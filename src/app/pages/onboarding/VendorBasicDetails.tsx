import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { CategoryCard } from "../../components/onboarding/CategoryCard";
import { VerificationBadge } from "../../components/onboarding/VerificationBadge";
import { AddressFields } from "../../components/onboarding/AddressFields";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";
import { Building2, Users, FileText, Phone, ShieldCheck, Loader2, MessageCircle, Briefcase, MoreHorizontal, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { generateOtp, verifyOtp } from "@/app/Service/AuthService/authService";
import { getCookie } from "@/app/utils/cookieUtils";

const LEGAL_ENTITY_MAP: Record<string, string> = {
  sole: "SOLE_PROPRIETORSHIP",
  partnership: "PARTNERSHIP",
  private: "PRIVATE_LIMITED",
  llp: "LLP",
  others: "OTHERS",
};

const REVERSE_LEGAL_ENTITY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(LEGAL_ENTITY_MAP).map(([k, v]) => [v, k])
);

function normalizePhone(val: string): string {
  return val.replace(/\D/g, "").slice(-10);
}

export function VendorBasicDetails() {
  const navigate = useNavigate();
  const { data, updateVendorBasicDetails } = useOnboarding();
  const vbd = data.vendorBasicDetails;

  const [loading, setLoading] = useState(true);

  // Fetch existing basic details on mount
  useEffect(() => {
    const fetchBasicDetails = async () => {
      try {
        const token = getCookie("token");
        const res = await axiosClient.get(`/api/v1/onboarding/basic-details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data?.data;
        if (d) {
          updateVendorBasicDetails({
            storeName: d.storeName || "",
            businessName: d.businessName || "",
            ownerName: d.ownerName || "",
            legalEntity: REVERSE_LEGAL_ENTITY_MAP[d.legalEntityType] || "",
            gstin: d.gstin || "",
            pan: d.pan || "",
            address: {
              shopNo: d.registeredAddress || "",
              streetArea: d.street || "",
              landmark: d.landmark || "",
              pincode: d.pincode || "",
              district: d.district || "",
              city: d.city || "",
              state: d.state || "",
            },
            contactPerson: d.contactPersonName || "",
            designation: d.designation || "",
            phone: d.phoneNumber || "",
            altPhone: d.alternatePhone || "",
            email: d.email || d.vendorEmail || "",
            contact2Name: d.secondaryContactName || "",
            contact2Designation: d.secondaryDesignation || "",
            contact2Phone: d.secondaryPhone || "",
            contact2Email: d.secondaryEmail || "",
          });
        }
      } catch (e) {
        console.error("Failed to fetch basic details:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBasicDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Phone verification UI state (not persisted to context)
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpValue, setPhoneOtpValue] = useState("");
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  const [phoneError, setPhoneError] = useState("");

  const [altPhoneOtpSent, setAltPhoneOtpSent] = useState(false);
  const [altPhoneOtpValue, setAltPhoneOtpValue] = useState("");
  const [altPhoneSending, setAltPhoneSending] = useState(false);
  const [altPhoneVerifying, setAltPhoneVerifying] = useState(false);
  const [altPhoneResendTimer, setAltPhoneResendTimer] = useState(0);
  const [altPhoneError, setAltPhoneError] = useState("");

  const [phoneTokenRefId, setPhoneTokenRefId] = useState("");
  const [altPhoneTokenRefId, setAltPhoneTokenRefId] = useState("");

  // Countdown timers
  useEffect(() => {
    if (phoneResendTimer > 0) {
      const t = setTimeout(() => setPhoneResendTimer(phoneResendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [phoneResendTimer]);

  useEffect(() => {
    if (altPhoneResendTimer > 0) {
      const t = setTimeout(() => setAltPhoneResendTimer(altPhoneResendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [altPhoneResendTimer]);

  const isValidPhone = (val: string) => /^(\+91\s?)?[6-9]\d{9}$/.test(val.replace(/\s/g, ""));

  const handleSendOtp = useCallback(async (type: "primary" | "alt") => {
    const num = type === "primary" ? vbd.phone : vbd.altPhone;
    const setError = type === "primary" ? setPhoneError : setAltPhoneError;
    const setSending = type === "primary" ? setPhoneSending : setAltPhoneSending;
    const setOtpSent = type === "primary" ? setPhoneOtpSent : setAltPhoneOtpSent;
    const setTimer = type === "primary" ? setPhoneResendTimer : setAltPhoneResendTimer;
    const setOtpValue = type === "primary" ? setPhoneOtpValue : setAltPhoneOtpValue;
    const setTokenRefId = type === "primary" ? setPhoneTokenRefId : setAltPhoneTokenRefId;

    if (!isValidPhone(num)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setSending(true);
    setOtpValue("");
    try {
      const fullPhone = `91${normalizePhone(num)}`;
      const data = await generateOtp(fullPhone);
      setTokenRefId(data.token_reference_id);
      setOtpSent(true);
      setTimer(30);
    } catch (e) {
      console.error(e);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  }, [vbd.phone, vbd.altPhone]);

  const handleVerifyOtp = useCallback(async (type: "primary" | "alt") => {
    const otpVal = type === "primary" ? phoneOtpValue : altPhoneOtpValue;
    const num = type === "primary" ? vbd.phone : vbd.altPhone;
    const tokenRefId = type === "primary" ? phoneTokenRefId : altPhoneTokenRefId;
    const setError = type === "primary" ? setPhoneError : setAltPhoneError;
    const setVerifying = type === "primary" ? setPhoneVerifying : setAltPhoneVerifying;

    if (otpVal.length !== 4) {
      setError("Please enter the complete 4-digit OTP");
      return;
    }
    setError("");
    setVerifying(true);
    try {
      const fullPhone = `91${normalizePhone(num)}`;
      await verifyOtp(fullPhone, otpVal, tokenRefId);
      if (type === "primary") {
        updateVendorBasicDetails({ phoneVerified: true });
      } else {
        updateVendorBasicDetails({ altPhoneVerified: true });
      }
    } catch (e) {
      console.error(e);
      setError("OTP verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  }, [phoneOtpValue, altPhoneOtpValue, vbd.phone, vbd.altPhone, phoneTokenRefId, altPhoneTokenRefId, updateVendorBasicDetails]);

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleNext = async () => {
    setApiError("");
    setSubmitting(true);
    try {
      const addr = vbd.address;

      const payload = {
        storeName: vbd.storeName,
        businessName: vbd.businessName,
        ownerName: vbd.ownerName,
        legalEntityType: LEGAL_ENTITY_MAP[vbd.legalEntity] ?? vbd.legalEntity.toUpperCase(),
        gstin: vbd.gstin,
        pan: vbd.pan,
        registeredAddress: addr.shopNo,
        street: addr.streetArea,
        landmark: addr.landmark,
        pincode: addr.pincode,
        district: addr.district,
        city: addr.city,
        state: addr.state,
        contactPersonName: vbd.contactPerson,
        designation: vbd.designation,
        phoneNumber: vbd.phone,
        alternatePhone: vbd.altPhone,
        email: vbd.email,
        secondaryContactName: vbd.contact2Name,
        secondaryDesignation: vbd.contact2Designation,
        secondaryPhone: vbd.contact2Phone,
        secondaryEmail: vbd.contact2Email,
        vendorEmail: vbd.email,
      };

      const token = getCookie("token");
      const res = await axiosClient.put(
        `/api/v1/onboarding/basic-details`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data?.message ?? "Something went wrong. Please try again.");
      }

      navigate("/onboarding/operations");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const legalEntities = [
    { id: "sole", label: "Sole Proprietorship", icon: <Building2 className="w-6 h-6 text-[#220E92]" /> },
    { id: "partnership", label: "Partnership", icon: <Users className="w-6 h-6 text-[#220E92]" /> },
    { id: "private", label: "Private Limited", icon: <FileText className="w-6 h-6 text-[#220E92]" /> },
    { id: "llp", label: "LLP", icon: <Briefcase className="w-6 h-6 text-[#220E92]" /> },
    { id: "others", label: "Others", icon: <MoreHorizontal className="w-6 h-6 text-[#220E92]" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#220E92]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Vendor Basic Details</h2>
        <p className="text-sm md:text-base text-gray-600">Let's start with your business information</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 lg:p-8 space-y-6">
        {/* Business Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name *</Label>
            <Input id="storeName" placeholder="Enter your store name" className="rounded-xl" value={vbd.storeName} onChange={(e) => updateVendorBasicDetails({ storeName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input id="businessName" placeholder="Enter your business name" className="rounded-xl" value={vbd.businessName} onChange={(e) => updateVendorBasicDetails({ businessName: e.target.value })} />
          </div>
        </div>

        {/* Owner & Legal Entity */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner / Authorized Person *</Label>
            <Input id="ownerName" placeholder="Full name" className="rounded-xl" value={vbd.ownerName} onChange={(e) => updateVendorBasicDetails({ ownerName: e.target.value })} />
          </div>

          <div className="space-y-3">
            <Label>Legal Entity Type *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {legalEntities.map((entity) => (
                <CategoryCard
                  key={entity.id}
                  title={entity.label}
                  icon={entity.icon}
                  selected={vbd.legalEntity === entity.id}
                  onClick={() => updateVendorBasicDetails({ legalEntity: entity.id })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* GST & PAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN *</Label>
            <div className="space-y-2">
              <Input
                id="gstin"
                placeholder="Enter GSTIN"
                className="rounded-xl"
                value={vbd.gstin}
                onChange={(e) => {
                  const val = e.target.value;
                  updateVendorBasicDetails({ gstin: val, gstVerified: false });
                  if (val.length === 15) {
                    setTimeout(() => updateVendorBasicDetails({ gstVerified: true }), 500);
                  }
                }}
              />
              <VerificationBadge verified={vbd.gstVerified} label="GST Verified" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pan">PAN *</Label>
            <div className="space-y-2">
              <Input
                id="pan"
                placeholder="Enter PAN"
                maxLength={10}
                className="rounded-xl"
                value={vbd.pan}
                onChange={(e) => {
                  const val = e.target.value;
                  updateVendorBasicDetails({ pan: val, panVerified: false });
                  if (val.length === 10) {
                    setTimeout(() => updateVendorBasicDetails({ panVerified: true }), 500);
                  }
                }}
              />
              <VerificationBadge verified={vbd.panVerified} label="PAN Verified" />
            </div>
          </div>
        </div>

        {/* Registered Address */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-800">Registered Address *</Label>
          <AddressFields
            address={vbd.address}
            onChange={(newAddr) => updateVendorBasicDetails({ address: newAddr })}
            idPrefix="reg"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#220E92]/8 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#220E92]" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Contact Information</h3>
            <p className="text-sm text-gray-500">Please provide details for two contact persons</p>
          </div>
        </div>

        {/* Contact Person 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#220E92] flex items-center justify-center text-white text-xs font-medium">1</div>
            <h4 className="text-sm font-semibold text-gray-800">Primary Contact</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person Name *</Label>
              <Input id="contactPerson" placeholder="Full name" className="rounded-xl" value={vbd.contactPerson} onChange={(e) => updateVendorBasicDetails({ contactPerson: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input id="designation" placeholder="e.g., Manager, Owner" className="rounded-xl" value={vbd.designation} onChange={(e) => updateVendorBasicDetails({ designation: e.target.value })} />
            </div>
          </div>

        {/* Primary Phone with OTP Verification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-3">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                className="rounded-xl flex-1"
                maxLength={10}
                value={vbd.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  updateVendorBasicDetails({ phone: val });
                  if (vbd.phoneVerified) {
                    updateVendorBasicDetails({ phoneVerified: false });
                    setPhoneOtpSent(false);
                    setPhoneOtpValue("");
                  }
                }}
                disabled={vbd.phoneVerified}
              />
              {!vbd.phoneVerified && !phoneOtpSent && (
                <Button
                  type="button"
                  onClick={() => handleSendOtp("primary")}
                  disabled={phoneSending || !vbd.phone}
                  style={{ backgroundColor: '#220E92', borderRadius: '12px' }}
                  className="shrink-0 px-4 text-xs"
                >
                  {phoneSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Phone className="w-3.5 h-3.5 mr-1.5" />
                      Send OTP
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
              <MessageCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <p className="text-xs text-green-800">WhatsApp is mandatory on this number. All order updates and communication will be sent via WhatsApp.</p>
            </div>

            {phoneOtpSent && !vbd.phoneVerified && (
              <div className="space-y-3 p-4 bg-purple-50/60 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 text-sm text-[#220E92]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter the 4-digit OTP sent to <span className="font-medium">{vbd.phone}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <InputOTP
                    maxLength={4}
                    value={phoneOtpValue}
                    onChange={setPhoneOtpValue}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-10 h-10 rounded-lg border-purple-200" />
                      <InputOTPSlot index={1} className="w-10 h-10 rounded-lg border-purple-200" />
                      <InputOTPSlot index={2} className="w-10 h-10 rounded-lg border-purple-200" />
                      <InputOTPSlot index={3} className="w-10 h-10 rounded-lg border-purple-200" />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    type="button"
                    onClick={() => handleVerifyOtp("primary")}
                    disabled={phoneVerifying || phoneOtpValue.length !== 4}
                    style={{ backgroundColor: '#220E92', borderRadius: '10px' }}
                    className="shrink-0 px-4 text-xs h-10"
                  >
                    {phoneVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {phoneResendTimer > 0 ? (
                    <span>Resend OTP in <span className="font-medium text-[#220E92]">{phoneResendTimer}s</span></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp("primary")}
                      className="text-[#220E92] font-medium hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {phoneError && (
              <p className="text-xs text-red-500">{phoneError}</p>
            )}
            <VerificationBadge verified={vbd.phoneVerified} label="Phone Verified" />
          </div>

          {/* Alternate Phone with OTP Verification */}
          <div className="space-y-3">
            <Label htmlFor="altPhone">Alternate Phone (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="altPhone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                className="rounded-xl flex-1"
                maxLength={10}
                value={vbd.altPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  updateVendorBasicDetails({ altPhone: val });
                  if (vbd.altPhoneVerified) {
                    updateVendorBasicDetails({ altPhoneVerified: false });
                    setAltPhoneOtpSent(false);
                    setAltPhoneOtpValue("");
                  }
                }}
                disabled={vbd.altPhoneVerified}
              />
              {!vbd.altPhoneVerified && !altPhoneOtpSent && vbd.altPhone && (
                <Button
                  type="button"
                  onClick={() => handleSendOtp("alt")}
                  disabled={altPhoneSending || !vbd.altPhone}
                  variant="outline"
                  className="shrink-0 px-4 text-xs border-[#220E92] text-[#220E92] hover:bg-purple-50"
                  style={{ borderRadius: '12px' }}
                >
                  {altPhoneSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Phone className="w-3.5 h-3.5 mr-1.5" />
                      Send OTP
                    </>
                  )}
                </Button>
              )}
            </div>

            {altPhoneOtpSent && !vbd.altPhoneVerified && (
              <div className="space-y-3 p-4 bg-purple-50/60 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 text-sm text-[#220E92]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter the 4-digit OTP sent to <span className="font-medium">{vbd.altPhone}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <InputOTP
                    maxLength={4}
                    value={altPhoneOtpValue}
                    onChange={setAltPhoneOtpValue}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-10 h-10 rounded-lg border-purple-200" />
                      <InputOTPSlot index={1} className="w-10 h-10 rounded-lg border-purple-200" />
                      <InputOTPSlot index={2} className="w-10 h-10 rounded-lg border-purple-200" />
                      <InputOTPSlot index={3} className="w-10 h-10 rounded-lg border-purple-200" />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    type="button"
                    onClick={() => handleVerifyOtp("alt")}
                    disabled={altPhoneVerifying || altPhoneOtpValue.length !== 4}
                    style={{ backgroundColor: '#220E92', borderRadius: '10px' }}
                    className="shrink-0 px-4 text-xs h-10"
                  >
                    {altPhoneVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {altPhoneResendTimer > 0 ? (
                    <span>Resend OTP in <span className="font-medium text-[#220E92]">{altPhoneResendTimer}s</span></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp("alt")}
                      className="text-[#220E92] font-medium hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {altPhoneError && (
              <p className="text-xs text-red-500">{altPhoneError}</p>
            )}
            <VerificationBadge verified={vbd.altPhoneVerified} label="Phone Verified" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" placeholder="your@email.com" className="rounded-xl" value={vbd.email} onChange={(e) => updateVendorBasicDetails({ email: e.target.value })} />
        </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6">
          {/* Contact Person 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#220E92] flex items-center justify-center text-white text-xs font-medium">2</div>
              <h4 className="text-sm font-semibold text-gray-800">Secondary Contact</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact2Name">Contact Person Name *</Label>
                <Input id="contact2Name" placeholder="Full name" className="rounded-xl" value={vbd.contact2Name} onChange={(e) => updateVendorBasicDetails({ contact2Name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact2Designation">Designation *</Label>
                <Input id="contact2Designation" placeholder="e.g., Manager, Co-founder" className="rounded-xl" value={vbd.contact2Designation} onChange={(e) => updateVendorBasicDetails({ contact2Designation: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact2Phone">Phone Number *</Label>
                <Input id="contact2Phone" type="tel" placeholder="+91 XXXXX XXXXX" maxLength={10} className="rounded-xl" value={vbd.contact2Phone} onChange={(e) => updateVendorBasicDetails({ contact2Phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact2Email">Email Address *</Label>
                <Input id="contact2Email" type="email" placeholder="contact2@email.com" className="rounded-xl" value={vbd.contact2Email} onChange={(e) => updateVendorBasicDetails({ contact2Email: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation */}
      <div className="flex justify-end gap-4 pt-4">
        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleNext}
          disabled={submitting}
          style={{ backgroundColor: '#220E92', borderRadius: '12px' }}
          className="w-full md:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium shadow-lg shadow-[#220E92]/20 hover:shadow-xl hover:shadow-[#220E92]/25 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Continue to Store Operations"
          )}
        </Button>
      </div>
    </div>
  );
}