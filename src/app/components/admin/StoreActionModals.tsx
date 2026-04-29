import { type ReactNode, useState } from "react";

export type ConfirmTone = "purple" | "emerald" | "primary" | "red";

export const CONFIRM_TONE_STYLES: Record<
  ConfirmTone,
  { iconBg: string; iconColor: string; button: string }
> = {
  purple: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    button: "bg-purple-600 text-white hover:bg-purple-700",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    button: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  primary: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    button: "bg-[#220E92] text-white hover:bg-[#220E92]/90",
  },
  red: {
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    button: "bg-red-600 text-white hover:bg-red-700",
  },
};

export function ConfirmModal({
  open,
  icon: Icon,
  tone,
  title,
  subtitle,
  message,
  confirmLabel,
  loadingLabel,
  loading,
  error,
  onConfirm,
  onClose,
}: {
  open: boolean;
  icon: React.ComponentType<{ className?: string }>;
  tone: ConfirmTone;
  title: string;
  subtitle?: string;
  message: ReactNode;
  confirmLabel: string;
  loadingLabel?: string;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  const styles = CONFIRM_TONE_STYLES[tone];
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="bg-card rounded-[12px] p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${styles.iconColor}`} />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{title}</h3>
            {subtitle && (
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <p style={{ fontSize: "14px" }} className="mb-5">
          {message || "store"}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors disabled:opacity-50"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-[10px] transition-colors disabled:opacity-50 ${styles.button}`}
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            {loading ? loadingLabel || `${confirmLabel}...` : confirmLabel}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}

export function RejectModal({
  open,
  icon: Icon,
  storeName,
  loading,
  error,
  onReject,
  onClose,
}: {
  open: boolean;
  icon: React.ComponentType<{ className?: string }>;
  storeName: string;
  loading?: boolean;
  error?: string;
  onReject: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleClose = () => {
    if (loading) return;
    setReason("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-card rounded-[12px] p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
              Reject Store Application
            </h3>
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
              The vendor will be notified
            </p>
          </div>
        </div>
        <p style={{ fontSize: "14px" }} className="mb-4">
          Rejecting <strong>{storeName}</strong>'s application.
        </p>
        <div className="mb-5">
          <label
            className="block text-muted-foreground mb-1.5"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Reason for rejection *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Incomplete documentation, invalid GST number..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background resize-none"
            style={{ fontSize: "14px" }}
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors disabled:opacity-50"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={() => onReject(reason)}
            disabled={!reason.trim() || loading}
            className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
