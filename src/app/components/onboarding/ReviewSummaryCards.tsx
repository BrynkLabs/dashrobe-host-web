import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import {
  FileText, DollarSign, Edit, Building2, Phone, Mail, MapPin,
  CreditCard, CircleCheck, Landmark,
} from "lucide-react";
import { formatAddress } from "./AddressFields";

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
      <span className={`text-gray-500 shrink-0 ${icon ? "w-[110px]" : "w-[130px]"}`}>{label}</span>
      <span className={`font-medium flex items-center gap-1.5 break-all ${isEmpty ? "text-gray-400 italic" : "text-gray-900"}`}>
        {value}
        {verified && <CircleCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
        {docStatus && <CircleCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
      </span>
    </div>
  );
}

export function BasicDetailsSummary({
  vbd,
  isLocked,
}: {
  vbd: any;
  isLocked: boolean;
}) {
  const navigate = useNavigate();
  const hasBasicDetails = vbd.storeName || vbd.businessName || vbd.ownerName || vbd.phone || vbd.email;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <SectionHeader
        icon={<FileText className="w-5 h-5 text-[#220E92]" />}
        title="Basic Details"
        complete={!!hasBasicDetails}
      />

      <div className="space-y-3 mb-4 animate-in fade-in duration-200">
        <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
          <SummaryRow icon={<Building2 className="w-3.5 h-3.5" />} label="Store Name" value={vbd.storeName || "Not provided"} />
          <SummaryRow icon={<Building2 className="w-3.5 h-3.5" />} label="Business Name" value={vbd.businessName || "Not provided"} />
          <SummaryRow label="Owner" value={vbd.ownerName || "Not provided"} />
          <SummaryRow label="Legal Entity" value={legalEntityLabels[vbd.legalEntity] || "Not selected"} />
        </div>
        <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
          <SummaryRow label="GSTIN" value={vbd.gstin || "Not provided"} verified={vbd.gstVerified} />
          <SummaryRow label="PAN" value={vbd.pan || "Not provided"} verified={vbd.panVerified} />
        </div>
        <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
          <SummaryRow icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={vbd.phone || "Not provided"} verified={vbd.phoneVerified} />
          <SummaryRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={vbd.email || "Not provided"} />
          <SummaryRow icon={<MapPin className="w-3.5 h-3.5" />} label="Reg. Address" value={formatAddress(vbd.address) || "Not provided"} />
        </div>
        {(vbd.contact2Name || vbd.contact2Phone) && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
            <p className="text-xs text-gray-400 font-medium">Secondary Contact</p>
            <SummaryRow label="Name" value={vbd.contact2Name || "Not provided"} />
            <SummaryRow label="Designation" value={vbd.contact2Designation || "Not provided"} />
            <SummaryRow icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={vbd.contact2Phone || "Not provided"} />
            <SummaryRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={vbd.contact2Email || "Not provided"} />
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/onboarding")}
        disabled={isLocked}
        className={`w-full justify-start text-[#220E92] ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Details
      </Button>
    </div>
  );
}

export function BankingSummary({
  bank,
  isLocked,
}: {
  bank: any;
  isLocked: boolean;
}) {
  const navigate = useNavigate();
  const hasBankDetails = bank.accountHolder || bank.bankName || bank.accountNumber || bank.ifscCode;
  const maskedAccountNumber = bank.accountNumber
    ? "\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF " + bank.accountNumber.slice(-4)
    : "";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <SectionHeader
        icon={<DollarSign className="w-5 h-5 text-[#220E92]" />}
        title="Banking Info"
        complete={!!hasBankDetails}
      />

      <div className="space-y-3 mb-4 animate-in fade-in duration-200">
        <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
          <SummaryRow icon={<Landmark className="w-3.5 h-3.5" />} label="Bank" value={bank.bankName || "Not provided"} verified={bank.bankVerified} />
          <SummaryRow label="Account Holder" value={bank.accountHolder || "Not provided"} />
          <SummaryRow icon={<CreditCard className="w-3.5 h-3.5" />} label="Account No." value={maskedAccountNumber || "Not provided"} />
          <SummaryRow label="Account Type" value={accountTypeLabels[bank.accountType] || bank.accountType} />
          <SummaryRow label="IFSC Code" value={bank.ifscCode || "Not provided"} />
        </div>
        <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
          <SummaryRow label="GST Certificate" value={bank.gstCertificateUploaded ? "Uploaded" : "Not uploaded"} docStatus={bank.gstCertificateUploaded} />
          <SummaryRow label="Business PAN" value={bank.businessPANUploaded ? "Uploaded" : "Not uploaded"} docStatus={bank.businessPANUploaded} />
          <SummaryRow label="Owner PAN" value={bank.ownerPANUploaded ? "Uploaded" : "Not uploaded"} docStatus={bank.ownerPANUploaded} />
          <SummaryRow label="Bank Proof" value={bank.bankProofUploaded ? "Uploaded" : "Not uploaded"} docStatus={bank.bankProofUploaded} />
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/onboarding/banking")}
        disabled={isLocked}
        className={`w-full justify-start text-[#220E92] ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Banking
      </Button>
    </div>
  );
}

function SectionHeader({ icon, title, complete }: { icon: React.ReactNode; title: string; complete: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-[#220E92]/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          {complete ? (
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
  );
}
