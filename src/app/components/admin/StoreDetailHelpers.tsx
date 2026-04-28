import type { ReactNode } from "react";
import { CircleCheck, CircleX } from "lucide-react";

export function isMissingValue(v?: string | null): boolean {
  if (v === undefined || v === null) return true;
  const s = String(v).trim();
  if (!s) return true;
  const lower = s.toLowerCase();
  if (lower === "—" || lower === "-" || lower === "na" || lower === "n/a" || lower === "null" || lower === "undefined") return true;
  if (lower === "undefined (undefined)" || lower === "(undefined)" || lower === "()") return true;
  return false;
}

export function VBadge({
  ok,
  yes = "Yes",
  no = "No",
}: {
  ok: boolean;
  yes?: string;
  no?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
      style={{
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: ok ? "#D1FAE5" : "#FEE2E2",
        color: ok ? "#059669" : "#DC2626",
      }}
    >
      {ok ? <CircleCheck className="w-3 h-3" /> : <CircleX className="w-3 h-3" />}
      {ok ? yes : no}
    </span>
  );
}

export function MissingTag() {
  return <VBadge ok={false} yes="Present" no="Missing" />;
}

export function DField({
  label,
  value,
  badge,
}: {
  label: string;
  value?: string;
  badge?: ReactNode;
}) {
  const missing = isMissingValue(value) && !badge;
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground shrink-0" style={{ fontSize: "13px" }}>
        {label}
      </span>
      <div className="text-right flex items-center gap-2">
        {!missing && value && !isMissingValue(value) && (
          <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>
        )}
        {badge}
        {missing && <MissingTag />}
      </div>
    </div>
  );
}

export function StepSection({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
        <span
          className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0"
          style={{ fontSize: "11px", fontWeight: 700 }}
        >
          {step}
        </span>
        <h3 style={{ fontSize: "15px", fontWeight: 600 }}>{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
