import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { ConfirmationModal } from "./ConfirmationModal";

export interface ProductImage {
  id: string;
  file: File;
  url: string;
  isPrimary: boolean;
}

interface ImageUploadSectionProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export function ImageUploadSection({
  images,
  onImagesChange,
  maxImages = 10,
  maxSizeMB = 5,
}: ImageUploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [removeImageId, setRemoveImageId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please upload an image file (JPG, PNG, or WEBP)";
    }

    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      return `Image size must not exceed ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setError("");

    const newImages: ProductImage[] = [];
    const fileArray = Array.from(files);

    // Check total count
    if (images.length + fileArray.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setError(error);
        return;
      }

      const newImage: ProductImage = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
        isPrimary: images.length === 0 && newImages.length === 0,
      };
      newImages.push(newImage);
    }

    onImagesChange([...images, ...newImages]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemoveImage = (id: string) => {
    setRemoveImageId(id);
  };

  const confirmRemove = () => {
    if (!removeImageId) return;

    const updatedImages = images.filter((img) => img.id !== removeImageId);

    // If removing primary image, make first image primary
    if (updatedImages.length > 0) {
      const removedImage = images.find((img) => img.id === removeImageId);
      if (removedImage?.isPrimary) {
        updatedImages[0].isPrimary = true;
      }
    }

    onImagesChange(updatedImages);
    setRemoveImageId(null);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const setPrimaryImage = (id: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {images.length === 0 ? (
        // Empty state
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-[#220e92] bg-[#f9f5ff]"
              : "border-[#d0d5dd] hover:border-[#98a2b3]"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-[#f9fafb] flex items-center justify-center">
              <Upload className="size-5 text-[#475467]" />
            </div>
            <div>
              <p className="text-[13px] text-[#475467] mb-1">
                No images yet. Add a cover and gallery photos using the actions
                below.
              </p>
              <p className="text-[12px] text-[#98a2b3]">
                At least one photo is required. Each file must be square (1:1
                ratio) and not exceed {maxSizeMB}MB.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Button
              onClick={handleClickUpload}
              className="bg-[#220e92] hover:bg-[#1a0a73] text-white rounded-lg h-10 px-4 mt-2 text-[13px]"
            >
              Upload now
            </Button>
            <p className="text-[11px] text-[#98a2b3] mt-1">
              Up to {maxImages} images.{" "}
              <span className="text-[#475467]">
                Max {maxSizeMB}MB / default 1:1 ratio
              </span>{" "}
              but any other thumbnail formats in the catalog image
            </p>
          </div>
        </div>
      ) : (
        // Image gallery
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[#475467]">
              {images.length} / {maxImages} images uploaded
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            {images.length < maxImages && (
              <Button
                onClick={handleClickUpload}
                variant="outline"
                className="h-9 px-3 rounded-lg border-[#d0d5dd] text-[12px]"
              >
                + Add more
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative rounded-lg overflow-hidden border-2 group transition-all ${
                  image.isPrimary
                    ? "border-[#220e92]"
                    : "border-[#eef0f4] hover:border-[#c4b5fd]"
                }`}
              >
                {/* Image */}
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    className="size-full object-cover"
                  />
                </div>

                {/* Remove button — top right on hover */}
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-1.5 right-1.5 size-6 rounded-full bg-white/90 hover:bg-red-50 border border-[#eef0f4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Remove image"
                >
                  <X className="size-3 text-red-500" />
                </button>

                {/* Cover badge — top left when primary */}
                {image.isPrimary && (
                  <div className="absolute top-1.5 left-1.5 bg-[#220e92] text-white text-[10px] px-2 py-0.5 rounded" style={{ fontWeight: 600 }}>
                    Cover
                  </div>
                )}

                {/* Cover checkbox strip — bottom */}
                <label className="flex items-center gap-1.5 px-2 py-1.5 bg-white/95 border-t border-[#eef0f4] cursor-pointer hover:bg-[#f9f5ff] transition-colors">
                  <input
                    type="checkbox"
                    checked={image.isPrimary}
                    onChange={() => {
                      if (!image.isPrimary) setPrimaryImage(image.id);
                    }}
                    className="accent-[#220e92] size-3 shrink-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-[#475467] select-none" style={{ fontWeight: image.isPrimary ? 600 : 400 }}>
                    {image.isPrimary ? "Cover image" : "Set as cover"}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-[12px] text-red-500 mt-2">{error}</p>
      )}

      {/* Remove confirmation modal */}
      <ConfirmationModal
        isOpen={removeImageId !== null}
        onClose={() => setRemoveImageId(null)}
        onConfirm={confirmRemove}
        title="Remove image"
        message="Are you sure you want to remove this image?"
        confirmText="Yes, Remove"
        icon="warning"
      />
    </div>
  );
}