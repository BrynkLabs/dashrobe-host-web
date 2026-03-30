import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { CircleAlert, Check, Shirt, ShoppingBag, Baby, Sparkles, Crown, Heart, PartyPopper, UserRound, Ribbon, Layers, Scissors, X, Hash, IndianRupee, Tag, Paintbrush, PenLine } from "lucide-react";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";

interface SubCategory {
  id: string;
  label: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  subCategories: SubCategory[];
}

export function ProductCategories() {
  const navigate = useNavigate();
  const { data, updateProductCategories } = useOnboarding();
  const pc = data.productCategories;
  const [selectedCategories, setSelectedCategories] = useState<string[]>(pc.selectedCategories);
  const [selectedSubCategories, setSelectedSubCategories] = useState<Record<string, string[]>>(pc.selectedSubCategories);
  const [showError, setShowError] = useState(false);
  const [numberOfSkus, setNumberOfSkus] = useState(pc.numberOfSkus);
  const [pricingType, setPricingType] = useState(pc.pricingType);
  const [avgPriceRange, setAvgPriceRange] = useState(pc.avgPriceRange);
  const [customizationAvailable, setCustomizationAvailable] = useState(pc.customizationAvailable);
  const [customCategoryText, setCustomCategoryText] = useState(pc.customCategoryText);

  const categories: Category[] = [
    {
      id: "mens-casual",
      label: "Men's Casual Wear",
      icon: <Shirt className="w-5 h-5" />,
      subCategories: [
        { id: "mc-tshirts", label: "T-Shirts & Polos" },
        { id: "mc-jeans", label: "Jeans & Trousers" },
        { id: "mc-shorts", label: "Shorts & Bermudas" },
        { id: "mc-hoodies", label: "Hoodies & Sweatshirts" },
      ],
    },
    {
      id: "mens-formal",
      label: "Men's Formal Wear",
      icon: <Crown className="w-5 h-5" />,
      subCategories: [
        { id: "mf-shirts", label: "Formal Shirts" },
        { id: "mf-trousers", label: "Formal Trousers" },
        { id: "mf-blazers", label: "Blazers & Suits" },
        { id: "mf-jackets", label: "Waistcoats & Jackets" },
      ],
    },
    {
      id: "mens-ethnic",
      label: "Men's Ethnic Wear",
      icon: <Layers className="w-5 h-5" />,
      subCategories: [
        { id: "me-kurtas", label: "Kurtas & Kurta Sets" },
        { id: "me-sherwanis", label: "Sherwanis" },
        { id: "me-nehru", label: "Nehru Jackets" },
        { id: "me-dhotis", label: "Dhotis & Lungis" },
      ],
    },
    {
      id: "womens-western",
      label: "Women's Western Wear",
      icon: <ShoppingBag className="w-5 h-5" />,
      subCategories: [
        { id: "ww-tops", label: "Tops & Blouses" },
        { id: "ww-dresses", label: "Dresses & Jumpsuits" },
        { id: "ww-jeans", label: "Jeans & Palazzos" },
        { id: "ww-skirts", label: "Skirts & Shorts" },
      ],
    },
    {
      id: "womens-ethnic",
      label: "Women's Ethnic Wear",
      icon: <Sparkles className="w-5 h-5" />,
      subCategories: [
        { id: "we-sarees", label: "Sarees" },
        { id: "we-salwar", label: "Salwar Suits" },
        { id: "we-kurtas", label: "Kurtas & Kurtis" },
        { id: "we-lehengas", label: "Lehengas & Gowns" },
      ],
    },
    {
      id: "womens-casual",
      label: "Women's Casual Wear",
      icon: <Heart className="w-5 h-5" />,
      subCategories: [
        { id: "wc-tshirts", label: "T-Shirts & Crop Tops" },
        { id: "wc-joggers", label: "Joggers & Leggings" },
        { id: "wc-coords", label: "Co-ord Sets" },
        { id: "wc-jackets", label: "Jackets & Shrugs" },
      ],
    },
    {
      id: "kids-boys",
      label: "Kids Boys Wear",
      icon: <Baby className="w-5 h-5" />,
      subCategories: [
        { id: "kb-tshirts", label: "T-Shirts & Shirts" },
        { id: "kb-bottoms", label: "Jeans & Joggers" },
        { id: "kb-sets", label: "Clothing Sets" },
        { id: "kb-ethnic", label: "Ethnic Wear" },
      ],
    },
    {
      id: "kids-girls",
      label: "Kids Girls Wear",
      icon: <Ribbon className="w-5 h-5" />,
      subCategories: [
        { id: "kg-dresses", label: "Dresses & Frocks" },
        { id: "kg-tops", label: "Tops & T-Shirts" },
        { id: "kg-ethnic", label: "Ethnic Wear" },
        { id: "kg-sets", label: "Clothing Sets" },
      ],
    },
    {
      id: "party-occasion",
      label: "Party & Occasion Wear",
      icon: <PartyPopper className="w-5 h-5" />,
      subCategories: [
        { id: "po-cocktail", label: "Cocktail & Evening" },
        { id: "po-wedding", label: "Wedding Collection" },
        { id: "po-festive", label: "Festive Wear" },
        { id: "po-prom", label: "Prom & Reception" },
      ],
    },
    {
      id: "plus-size",
      label: "Plus Size Clothing",
      icon: <UserRound className="w-5 h-5" />,
      subCategories: [
        { id: "ps-mens", label: "Men's Plus Size" },
        { id: "ps-womens", label: "Women's Plus Size" },
        { id: "ps-ethnic", label: "Ethnic Plus Size" },
        { id: "ps-casual", label: "Casual Plus Size" },
      ],
    },
    {
      id: "maternity",
      label: "Maternity Wear",
      icon: <Heart className="w-5 h-5" />,
      subCategories: [
        { id: "mt-dresses", label: "Maternity Dresses" },
        { id: "mt-tops", label: "Maternity Tops" },
        { id: "mt-bottoms", label: "Maternity Bottoms" },
        { id: "mt-ethnic", label: "Maternity Ethnic" },
      ],
    },
    {
      id: "handmade",
      label: "Handloom & Stitched",
      icon: <Scissors className="w-5 h-5" />,
      subCategories: [
        { id: "hm-custom", label: "Custom Stitched" },
        { id: "hm-handloom", label: "Handloom Fabrics" },
        { id: "hm-embroidered", label: "Embroidered Pieces" },
        { id: "hm-designer", label: "Designer Boutique" },
      ],
    },
    {
      id: "other",
      label: "Other",
      icon: <PenLine className="w-5 h-5" />,
      subCategories: [],
    },
  ];

  const toggleCategory = (id: string) => {
    setShowError(false);
    const isRemoving = selectedCategories.includes(id);
    if (isRemoving) {
      setSelectedCategories((prev) => prev.filter((c) => c !== id));
      setSelectedSubCategories((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setSelectedCategories((prev) => [...prev, id]);
    }
  };

  const toggleSubCategory = (categoryId: string, subId: string) => {
    setShowError(false);
    setSelectedSubCategories((prev) => {
      const current = prev[categoryId] || [];
      const isRemoving = current.includes(subId);
      return {
        ...prev,
        [categoryId]: isRemoving
          ? current.filter((s) => s !== subId)
          : [...current, subId],
      };
    });
  };

  const hasValidSelection = () => {
    return selectedCategories.some(
      (catId) => {
        if (catId === "other") return customCategoryText.trim().length > 0;
        return (selectedSubCategories[catId] || []).length > 0;
      }
    );
  };

  const syncToContext = () => {
    updateProductCategories({
      selectedCategories,
      selectedSubCategories,
      numberOfSkus,
      pricingType,
      avgPriceRange,
      customizationAvailable,
      customCategoryText,
    });
  };

  const handleNext = () => {
    if (!hasValidSelection()) {
      setShowError(true);
      return;
    }
    syncToContext();
    navigate("/onboarding/banking");
  };

  const handleBack = () => {
    syncToContext();
    navigate("/onboarding/operations");
  };

  // Build rows with inline sub-category panels
  const buildGridItems = () => {
    const items: React.ReactNode[] = [];

    categories.forEach((category) => {
      const isSelected = selectedCategories.includes(category.id);
      const subCount = (selectedSubCategories[category.id] || []).length;

      // Category card
      items.push(
        <button
          key={category.id}
          type="button"
          onClick={() => toggleCategory(category.id)}
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

          <div className={`mb-2 ${isSelected ? "text-[#220E92]" : "text-gray-400"}`}>
            {category.icon}
          </div>
          <span className={`text-xs md:text-sm font-medium leading-tight ${isSelected ? "text-[#220E92]" : "text-gray-700"}`}>
            {category.label}
          </span>

          {subCount > 0 && (
            <span className="mt-1.5 text-[10px] md:text-xs bg-[#220E92] text-white px-2 py-0.5 rounded-full leading-normal">
              {subCount} selected
            </span>
          )}
        </button>
      );

      // Sub-category row right after selected category — spans full grid width
      if (isSelected) {
        if (category.id === "other") {
          // Show free text field for "Other" category
          items.push(
            <div
              key={`sub-${category.id}`}
              style={{ gridColumn: "1 / -1" }}
              className="bg-gradient-to-r from-[#220E92]/[0.03] to-[#220E92]/[0.06] border border-[#220E92]/15 rounded-xl p-4 md:p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#220E92]/10 flex items-center justify-center text-[#220E92]">
                    {category.icon}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#220E92]">{category.label}</span>
                    <span className="text-xs text-gray-500 ml-2">— describe your category</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(category.id);
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Remove category"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customCategory" className="text-sm text-[#220E92]">
                  What category do you sell? *
                </Label>
                <Input
                  id="customCategory"
                  placeholder="e.g., Accessories, Footwear, Bags, Innerwear..."
                  className="rounded-lg bg-white"
                  value={customCategoryText}
                  onChange={(e) => setCustomCategoryText(e.target.value)}
                />
                <p className="text-xs text-gray-500">Enter the category or product type that isn't listed above</p>
              </div>
            </div>
          );
        } else {
          items.push(
            <div
              key={`sub-${category.id}`}
              style={{ gridColumn: "1 / -1" }}
              className="bg-gradient-to-r from-[#220E92]/[0.03] to-[#220E92]/[0.06] border border-[#220E92]/15 rounded-xl p-4 md:p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#220E92]/10 flex items-center justify-center text-[#220E92]">
                    {category.icon}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#220E92]">{category.label}</span>
                    <span className="text-xs text-gray-500 ml-2">— choose sub-categories</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(category.id);
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Remove category"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.subCategories.map((sub) => {
                  const isSubSelected = (selectedSubCategories[category.id] || []).includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => toggleSubCategory(category.id, sub.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-all ${
                        isSubSelected
                          ? "bg-[#220E92] text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-[#220E92]/40 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                          isSubSelected
                            ? "bg-white/20 border-white/50"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSubSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      {sub.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }
      }
    });

    return items;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Product Categories</h2>
        <p className="text-sm md:text-base text-gray-600">Select the clothing categories and sub-categories you sell</p>
      </div>

      {/* Validation Error */}
      {showError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            Please select at least one category and one sub-category to continue.
          </p>
        </div>
      )}

      {/* Category Grid with Inline Sub-categories */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-5 shadow-sm">
        <div>
          <Label className="text-base">Select Categories You Sell *</Label>
          <p className="text-sm text-gray-600 mt-1">Click a category to select it — sub-categories will appear right below</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {buildGridItems()}
        </div>
      </div>

      {/* Selected Summary */}
      {selectedCategories.length > 0 && (
        <div className="bg-[#220E92]/[0.03] rounded-xl border border-[#220E92]/10 p-4 md:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#220E92]">Your Selection</h4>
            <span className="text-xs text-gray-500">
              {selectedCategories.length} {selectedCategories.length === 1 ? "category" : "categories"}
            </span>
          </div>
          <div className="space-y-2">
            {selectedCategories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              const subs = selectedSubCategories[catId] || [];
              if (!cat) return null;
              return (
                <div key={catId} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 py-2 px-3 rounded-lg bg-white">
                  <span className="text-sm text-gray-800 font-medium whitespace-nowrap">{cat.label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {catId === "other" ? (
                      customCategoryText.trim() ? (
                        <span className="text-xs bg-[#220E92]/10 text-[#220E92] px-2 py-0.5 rounded-md">
                          {customCategoryText}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 italic">Enter your custom category</span>
                      )
                    ) : subs.length > 0 ? (
                      subs.map((subId) => {
                        const sub = cat.subCategories.find((s) => s.id === subId);
                        return (
                          <span
                            key={subId}
                            className="text-xs bg-[#220E92]/10 text-[#220E92] px-2 py-0.5 rounded-md"
                          >
                            {sub?.label}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-amber-600 italic">Choose sub-categories</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Details */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Product Details</h3>
          <p className="text-sm text-gray-600 mt-1">Tell us more about your product catalog</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Number of SKUs */}
          <div className="space-y-2">
            <Label htmlFor="numberOfSkus" className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#220E92]" />
              Number of SKU(s) (Approx) *
            </Label>
            <Input
              id="numberOfSkus"
              type="number"
              min={1}
              placeholder="e.g., 150"
              className="rounded-lg"
              value={numberOfSkus}
              onChange={(e) => setNumberOfSkus(e.target.value)}
            />
            <p className="text-xs text-gray-500">Total number of unique products you plan to list</p>
          </div>

          {/* Pricing Type */}
          <div className="space-y-2">
            <Label htmlFor="pricingType" className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#220E92]" />
              Pricing Type *
            </Label>
            <Select value={pricingType || undefined} onValueChange={setPricingType}>
              <SelectTrigger id="pricingType" className="rounded-lg">
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="value-for-money">Value for Money</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">The pricing segment your products fall under</p>
          </div>

          {/* Average Price Range */}
          <div className="space-y-2">
            <Label htmlFor="avgPriceRange" className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#220E92]" />
              Average Price Range *
            </Label>
            <Input
              id="avgPriceRange"
              placeholder="e.g., ₹500 – ₹2,000"
              className="rounded-lg"
              value={avgPriceRange}
              onChange={(e) => setAvgPriceRange(e.target.value)}
            />
            <p className="text-xs text-gray-500">Typical price range of your products</p>
          </div>

          {/* Customization Available */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-[#220E92]" />
              Customization Available
            </Label>
            <div
              className={`flex items-center justify-between p-3.5 rounded-lg border-2 transition-all ${
                customizationAvailable
                  ? "border-[#220E92] bg-[#220E92]/[0.03]"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${customizationAvailable ? "text-[#220E92]" : "text-gray-700"}`}>
                  {customizationAvailable ? "Yes — Customization offered" : "No — Standard products only"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">For boutiques and home tailors</p>
              </div>
              <Switch
                checked={customizationAvailable}
                onCheckedChange={setCustomizationAvailable}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          onClick={handleBack}
          variant="outline"
          style={{ borderRadius: "12px" }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          style={{ backgroundColor: "#220E92", borderRadius: "12px" }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium shadow-lg shadow-[#220E92]/20 hover:shadow-xl hover:shadow-[#220E92]/25 transition-all"
        >
          Continue to Bank & Settlement
        </Button>
      </div>
    </div>
  );
}