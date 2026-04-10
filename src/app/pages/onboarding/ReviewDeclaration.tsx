import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { formatAddress } from "../../components/onboarding/AddressFields";
import { FileText, DollarSign, Shield, Edit, CircleAlert, Building2, Phone, Mail, MapPin, CreditCard, CircleCheck, Landmark, Info, Loader2 } from "lucide-react";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
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

const REVERSE_ACCOUNT_TYPE_MAP: Record<string, string> = {
  SAVINGS: "savings",
  CURRENT: "current",
};


const legalEntityLabels: Record<string, string> = {
  sole: "Sole Proprietorship",
  partnership: "Partnership",
  private: "Private Limited",
  llp: "LLP",
  others: "Others",
};

const accountTypeLabels: Record<string, string> = {
  savings: "Savings Account",
  current: "Current Account",
};

export function ReviewDeclaration() {
  const navigate = useNavigate();
  const { data, updateVendorBasicDetails, updateBankSettlement } = useOnboarding();
  const vbd = data.vendorBasicDetails;
  const bank = data.bankSettlement;

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [tncOpen, setTncOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [showError, setShowError] = useState(false);
  const [basicExpanded, setBasicExpanded] = useState(true);
  const [bankingExpanded, setBankingExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch basic details and bank settlement on mount
  useEffect(() => {
    const fetchAll = async () => {
      const token = getCookie("token");
      const auth = { headers: { Authorization: `Bearer ${token}` } };

      const [basicRes, bankRes, statusRes] = await Promise.allSettled([
        axiosClient.get(`/api/v1/onboarding/basic-details`, auth),
        axiosClient.get(`/api/v1/onboarding/bank-settlement`, auth),
        axiosClient.get(`/api/v1/onboarding/status`, auth),
      ]);

      if (basicRes.status === "fulfilled") {
        const d = basicRes.value.data?.data;
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
      } else {
        console.error("Failed to fetch basic details:", basicRes.reason);
      }

      if (bankRes.status === "fulfilled") {
        const d = bankRes.value.data?.data;
        if (d) {
          updateBankSettlement({
            accountHolder: d.accountHolderName || "",
            bankName: d.bankName || "",
            accountNumber: d.accountNumber || "",
            accountType: REVERSE_ACCOUNT_TYPE_MAP[d.accountType] || "",
            ifscCode: d.ifscCode || "",
            upiId: d.upiId || "",
            gstCertificateUploaded: !!d.docGstCertificateS3Key,
            businessPANUploaded: !!d.docBusinessPanS3Key,
            ownerPANUploaded: !!d.docOwnerPanS3Key,
            bankProofUploaded: !!d.docBankProofS3Key,
          });
        }
      } else {
        console.error("Failed to fetch bank settlement:", bankRes.reason);
      }

      if (statusRes.status === "fulfilled") {
        const d = statusRes.value.data?.data;
        if (d?.status) {
          setSubmissionStatus(d.status);
          if (d.status === "SUBMITTED") {
            setIsSubmitted(true);
            setTermsAccepted(true);
          }
        }
      } else {
        console.error("Failed to fetch onboarding status:", statusRes.reason);
      }

      setLoading(false);
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTerms = (v: boolean) => {
    setShowError(false);
    setTermsAccepted(v);
  };

  // Required-field completeness checks
  const basicComplete = !!(
    vbd.storeName &&
    vbd.businessName &&
    vbd.ownerName &&
    vbd.legalEntity &&
    vbd.gstin &&
    vbd.pan &&
    vbd.address.shopNo &&
    vbd.address.streetArea &&
    vbd.address.pincode &&
    vbd.address.district &&
    vbd.address.city &&
    vbd.address.state &&
    vbd.contactPerson &&
    vbd.designation &&
    vbd.phone &&
    vbd.email &&
    vbd.contact2Name &&
    vbd.contact2Designation &&
    vbd.contact2Phone &&
    vbd.contact2Email
  );

  const bankComplete = !!(
    bank.accountHolder &&
    bank.bankName &&
    bank.accountNumber &&
    bank.accountType &&
    bank.ifscCode &&
    bank.gstCertificateUploaded &&
    bank.businessPANUploaded &&
    bank.ownerPANUploaded &&
    bank.bankProofUploaded
  );

  const canSubmit = termsAccepted && basicComplete && bankComplete;

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    if (!canSubmit) {
      setShowError(true);
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const token = getCookie("token");
      await axiosClient.post(
        `/api/v1/onboarding/submit`,
        { declarationsAccepted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSubmitted(true);
      setSubmissionStatus("SUBMITTED");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  const handleBack = () => {
    navigate("/onboarding/offers");
  };

  // Display flags for the section header status
  const hasBasicDetails = vbd.storeName || vbd.businessName || vbd.ownerName || vbd.phone || vbd.email;
  const hasBankDetails = bank.accountHolder || bank.bankName || bank.accountNumber || bank.ifscCode;

  // Mask account number for display
  const maskedAccountNumber = bank.accountNumber
    ? "\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF " + bank.accountNumber.slice(-4)
    : "";

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
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Review & Declaration</h2>
        <p className="text-sm md:text-base text-gray-600">Review your details and accept the Terms and Conditions to submit</p>
      </div>

      {/* Submission status notice */}
      {isSubmitted ? (
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ backgroundColor: "#F0FDF4", border: "1px solid #86EFAC" }}
        >
          <CircleCheck className="w-5 h-5 text-emerald-600 text-[#16A34A] flex-shrink-0" />
          <p className="text-sm text-emerald-800 text-[#16A34A]">
            Application submitted, We're reviewing your application and will reach out within 2 days.
          </p>
        </div>
      ) : (
        (!basicComplete || !bankComplete) && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Some sections appear incomplete. Navigate back to fill in any missing details before submitting.
            </p>
          </div>
        )
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Basic Details Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#220E92]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#220E92]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Basic Details</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {hasBasicDetails ? (
                    <>
                      <CircleCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <p className="text-xs text-emerald-600 font-medium">Completed</p>
                    </>
                  ) : (
                    <p className="text-xs text-amber-600 font-medium">Incomplete</p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBasicExpanded(!basicExpanded)}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              {basicExpanded ? "Collapse" : "Expand"}
            </button>
          </div>

          {basicExpanded && (
            <div className="space-y-3 mb-4 animate-in fade-in duration-200">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
                <SummaryRow
                  icon={<Building2 className="w-3.5 h-3.5" />}
                  label="Store Name"
                  value={vbd.storeName || "Not provided"}
                />
                <SummaryRow
                  icon={<Building2 className="w-3.5 h-3.5" />}
                  label="Business Name"
                  value={vbd.businessName || "Not provided"}
                />
                <SummaryRow
                  label="Owner"
                  value={vbd.ownerName || "Not provided"}
                />
                <SummaryRow
                  label="Legal Entity"
                  value={legalEntityLabels[vbd.legalEntity] || "Not selected"}
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
                <SummaryRow
                  label="GSTIN"
                  value={vbd.gstin || "Not provided"}
                  verified={vbd.gstVerified}
                />
                <SummaryRow
                  label="PAN"
                  value={vbd.pan || "Not provided"}
                  verified={vbd.panVerified}
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
                <SummaryRow
                  icon={<Phone className="w-3.5 h-3.5" />}
                  label="Phone"
                  value={vbd.phone || "Not provided"}
                  verified={vbd.phoneVerified}
                />
                <SummaryRow
                  icon={<Mail className="w-3.5 h-3.5" />}
                  label="Email"
                  value={vbd.email || "Not provided"}
                />
                <SummaryRow
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Reg. Address"
                  value={formatAddress(vbd.address) || "Not provided"}
                />
              </div>
              {/* Secondary Contact */}
              {(vbd.contact2Name || vbd.contact2Phone) && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
                  <p className="text-xs text-gray-400 font-medium">Secondary Contact</p>
                  <SummaryRow
                    label="Name"
                    value={vbd.contact2Name || "Not provided"}
                  />
                  <SummaryRow
                    label="Designation"
                    value={vbd.contact2Designation || "Not provided"}
                  />
                  <SummaryRow
                    icon={<Phone className="w-3.5 h-3.5" />}
                    label="Phone"
                    value={vbd.contact2Phone || "Not provided"}
                  />
                  <SummaryRow
                    icon={<Mail className="w-3.5 h-3.5" />}
                    label="Email"
                    value={vbd.contact2Email || "Not provided"}
                  />
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/onboarding")}
            className="w-full justify-start text-[#220E92]"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
        </div>

        {/* Banking Info Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#220E92]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#220E92]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Banking Info</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {bank.bankVerified ? (
                    <>
                      <CircleCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <p className="text-xs text-emerald-600 font-medium">Verified</p>
                    </>
                  ) : hasBankDetails ? (
                    <p className="text-xs text-amber-600 font-medium">Pending Verification</p>
                  ) : (
                    <p className="text-xs text-amber-600 font-medium">Incomplete</p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBankingExpanded(!bankingExpanded)}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              {bankingExpanded ? "Collapse" : "Expand"}
            </button>
          </div>

          {bankingExpanded && (
            <div className="space-y-3 mb-4 animate-in fade-in duration-200">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
                <SummaryRow
                  icon={<Landmark className="w-3.5 h-3.5" />}
                  label="Bank"
                  value={bank.bankName || "Not provided"}
                  verified={bank.bankVerified}
                />
                <SummaryRow
                  label="Account Holder"
                  value={bank.accountHolder || "Not provided"}
                />
                <SummaryRow
                  icon={<CreditCard className="w-3.5 h-3.5" />}
                  label="Account No."
                  value={maskedAccountNumber || "Not provided"}
                />
                <SummaryRow
                  label="Account Type"
                  value={accountTypeLabels[bank.accountType] || bank.accountType}
                />
                <SummaryRow
                  label="IFSC Code"
                  value={bank.ifscCode || "Not provided"}
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
                <SummaryRow
                  label="GST Certificate"
                  value={bank.gstCertificateUploaded ? "Uploaded" : "Not uploaded"}
                  docStatus={bank.gstCertificateUploaded}
                />
                <SummaryRow
                  label="Business PAN"
                  value={bank.businessPANUploaded ? "Uploaded" : "Not uploaded"}
                  docStatus={bank.businessPANUploaded}
                />
                <SummaryRow
                  label="Owner PAN"
                  value={bank.ownerPANUploaded ? "Uploaded" : "Not uploaded"}
                  docStatus={bank.ownerPANUploaded}
                />
                <SummaryRow
                  label="Bank Proof"
                  value={bank.bankProofUploaded ? "Uploaded" : "Not uploaded"}
                  docStatus={bank.bankProofUploaded}
                />
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/onboarding/banking")}
            className="w-full justify-start text-[#220E92]"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Banking
          </Button>
        </div>
      </div>

      {/* Validation Error */}
      {showError && !canSubmit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            {!basicComplete || !bankComplete
              ? "Please complete Basic Details and Bank & Settlement sections before submitting."
              : "Please accept the Terms and Conditions to submit your application."}
          </p>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 lg:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#220E92]" />
          <h3 className="text-lg font-semibold text-gray-900">Commitments, Declarations & SLA</h3>
        </div>

        {isSubmitted ? (
          <div className="flex items-start gap-3 rounded-lg">
            <CircleCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-md text-gray-800 leading-relaxed">
              You have accepted this 
            </p>
            <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setTncOpen(true);
                  }}
                  className="text-[#220E92] font-medium underline hover:text-[#1a0a6e]"
                >
                  Terms and Conditions
                </button>
                <p>
               and your application current status is{" "}
              <span className="font-semibold text-[#220E92]">{submissionStatus || "SUBMITTED"}</span>.
            </p>
          </div>
        ) : (
          <>
            <p className="text-md text-[#4A5565]">Please review and accept the following mandatory items to proceed.</p>

            <div
              className={`flex items-center gap-3 rounded-lg transition-colors`}
            >
              <Checkbox
                id="accept-terms"
                checked={termsAccepted}
                onCheckedChange={(v) => toggleTerms(!!v)}
                className="w-5 h-5"
              />
              <label
                htmlFor="accept-terms"
                className={`text-md leading-relaxed font-[400] cursor-pointer select-none ${
                  termsAccepted ? "text-gray-900" : "text-gray-700"
                }`}
              >
                I have read and agree to the{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setTncOpen(true);
                  }}
                  className="text-[#220E92] font-medium underline hover:text-[#1a0a6e]"
                >
                  Terms and Conditions
                </button>
                . <span className="text-red-500">*</span>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Submit API error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          onClick={handleBack}
          variant="outline"
          style={{ borderRadius: '10px' }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
        >
          Back
        </Button>
        {isSubmitted ? (
          <Button
            onClick={handleEdit}
            style={{ backgroundColor: '#220E92', borderRadius: '10px' }}
            className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Application
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit}
            style={{ backgroundColor: canSubmit ? '#220E92' : undefined, borderRadius: '10px' }}
            className={`w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium ${
              !canSubmit ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        )}
      </div>

      {/* Terms & Conditions Dialog */}
      <Dialog open={tncOpen} onOpenChange={setTncOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center">
            <img src="/src/assets/icons/Container.png" alt="Container Icon" className="w-[40px] h-[40px]" />
            <DialogTitle className="text-xl text-[#1A1A2E]">Terms & Conditions</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto pr-2 space-y-4 text-sm text-gray-700 leading-relaxed">
            <p className="font=[500] text-md text-[#364153]">All information provided in this application is accurate and up-to-date.</p>
            <p className="font=[500] text-md text-[#364153]">I have the legal authority to represent and act on behalf of this business.</p>
            <p className="font=[500] text-md text-[#364153]">All products listed comply with Indian laws, regulations, and quality standards.</p>
            <p className="font=[500] text-md text-[#364153]">I accept Dashrobe's Vendor Terms & Conditions and Privacy Policy.</p>
            <p className="font=[500] text-md text-[#364153]">I commit to maintaining product quality and accurate listings at all times.</p>
            <p className="font=[500] text-md text-[#364153]">I authorize Dashrobe to verify all submitted documents and business credentials.</p>
            <p className="font=[500] text-md text-[#364153]">I commit to accepting or rejecting orders within 5 minutes of receiving them.</p>
            <p className="font=[500] text-md text-[#364153]">I commit to packing accepted orders within the preparation time specified during onboarding.</p>
            <p className="font=[500] text-md text-[#364153]">I will keep inventory levels updated to avoid order cancellations due to stock-outs. </p>
            <p className="font=[500] text-md text-[#364153]">I understand and accept the weekly settlement cycle (T+7 days from delivery).</p>
            <p className="font=[500] text-md text-[#364153]">I acknowledge that Dashrobe handles all logistics and delivery operations.</p>
            <p className="font=[500] text-md text-[#364153]">I agree to maintain responsive communication via the registered WhatsApp number.</p>
          </div>

          {!isSubmitted && <DialogFooter className="gap-2 pt-2">
            <Button
              onClick={() => {
                toggleTerms(true);
                setTncOpen(false);
              }}
              style={{ backgroundColor: "#220E92", borderRadius: "10px" }}
            >
              I Agree
            </Button>
          </DialogFooter>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  verified,
  docStatus,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  verified?: boolean;
  docStatus?: boolean;
}) {
  const isEmpty = value === "Not provided" || value === "Not uploaded" || value === "Not selected";
  return (
    <div className="flex items-start gap-2 text-sm">
      {icon && <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>}
      <span className="text-gray-500 shrink-0 min-w-[90px]">{label}</span>
      <span className={`font-medium flex items-center gap-1.5 break-all ${isEmpty ? "text-gray-400 italic" : "text-gray-900"}`}>
        {value}
        {verified && (
          <CircleCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        )}
        {docStatus && (
          <CircleCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        )}
      </span>
    </div>
  );
}