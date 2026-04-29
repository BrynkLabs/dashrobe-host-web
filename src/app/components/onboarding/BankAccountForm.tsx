import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function BankAccountForm({
  bank,
  onUpdate,
  initialConfirmAccount,
  onMismatchChange,
}: {
  bank: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    accountType: string;
    ifscCode: string;
  };
  onUpdate: (fields: Record<string, any>) => void;
  initialConfirmAccount: string;
  onMismatchChange: (mismatch: boolean) => void;
}) {
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(initialConfirmAccount);
  const [ifscError, setIfscError] = useState("");

  useEffect(() => {
    if (confirmAccountNumber && bank.accountNumber) {
      onMismatchChange(confirmAccountNumber !== bank.accountNumber);
    } else {
      onMismatchChange(false);
    }
  }, [confirmAccountNumber, bank.accountNumber]);

  const accountMismatch = confirmAccountNumber && bank.accountNumber
    ? confirmAccountNumber !== bank.accountNumber
    : false;

  const validatePartialIfsc = (value: string): string => {
    if (!value) return "";
    for (let i = 0; i < Math.min(value.length, 4); i++) {
      if (!/[A-Z]/.test(value[i])) return "First 4 characters must be letters (A–Z)";
    }
    if (value.length >= 5 && value[4] !== "0") return "5th character must be '0'";
    for (let i = 5; i < Math.min(value.length, 11); i++) {
      if (!/[A-Z0-9]/.test(value[i])) return "Last 6 characters must be letters or digits";
    }
    if (value.length > 11) return "IFSC code must be 11 characters";
    if (value.length === 11 && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) return "Invalid IFSC format";
    return "";
  };

  const handleIfscChange = (value: string) => {
    onUpdate({ ifscCode: value, bankVerified: false });
    const err = validatePartialIfsc(value);
    setIfscError(err);
    if (!err && value.length === 11) {
      setTimeout(() => onUpdate({ bankVerified: true }), 500);
    }
  };

  return (
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
          onChange={(e) => onUpdate({ accountHolder: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name *</Label>
        <Input
          id="bankName"
          placeholder="Enter bank name"
          value={bank.bankName}
          onChange={(e) => onUpdate({ bankName: e.target.value })}
          className="rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number *</Label>
          <Input
            id="accountNumber"
            type="password"
            placeholder="Enter account number"
            className="rounded-xl"
            value={bank.accountNumber}
            onChange={(e) => onUpdate({ accountNumber: e.target.value })}
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
        <RadioGroup value={bank.accountType} onValueChange={(v) => onUpdate({ accountType: v })}>
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
        <Input
          id="ifsc"
          placeholder="Enter IFSC code"
          maxLength={11}
          value={bank.ifscCode}
          onChange={(e) => handleIfscChange(e.target.value.toUpperCase())}
          className="rounded-xl"
        />
        {ifscError && <p className="text-xs text-red-500">{ifscError}</p>}
      </div>
    </div>
  );
}
