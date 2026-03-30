import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { formatAddress } from "../../components/onboarding/AddressFields";
import { FileText, DollarSign, Shield, Edit, CircleAlert, Building2, Phone, Mail, MapPin, CreditCard, CircleCheck, Landmark, Info } from "lucide-react";

interface CommitmentItem {
  id: string;
  label: string;
}

const commitments: CommitmentItem[] = [
  { id: "info-accurate", label: "All information provided in this application is accurate and up-to-date." },
  { id: "legal-authority", label: "I have the legal authority to represent and act on behalf of this business." },
  { id: "product-compliance", label: "All products listed comply with Indian laws, regulations, and quality standards." },
  { id: "vendor-terms", label: "I accept Dashrobe's Vendor Terms & Conditions and Privacy Policy." },
  { id: "quality-standards", label: "I commit to maintaining product quality and accurate listings at all times." },
  { id: "document-verification", label: "I authorize Dashrobe to verify all submitted documents and business credentials." },
  { id: "order-acceptance", label: "I commit to accepting or rejecting orders within 5 minutes of receiving them." },
  { id: "packing-sla", label: "I commit to packing accepted orders within the preparation time specified during onboarding." },
  { id: "inventory-accuracy", label: "I will keep inventory levels updated to avoid order cancellations due to stock-outs." },
  { id: "settlement-terms", label: "I understand and accept the weekly settlement cycle (T+7 days from delivery)." },
  { id: "delivery-integration", label: "I acknowledge that Dashrobe handles all logistics and delivery operations." },
  { id: "communication", label: "I agree to maintain responsive communication via the registered WhatsApp number." },
];

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
  const { data } = useOnboarding();
  const vbd = data.vendorBasicDetails;
  const bank = data.bankSettlement;

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [basicExpanded, setBasicExpanded] = useState(true);
  const [bankingExpanded, setBankingExpanded] = useState(true);

  const allChecked = commitments.every((c) => checkedItems[c.id] === true);
  const checkedCount = commitments.filter((c) => checkedItems[c.id]).length;

  const toggleItem = (id: string) => {
    setShowError(false);
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    if (allChecked) {
      setCheckedItems({});
    } else {
      const all: Record<string, boolean> = {};
      commitments.forEach((c) => { all[c.id] = true; });
      setCheckedItems(all);
    }
    setShowError(false);
  };

  const handleSubmit = async () => {
    if (!allChecked) {
      setShowError(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleBack = () => {
    navigate("/onboarding/technology");
  };

  // Helper to check if fields have data
  const hasBasicDetails = vbd.storeName || vbd.businessName || vbd.ownerName || vbd.phone || vbd.email;
  const hasBankDetails = bank.accountHolder || bank.bankName || bank.accountNumber || bank.ifscCode;

  // Mask account number for display
  const maskedAccountNumber = bank.accountNumber
    ? "\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF " + bank.accountNumber.slice(-4)
    : "";

  // ─── Full-screen Welcome Page after successful submission ─────
  if (isSubmitted) {
    // Generate confetti pieces once
    const confettiColors = ["#FFC100", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96E6A1", "#DDA0DD", "#FFD93D", "#FF8C42", "#ffffff"];
    const confettiPieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: confettiColors[i % confettiColors.length],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 1.5,
      duration: Math.random() * 2 + 2,
      rotation: Math.random() * 720 - 360,
      shape: i % 3, // 0 = square, 1 = circle, 2 = rectangle
    }));

    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#220E92] via-[#2D14B3] to-[#1a0a6e] flex items-center justify-center overflow-hidden">
        {/* Confetti animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                top: -20,
                width: piece.shape === 2 ? piece.size * 2.5 : piece.size,
                height: piece.shape === 1 ? piece.size : piece.size * 0.6,
                backgroundColor: piece.color,
                borderRadius: piece.shape === 1 ? "50%" : piece.shape === 0 ? "2px" : "1px",
              }}
              initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
              animate={{
                y: ["-2vh", "110vh"],
                opacity: [1, 1, 0.8, 0],
                rotate: [0, piece.rotation],
                x: [0, (Math.random() - 0.5) * 200],
                scale: [1, 0.8],
              }}
              transition={{
                duration: piece.duration + 1.5,
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </div>

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.05, 0.15, 0.05],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
          {/* Animated checkmark circle */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#FFC100] flex items-center justify-center mb-8 shadow-2xl shadow-[#FFC100]/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
            >
              <CircleCheck className="w-14 h-14 md:w-16 md:h-16 text-[#220E92]" />
            </motion.div>
          </motion.div>

          {/* Welcome text */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl text-white mb-4"
            style={{ fontWeight: 700, letterSpacing: "-0.5px" }}
          >
            Welcome to <span className="text-[#FFC100]">Dashrobe</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="space-y-3 mb-10"
          >
            <p className="text-lg md:text-xl text-white/90">
              Your application has been submitted successfully!
            </p>
            <p className="text-sm md:text-base text-white/60">
              We will get back to you shortly. Our team will review your application and you'll hear from us within 2-3 business days.
            </p>
          </motion.div>

          {/* Animated card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 w-full border border-white/20 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFC100]/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-[#FFC100]" />
              </div>
              <h3 className="text-white font-semibold text-left">What happens next?</h3>
            </div>
            <ul className="space-y-3 text-left">
              {[
                "Our team reviews your documents & details",
                "You'll receive an email confirmation shortly",
                "Once approved, your vendor dashboard goes live",
                "Start listing products and accepting orders!",
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7 + i * 0.15, duration: 0.4 }}
                  className="flex items-start gap-2.5 text-sm text-white/80"
                >
                  <span className="w-5 h-5 rounded-full bg-[#FFC100]/20 text-[#FFC100] flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.5 }}
          >
            <Button
              onClick={() => navigate("/vendor")}
              className="px-8 md:px-10 py-5 md:py-6 text-sm md:text-base font-medium bg-[#FFC100] text-[#220E92] hover:bg-[#FFD040]"
              style={{ borderRadius: "12px" }}
            >
              Go to Vendor Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Review & Declaration</h2>
        <p className="text-sm md:text-base text-gray-600">Review your details and confirm your commitments to submit</p>
      </div>

      {/* Incomplete data notice */}
      {(!hasBasicDetails || !hasBankDetails) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Some sections appear incomplete. Navigate back to fill in any missing details before submitting.
          </p>
        </div>
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
      {showError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            Please accept all commitments and declarations below to submit your application.
          </p>
        </div>
      )}

      {/* Commitments, Declarations & SLA */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 lg:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#220E92]" />
            <h3 className="text-lg font-semibold text-gray-900">Commitments, Declarations & SLA</h3>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            {checkedCount}/{commitments.length} accepted
          </span>
        </div>

        <p className="text-sm text-gray-600">
          Please review and accept all the following items. All are mandatory to proceed.
        </p>

        {/* Select All */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <Checkbox
            id="select-all"
            checked={allChecked}
            onCheckedChange={toggleAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-semibold text-[#220E92] cursor-pointer select-none"
          >
            Select All
          </label>
        </div>

        {/* Individual checkboxes */}
        <div className="space-y-3">
          {commitments.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                checkedItems[item.id] ? "bg-emerald-50/60" : "hover:bg-gray-50"
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <Checkbox
                id={item.id}
                checked={checkedItems[item.id] || false}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-0.5"
              />
              <label
                htmlFor={item.id}
                className={`text-sm leading-relaxed cursor-pointer select-none ${
                  checkedItems[item.id] ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {item.label} <span className="text-red-500">*</span>
              </label>
            </div>
          ))}
        </div>
      </div>

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
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ backgroundColor: allChecked ? '#220E92' : undefined, borderRadius: '10px' }}
          className={`w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium ${
            !allChecked ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
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