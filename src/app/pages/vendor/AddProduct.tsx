import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useBlocker } from "react-router";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { AddProductHeader, type HeaderState } from "../../components/vendor/AddProductHeader";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ImageUploadSection, ProductImage } from "../../components/vendor/ImageUploadSection";
import { VariantsTable, ProductVariant } from "../../components/vendor/VariantsTable";
import { SizeChartBuilder, SavedSizeChart } from "../../components/vendor/SizeChartBuilder";
import { SpecificationsSection, Specification } from "../../components/vendor/SpecificationsSection";
import { BrandModal, Brand } from "../../components/vendor/BrandModal";
import { BrandSelector } from "../../components/vendor/BrandSelector";
import { CategorySection } from "../../components/vendor/CategorySection";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";

/* ─── Status transition rules ─────────────────────────────────────
   Draft  → Active  : Allowed
   Active → Hidden  : Allowed
   Hidden → Active  : Allowed
   Any other        : Not Allowed
──────────────────────────────────────────────────────────────────── */
const ALLOWED_FROM: Record<string, string[]> = {
  Draft: ["Draft", "Active"],
  Active: ["Active", "Hidden"],
  Hidden: ["Hidden", "Active"],
};

/* ─── Validate mandatory fields for "Active" status ─────────────── */
function getMissingActiveFields(
  title: string,
  description: string,
  category: string,
  subcategory: string,
  brand: string,
  images: ProductImage[],
  variants: ProductVariant[]
): string[] {
  const missing: string[] = [];
  if (!title.trim() || title.trim().length < 3) missing.push("Title");
  if (!description.trim()) missing.push("Description");
  if (!category) missing.push("Category");
  if (!subcategory) missing.push("Subcategory");
  if (!brand) missing.push("Brand");
  if (images.length === 0) missing.push("1 image min.");
  const completeVariants = variants.filter((v) => v.color && v.size && v.mrp);
  if (completeVariants.length === 0) missing.push("1 variant min.");
  return missing;
}

