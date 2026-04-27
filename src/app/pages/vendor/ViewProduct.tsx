import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link, useBlocker } from "react-router";
import { ArrowLeft, AlertCircle, ImageIcon } from "lucide-react";
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
import { VariantsTable, ProductVariant } from "../../components/vendor/VariantsTable";
import { SizeChartBuilder, SavedSizeChart } from "../../components/vendor/SizeChartBuilder";
import { SpecificationsSection, Specification } from "../../components/vendor/SpecificationsSection";
import { BrandModal, Brand } from "../../components/vendor/BrandModal";
import { BrandSelector } from "../../components/vendor/BrandSelector";
import { CategorySection } from "../../components/vendor/CategorySection";
import { PRODUCT_DETAILS, ViewProductImage } from "../../data/productData";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";

/* ─── State transition rules ──────────────────────────────────────
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
  images: ViewProductImage[],
  variants: ProductVariant[]
): string[] {
  const missing: string[] = [];
  if (!title.trim() || title.trim().length < 3) missing.push("Title");
  if (!description.trim()) missing.push("Description");
  if (!category) missing.push("Category");
  if (!subcategory) missing.push("Subcategory");
  if (!brand) missing.push("Brand");
  if (images.length === 0) missing.push("1 image min.");
  if (!variants.some((v) => v.color && v.size && v.mrp))
    missing.push("1 variant min.");
  return missing;
}

/* ─── Image gallery ──────────────────────────────────────────────── */
function ProductImagesGallery({
  images,
  onImagesChange,
}: {
  images: ViewProductImage[];
  onImagesChange: (imgs: ViewProductImage[]) => void;
}) {
  const setPrimary = (id: string) =>
    onImagesChange(images.map((img) => ({ ...img, isPrimary: img.id === id })));

  if (images.length === 0) {
    return (
      <div className="border-2 border-dashed border-[#d0d5dd] rounded-lg p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-full bg-[#f9fafb] flex items-center justify-center">
            <ImageIcon className="size-5 text-[#98a2b3]" />
          </div>
          <p className="text-[13px] text-[#98a2b3]">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-[#475467]">
        {images.length} image{images.length !== 1 ? "s" : ""} uploaded
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative rounded-lg overflow-hidden border-2 group transition-all ${
              image.isPrimary
                ? "border-[#220e92]"
                : "border-[#eef0f4] hover:border-[#c4b5fd]"
            }`}
          >
            <div className="aspect-square">
              <img
                src={image.url}
                alt={`Product ${index + 1}`}
                className="size-full object-cover"
              />
            </div>
            {image.isPrimary && (
              <div
                className="absolute top-1.5 left-1.5 bg-[#220e92] text-white text-[10px] px-2 py-0.5 rounded"
                style={{ fontWeight: 600 }}
              >
                Cover
              </div>
            )}
            <label className="flex items-center gap-1.5 px-2 py-1.5 bg-white/95 border-t border-[#eef0f4] cursor-pointer hover:bg-[#f9f5ff] transition-colors">
              <input
                type="checkbox"
                checked={image.isPrimary}
                onChange={() => {
                  if (!image.isPrimary) setPrimary(image.id);
                }}
                className="accent-[#220e92] size-3 shrink-0 cursor-pointer"
              />
              <span
                className="text-[11px] text-[#475467] select-none"
                style={{ fontWeight: image.isPrimary ? 600 : 400 }}
              >
                {image.isPrimary ? "Cover image" : "Set as cover"}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export function ViewProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setHasUnsavedChanges: setGlobalUnsavedChanges } = useUnsavedChanges();

  const product = id ? PRODUCT_DETAILS[id] : null;

  // ── Saved snapshot — represents the last persisted state ──
  const [savedSnapshot, setSavedSnapshot] = useState({
    title: product?.title ?? "",
    description: product?.description ?? "",
    gender: product?.gender ?? "Women's",
    category: product?.category ?? "",
    subcategory: product?.subcategory ?? "",
    brand: product?.brand ?? "",
    status: product?.status ?? "Draft",
    images: product?.images ?? ([] as ViewProductImage[]),
    variants: product?.variants ?? ([] as ProductVariant[]),
    specifications: product?.specifications ?? ([] as Specification[]),
  });

  // ── Form state ──
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [gender, setGender] = useState(product?.gender ?? "Women's");
  const [category, setCategory] = useState(product?.category ?? "");
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [status, setStatus] = useState<string>(product?.status ?? "Draft");
  const [images, setImages] = useState<ViewProductImage[]>(product?.images ?? []);
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants ?? []);
  const [specifications, setSpecifications] = useState<Specification[]>(
    product?.specifications ?? []
  );
  const [specificationsOpen, setSpecificationsOpen] = useState(
    (product?.specifications?.length ?? 0) > 0
  );
  const [savedSizeCharts, setSavedSizeCharts] = useState<SavedSizeChart[]>([]);
  const [selectedSizeChartId, setSelectedSizeChartId] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([
    { id: "b-1", name: "Banaras Weavers Co.", logo: null },
    { id: "b-2", name: "Royal Threads", logo: null },
    { id: "b-3", name: "SoftWeave", logo: null },
    { id: "b-4", name: "CottonCraft", logo: null },
    { id: "b-5", name: "Festive Looms", logo: null },
    { id: "b-6", name: "Jaipur Prints", logo: null },
    { id: "b-7", name: "Weave & Wear", logo: null },
    { id: "b-8", name: "Linara", logo: null },
  ]);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Header state ──
  const [headerState, setHeaderState] = useState<HeaderState>("clean");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bypassBlockerRef = useRef(false);

  // ── Computed: has unsaved changes vs snapshot ──
  const hasUnsavedChanges = useMemo(
    () =>
      title !== savedSnapshot.title ||
      description !== savedSnapshot.description ||
      gender !== savedSnapshot.gender ||
      category !== savedSnapshot.category ||
      subcategory !== savedSnapshot.subcategory ||
      brand !== savedSnapshot.brand ||
      status !== savedSnapshot.status ||
      JSON.stringify(images) !== JSON.stringify(savedSnapshot.images) ||
      JSON.stringify(variants) !== JSON.stringify(savedSnapshot.variants) ||
      JSON.stringify(specifications) !== JSON.stringify(savedSnapshot.specifications),
    [
      title, description, gender, category, subcategory, brand, status,
      images, variants, specifications, savedSnapshot,
    ]
  );

  // Sync header state when changes appear / disappear
  useEffect(() => {
    if (!hasUnsavedChanges) {
      setHeaderState("clean");
    } else if (headerState === "clean") {
      setHeaderState("unsaved");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnsavedChanges]);

  // Sync global context so sidebar logout can read it
  useEffect(() => {
    setGlobalUnsavedChanges(hasUnsavedChanges);
    return () => setGlobalUnsavedChanges(false);
  }, [hasUnsavedChanges, setGlobalUnsavedChanges]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  // ── Navigation blocker — stable callback via ref ──
  const unsavedRef = useRef(false);
  unsavedRef.current = hasUnsavedChanges;
  const blockerFn = useCallback(
    () => unsavedRef.current && !bypassBlockerRef.current,
    []
  );
  const blocker = useBlocker(blockerFn);

  // When blocker fires → show inline header warning (no modal)
  useEffect(() => {
    if (blocker.state === "blocked") {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setHeaderState("blocked");
    }
  }, [blocker.state]);

  // Auto-proceed blocker once changes are cleared (after save/discard)
  useEffect(() => {
    if (!hasUnsavedChanges && blocker.state === "blocked") {
      blocker.proceed?.();
    }
  }, [hasUnsavedChanges, blocker.state]); // eslint-disable-line

  /* ── Handlers ────────────────────────────────────────────────── */

  const handleAddBrand = (newBrand: Brand) => {
    setBrands([...brands, newBrand]);
    setBrand(newBrand.name);
  };

  const handleSaveSizeChart = (chart: SavedSizeChart) =>
    setSavedSizeCharts([...savedSizeCharts, chart]);

  const isSizeChartEnabled = !!(gender && category && subcategory);

  const handleStatusChange = (newStatus: string) => {
    if ((ALLOWED_FROM[status] ?? []).includes(newStatus)) setStatus(newStatus);
  };

  const handleSave = () => {
    if (status !== "Active") {
      setErrors({});
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setSavedSnapshot({ title, description, gender, category, subcategory, brand, status, images, variants, specifications });
      return;
    }

    const missing = getMissingActiveFields(title, description, category, subcategory, brand, images, variants);

    if (missing.length > 0) {
      const newErrors: Record<string, string> = {};
      if (!title.trim() || title.trim().length < 3) newErrors.title = "Title is required (min 3 chars)";
      if (!description.trim()) newErrors.description = "Description is required";
      if (!category) newErrors.category = "Category is required";
      if (!subcategory) newErrors.subcategory = "Subcategory is required";
      if (!brand) newErrors.brand = "Brand is required";
      if (images.length === 0) newErrors.images = "At least one product image is required";
      if (!variants.some((v) => v.color && v.size && v.mrp))
        newErrors.variants = "At least one complete variant is required";
      setErrors(newErrors);

      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setErrorFields(missing);
      setHeaderState("error");
      errorTimerRef.current = setTimeout(() => setHeaderState("unsaved"), 3500);
      return;
    }

    setErrors({});
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setSavedSnapshot({ title, description, gender, category, subcategory, brand, status, images, variants, specifications });
  };

  const handleDiscard = () => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setErrors({});
    setTitle(savedSnapshot.title);
    setDescription(savedSnapshot.description);
    setGender(savedSnapshot.gender);
    setCategory(savedSnapshot.category);
    setSubcategory(savedSnapshot.subcategory);
    setBrand(savedSnapshot.brand);
    setStatus(savedSnapshot.status);
    setImages(savedSnapshot.images);
    setVariants(savedSnapshot.variants);
    setSpecifications(savedSnapshot.specifications);
  };

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-w-0 h-full overflow-hidden bg-[#edf1ff]">
        <p className="text-[16px] text-[#475467] font-medium">Product not found.</p>
        <Link to="/vendor/products" className="text-[#220e92] text-[14px] underline">
          Back to Products
        </Link>
      </div>
    );
  }

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
          <div className="flex items-center gap-2.5 mb-6">
            <Link
              to="/vendor/products"
              className="flex items-center justify-center size-8 rounded-lg hover:bg-black/5 transition-colors shrink-0"
            >
              <ArrowLeft className="size-4 text-[#667085]" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-[20px] text-[#101828] truncate" style={{ fontWeight: 700 }}>
                {product.title}
              </h1>
            </div>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Left */}
            <div className="flex-1 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-[13px] text-[#475467]">Title *</Label>
                      <span className="text-[11px] text-[#98a2b3]">{titleCharCount}/100</span>
                    </div>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      className={`h-10 rounded-lg border-[#d0d5dd] text-[13px] ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && (
                      <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="size-3" />{errors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-[13px] text-[#475467]">Description *</Label>
                      <span className="text-[11px] text-[#98a2b3]">{descCharCount}/500</span>
                    </div>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={500}
                      className={`min-h-[100px] rounded-lg border-[#d0d5dd] text-[13px] ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && (
                      <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="size-3" />{errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">Category</h2>
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
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">Brand *</h2>
                {errors.brand && (
                  <p className="text-[12px] text-red-500 mb-3 flex items-center gap-1">
                    <AlertCircle className="size-3" />{errors.brand}
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
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">Product Images *</h2>
                {errors.images && (
                  <p className="text-[12px] text-red-500 mb-3 flex items-center gap-1">
                    <AlertCircle className="size-3" />{errors.images}
                  </p>
                )}
                <ProductImagesGallery images={images} onImagesChange={setImages} />
              </div>

              {/* Variants */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">Variants *</h2>
                {errors.variants && (
                  <p className="text-[12px] text-red-500 mb-3 flex items-center gap-1">
                    <AlertCircle className="size-3" />{errors.variants}
                  </p>
                )}
                <VariantsTable
                  variants={variants}
                  onVariantsChange={setVariants}
                  errors={errors}
                  showDelete={false}
                />
              </div>

              {/* Size Chart */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#1a1a2e]">Size Chart</h2>
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

            {/* Right sidebar */}
            <div className="w-full lg:w-[280px] space-y-6">
              {/* Status */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">Status</h2>
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

              {/* Summary */}
              <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
                <h2 className="text-[15px] font-semibold text-[#1a1a2e] mb-4">Summary</h2>
                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Gender</span>
                    <span className="text-[#101828] font-medium">{gender || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Category</span>
                    <span className="text-[#101828] font-medium">{category || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Sub-category</span>
                    <span className="text-[#101828] font-medium">{subcategory || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Brand</span>
                    <span className="text-[#101828] font-medium">{brand || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Images</span>
                    <span className="text-[#101828] font-medium">
                      {images.length > 0 ? `${images.length} images` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467]">Variants</span>
                    <span className="text-[#101828] font-medium">
                      {variants.filter((v) => v.color && v.size).length > 0
                        ? `${variants.filter((v) => v.color && v.size).length} variants`
                        : "—"}
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

      <BrandModal
        isOpen={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
        onSave={handleAddBrand}
      />
    </div>
  );
}

export default ViewProduct;
