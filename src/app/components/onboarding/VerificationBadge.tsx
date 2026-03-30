import { CircleCheckBig } from "lucide-react";

interface VerificationBadgeProps {
  verified: boolean;
  label?: string;
}

export function VerificationBadge({ verified, label = "Verified" }: VerificationBadgeProps) {
  if (!verified) return null;
  
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/50 shadow-sm">
      <CircleCheckBig className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
