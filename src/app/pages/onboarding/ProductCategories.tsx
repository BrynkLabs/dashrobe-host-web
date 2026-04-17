import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { CircleAlert, Check, Loader2, Hash, IndianRupee, Tag, Paintbrush, X, Shirt } from "lucide-react";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { getCookie } from "@/app/utils/cookieUtils";

const MAX_NUMERIC_VALUE = 1999999999;

// Strip non-digit characters. If the resulting number would exceed
// MAX_NUMERIC_VALUE, the input is rejected (keeps the previous value)
// so the field stops accepting more digits at the cap.
function sanitizeNumericInput(raw: string, previous: string = ""): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  // Drop leading zeros (e.g. "007" → "7"); keep "0" as "" so users must type a real number.
  const trimmed = digits.replace(/^0+/, "");
  if (!trimmed) return "";
  const num = Number(trimmed);
  if (num > MAX_NUMERIC_VALUE) return previous;
  return trimmed;
}

// Block "e", "E", "+", "-", "." in number-like inputs.
function blockNonNumericKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
    e.preventDefault();
  }
}

interface ApiSubCategory {
  id: number;
  name: string;
}

interface ApiCategory {
  id: number;
  name: string;
  subcategories: ApiSubCategory[];
}

export function ProductCategories() {
  const navigate = useNavigate();
  const { data, updateProductCategories } = useOnboarding();
  const pc = data.productCategories;

  const [loading, setLoading] = useState(true);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);
  const [showError, setShowError] = useState(false);
  const [numberOfSkus, setNumberOfSkus] = useState(pc.numberOfSkus);
  const [pricingType, setPricingType] = useState(pc.pricingType);
  const [avgPriceRange, setAvgPriceRange] = useState(pc.avgPriceRange);
  const [customizationAvailable, setCustomizationAvailable] = useState(pc.customizationAvailable);
  const [customCategoryText, setCustomCategoryText] = useState(pc.customCategoryText);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  // Fetch categories and vendor's previous selections on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("token");
        const headers = { Authorization: `Bearer ${token}` };

        const categoriesRes = await axiosClient.get(`/api/v1/onboarding/categories`, { headers });
        const cats: ApiCategory[] = categoriesRes.data?.data?.categories || [];
        setApiCategories(cats);

        try {
          const selectionsRes = await axiosClient.get(`/api/v1/onboarding/product-categories`, { headers });
          const sel = selectionsRes.data?.data;
          if (sel) {
            setSelectedCategoryIds(sel.selectedCategoryIds || []);
            setSelectedSubcategoryIds(sel.selectedSubcategoryIds || []);
            setNumberOfSkus(sel.skuCountApprox ? String(sel.skuCountApprox) : "");
            setPricingType(sel.pricingType || "");
            setAvgPriceRange(sel.averagePriceRange || "");
            setCustomizationAvailable(sel.customizationAvailable ?? false);
            if (sel.customCategories) {
              setCustomCategoryText(sel.customCategories);
            }
          }
        } catch {
          // No previous selections — that's fine
        }
      } catch (e) {
        console.error("Failed to fetch categories:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (catId: number) => {
    setShowError(false);
    const isRemoving = selectedCategoryIds.includes(catId);
    if (isRemoving) {
      setSelectedCategoryIds((prev) => prev.filter((id) => id !== catId));
      // Remove all subcategories of this category
      const cat = apiCategories.find((c) => c.id === catId);
      if (cat) {
        const subIds = cat.subcategories.map((s) => s.id);
        setSelectedSubcategoryIds((prev) => prev.filter((id) => !subIds.includes(id)));
      }
    } else {
      setSelectedCategoryIds((prev) => [...prev, catId]);
    }
  };

  const toggleSubcategory = (subId: number) => {
    setShowError(false);
    setSelectedSubcategoryIds((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    );
  };

  const hasValidSelection = () => {
    return selectedCategoryIds.length > 0 && selectedSubcategoryIds.length > 0;
  };

  const handleNext = async () => {
    if (!hasValidSelection()) {
      setShowError(true);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }
    const skuNum = Number(numberOfSkus);
    const priceNum = Number(avgPriceRange);
    if (!numberOfSkus || skuNum < 1 || skuNum > MAX_NUMERIC_VALUE) {
      setApiError(`Number of SKUs must be between 1 and ${MAX_NUMERIC_VALUE}.`);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }
    if (!avgPriceRange || priceNum < 1 || priceNum > MAX_NUMERIC_VALUE) {
      setApiError(`Average Price Range must be between 1 and ${MAX_NUMERIC_VALUE}.`);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }
    setApiError("");
    setSubmitting(true);
    try {
      const token = getCookie("token");
      const payload: Record<string, unknown> = {
        selectedCategoryIds,
        selectedSubcategoryIds: selectedSubcategoryIds,
        skuCountApprox: skuNum,
        pricingType: pricingType || "MRP",
        averagePriceRange: avgPriceRange,
        customizationAvailable,
      };


      await axiosClient.put(`/api/v1/onboarding/product-categories`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sync to context for local state
      updateProductCategories({
        selectedCategories: selectedCategoryIds.map(String),
        selectedSubCategories: {},
        numberOfSkus,
        pricingType,
        avgPriceRange,
        customizationAvailable,
        customCategoryText,
      });

      navigate("/onboarding/banking");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      setApiError(msg);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    updateProductCategories({
      selectedCategories: selectedCategoryIds.map(String),
      selectedSubCategories: {},
      numberOfSkus,
      pricingType,
      avgPriceRange,
      customizationAvailable,
      customCategoryText,
    });
    navigate("/onboarding/operations");
  };

  // Build grid items with inline sub-category panels
  const buildGridItems = () => {
    const items: React.ReactNode[] = [];

    apiCategories.forEach((category) => {
      const isSelected = selectedCategoryIds.includes(category.id);
      const subCount = category.subcategories.filter((s) =>
        selectedSubcategoryIds.includes(s.id)
      ).length;

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
              {category.subcategories.map((sub) => {
                const isSubSelected = selectedSubcategoryIds.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleSubcategory(sub.id)}
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
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
    });

    return items;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#220E92]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div ref={topRef}>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Product Categories</h2>
        <p className="text-sm md:text-base text-gray-600">Select the clothing categories and sub-categories you sell</p>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{apiError}</p>
        </div>
      )}

      {showError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            Please select at least one category and one sub-category to continue.
          </p>
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
              type="text"
              inputMode="numeric"
              placeholder="e.g., 150"
              className="rounded-lg"
              value={numberOfSkus}
              onKeyDown={blockNonNumericKeys}
              onPaste={(e) => {
                e.preventDefault();
                setNumberOfSkus((prev) => sanitizeNumericInput(e.clipboardData.getData("text"), prev));
              }}
              onChange={(e) => setNumberOfSkus((prev) => sanitizeNumericInput(e.target.value, prev))}
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
                <SelectItem value="PREMIUM">Premium</SelectItem>
                <SelectItem value="VALUE_FOR_MONEY">Value for money</SelectItem>
                <SelectItem value="ECONOMICAL">Economical</SelectItem>
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
              type="text"
              inputMode="numeric"
              placeholder="e.g., 750"
              className="rounded-lg"
              value={avgPriceRange}
              onKeyDown={blockNonNumericKeys}
              onPaste={(e) => {
                e.preventDefault();
                setAvgPriceRange((prev) => sanitizeNumericInput(e.clipboardData.getData("text"), prev));
              }}
              onChange={(e) => setAvgPriceRange((prev) => sanitizeNumericInput(e.target.value, prev))}
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
      {selectedCategoryIds.length > 0 && (
        <div className="bg-[#220E92]/[0.03] rounded-xl border border-[#220E92]/10 p-4 md:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#220E92]">Your Selection</h4>
            <span className="text-xs text-gray-500">
              {selectedCategoryIds.length} {selectedCategoryIds.length === 1 ? "category" : "categories"}
            </span>
          </div>
          <div className="space-y-2">
            {selectedCategoryIds.map((catId) => {
              const cat = apiCategories.find((c) => c.id === catId);
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
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={submitting}
          style={{ borderRadius: "12px" }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={submitting}
          style={{ backgroundColor: "#220E92", borderRadius: "12px" }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium shadow-lg shadow-[#220E92]/20 hover:shadow-xl hover:shadow-[#220E92]/25 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Continue to Bank & Settlement"
          )}
        </Button>
      </div>
    </div>
  );
}
