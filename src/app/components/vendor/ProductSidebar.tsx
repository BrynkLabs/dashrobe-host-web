import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ALLOWED_FROM } from "./ProductFormSections";
import type { ProductVariant } from "./VariantsTable";

export function StatusCard({
  status,
  onStatusChange,
}: {
  status: string;
  onStatusChange: (v: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
      <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">Status</h2>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="h-10 rounded-lg border-[#d0d5dd] text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(["Draft", "Active", "Hidden"] as const).map((s) => {
            const allowed = (ALLOWED_FROM[status] ?? []).includes(s);
            return (
              <SelectItem key={s} value={s} disabled={!allowed}>
                <span className={!allowed ? "opacity-40" : ""}>
                  {s}{!allowed && s === "Draft" ? " (not available)" : ""}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <p className="text-[11px] text-[#98a2b3] mt-2">
        {status === "Draft" && "Draft can move to Active"}
        {status === "Active" && "Active can move to Hidden"}
        {status === "Hidden" && "Hidden can move to Active"}
      </p>
    </div>
  );
}

export function SummaryCard({
  gender,
  category,
  subcategory,
  brand,
  imageCount,
  variants,
  status,
}: {
  gender: string;
  category: string;
  subcategory: string;
  brand: string;
  imageCount: number;
  variants: ProductVariant[];
  status: string;
}) {
  const variantCount = variants.filter((v) => v.color && v.size).length;
  const rows = [
    { label: "Gender", value: gender || "—" },
    { label: "Category", value: category || "—" },
    { label: "Sub-category", value: subcategory || "—" },
    { label: "Brand", value: brand || "—" },
    { label: "Images", value: imageCount > 0 ? `${imageCount} images` : "—" },
    { label: "Variants", value: variantCount > 0 ? `${variantCount} variants` : "—" },
    { label: "Status", value: status },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
      <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">Summary</h2>
      <div className="space-y-3 text-[13px]">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between">
            <span className="text-[#475467]">{r.label}</span>
            <span className="text-[#101828] font-medium">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
