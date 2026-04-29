interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: SubCategory[];
}

export function SelectionSummary({
  categories,
  selectedCategoryIds,
  selectedSubcategoryIds,
}: {
  categories: Category[];
  selectedCategoryIds: number[];
  selectedSubcategoryIds: number[];
}) {
  if (selectedCategoryIds.length === 0) return null;

  return (
    <div className="bg-[#220E92]/[0.03] rounded-xl border border-[#220E92]/10 p-4 md:p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#220E92]">Your Selection</h4>
        <span className="text-xs text-gray-500">
          {selectedCategoryIds.length} {selectedCategoryIds.length === 1 ? "category" : "categories"}
        </span>
      </div>
      <div className="space-y-2">
        {selectedCategoryIds.map((catId) => {
          const cat = categories.find((c) => c.id === catId);
          if (!cat) return null;
          const subs = cat.subcategories.filter((s) => selectedSubcategoryIds.includes(s.id));
          return (
            <div key={catId} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 py-2 px-3 rounded-lg bg-white">
              <span className="text-sm text-gray-800 font-medium whitespace-nowrap">{cat.name}</span>
              <div className="flex flex-wrap gap-1.5">
                {subs.length > 0 ? (
                  subs.map((sub) => (
                    <span key={sub.id} className="text-xs bg-[#220E92]/10 text-[#220E92] px-2 py-0.5 rounded-md">
                      {sub.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-amber-600 italic">Choose sub-categories</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
