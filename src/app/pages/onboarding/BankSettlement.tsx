import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { VerificationBadge } from "../../components/onboarding/VerificationBadge";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { CircleAlert, Building2, FileText, CircleCheck, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function BankSettlement() {
  const navigate = useNavigate();
  const { data, updateBankSettlement } = useOnboarding();
  const bank = data.bankSettlement;

  const handleIfscChange = (value: string) => {
    updateBankSettlement({ ifscCode: value });
    if (value.length === 11) {
      setTimeout(() => {
        updateBankSettlement({ bankName: "State Bank of India", bankVerified: true });
      }, 500);
    }
  };

  const [gstError, setGstError] = useState("");

  const handleNext = () => {
    if (!bank.gstCertificateUploaded) {
      setGstError("GST Certificate is mandatory. Please upload before continuing.");
      return;
    }
    setGstError("");
    navigate("/onboarding/returns");
  };
  const handleBack = () => navigate("/onboarding/categories");

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
              className="rounded-xl"
            />
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
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
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

        <div className="space-y-2">
          <Label htmlFor="gstCertificate" className="flex items-center gap-1.5">
            GST Certificate <span className="text-red-500">*</span>
            <span className="text-xs text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">Mandatory</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="gstCertificate"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => {
                if (e.target.files?.[0]) updateBankSettlement({ gstCertificateUploaded: true });
              }}
              className="rounded-xl"
            />
            {bank.gstCertificateUploaded && <CircleCheck className="w-5 h-5 text-green-500" />}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessPAN">Business PAN Card *</Label>
          <div className="flex items-center gap-2">
            <Input
              id="businessPAN"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => {
                if (e.target.files?.[0]) updateBankSettlement({ businessPANUploaded: true });
              }}
              className="rounded-xl"
            />
            {bank.businessPANUploaded && <CircleCheck className="w-5 h-5 text-green-500" />}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerPAN">Owner PAN Card *</Label>
          <div className="flex items-center gap-2">
            <Input
              id="ownerPAN"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => {
                if (e.target.files?.[0]) updateBankSettlement({ ownerPANUploaded: true });
              }}
              className="rounded-xl"
            />
            {bank.ownerPANUploaded && <CircleCheck className="w-5 h-5 text-green-500" />}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankProof">Bank Proof Document *</Label>
          <p className="text-xs text-gray-600 mb-2">Cancelled cheque or bank passbook</p>
          <div className="flex items-center gap-2">
            <Input
              id="bankProof"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => {
                if (e.target.files?.[0]) updateBankSettlement({ bankProofUploaded: true });
              }}
              className="rounded-xl"
            />
            {bank.bankProofUploaded && <CircleCheck className="w-5 h-5 text-green-500" />}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          onClick={handleBack}
          variant="outline"
          style={{ borderRadius: '12px' }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          style={{ backgroundColor: '#220E92', borderRadius: '12px' }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium shadow-lg shadow-[#220E92]/20 hover:shadow-xl hover:shadow-[#220E92]/25 transition-all"
        >
          Continue to Refunds & Returns
        </Button>
      </div>
    </div>
  );
}