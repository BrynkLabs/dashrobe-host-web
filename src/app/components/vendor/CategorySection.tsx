import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CategoryItem {
  value: string;
  label: string;
  keywords: string[];
  subcategories: string[];
}

const CATEGORIES: CategoryItem[] = [
  {
    value: "Sarees",
    label: "Sarees",
    keywords: ["saree", "sari", "banarasi", "patola", "kanjivaram", "silk saree", "cotton saree", "georgette saree", "chiffon saree"],
    subcategories: ["Silk Sarees", "Cotton Sarees", "Georgette Sarees", "Chiffon Sarees", "Designer Sarees", "Banarasi Sarees", "Sarees"],
  },
  {
    value: "Kurta Sets",
    label: "Kurta Sets",
    keywords: ["kurta", "kurtas", "salwar", "churidar", "pajama set", "kurta set", "salwar kameez", "suit"],
    subcategories: ["Salwar Kameez", "Churidar Sets", "Palazzo Sets", "Pant Sets", "Kurta Sets"],
  },
  {
    value: "Dupattas",
    label: "Dupattas",
    keywords: ["dupatta", "chunni", "stole", "scarf", "odhni"],
    subcategories: ["Silk Dupattas", "Chiffon Dupattas", "Cotton Dupattas", "Embroidered Dupattas", "Dupattas"],
  },
  {
    value: "Bottomwear",
    label: "Bottomwear",
    keywords: ["bottom", "palazzo", "legging", "pant", "trouser", "skirt", "sharara", "garara"],
    subcategories: ["Palazzo Pants", "Leggings", "Trousers", "Skirts", "Sharara", "Bottomwear"],
  },
  {
    value: "Dresses",
    label: "Dresses",
    keywords: ["dress", "anarkali", "gown", "frock", "maxi", "midi", "one piece"],
    subcategories: ["Anarkali", "Gowns", "Maxi Dresses", "Midi Dresses", "Party Wear", "Dresses"],
  },
  {
    value: "Kurtis",
    label: "Kurtis",
    keywords: ["kurti", "kurtis", "tunic", "top", "ikat", "block print", "straight kurti", "a-line kurti", "kaftan"],
    subcategories: ["Straight Kurtis", "A-Line Kurtis", "Kaftan", "Embroidered Kurtis", "Printed Kurtis", "Kurtis"],
  },
  {
    value: "Shirts",
    label: "Shirts",
    keywords: ["shirt", "linen shirt", "formal shirt", "casual shirt", "half sleeve", "full sleeve"],
    subcategories: ["Casual Shirts", "Formal Shirts", "Linen Shirts", "Printed Shirts", "Shirts"],
  },
  {
    value: "Lehengas",
    label: "Lehengas",
    keywords: ["lehanga", "lehenga", "ghagra", "chaniya choli", "bridal lehenga", "party lehenga"],
    subcategories: ["Bridal Lehengas", "Party Wear Lehengas", "Designer Lehengas", "Cotton Lehengas", "Lehengas"],
  },
  {
    value: "Sherwanis",
    label: "Sherwanis",
    keywords: ["sherwani", "achkan", "bandhgala", "wedding sherwani", "indo western"],
    subcategories: ["Wedding Sherwanis", "Party Sherwanis", "Indo-Western", "Achkans", "Sherwanis"],
  },
  {
    value: "Jackets",
    label: "Jackets",
    keywords: ["jacket", "nehru jacket", "bandhgala jacket", "koti", "waistcoat", "bundi"],
    subcategories: ["Nehru Jackets", "Bandhgala Jackets", "Waistcoats", "Embroidered Jackets", "Jackets"],
  },
];

const GENDERS = ["Men's", "Women's", "Boys'", "Girls'", "Unisex"];

interface CategorySectionProps {
  gender: string;
  onGenderChange: (g: string) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  subcategory: string;
  onSubcategoryChange: (s: string) => void;
  categoryError?: string;
}

