import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] text-[#475467]" style={{ fontWeight: 500 }}>
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 rounded-lg bg-white border-[#d0d5dd] text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt === "All" && allLabel ? allLabel : opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ProductFilterRow({
  gender,
  category,
  subcategory,
  onGenderChange,
  onCategoryChange,
  onSubcategoryChange,
}: {
  gender: string;
  category: string;
  subcategory: string;
  onGenderChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSubcategoryChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border-b border-[#eaecf0]">
      <FilterSelect
        label="Gender"
        value={gender}
        onChange={onGenderChange}
        options={["All", "Women's", "Men's", "Girls", "Boys", "Unisex"]}
      />
      <FilterSelect
        label="Category"
        value={category}
        onChange={onCategoryChange}
        options={["All", "Sarees", "Kurta Sets", "Dupattas", "Bottomwear", "Dresses", "Kurtis", "Shirts"]}
        allLabel="All Categories"
      />
      <FilterSelect
        label="Subcategory"
        value={subcategory}
        onChange={onSubcategoryChange}
        options={["All", "Sarees", "Kurta Sets", "Dupattas", "Bottomwear", "Dresses", "Kurtis", "Shirts"]}
        allLabel="All Subcategories"
      />
    </div>
  );
}

export function BulkActionBar({
  selectedCount,
  bulkAction,
  onBulkActionChange,
  availableBulkActions,
  onApplyBulk,
  search,
  onSearchChange,
}: {
  selectedCount: number;
  bulkAction: string;
  onBulkActionChange: (v: string) => void;
  availableBulkActions: { value: string; label: string }[];
  onApplyBulk: () => void;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#eaecf0] flex-wrap">
      <div className="flex items-center gap-2.5 min-h-[36px]">
        {selectedCount > 0 ? (
          <>
            <span className="text-[12px] text-[#667085] bg-[#f9fafb] border border-[#eaecf0] rounded-lg px-2.5 py-1" style={{ fontWeight: 500 }}>
              {selectedCount} selected
            </span>
            {availableBulkActions.length > 0 ? (
              <>
                <Select value={bulkAction} onValueChange={onBulkActionChange}>
                  <SelectTrigger className="w-[180px] h-9 rounded-lg bg-white border-[#d0d5dd] text-[13px]">
                    <SelectValue placeholder="Bulk action…" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBulkActions.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={onApplyBulk}
                  disabled={!bulkAction}
                  className="h-9 px-4 rounded-lg bg-[#220e92] hover:bg-[#1a0a73] text-white text-[13px] disabled:opacity-40"
                  style={{ fontWeight: 500 }}
                >
                  Apply
                </Button>
              </>
            ) : (
              <span className="text-[12px] text-[#98a2b3]">No actions available</span>
            )}
          </>
        ) : (
          <span className="text-[12px] text-[#98a2b3]">Select rows to take bulk action</span>
        )}
      </div>

      <div className="relative w-full md:w-[260px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#98a2b3]" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products…"
          className="pl-9 h-9 rounded-lg border-[#d0d5dd] bg-white text-[13px] placeholder:text-[#98a2b3]"
        />
      </div>
    </div>
  );
}
