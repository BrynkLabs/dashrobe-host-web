import { useState, useRef, useEffect } from "react";
import { Search, Plus, ChevronDown, Check } from "lucide-react";
import { Input } from "../ui/input";
import { Brand } from "./BrandModal";

interface BrandSelectorProps {
  brands: Brand[];
  selectedBrand: string;
  onBrandChange: (brandName: string) => void;
  onAddBrand: () => void;
  error?: boolean;
}

export function BrandSelector({
  brands,
  selectedBrand,
  onBrandChange,
  onAddBrand,
  error = false,
}: BrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBrandObj = brands.find((b) => b.name === selectedBrand);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-10 px-3 rounded-lg border text-[13px] flex items-center justify-between transition-colors ${
          error
            ? "border-red-500"
            : "border-[#d0d5dd] hover:border-[#220e92]"
        }`}
      >
        {selectedBrandObj ? (
          <div className="flex items-center gap-2">
            {selectedBrandObj.logo ? (
              <img
                src={selectedBrandObj.logo}
                alt={selectedBrandObj.name}
                className="size-5 object-contain rounded"
              />
            ) : (
              <div className="size-5 rounded bg-[#f9fafb] border border-[#eef0f4]" />
            )}
            <span className="text-[#1a1a2e]">{selectedBrandObj.name}</span>
          </div>
        ) : (
          <span className="text-[#98a2b3]">Select brand</span>
        )}
        <ChevronDown className="size-4 text-[#667085]" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#d0d5dd] shadow-lg z-10 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-[#eef0f4]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-[#667085]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brands..."
                className="h-8 pl-8 text-[12px] rounded border-[#d0d5dd]"
              />
            </div>
          </div>

          {/* Brand list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => {
                    onBrandChange(brand.name);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-[#f9fafb] transition-colors text-left"
                >
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="size-6 object-contain rounded"
                    />
                  ) : (
                    <div className="size-6 rounded bg-[#f9fafb] border border-[#eef0f4]" />
                  )}
                  <span className="flex-1 text-[13px] text-[#1a1a2e]">
                    {brand.name}
                  </span>
                  {selectedBrand === brand.name && (
                    <Check className="size-4 text-[#220e92]" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center">
                <p className="text-[12px] text-[#98a2b3]">No brands found</p>
              </div>
            )}
          </div>

          {/* Add brand button */}
          <div className="p-2 border-t border-[#eef0f4]">
            <button
              onClick={() => {
                onAddBrand();
                setIsOpen(false);
                setSearchQuery("");
              }}
              className="w-full h-8 px-3 rounded bg-[#f9fafb] hover:bg-[#220e92] text-[#475467] hover:text-white transition-colors flex items-center gap-2 text-[12px] font-medium"
            >
              <Plus className="size-3" />
              Add new brand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
