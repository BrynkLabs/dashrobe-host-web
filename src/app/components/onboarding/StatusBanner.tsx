import { CircleAlert, CircleCheck, Info, RefreshCw } from "lucide-react";

export function StatusBanner({
  isSubmitted,
  submissionStatus,
  basicComplete,
  bankComplete,
  refreshing,
  onRefresh,
}: {
  isSubmitted: boolean;
  submissionStatus: string;
  basicComplete: boolean;
  bankComplete: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  if (isSubmitted && (submissionStatus === "REJECTED" || submissionStatus === "SUSPENDED")) {
    return (
      <div
        className="rounded-2xl p-4 flex items-start justify-between gap-3"
        style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}
      >
        <div className="flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <p>
              Your request has been {submissionStatus === "REJECTED" ? "rejected" : "suspended"}. Please contact our customer support team for assistance.
            </p>
            <p className="mt-1 font-medium">
              <a href="mailto:info@dashrobe.in" className="underline">info@dashrobe.in</a>
              {" "}or{" "}
              <a href="tel:+919999999999" className="underline">+91 9999 999 999</a>
            </p>
          </div>
        </div>
        <RefreshButton refreshing={refreshing} onRefresh={onRefresh} className="text-red-700 hover:bg-red-100" />
      </div>
    );
  }

  if (isSubmitted && submissionStatus === "APPROVED") {
    return (
      <div
        className="rounded-2xl p-4 flex items-start justify-between gap-3"
        style={{ backgroundColor: "#F0FDF4", border: "1px solid #86EFAC" }}
      >
        <div className="flex items-start gap-3">
          <CircleCheck className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800 text-[#16A34A]">
            Congratulations! Your application has been approved. Welcome to Dashrobe!
          </p>
        </div>
        <RefreshButton refreshing={refreshing} onRefresh={onRefresh} className="text-emerald-700 hover:bg-emerald-100" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div
        className="rounded-2xl p-4 flex items-center justify-between gap-3"
        style={{ backgroundColor: "#F0FDF4", border: "1px solid #86EFAC" }}
      >
        <div className="flex items-center gap-3">
          <CircleCheck className="w-5 h-5 text-emerald-600 text-[#16A34A] flex-shrink-0" />
          <p className="text-sm text-emerald-800 text-[#16A34A]">
            Application submitted, We're reviewing your application and will reach out within 2 days.
          </p>
        </div>
        <RefreshButton refreshing={refreshing} onRefresh={onRefresh} className="text-[#16A34A] hover:bg-emerald-100" />
      </div>
    );
  }

  if (!basicComplete || !bankComplete) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Some sections appear incomplete. Navigate back to fill in any missing details before submitting.
        </p>
      </div>
    );
  }

  return null;
}

function RefreshButton({
  refreshing,
  onRefresh,
  className,
}: {
  refreshing: boolean;
  onRefresh: () => void;
  className: string;
}) {
  return (
    <button
      onClick={onRefresh}
      disabled={refreshing}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${className}`}
    >
      <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
      Refresh
    </button>
  );
}
