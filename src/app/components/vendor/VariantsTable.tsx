import { useState, useRef } from "react";
import { Plus, Upload, X } from "lucide-react";
import variantDelIcon from "@/assets/icons/varient-del.png";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ColorPickerModal } from "./ColorPickerModal";

export interface ProductVariant {
  id: string;
  color: {
    name: string;
    hex: string;
    secondaryName?: string;
    secondaryHex?: string;
  } | null;
  size: string;
  mrp: string;
  offerPrice: string;
  status: string;
  image: string | null;
  isDefault?: boolean;
}

interface VariantsTableProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  errors?: Record<string, string>;
  showDelete?: boolean;
}

const SIZES = ["Free Size", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "Custom"];

// ── Per-row image upload cell ────────────────────────────────────────────────
function VariantImageCell({
  image,
  onUpload,
  onRemove,
}: {
  image: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(url);
    e.target.value = "";
  };

  if (image) {
    return (
      <div className="relative size-9 group">
        <img
          src={image}
          alt="Variant"
          className="size-full object-cover rounded-md border border-[#eef0f4]"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <X className="size-2.5" />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="h-8 px-2.5 flex items-center gap-1.5 text-[11px] text-[#98a2b3] hover:text-[#220e92] hover:bg-[#f0ebff] rounded-md border border-dashed border-[#d0d5dd] hover:border-[#220e92] transition-colors whitespace-nowrap"
      >
        <Upload className="size-3 shrink-0" />
        Upload
      </button>
    </>
  );
}

// ── Custom radio-style checkbox ──────────────────────────────────────────────
function DefaultRadio({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      title={checked ? "Default variant" : "Set as default"}
      className="size-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#220e92] focus-visible:ring-offset-1"
      style={{
        borderColor: checked ? "#220e92" : "#d0d5dd",
        backgroundColor: checked ? "#220e92" : "white",
      }}
    >
      {checked && (
        <span className="size-1.5 rounded-full bg-white block" />
      )}
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function VariantsTable({
  variants,
  onVariantsChange,
  errors = {},
  showDelete = true,
}: VariantsTableProps) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [deleteVariantId, setDeleteVariantId] = useState<string | null>(null);

  const addVariantRow = () => {
    if (variants.length >= 20) return;
    const newVariant: ProductVariant = {
      id: `${Date.now()}-${Math.random()}`,
      color: null,
      size: "",
      mrp: "",
      offerPrice: "",
      status: "Active",
      image: null,
      isDefault: false,
    };
    onVariantsChange([...variants, newVariant]);
  };

  const updateVariant = (
    id: string,
    field: keyof ProductVariant,
    value: any
  ) => {
    onVariantsChange(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const setDefault = (id: string) => {
    onVariantsChange(
      variants.map((v) => ({ ...v, isDefault: v.id === id }))
    );
  };

  const removeVariant = (id: string) => {
    if (variants.length <= 1) return;
    const filtered = variants.filter((v) => v.id !== id);
    // If removed variant was default, assign default to first row
    const removedWasDefault = variants.find((v) => v.id === id)?.isDefault;
    if (removedWasDefault && filtered.length > 0) {
      filtered[0] = { ...filtered[0], isDefault: true };
    }
    onVariantsChange(filtered);
  };

  const openColorPicker = (variantId: string) => {
    setEditingVariantId(variantId);
    setColorPickerOpen(true);
  };

  const handleColorSave = (color: {
    name: string;
    hex: string;
    secondaryName?: string;
    secondaryHex?: string;
  }) => {
    if (editingVariantId) updateVariant(editingVariantId, "color", color);
    setColorPickerOpen(false);
    setEditingVariantId(null);
  };

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#eef0f4]">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#eef0f4]">
              {/* Default column header */}
              <th className="text-left py-2.5 px-3 w-[72px]">
                <span
                  className="text-[#667085] whitespace-nowrap"
                  style={{ fontWeight: 500, fontSize: 11, letterSpacing: "0.05em" }}
                >
                  DEFAULT
                </span>
              </th>
              {["COLOR", "SIZE", "MRP", "OFFER PRICE", "STATUS", "IMAGE", ""].map((h) => (
                <th
                  key={h}
                  className="text-left py-2.5 px-3 text-[#667085] whitespace-nowrap"
                  style={{ fontWeight: 500, fontSize: 11, letterSpacing: "0.05em" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr
                key={variant.id}
                className={`border-b border-[#eef0f4] last:border-0 transition-colors ${
                  variant.isDefault
                    ? "bg-[#f9f5ff] hover:bg-[#f3eeff]"
                    : "hover:bg-[#fafafa]"
                }`}
              >
                {/* Default radio */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <DefaultRadio
                      checked={!!variant.isDefault}
                      onChange={() => setDefault(variant.id)}
                    />
                    {variant.isDefault && (
                      <span className="text-[10px] text-[#220e92] bg-[#ede9ff] px-1.5 py-0.5 rounded whitespace-nowrap" style={{ fontWeight: 500 }}>
                        Default
                      </span>
                    )}
                  </div>
                </td>

                {/* Color */}
                <td className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => openColorPicker(variant.id)}
                    className={`h-8 pl-2.5 pr-3 rounded-md border text-[11px] flex items-center gap-2 hover:border-[#220e92] transition-colors min-w-[110px] ${
                      errors[`variant-${index}`]
                        ? "border-red-400 bg-red-50"
                        : "border-[#d0d5dd] bg-white"
                    }`}
                  >
                    {variant.color ? (
                      <>
                        <div className="flex gap-0.5 shrink-0">
                          <div
                            className="size-3 rounded-full"
                            style={{
                              backgroundColor: variant.color.hex,
                              border:
                                variant.color.hex === "#FFFFFF"
                                  ? "1px solid #e0e0e0"
                                  : "none",
                            }}
                          />
                          {variant.color.secondaryHex && (
                            <div
                              className="size-3 rounded-full -ml-1"
                              style={{
                                backgroundColor: variant.color.secondaryHex,
                                border:
                                  variant.color.secondaryHex === "#FFFFFF"
                                    ? "1px solid #e0e0e0"
                                    : "none",
                              }}
                            />
                          )}
                        </div>
                        <span className="truncate max-w-[80px]">
                          {variant.color.name}
                          {variant.color.secondaryName &&
                            ` + ${variant.color.secondaryName}`}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#98a2b3]">Select color</span>
                    )}
                  </button>
                </td>

                {/* Size */}
                <td className="py-2.5 px-3">
                  {variant.size === "Custom" ||
                  (variant.size &&
                    !SIZES.filter((s) => s !== "Custom").includes(variant.size)) ? (
                    <Input
                      value={variant.size === "Custom" ? "" : variant.size}
                      onChange={(e) => updateVariant(variant.id, "size", e.target.value)}
                      placeholder="Custom"
                      className="h-8 w-24 text-[11px] rounded-md border-[#d0d5dd]"
                    />
                  ) : (
                    <Select
                      value={variant.size}
                      onValueChange={(value) =>
                        updateVariant(
                          variant.id,
                          "size",
                          value === "Custom" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger className="h-8 w-24 text-[11px] rounded-md border-[#d0d5dd]">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </td>

                {/* MRP */}
                <td className="py-2.5 px-3">
                  <Input
                    value={variant.mrp}
                    onChange={(e) => updateVariant(variant.id, "mrp", e.target.value)}
                    placeholder="₹ 0"
                    className={`h-8 w-24 text-[11px] rounded-md ${
                      errors[`variant-mrp-${index}`] || errors[`variant-price-${index}`]
                        ? "border-red-400"
                        : "border-[#d0d5dd]"
                    }`}
                  />
                </td>

                {/* Offer Price */}
                <td className="py-2.5 px-3">
                  <div>
                    <Input
                      value={variant.offerPrice}
                      onChange={(e) =>
                        updateVariant(variant.id, "offerPrice", e.target.value)
                      }
                      placeholder="₹ 0"
                      className={`h-8 w-24 text-[11px] rounded-md ${
                        errors[`variant-offer-${index}`] ||
                        errors[`variant-price-${index}`]
                          ? "border-red-400"
                          : "border-[#d0d5dd]"
                      }`}
                    />
                    {errors[`variant-price-${index}`] && (
                      <p className="text-[10px] text-red-500 mt-0.5">
                        {errors[`variant-price-${index}`]}
                      </p>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="py-2.5 px-3">
                  <Select
                    value={variant.status}
                    onValueChange={(value) => updateVariant(variant.id, "status", value)}
                  >
                    <SelectTrigger className="h-8 w-24 text-[11px] rounded-md border-[#d0d5dd]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </td>

                {/* Image upload */}
                <td className="py-2.5 px-3">
                  <VariantImageCell
                    image={variant.image}
                    onUpload={(url) => updateVariant(variant.id, "image", url)}
                    onRemove={() => updateVariant(variant.id, "image", null)}
                  />
                </td>

                {/* Delete row */}
                <td className="py-2.5 px-3">
                  {showDelete && variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDeleteVariantId(variant.id)}
                      className="size-7 flex items-center justify-center rounded-md text-[#98a2b3] hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Remove row"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add row */}
      <button
        type="button"
        onClick={addVariantRow}
        disabled={variants.length >= 20}
        className="text-[#220e92] text-[12px] flex items-center gap-1.5 hover:text-[#1a0a73] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        style={{ fontWeight: 500 }}
      >
        <Plus className="size-3.5" />
        Add variant row{variants.length >= 20 ? " (max 20)" : ""}
      </button>

      {/* Delete variant confirmation modal */}
      {deleteVariantId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setDeleteVariantId(null)} />
          <div className="relative bg-white rounded-2xl shadow-[0px_20px_60px_rgba(0,0,0,0.15)] w-full max-w-[420px] p-6">
            <div className="flex items-center gap-3 mb-5">
              <img src={variantDelIcon} alt="Delete" className="size-10 shrink-0" />
              <h2 className="text-[16px] text-[#101828]" style={{ fontWeight: 600 }}>Delete Variant</h2>
            </div>
            <p className="text-[14px] text-[#475467] leading-[21px] mb-6">
              Are you sure you want to delete this Variant?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteVariantId(null)}
                className="flex-1 h-12 rounded-xl text-[14px] text-[#344054] border border-[#d0d5dd] hover:bg-[#f9fafb] transition-colors"
                style={{ fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={() => { removeVariant(deleteVariantId); setDeleteVariantId(null); }}
                className="flex-1 h-12 rounded-xl text-[14px] text-white bg-[#f87171] hover:bg-[#ef4444] transition-colors"
                style={{ fontWeight: 600 }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color picker modal */}
      <ColorPickerModal
        isOpen={colorPickerOpen}
        onClose={() => {
          setColorPickerOpen(false);
          setEditingVariantId(null);
        }}
        onSave={handleColorSave}
        currentColor={
          editingVariantId
            ? variants.find((v) => v.id === editingVariantId)?.color?.name
            : undefined
        }
      />
    </div>
  );
}