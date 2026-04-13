import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { VerificationBadge } from "../../components/onboarding/VerificationBadge";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { CircleAlert, Building2, FileText, CircleCheck, AlertTriangle, Loader2, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { getCookie } from "@/app/utils/cookieUtils";

const ACCOUNT_TYPE_MAP: Record<string, string> = {
  savings: "SAVINGS",
  current: "CURRENT",
};

const REVERSE_ACCOUNT_TYPE_MAP: Record<string, string> = {
  SAVINGS: "savings",
  CURRENT: "current",
};

export function BankSettlement() {
  const navigate = useNavigate();
  const { data, updateBankSettlement } = useOnboarding();
  const bank = data.bankSettlement;

  const [loading, setLoading] = useState(true);
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountMismatch, setAccountMismatch] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [gstError, setGstError] = useState("");
  const [ifscError, setIfscError] = useState("");

  // S3 keys for uploaded documents
  const [docGstS3Key, setDocGstS3Key] = useState("");
  const [docBusinessPanS3Key, setDocBusinessPanS3Key] = useState("");
  const [docOwnerPanS3Key, setDocOwnerPanS3Key] = useState("");
  const [docBankProofS3Key, setDocBankProofS3Key] = useState("");

  // Upload progress states
  const [gstUploading, setGstUploading] = useState(false);
  const [businessPanUploading, setBusinessPanUploading] = useState(false);
  const [ownerPanUploading, setOwnerPanUploading] = useState(false);
  const [bankProofUploading, setBankProofUploading] = useState(false);

  // Fetch existing bank settlement details on mount
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const token = getCookie("token");
        const res = await axiosClient.get(`/api/v1/onboarding/bank-settlement`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data?.data;
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
          if (d.accountNumber) setConfirmAccountNumber(d.accountNumber);
          if (d.docGstCertificateS3Key) setDocGstS3Key(d.docGstCertificateS3Key);
          if (d.docBusinessPanS3Key) setDocBusinessPanS3Key(d.docBusinessPanS3Key);
          if (d.docOwnerPanS3Key) setDocOwnerPanS3Key(d.docOwnerPanS3Key);
          if (d.docBankProofS3Key) setDocBankProofS3Key(d.docBankProofS3Key);
        }
      } catch (e) {
        console.error("Failed to fetch bank details:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBankDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check account number mismatch
  useEffect(() => {
    if (confirmAccountNumber && bank.accountNumber) {
      setAccountMismatch(confirmAccountNumber !== bank.accountNumber);
    } else {
      setAccountMismatch(false);
    }
  }, [confirmAccountNumber, bank.accountNumber]);

  const isValidIfsc = (code: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(code);

  const handleIfscChange = (value: string) => {
    updateBankSettlement({ ifscCode: value, bankVerified: false });
    if (value.length === 0) {
      setIfscError("");
    } else if (value.length === 11) {
      if (isValidIfsc(value)) {
        setIfscError("");
        setTimeout(() => updateBankSettlement({ bankVerified: true }), 500);
      } else {
        setIfscError("Invalid IFSC format. Must be 4 letters, followed by 0, then 6 alphanumeric characters (e.g., SBIN0001234)");
      }
    } else {
      setIfscError("");
    }
  };

  const uploadDocument = async (
    file: File,
    documentType: string,
    setUploading: (v: boolean) => void,
    setS3Key: (v: string) => void,
    setUploaded: (field: Record<string, boolean>) => void,
  ) => {
    setUploading(true);
    try {
      const token = getCookie("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosClient.post(
        `/api/v1/onboarding/documents/upload?document_type=${documentType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const s3Key = res.data?.data?.s3Key;
      if (s3Key) {
        setS3Key(s3Key);
        setUploaded({ [`${documentType === "GST_CERTIFICATE" ? "gstCertificate" : documentType === "BUSINESS_PAN" ? "businessPAN" : documentType === "OWNER_PAN" ? "ownerPAN" : "bankProof"}Uploaded`]: true });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Upload failed";
      setApiError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: string,
    setUploading: (v: boolean) => void,
    setS3Key: (v: string) => void,
    setUploaded: (field: Record<string, boolean>) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadDocument(file, documentType, setUploading, setS3Key, setUploaded);
    }
  };

  const handleNext = async () => {
    if (accountMismatch) return;
    if (bank.ifscCode && !isValidIfsc(bank.ifscCode)) {
      setIfscError("Invalid IFSC format. Must be 4 letters, followed by 0, then 6 alphanumeric characters (e.g., SBIN0001234)");
      return;
    }
    if (!bank.ownerPANUploaded) {
      setGstError("Owner PAN Card is mandatory. Please upload before continuing.");
      return;
    }
    setGstError("");
    setApiError("");
    setSubmitting(true);
    try {
      const token = getCookie("token");
      const payload = {
        accountHolderName: bank.accountHolder,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        confirmAccountNumber: confirmAccountNumber,
        accountType: ACCOUNT_TYPE_MAP[bank.accountType] || bank.accountType.toUpperCase(),
        ifscCode: bank.ifscCode,
        upiId: bank.upiId,
        docGstCertificateS3Key: docGstS3Key,
        docBusinessPanS3Key: docBusinessPanS3Key,
        docOwnerPanS3Key: docOwnerPanS3Key,
        docBankProofS3Key: docBankProofS3Key,
      };

      await axiosClient.put(`/api/v1/onboarding/bank-settlement`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/onboarding/returns");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => navigate("/onboarding/categories");

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
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Bank & Settlement Details</h2>
        <p className="text-sm md:text-base text-gray-600">Add your bank account information for settlements</p>
      </div>

      {/* Important Notice */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50/50 border border-yellow-200 rounded-2xl p-4 md:p-6 flex items-start gap-3">
        <CircleAlert className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-yellow-800">
            Ensure that the bank account details match with your business GSTIN. Settlements will be made to this account only.
          </p>
        </div>
      </div>

      {/* Bank Account Details */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#220E92]/8 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#220E92]" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Bank Account Details</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountHolder">Bank Account Holder Name *</Label>
          <Input
            id="accountHolder"
            placeholder="Enter account holder name"
            className="rounded-xl"
            value={bank.accountHolder}
            onChange={(e) => updateBankSettlement({ accountHolder: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name *</Label>
          <Input
            id="bankName"
            placeholder="Enter bank name"
            value={bank.bankName}
            onChange={(e) => updateBankSettlement({ bankName: e.target.value })}
            className="rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              type="text"
              placeholder="Enter account number"
              className="rounded-xl"
              value={bank.accountNumber}
              onChange={(e) => updateBankSettlement({ accountNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmAccount">Confirm Account Number *</Label>
            <Input
              id="confirmAccount"
              type="text"
              placeholder="Re-enter account number"
              className={`rounded-xl ${accountMismatch ? "border-red-500 focus-visible:ring-red-200" : ""}`}
              value={confirmAccountNumber}
              onChange={(e) => setConfirmAccountNumber(e.target.value)}
            />
            {accountMismatch && (
              <p className="text-xs text-red-500">Account numbers do not match</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Account Type *</Label>
          <RadioGroup value={bank.accountType} onValueChange={(v) => updateBankSettlement({ accountType: v })}>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="savings" id="savings" />
                <Label htmlFor="savings" className="font-normal cursor-pointer">Savings Account</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="current" />
                <Label htmlFor="current" className="font-normal cursor-pointer">Current Account</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ifsc">IFSC Code *</Label>
          <div className="space-y-2">
            <Input
              id="ifsc"
              placeholder="Enter IFSC code"
              maxLength={11}
              value={bank.ifscCode}
              onChange={(e) => handleIfscChange(e.target.value.toUpperCase())}
              className="rounded-xl"
            />
            {ifscError && (
              <p className="text-xs text-red-500">{ifscError}</p>
            )}
            {bank.bankName && (
              <div className="flex items-center gap-2">
                <VerificationBadge verified={bank.bankVerified} label="Bank Verified" />
                <span className="text-sm text-gray-600">{bank.bankName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="upi">UPI ID (Optional)</Label>
          <Input
            id="upi"
            placeholder="yourname@upi"
            className="rounded-xl"
            value={bank.upiId}
            onChange={(e) => updateBankSettlement({ upiId: e.target.value })}
          />
        </div>
      </div>

      {/* Document Uploads */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#220E92]/8 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#220E92]" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Document Uploads</h3>
        </div>

        {gstError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{gstError}</p>
          </div>
        )}

        {/* GST Certificate */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">GST Certificate</p>
          <label
            htmlFor="gstCertificate"
            className={`flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-gray-300 transition-colors ${gstUploading ? "opacity-60 pointer-events-none" : ""}`}
          >
            {gstUploading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-[#220E92] shrink-0" />
            ) : bank.gstCertificateUploaded ? (
              <CircleCheck className="w-4.5 h-4.5 text-green-500 shrink-0" />
            ) : (
              <Upload className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            )}
            <span className="text-sm text-gray-400">{bank.gstCertificateUploaded ? "Uploaded" : "Upload"}</span>
            <input
              id="gstCertificate"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              className="hidden"
              onChange={(e) =>
                handleFileChange(e, "GST_CERTIFICATE", setGstUploading, setDocGstS3Key, (field) =>
                  updateBankSettlement(field as any)
                )
              }
              disabled={gstUploading}
            />
          </label>
        </div>

        {/* Business PAN Card */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">Business PAN Card</p>
          <label
            htmlFor="businessPAN"
            className={`flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-gray-300 transition-colors ${businessPanUploading ? "opacity-60 pointer-events-none" : ""}`}
          >
            {businessPanUploading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-[#220E92] shrink-0" />
            ) : bank.businessPANUploaded ? (
              <CircleCheck className="w-4.5 h-4.5 text-green-500 shrink-0" />
            ) : (
              <Upload className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            )}
            <span className="text-sm text-gray-400">{bank.businessPANUploaded ? "Uploaded" : "Upload"}</span>
            <input
              id="businessPAN"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              className="hidden"
              onChange={(e) =>
                handleFileChange(e, "BUSINESS_PAN", setBusinessPanUploading, setDocBusinessPanS3Key, (field) =>
                  updateBankSettlement(field as any)
                )
              }
              disabled={businessPanUploading}
            />
          </label>
        </div>

        {/* Owner PAN Card - Mandatory */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            Owner PAN Card <span className="text-red-500">*</span>
            <span className="text-xs text-red-500 bg-[#FEF2F2] p-1 rounded font-medium">Mandatory</span>
          </p>
          <label
            htmlFor="ownerPAN"
            className={`flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-gray-300 transition-colors ${ownerPanUploading ? "opacity-60 pointer-events-none" : ""}`}
          >
            {ownerPanUploading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-[#220E92] shrink-0" />
            ) : bank.ownerPANUploaded ? (
              <CircleCheck className="w-4.5 h-4.5 text-green-500 shrink-0" />
            ) : (
              <Upload className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            )}
            <span className="text-sm text-gray-400">{bank.ownerPANUploaded ? "Uploaded" : "Upload"}</span>
            <input
              id="ownerPAN"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              className="hidden"
              onChange={(e) =>
                handleFileChange(e, "OWNER_PAN", setOwnerPanUploading, setDocOwnerPanS3Key, (field) =>
                  updateBankSettlement(field as any)
                )
              }
              disabled={ownerPanUploading}
            />
          </label>
        </div>

        {/* Bank Proof Document */}
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-gray-900">Bank Proof Document</p>
            <p className="text-xs text-gray-500">Cancelled cheque or bank passbook</p>
          </div>
          <label
            htmlFor="bankProof"
            className={`flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-gray-300 transition-colors ${bankProofUploading ? "opacity-60 pointer-events-none" : ""}`}
          >
            {bankProofUploading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-[#220E92] shrink-0" />
            ) : bank.bankProofUploaded ? (
              <CircleCheck className="w-4.5 h-4.5 text-green-500 shrink-0" />
            ) : (
              <Upload className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            )}
            <span className="text-sm text-gray-400">{bank.bankProofUploaded ? "Uploaded" : "Upload"}</span>
            <input
              id="bankProof"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              className="hidden"
              onChange={(e) =>
                handleFileChange(e, "BANK_PROOF", setBankProofUploading, setDocBankProofS3Key, (field) =>
                  updateBankSettlement(field as any)
                )
              }
              disabled={bankProofUploading}
            />
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        {apiError && (
          <p className="text-sm text-red-500 text-right">{apiError}</p>
        )}
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={submitting}
          style={{ borderRadius: '12px' }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={submitting || accountMismatch}
          style={{ backgroundColor: '#220E92', borderRadius: '12px' }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium shadow-lg shadow-[#220E92]/20 hover:shadow-xl hover:shadow-[#220E92]/25 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Continue to Refunds & Returns"
          )}
        </Button>
      </div>
    </div>
  );
}
