import { Check, X } from "lucide-react";
import { Label } from "../ui/label";

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: SubCategory[];
}

export function CategoryGrid({
  categories,
  selectedCategoryIds,
  selectedSubcategoryIds,
  onToggleCategory,
  onToggleSubcategory,
}: {
  categories: Category[];
  selectedCategoryIds: number[];
  selectedSubcategoryIds: number[];
  onToggleCategory: (id: number) => void;
  onToggleSubcategory: (id: number) => void;
}) {
  const items: React.ReactNode[] = [];

  categories.forEach((category) => {
    const isSelected = selectedCategoryIds.includes(category.id);
    const subCount = category.subcategories.filter((s) =>
      selectedSubcategoryIds.includes(s.id)
    ).length;

    items.push(
      <button
        key={category.id}
        type="button"
        onClick={() => onToggleCategory(category.id)}
        className={`relative flex flex-col items-center justify-center text-center p-4 md:p-5 rounded-xl border-2 transition-all min-h-[100px] md:min-h-[110px] ${
          isSelected
            ? "border-[#220E92] bg-[#220E92]/5 shadow-[0_0_0_1px_rgba(34,14,146,0.15)]"
            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#220E92] flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
        <span className={`text-xs md:text-sm font-medium leading-tight ${isSelected ? "text-[#220E92]" : "text-gray-700"}`}>
          {category.name}
        </span>
        {subCount > 0 && (
          <span className="mt-1.5 text-[10px] md:text-xs bg-[#220E92] text-white px-2 py-0.5 rounded-full leading-normal">
            {subCount} selected
          </span>
        )}
      </button>
    );

    if (isSelected && category.subcategories.length > 0) {
      items.push(
        <div
          key={`sub-${category.id}`}
          style={{ gridColumn: "1 / -1" }}
          className="bg-gradient-to-r from-[#220E92]/[0.03] to-[#220E92]/[0.06] border border-[#220E92]/15 rounded-xl p-4 md:p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div>
                <span className="text-sm font-semibold text-[#220E92]">{category.name}</span>
                <span className="text-xs text-gray-500 ml-2">— choose sub-categories</span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleCategory(category.id); }}
              className="text-xs text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
              title="Remove category"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map((sub) => {
              const isSubSelected = selectedSubcategoryIds.includes(sub.id);
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onToggleSubcategory(sub.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-all ${
                    isSubSelected
                      ? "bg-[#220E92] text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-[#220E92]/40 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                      isSubSelected ? "bg-white/20 border-white/50" : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSubSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-5 shadow-sm">
      <div>
        <Label className="text-base">Select Categories You Sell *</Label>
        <p className="text-sm text-gray-600 mt-1">Click a category to select it — sub-categories will appear right below</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {items}
      </div>
    </div>
  );
}
