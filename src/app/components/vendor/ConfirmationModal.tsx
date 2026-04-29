import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  icon?: "warning" | "alert";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  icon = "alert",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-[0px_20px_60px_rgba(0,0,0,0.15)] w-full max-w-[420px] overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-[#220e92]" />

        <div className="p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-7 flex items-center justify-center rounded-lg text-[#98a2b3] hover:bg-[#f2f4f7] hover:text-[#344054] transition-colors"
          >
            <X className="size-4" />
          </button>

          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                icon === "warning"
                  ? "bg-[#fff4ed]"
                  : "bg-[#ede9fe]"
              }`}
            >
              <AlertTriangle
                className={`size-5 ${
                  icon === "warning" ? "text-[#b93815]" : "text-[#220e92]"
                }`}
              />
            </div>
            <div className="pt-0.5">
              <h2 className="text-[16px] text-[#101828]" style={{ fontWeight: 600 }}>
                {title}
              </h2>
            </div>
          </div>

          {/* Message */}
          <p className="text-[14px] text-[#475467] leading-[21px] mb-6 pl-14">
            {message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 h-10 flex-1 rounded-xl text-[14px] text-[#344054] border border-[#d0d5dd] hover:bg-[#f9fafb] transition-colors"
              style={{ fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 h-10 flex-1 rounded-xl text-[14px] text-white bg-[#220e92] hover:bg-[#1a0a73] active:bg-[#150870] transition-colors shadow-sm"
              style={{ fontWeight: 600 }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