export function CategorySection({
  gender,
  onGenderChange,
  category,
  onCategoryChange,
  subcategory,
  onSubcategoryChange,
  categoryError,
}: CategorySectionProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim()
    ? CATEGORIES.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.label.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.includes(q))
        );
      })
    : [];

  const handleSelect = (cat: CategoryItem) => {
    onCategoryChange(cat.value);
    // Auto-set subcategory to first matching subcategory
    onSubcategoryChange(cat.subcategories[cat.subcategories.length - 1]);
    setQuery("");
    setOpen(false);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(e.target.value.trim().length > 0);
  };

  const clearQuery = () => {
    setQuery("");
    setOpen(false);
  };

  // Current category object
  const currentCat = CATEGORIES.find((c) => c.value === category);
  const subcategoryOptions = currentCat?.subcategories ?? CATEGORIES.flatMap((c) => c.subcategories);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div ref={containerRef} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#667085] z-10 pointer-events-none" />
        <Input
          value={query}
          onChange={handleQueryChange}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search category e.g. saree, kurti, lehenga…"
          className="h-10 pl-10 pr-9 rounded-lg border-[#d0d5dd] text-[13px]"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98a2b3] hover:text-[#475467] transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}

        {/* Dropdown results */}
        {open && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#eaecf0] rounded-lg shadow-[0px_8px_24px_rgba(16,24,40,0.12)] z-30 overflow-hidden">
            <p className="text-[11px] text-[#98a2b3] px-3 pt-2.5 pb-1" style={{ fontWeight: 500 }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent input blur before click registers
                  handleSelect(cat);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#f9f5ff] transition-colors group"
              >
                <div className="size-7 rounded-md bg-[#f2f4f7] group-hover:bg-[#ede9fe] flex items-center justify-center shrink-0 transition-colors">
                  <span className="text-[11px] text-[#667085] group-hover:text-[#220e92]" style={{ fontWeight: 600 }}>
                    {cat.label.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] text-[#101828]" style={{ fontWeight: 500 }}>
                    {cat.label}
                  </p>
                  <p className="text-[11px] text-[#98a2b3] truncate">
                    {cat.subcategories.slice(0, 3).join(" · ")}
                    {cat.subcategories.length > 3 ? " …" : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {open && query.trim() && filtered.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#eaecf0] rounded-lg shadow-[0px_8px_24px_rgba(16,24,40,0.12)] z-30 p-4 text-center">
            <p className="text-[13px] text-[#98a2b3]">No categories found for "{query}"</p>
          </div>
        )}
      </div>

      {/* Gender */}
      <div>
        <Label className="text-[12px] text-[#475467] mb-2 block">Gender *</Label>
        <div className="flex gap-2 flex-wrap">
          {GENDERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGenderChange(g)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                gender === g
                  ? "bg-[#220e92] text-white"
                  : "bg-[#f9fafb] text-[#475467] hover:bg-[#f2f4f7] border border-[#eaecf0]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Category + Subcategory selects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[12px] text-[#475467] mb-1.5 block">Category *</Label>
          <Select
            value={category}
            onValueChange={(val) => {
              onCategoryChange(val);
              // Reset subcategory when category changes
              const cat = CATEGORIES.find((c) => c.value === val);
              if (cat) onSubcategoryChange(cat.subcategories[cat.subcategories.length - 1]);
              else onSubcategoryChange("");
            }}
          >
            <SelectTrigger
              className={`h-10 rounded-lg border-[#d0d5dd] text-[13px] ${
                categoryError ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {categoryError && (
            <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="size-3" />
              {categoryError}
            </p>
          )}
        </div>
        <div>
          <Label className="text-[12px] text-[#475467] mb-1.5 block">Subcategory *</Label>
          <Select value={subcategory} onValueChange={onSubcategoryChange}>
            <SelectTrigger className="h-10 rounded-lg border-[#d0d5dd] text-[13px]">
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategoryOptions.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}