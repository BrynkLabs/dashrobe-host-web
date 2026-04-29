import { useState } from "react";
import { CircleCheck, Loader2, Upload, Eye } from "lucide-react";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { getCookie } from "@/app/utils/cookieUtils";

export function DocumentUploadField({
  id,
  label,
  subtitle,
  mandatory,
  documentType,
  uploaded,
  s3Key,
  onUploaded,
  onViewDocument,
  docPreviewLoading,
  onError,
}: {
  id: string;
  label: string;
  subtitle?: string;
  mandatory?: boolean;
  documentType: string;
  uploaded: boolean;
  s3Key: string;
  onUploaded: (s3Key: string) => void;
  onViewDocument: (s3Key: string, name: string) => void;
  docPreviewLoading: boolean;
  onError: (msg: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = getCookie("token");
      const formData = new FormData();
      formData.append("file", file);
      const res = await axiosClient.post(
        `/api/v1/onboarding/documents/upload?document_type=${documentType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const key = res.data?.data?.s3Key;
      if (key) {
        onUploaded(key);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Upload failed";
      onError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
          {label}
          {mandatory && (
            <>
              {" "}<span className="text-red-500">*</span>
              <span className="text-xs text-red-500 bg-[#FEF2F2] p-1 rounded font-medium">Mandatory</span>
            </>
          )}
        </p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className={`flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-gray-300 transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          {uploading ? (
            <Loader2 className="w-4.5 h-4.5 animate-spin text-[#220E92] shrink-0" />
          ) : uploaded ? (
            <CircleCheck className="w-4.5 h-4.5 text-green-500 shrink-0" />
          ) : (
            <Upload className="w-4.5 h-4.5 text-gray-400 shrink-0" />
          )}
          <span className="text-sm text-gray-400">{uploaded ? "Uploaded" : "Upload"}</span>
          <input
            id={id}
            type="file"
            accept=".pdf, .jpg, .jpeg, .png"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        {uploaded && s3Key && (
          <button
            onClick={() => onViewDocument(s3Key, label)}
            disabled={docPreviewLoading}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 hover:bg-[#220E92]/10 transition-colors shrink-0"
            title={`View ${label}`}
          >
            <Eye className="w-4 h-4 text-[#220E92]" />
          </button>
        )}
      </div>
    </div>
  );
}
