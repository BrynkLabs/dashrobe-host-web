import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { CircleAlert, Edit, Loader2 } from "lucide-react";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { getCookie } from "@/app/utils/cookieUtils";
import { BasicDetailsSummary, BankingSummary } from "../../components/onboarding/ReviewSummaryCards";
import { StatusBanner } from "../../components/onboarding/StatusBanner";
import { TermsSection } from "../../components/onboarding/TermsSection";

const REVERSE_LEGAL_ENTITY_MAP: Record<string, string> = {
  SOLE_PROPRIETORSHIP: "sole",
  PARTNERSHIP: "partnership",
  PRIVATE_LIMITED: "private",
  LLP: "llp",
  OTHERS: "others",
};

const REVERSE_ACCOUNT_TYPE_MAP: Record<string, string> = {
  SAVINGS: "savings",
  CURRENT: "current",
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const isLocked = submissionStatus === "APPROVED" || submissionStatus === "SUSPENDED";

  const basicComplete = !!(
    vbd.storeName && vbd.businessName && vbd.ownerName && vbd.legalEntity &&
    vbd.pan && vbd.address.shopNo && vbd.address.streetArea && vbd.address.pincode &&
    vbd.address.district && vbd.address.city && vbd.address.state &&
    vbd.contactPerson && vbd.designation && vbd.phone && vbd.email
  );

  const bankComplete = !!(
    bank.accountHolder && bank.bankName && bank.accountNumber &&
    bank.accountType && bank.ifscCode && bank.ownerPANUploaded
  );

  const canSubmit = termsAccepted && basicComplete && bankComplete;

  const fetchStatus = async () => {
    try {
      const token = getCookie("token");
      const res = await axiosClient.get(`/api/v1/onboarding/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = res.data?.data;
      if (d?.status) {
        setSubmissionStatus(d.status);
        if (["SUBMITTED", "REJECTED", "SUSPENDED", "APPROVED"].includes(d.status)) {
          setIsSubmitted(true);
          setTermsAccepted(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch onboarding status:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const token = getCookie("token");
      const auth = { headers: { Authorization: `Bearer ${token}` } };

      const [basicRes, bankRes] = await Promise.allSettled([
        axiosClient.get(`/api/v1/onboarding/basic-details`, auth),
        axiosClient.get(`/api/v1/onboarding/bank-settlement`, auth),
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

      await fetchStatus();
      setLoading(false);
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit) {
      setShowError(true);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
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
      navigate("/onboarding/success", { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      setSubmitError(msg);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (submissionStatus !== "SUBMITTED" && submissionStatus !== "REJECTED") {
      setIsSubmitted(false);
      return;
    }
    setSubmitError("");
    setIsEditing(true);
    try {
      const token = getCookie("token");
      await axiosClient.post(`/api/v1/onboarding/edit`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissionStatus("DRAFT");
      setIsSubmitted(false);
      setTermsAccepted(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to enable editing. Please try again.";
      setSubmitError(msg);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setIsEditing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#220E92]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div ref={topRef}>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Review & Declaration</h2>
        <p className="text-sm md:text-base text-gray-600">Review your details and accept the Terms and Conditions to submit</p>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      <StatusBanner
        isSubmitted={isSubmitted}
        submissionStatus={submissionStatus}
        basicComplete={basicComplete}
        bankComplete={bankComplete}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {showError && !canSubmit && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            {!basicComplete || !bankComplete
              ? "Please complete Basic Details and Bank & Settlement sections before submitting."
              : "Please accept the Terms and Conditions to submit your application."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <BasicDetailsSummary vbd={vbd} isLocked={isLocked} />
        <BankingSummary bank={bank} isLocked={isLocked} />
      </div>

      <TermsSection
        isSubmitted={isSubmitted}
        submissionStatus={submissionStatus}
        termsAccepted={termsAccepted}
        onToggleTerms={(v) => { setShowError(false); setTermsAccepted(v); }}
        tncOpen={tncOpen}
        onTncOpenChange={setTncOpen}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          onClick={() => navigate("/onboarding/offers")}
          variant="outline"
          disabled={isLocked}
          style={{ borderRadius: '10px' }}
          className={`w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Back
        </Button>
        {isSubmitted ? (
          <Button
            onClick={handleEdit}
            disabled={isLocked || isEditing}
            style={{ backgroundColor: '#220E92', borderRadius: '10px' }}
            className={`w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isEditing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enabling edit...</>) : (<><Edit className="w-4 h-4 mr-2" />Edit Application</>)}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit}
            style={{ backgroundColor: canSubmit ? '#220E92' : undefined, borderRadius: '10px' }}
            className={`w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium ${!canSubmit ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>) : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  );
}
