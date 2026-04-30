import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { CategorySection } from "./CategorySection";
import { BrandSelector } from "./BrandSelector";
import type { Brand } from "./BrandModal";

export function FormCard({ title, children, error, headerAction }: { title: string; children: ReactNode; error?: string; headerAction?: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-[#1a1a2e]">{title}</h2>
        {headerAction}
      </div>
      {error && (
        <p className="text-[12px] text-red-500 mb-3 flex items-center gap-1">
          <AlertCircle className="size-3" />{error}
        </p>
      )}
      {children}
    </div>
  );
}

export function BasicInfoFields({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  errors,
}: {
  title: string;
  description: string;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <FormCard title="Basic Information">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-[13px] text-[#475467]">Title *</Label>
            <span className="text-[11px] text-[#98a2b3]">{title.length}/100</span>
          </div>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Short sleeve t-shirt"
            maxLength={100}
            className={`h-10 rounded-lg border-[#d0d5dd] text-[13px] ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="size-3" />{errors.title}
            </p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-[13px] text-[#475467]">Description *</Label>
            <span className="text-[11px] text-[#98a2b3]">{description.length}/500</span>
          </div>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe your product..."
            maxLength={500}
            className={`min-h-[100px] rounded-lg border-[#d0d5dd] text-[13px] ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="size-3" />{errors.description}
            </p>
          )}
        </div>
      </div>
    </FormCard>
  );
}

export function CategoryCard({
  gender,
  category,
  subcategory,
  onGenderChange,
  onCategoryChange,
  onSubcategoryChange,
  categoryError,
}: {
  gender: string;
  category: string;
  subcategory: string;
  onGenderChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSubcategoryChange: (v: string) => void;
  categoryError?: string;
}) {
  return (
    <FormCard title="Category">
      <CategorySection
        gender={gender}
        onGenderChange={onGenderChange}
        category={category}
        onCategoryChange={onCategoryChange}
        subcategory={subcategory}
        onSubcategoryChange={onSubcategoryChange}
        categoryError={categoryError}
      />
    </FormCard>
  );
}

export function BrandCard({
  brands,
  selectedBrand,
  onBrandChange,
  onAddBrand,
  error,
}: {
  brands: Brand[];
  selectedBrand: string;
  onBrandChange: (v: string) => void;
  onAddBrand: () => void;
  error?: string;
}) {
  return (
    <FormCard title="Brand *" error={error}>
      <BrandSelector
        brands={brands}
        selectedBrand={selectedBrand}
        onBrandChange={onBrandChange}
        onAddBrand={onAddBrand}
      />
    </FormCard>
  );
}

/* ─── Shared validation ─────────────────────────────────────────── */

export const ALLOWED_FROM: Record<string, string[]> = {
  Draft: ["Draft", "Active"],
  Active: ["Active", "Hidden"],
  Hidden: ["Hidden", "Active"],
};

export function getMissingActiveFields(
  title: string,
  description: string,
  category: string,
  subcategory: string,
  brand: string,
  imageCount: number,
  hasCompleteVariant: boolean,
): string[] {
  const missing: string[] = [];
  if (!title.trim() || title.trim().length < 3) missing.push("Title");
  if (!description.trim()) missing.push("Description");
  if (!category) missing.push("Category");
  if (!subcategory) missing.push("Subcategory");
  if (!brand) missing.push("Brand");
  if (imageCount === 0) missing.push("1 image min.");
  if (!hasCompleteVariant) missing.push("1 variant min.");
  return missing;
}

export function buildValidationErrors(
  title: string,
  description: string,
  category: string,
  subcategory: string,
  brand: string,
  imageCount: number,
  hasCompleteVariant: boolean,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!title.trim() || title.trim().length < 3) errors.title = "Title is required (min 3 chars)";
  if (!description.trim()) errors.description = "Description is required";
  if (!category) errors.category = "Category is required";
  if (!subcategory) errors.subcategory = "Subcategory is required";
  if (!brand) errors.brand = "Brand is required";
  if (imageCount === 0) errors.images = "At least one product image is required";
  if (!hasCompleteVariant) errors.variants = "At least one complete variant is required";
  return errors;
}
