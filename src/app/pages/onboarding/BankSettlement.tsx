import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { CircleAlert, FileText, AlertTriangle, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { getCookie } from "@/app/utils/cookieUtils";
import { BankAccountForm } from "../../components/onboarding/BankAccountForm";
import { DocumentUploadField } from "../../components/onboarding/DocumentUploadField";
import { DocumentPreviewModal } from "../../components/admin/DocumentPreviewModal";

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
  const [accountMismatch, setAccountMismatch] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [gstError, setGstError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const [initialConfirmAccount, setInitialConfirmAccount] = useState("");

  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string; fileType: string } | null>(null);
  const [docPreviewLoading, setDocPreviewLoading] = useState(false);

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
            docGstS3Key: d.docGstCertificateS3Key || "",
            docBusinessPanS3Key: d.docBusinessPanS3Key || "",
            docOwnerPanS3Key: d.docOwnerPanS3Key || "",
            docBankProofS3Key: d.docBankProofS3Key || "",
          });
          if (d.accountNumber) setInitialConfirmAccount(d.accountNumber);
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

  const handleViewDocument = async (s3Key: string, name: string) => {
    try {
      setDocPreviewLoading(true);
      const token = getCookie("token");
      const response = await axiosClient.get(`/api/v1/onboarding/documents/download`, {
        params: { s3_key: s3Key },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200 && response.data?.success) {
        const url = response.data.data;
        const ext = s3Key.split(".").pop()?.toLowerCase() || "";
        const fileType = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext) ? "image" : ext === "pdf" ? "pdf" : "image";
        setPreviewDoc({ name, url, fileType });
      }
    } catch (error) {
      console.error("Error previewing document:", error);
    } finally {
      setDocPreviewLoading(false);
    }
  };

  const handleUploadError = (msg: string) => {
    setApiError(msg);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleNext = async () => {
    if (accountMismatch) return;
    if (bank.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifscCode)) return;
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
        confirmAccountNumber: bank.accountNumber,
        accountType: ACCOUNT_TYPE_MAP[bank.accountType] || bank.accountType.toUpperCase(),
        ifscCode: bank.ifscCode,
        docGstCertificateS3Key: bank.docGstS3Key,
        docBusinessPanS3Key: bank.docBusinessPanS3Key,
        docOwnerPanS3Key: bank.docOwnerPanS3Key,
        docBankProofS3Key: bank.docBankProofS3Key,
      };
      await axiosClient.put(`/api/v1/onboarding/bank-settlement`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/onboarding/returns");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      setApiError(msg);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#220E92]" />
      </div>
    );
  }

  const DOCUMENTS = [
    { id: "gstCertificate", label: "GST Certificate", type: "GST_CERTIFICATE", uploaded: bank.gstCertificateUploaded, s3Key: bank.docGstS3Key, uploadedKey: "gstCertificateUploaded", s3Field: "docGstS3Key" },
    { id: "businessPAN", label: "Business PAN Card", type: "BUSINESS_PAN", uploaded: bank.businessPANUploaded, s3Key: bank.docBusinessPanS3Key, uploadedKey: "businessPANUploaded", s3Field: "docBusinessPanS3Key" },
    { id: "ownerPAN", label: "Owner PAN Card", type: "OWNER_PAN", uploaded: bank.ownerPANUploaded, s3Key: bank.docOwnerPanS3Key, uploadedKey: "ownerPANUploaded", s3Field: "docOwnerPanS3Key", mandatory: true },
    { id: "bankProof", label: "Bank Proof Document", type: "BANK_PROOF", uploaded: bank.bankProofUploaded, s3Key: bank.docBankProofS3Key, uploadedKey: "bankProofUploaded", s3Field: "docBankProofS3Key", subtitle: "Cancelled cheque or bank passbook" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div ref={topRef}>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Bank & Settlement Details</h2>
        <p className="text-sm md:text-base text-gray-600">Add your bank account information for settlements</p>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{apiError}</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-yellow-50 to-amber-50/50 border border-yellow-200 rounded-2xl p-4 md:p-6 flex items-start gap-3">
        <CircleAlert className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          Please ensure you enter the correct bank account details. This is where your settlements will be credited.
        </p>
      </div>

      <BankAccountForm
        bank={bank}
        onUpdate={updateBankSettlement}
        initialConfirmAccount={initialConfirmAccount}
        onMismatchChange={setAccountMismatch}
      />

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

        {DOCUMENTS.map((doc) => (
          <DocumentUploadField
            key={doc.id}
            id={doc.id}
            label={doc.label}
            subtitle={doc.subtitle}
            mandatory={doc.mandatory}
            documentType={doc.type}
            uploaded={doc.uploaded}
            s3Key={doc.s3Key}
            onUploaded={(key) => updateBankSettlement({ [doc.s3Field]: key, [doc.uploadedKey]: true })}
            onViewDocument={handleViewDocument}
            docPreviewLoading={docPreviewLoading}
            onError={handleUploadError}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          onClick={() => navigate("/onboarding/categories")}
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

      {previewDoc && <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </div>
  );
}