export function AddProduct() {
  const navigate = useNavigate();
  const { setHasUnsavedChanges: setGlobalUnsavedChanges } = useUnsavedChanges();

  // ── Basic Info ──
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("Women's");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");

  // ── Brands ──
  const [brands, setBrands] = useState<Brand[]>([
    { id: "1", name: "Nike", logo: null },
    { id: "2", name: "Adidas", logo: null },
    { id: "3", name: "Puma", logo: null },
    { id: "4", name: "Reebok", logo: null },
  ]);
  const [brandModalOpen, setBrandModalOpen] = useState(false);

  // ── Images ──
  const [images, setImages] = useState<ProductImage[]>([]);

  // ── Variants ──
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: "1",
      color: null,
      size: "",
      mrp: "",
      offerPrice: "",
      status: "Active",
      image: null,
      isDefault: true,
    },
  ]);

  // ── Size Chart ──
  const [savedSizeCharts, setSavedSizeCharts] = useState<SavedSizeChart[]>([]);
  const [selectedSizeChartId, setSelectedSizeChartId] = useState<string | null>(null);

  // ── Specifications ──
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [specificationsOpen, setSpecificationsOpen] = useState(false);

  // ── Status (starts as Draft) ──
  const [status, setStatus] = useState("Draft");

  // ── Errors (inline field highlights) ──
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Header / unsaved state ──
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [headerState, setHeaderState] = useState<HeaderState>("clean");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bypass ref — set true right before a programmatic navigate so the
  // blocker doesn't intercept our own save/discard navigation.
  const bypassBlockerRef = useRef(false);

  // Stable ref so the blocker callback never changes identity
  const unsavedRef = useRef(false);
  unsavedRef.current = hasUnsavedChanges;

  // ── Navigation blocker (stable callback — reads via ref) ──
  const blockerFn = useCallback(
    () => unsavedRef.current && !bypassBlockerRef.current,
    [] // empty deps → stable identity
  );
  const blocker = useBlocker(blockerFn);

  // Sync to global context so sidebar can read it
  useEffect(() => {
    setGlobalUnsavedChanges(hasUnsavedChanges);
    return () => setGlobalUnsavedChanges(false);
  }, [hasUnsavedChanges, setGlobalUnsavedChanges]);

  // Track unsaved changes from form values
  useEffect(() => {
    const hasChanges =
      title !== "" ||
      description !== "" ||
      category !== "" ||
      brand !== "" ||
      images.length > 0 ||
      variants.some((v) => v.color || v.size || v.mrp || v.offerPrice);

    setHasUnsavedChanges(hasChanges);

    // Sync headerState — don't override 'error' while timer is still running
    if (!hasChanges) {
      setHeaderState("clean");
    } else if (headerState === "clean") {
      setHeaderState("unsaved");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, category, brand, images, variants]);

  // Cleanup error timer on unmount
  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  // When the router blocker fires, flip header to 'blocked' state (no popup)
  useEffect(() => {
    if (blocker.state === "blocked") {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setHeaderState("blocked");
    }
  }, [blocker.state]);

  /* ── Handlers ──────────────────────────────────────────────────── */

  const handleAddBrand = (newBrand: Brand) => {
    setBrands([...brands, newBrand]);
    setBrand(newBrand.name);
  };

  const handleSaveSizeChart = (chart: SavedSizeChart) => {
    setSavedSizeCharts([...savedSizeCharts, chart]);
  };

  const isSizeChartEnabled = !!(gender && category && subcategory);

  // Status change — enforce transition rules
  const handleStatusChange = (newStatus: string) => {
    const allowed = ALLOWED_FROM[status] ?? [];
    if (allowed.includes(newStatus)) {
      setStatus(newStatus);
    }
  };

  const handleSave = () => {
    // Draft / Hidden → save without mandatory-field checks
    if (status !== "Active") {
      bypassBlockerRef.current = true;
      setHasUnsavedChanges(false);
      setHeaderState("clean");
      // Proceed any blocked navigation, or go to /products
      if (blocker.state === "blocked") {
        blocker.proceed?.();
      } else {
        navigate("/vendor/products");
      }
      return;
    }

    // Active → validate mandatory fields
    const missing = getMissingActiveFields(
      title,
      description,
      category,
      subcategory,
      brand,
      images,
      variants
    );

    if (missing.length > 0) {
      // Build inline errors
      const newErrors: Record<string, string> = {};
      if (!title.trim() || title.trim().length < 3) newErrors.title = "Title is required (min 3 chars)";
      if (!category) newErrors.category = "Category is required";
      if (!subcategory) newErrors.subcategory = "Subcategory is required";
      if (!brand) newErrors.brand = "Brand is required";
      if (images.length === 0) newErrors.images = "At least one product image is required";
      if (!variants.some((v) => v.color && v.size && v.mrp))
        newErrors.variants = "At least one complete variant is required";
      setErrors(newErrors);

      // Show error header, then flip back to unsaved
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setErrorFields(missing);
      setHeaderState("error");
      errorTimerRef.current = setTimeout(() => {
        setHeaderState("unsaved");
      }, 3500);
      return;
    }

    // Passes validation
    setErrors({});
    bypassBlockerRef.current = true;
    setHasUnsavedChanges(false);
    setHeaderState("clean");
    if (blocker.state === "blocked") {
      blocker.proceed?.();
    } else {
      navigate("/vendor/products");
    }
  };

  const handleDiscard = () => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    bypassBlockerRef.current = true;
    setHasUnsavedChanges(false);
    setHeaderState("clean");
    if (blocker.state === "blocked") {
      blocker.proceed?.();
    } else {
      navigate("/vendor/products");
    }
  };

  const titleCharCount = title.length;
  const descCharCount = description.length;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#edf1ff]">
        <AddProductHeader
          headerState={headerState}
          errorFields={errorFields}
          onDiscard={handleDiscard}
          onSave={handleSave}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Page Title */}
          <div className="flex items-center gap-2.5 mb-6">
            <Link
              to="/vendor/products"
              className="flex items-center justify-center size-8 rounded-lg hover:bg-black/5 transition-colors shrink-0"
            >
              <ArrowLeft className="size-4 text-[#667085]" />
            </Link>
            <h1
              className="text-[20px] text-[#101828]"
              style={{ fontWeight: 700 }}
            >
              Add product
            </h1>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-[13px] text-[#475467]">
                        Title *
                      </Label>
                      <span className="text-[11px] text-[#98a2b3]">
                        {titleCharCount}/100
                      </span>
                    </div>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Short sleeve t-shirt"
                      maxLength={100}
                      className={`h-10 rounded-lg border-[#d0d5dd] text-[13px] ${
                        errors.title ? "border-red-500" : ""
                      }`}
                    />
                    {errors.title && (
                      <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        {errors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-[13px] text-[#475467]">
                        Description *
                      </Label>
                      <span className="text-[11px] text-[#98a2b3]">
                        {descCharCount}/500
                      </span>
                    </div>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your product..."
                      maxLength={500}
                      className={`min-h-[100px] rounded-lg border-[#d0d5dd] text-[13px] ${
                        errors.description ? "border-red-500" : ""
                      }`}
                    />
                    {errors.description && (
                      <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">
                  Category
                </h2>
                <CategorySection
                  gender={gender}
                  onGenderChange={setGender}
                  category={category}
                  onCategoryChange={setCategory}
                  subcategory={subcategory}
                  onSubcategoryChange={setSubcategory}
                  categoryError={errors.category}
                />
              </div>

              {/* Brand */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">
                  Brand *
                </h2>
                {errors.brand && (
                  <p className="text-[12px] text-red-500 mb-3 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.brand}
                  </p>
                )}
                <BrandSelector
                  brands={brands}
                  selectedBrand={brand}
                  onBrandChange={setBrand}
                  onAddBrand={() => setBrandModalOpen(true)}
                />
              </div>

              {/* Product Images */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">
                  Product Images *
                </h2>
                {errors.images && (
                  <p className="text-[12px] text-red-500 mb-3 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.images}
                  </p>
                )}
                <ImageUploadSection
                  images={images}
                  onImagesChange={setImages}
                />
              </div>

              {/* Variants */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">
                  Variants *
                </h2>
                {errors.variants && (
                  <p className="text-[12px] text-red-500 mb-3 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.variants}
                  </p>
                )}
                <VariantsTable
                  variants={variants}
                  onVariantsChange={setVariants}
                  errors={errors}
                />
              </div>

              {/* Size Chart */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#1a1a2e]">
                    Size Chart
                  </h2>
                </div>
                <SizeChartBuilder
                  isEnabled={isSizeChartEnabled}
                  savedCharts={savedSizeCharts}
                  selectedChartId={selectedSizeChartId}
                  onSelectChart={setSelectedSizeChartId}
                  onSaveChart={handleSaveSizeChart}
                />
              </div>

              {/* Specifications */}
              <SpecificationsSection
                specifications={specifications}
                onSpecificationsChange={setSpecifications}
                isOpen={specificationsOpen}
                onToggle={() => setSpecificationsOpen(!specificationsOpen)}
              />
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-[280px] space-y-6">
              {/* Status */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">
                  Status
                </h2>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-10 rounded-lg border-[#d0d5dd] text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Draft", "Active", "Hidden"] as const).map((s) => {
                      const allowed = (ALLOWED_FROM[status] ?? []).includes(s);
                      return (
                        <SelectItem key={s} value={s} disabled={!allowed}>
                          <span className={!allowed ? "opacity-40" : ""}>
                            {s}
                            {!allowed && s === "Draft" ? " (not available)" : ""}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {/* Transition hint */}
                <p className="text-[11px] text-[#98a2b3] mt-2">
                  {status === "Draft" && "Draft can move to Active"}
                  {status === "Active" && "Active can move to Hidden"}
                  {status === "Hidden" && "Hidden can move to Active"}
                </p>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">
                  Summary
                </h2>
                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Gender</span>
                    <span className="text-[#101828] font-medium">
                      {gender || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Category</span>
                    <span className="text-[#101828] font-medium">
                      {category || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Sub-category</span>
                    <span className="text-[#101828] font-medium">
                      {subcategory || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Brand</span>
                    <span className="text-[#101828] font-medium">
                      {brand || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Images</span>
                    <span className="text-[#101828] font-medium">
                      {images.length > 0 ? `${images.length} images` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Variants</span>
                    <span className="text-[#101828] font-medium">
                      {variants.filter((v) => v.color && v.size).length > 0
                        ? `${
                            variants.filter((v) => v.color && v.size).length
                          } variants`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Status</span>
                    <span className="text-[#101828] font-medium">{status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

      {/* Brand Modal */}
      <BrandModal
        isOpen={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
        onSave={handleAddBrand}
      />
    </div>
  );
}

export default AddProduct;