import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface Brand {
  id: string;
  name: string;
  logo: string | null;
}

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brand: Brand) => void;
}

export function BrandModal({ isOpen, onClose, onSave }: BrandModalProps) {
  const [brandName, setBrandName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo size must not exceed 2MB");
      return;
    }

    setError("");
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!brandName.trim()) {
      setError("Brand name is required");
      return;
    }

    const newBrand: Brand = {
      id: `${Date.now()}-${Math.random()}`,
      name: brandName.trim(),
      logo: logoPreview,
    };

    onSave(newBrand);
    handleClose();
  };

  const handleClose = () => {
    setBrandName("");
    setLogoFile(null);
    setLogoPreview(null);
    setError("");
    onClose();
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-[#1a1a2e]">
            Add New Brand
          </h2>
          <button
            onClick={handleClose}
            className="text-[#667085] hover:text-[#1a1a2e] transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Brand name */}
          <div>
            <Label className="text-[13px] text-[#475467] mb-1.5 block">
              Brand Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name"
              className="h-10 rounded-lg border-[#d0d5dd] text-[13px]"
            />
          </div>

          {/* Brand logo */}
          <div>
            <Label className="text-[13px] text-[#475467] mb-1.5 block">
              Brand Logo (Optional)
            </Label>
            {logoPreview ? (
              <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#eef0f4]">
                <img
                  src={logoPreview}
                  alt="Brand logo"
                  className="size-12 object-contain rounded border border-[#eef0f4] bg-white"
                />
                <div className="flex-1">
                  <p className="text-[13px] text-[#1a1a2e] font-medium">
                    {logoFile?.name}
                  </p>
                  <p className="text-[11px] text-[#98a2b3]">
                    {(logoFile!.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={removeLogo}
                  className="text-[#667085] hover:text-red-600 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#d0d5dd] rounded-lg p-4 text-center hover:border-[#98a2b3] transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center gap-2"
                >
                  <div className="size-10 rounded-full bg-[#f9fafb] flex items-center justify-center">
                    <Upload className="size-4 text-[#475467]" />
                  </div>
                  <div>
                    <p className="text-[12px] text-[#475467]">
                      Click to upload logo
                    </p>
                    <p className="text-[11px] text-[#98a2b3]">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && <p className="text-[12px] text-red-500">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 h-10 rounded-lg border-[#d0d5dd] text-[13px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 h-10 rounded-lg bg-[#220e92] hover:bg-[#1a0a73] text-white text-[13px]"
          >
            Add Brand
          </Button>
        </div>
      </div>
    </div>
  );
}
