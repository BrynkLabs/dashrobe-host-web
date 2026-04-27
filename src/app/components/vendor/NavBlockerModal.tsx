import { AlertTriangle } from "lucide-react";

interface NavBlockerModalProps {
  isOpen: boolean;
  onStay: () => void;
}

/**
 * Shown when the user tries to navigate away with unsaved changes.
 * There is no "proceed" option — they must Save or Discard from the header.
 */
export function NavBlockerModal({ isOpen, onStay }: NavBlockerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onStay}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-[0px_20px_60px_rgba(0,0,0,0.18)] w-full max-w-[400px] overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-[#d92d20]" />

        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-3">
            <div className="size-10 rounded-xl bg-[#fef3f2] flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5 text-[#d92d20]" />
            </div>
            <div className="pt-1">
              <h2
                className="text-[16px] text-[#101828]"
                style={{ fontWeight: 600 }}
              >
                Unsaved changes
              </h2>
            </div>
          </div>

          {/* Message */}
          <p
            className="text-[14px] text-[#475467] mb-1 pl-14"
            style={{ lineHeight: "1.55" }}
          >
            You have unsaved changes on this page.
          </p>
          <p
            className="text-[14px] text-[#475467] mb-6 pl-14"
            style={{ lineHeight: "1.55" }}
          >
            Please{" "}
            <span className="text-[#220e92]" style={{ fontWeight: 600 }}>
              Save
            </span>{" "}
            or{" "}
            <span className="text-[#220e92]" style={{ fontWeight: 600 }}>
              Discard
            </span>{" "}
            your changes from the header before leaving.
          </p>

          {/* Single action */}
          <div className="flex justify-end">
            <button
              onClick={onStay}
              className="px-6 h-10 rounded-xl text-[14px] text-white bg-[#220e92] hover:bg-[#1a0a73] transition-colors shadow-sm"
              style={{ fontWeight: 600 }}
            >
              Return to page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
