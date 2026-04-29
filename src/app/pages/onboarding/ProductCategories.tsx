import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { CircleAlert, Loader2 } from "lucide-react";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { getCookie } from "@/app/utils/cookieUtils";
import { CategoryGrid } from "../../components/onboarding/CategoryGrid";
import { ProductDetailsForm } from "../../components/onboarding/ProductDetailsForm";
import { SelectionSummary } from "../../components/onboarding/SelectionSummary";
import { RequestCategoryDialog } from "../../components/onboarding/RequestCategoryDialog";

const MAX_NUMERIC_VALUE = 1999999999;

interface ApiSubCategory { id: number; name: string; }
interface ApiCategory { id: number; name: string; subcategories: ApiSubCategory[]; }

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

  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

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
            if (sel.customCategories) setCustomCategoryText(sel.customCategories);
          }
        } catch { /* No previous selections */ }
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

  const buildContextPayload = () => ({
    selectedCategories: selectedCategoryIds.map(String),
    selectedSubCategories: {},
    numberOfSkus,
    pricingType,
    avgPriceRange,
    customizationAvailable,
    customCategoryText,
  });

  const handleRequestCategory = async () => {
    setRequestSubmitting(true);
    try {
      const token = getCookie("token");
      await axiosClient.post(
        `/api/v1/onboarding/category-request`,
        { message: "Vendor requested new category" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequestSuccess(true);
    } catch (err: any) {
      console.error("Category request failed:", err);
    } finally {
      setRequestSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (selectedCategoryIds.length === 0 || selectedSubcategoryIds.length === 0) {
      setShowError(true);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }
    const skuNum = Number(numberOfSkus);
    if (!numberOfSkus || skuNum < 1 || skuNum > MAX_NUMERIC_VALUE) {
      setApiError(`Number of SKUs must be between 1 and ${MAX_NUMERIC_VALUE}.`);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }
    if (!avgPriceRange) {
      setApiError("Average Price Range is required.");
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }
    // Validate range format: "1000" or "1000-2000"
    const priceParts = avgPriceRange.split("-").filter(Boolean);
    if (priceParts.some((p) => { const n = Number(p); return isNaN(n) || n < 1 || n > MAX_NUMERIC_VALUE; })) {
      setApiError(`Price values must be between 1 and ${MAX_NUMERIC_VALUE}.`);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }
    setApiError("");
    setSubmitting(true);
    try {
      const token = getCookie("token");
      await axiosClient.put(`/api/v1/onboarding/product-categories`, {
        selectedCategoryIds,
        selectedSubcategoryIds,
        skuCountApprox: skuNum,
        pricingType: pricingType || "MRP",
        averagePriceRange: avgPriceRange,
        customizationAvailable,
      }, { headers: { Authorization: `Bearer ${token}` } });

      updateProductCategories(buildContextPayload());
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
    updateProductCategories(buildContextPayload());
    navigate("/onboarding/operations");
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
          <p className="text-sm text-red-800">Please select at least one category and one sub-category to continue.</p>
        </div>
      )}

      <ProductDetailsForm
        numberOfSkus={numberOfSkus}
        pricingType={pricingType}
        avgPriceRange={avgPriceRange}
        customizationAvailable={customizationAvailable}
        onSkusChange={setNumberOfSkus}
        onPricingTypeChange={setPricingType}
        onAvgPriceChange={setAvgPriceRange}
        onCustomizationChange={setCustomizationAvailable}
      />

      <CategoryGrid
        categories={apiCategories}
        selectedCategoryIds={selectedCategoryIds}
        selectedSubcategoryIds={selectedSubcategoryIds}
        onToggleCategory={toggleCategory}
        onToggleSubcategory={toggleSubcategory}
      />

      <div className="pt-2">
        <button
          type="button"
          onClick={() => { handleRequestCategory(); setRequestDialogOpen(true); }}
          disabled={requestSubmitting}
          className="text-sm font-medium text-[#220E92] border border-[#220E92] px-4 py-2 rounded-md cursor-pointer transition-colors disabled:opacity-50"
        >
          {requestSubmitting ? "Requesting..." : "Request Categories"}
        </button>
      </div>

      <SelectionSummary
        categories={apiCategories}
        selectedCategoryIds={selectedCategoryIds}
        selectedSubcategoryIds={selectedSubcategoryIds}
      />

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
          {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>) : "Continue to Bank & Settlement"}
        </Button>
      </div>

      <RequestCategoryDialog
        open={requestDialogOpen}
        success={requestSuccess}
        onClose={() => { setRequestDialogOpen(false); setRequestSuccess(false); }}
      />
    </div>
  );
}
