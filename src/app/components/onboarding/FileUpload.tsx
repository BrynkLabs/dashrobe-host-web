import { Upload, FileText, X } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
}

export function FileUpload({
  accept,
  multiple = false,
  onFilesSelected,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    onFilesSelected?.(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
    onFilesSelected?.(selectedFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected?.(newFiles);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging
            ? 'border-[#220E92] bg-[#220E92]/[0.04] shadow-[0_0_0_4px_rgba(34,14,146,0.06)]'
            : 'border-gray-200 hover:border-[#220E92]/30 hover:bg-gray-50/50'
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? "bg-[#220E92]/10" : "bg-[#220E92]/[0.06]"
          }`}>
            <Upload className="w-6 h-6 text-[#220E92]" />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              Drop files here or <span className="text-[#220E92] font-semibold">browse</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {accept ? `Supported: ${accept}` : 'All file types supported'}
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#220E92]/8 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#220E92]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
