import { X, FileCheck } from "lucide-react";

export function DocumentPreviewModal({
  doc,
  onClose,
}: {
  doc: { name: string; url: string; fileType: string };
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-[12px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/8 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-[#220E92]" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate" style={{ fontSize: "16px", fontWeight: 600 }}>
                {doc.name}
              </h3>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                {doc.fileType} Document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors shrink-0"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-muted/20">
          {doc.fileType === "pdf" ? (
            <iframe
              src={doc.url}
              className="w-full rounded-[12px] border border-border"
              style={{ minHeight: "500px" }}
              title={doc.name}
            />
          ) : (
            <div className="flex items-center justify-center">
              <img
                src={doc.url}
                alt={doc.name}
                className="max-w-full max-h-[70vh] rounded-[12px] border border-border shadow-sm object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
