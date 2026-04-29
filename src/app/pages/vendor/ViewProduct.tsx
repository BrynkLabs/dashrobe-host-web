import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, Link, useBlocker } from "react-router";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { AddProductHeader, type HeaderState } from "../../components/vendor/AddProductHeader";
import { VariantsTable, ProductVariant } from "../../components/vendor/VariantsTable";
import { SizeChartBuilder, SavedSizeChart } from "../../components/vendor/SizeChartBuilder";
import { SpecificationsSection, Specification } from "../../components/vendor/SpecificationsSection";
import { BrandModal, Brand } from "../../components/vendor/BrandModal";
import { PRODUCT_DETAILS, ViewProductImage } from "../../data/productData";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";
import {
  BasicInfoFields, CategoryCard, BrandCard, FormCard,
  ALLOWED_FROM, getMissingActiveFields, buildValidationErrors,
} from "../../components/vendor/ProductFormSections";
import { StatusCard, SummaryCard } from "../../components/vendor/ProductSidebar";

function ProductImagesGallery({ images, onImagesChange }: { images: ViewProductImage[]; onImagesChange: (imgs: ViewProductImage[]) => void }) {
  if (images.length === 0) {
    return (
      <div className="border-2 border-dashed border-[#d0d5dd] rounded-lg p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-full bg-[#f9fafb] flex items-center justify-center"><ImageIcon className="size-5 text-[#98a2b3]" /></div>
          <p className="text-[13px] text-[#98a2b3]">No images available</p>
        </div>
      </div>
    );
  }
  const setPrimary = (id: string) => onImagesChange(images.map((img) => ({ ...img, isPrimary: img.id === id })));
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-[#475467]">{images.length} image{images.length !== 1 ? "s" : ""} uploaded</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div key={image.id} className={`relative rounded-lg overflow-hidden border-2 group transition-all ${image.isPrimary ? "border-[#220e92]" : "border-[#eef0f4] hover:border-[#c4b5fd]"}`}>
            <div className="aspect-square"><img src={image.url} alt={`Product ${index + 1}`} className="size-full object-cover" /></div>
            {image.isPrimary && <div className="absolute top-1.5 left-1.5 bg-[#220e92] text-white text-[10px] px-2 py-0.5 rounded" style={{ fontWeight: 600 }}>Cover</div>}
            <label className="flex items-center gap-1.5 px-2 py-1.5 bg-white/95 border-t border-[#eef0f4] cursor-pointer hover:bg-[#f9f5ff] transition-colors">
              <input type="checkbox" checked={image.isPrimary} onChange={() => { if (!image.isPrimary) setPrimary(image.id); }} className="accent-[#220e92] size-3 shrink-0 cursor-pointer" />
              <span className="text-[11px] text-[#475467] select-none" style={{ fontWeight: image.isPrimary ? 600 : 400 }}>{image.isPrimary ? "Cover image" : "Set as cover"}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ViewProduct() {
  const { id } = useParams<{ id: string }>();
  const { setHasUnsavedChanges: setGlobalUnsavedChanges } = useUnsavedChanges();
  const product = id ? PRODUCT_DETAILS[id] : null;

  const [savedSnapshot, setSavedSnapshot] = useState<{
    title: string; description: string; gender: string; category: string; subcategory: string;
    brand: string; status: string; images: ViewProductImage[]; variants: ProductVariant[]; specifications: Specification[];
  }>({
    title: product?.title ?? "", description: product?.description ?? "", gender: product?.gender ?? "Women's",
    category: product?.category ?? "", subcategory: product?.subcategory ?? "", brand: product?.brand ?? "",
    status: product?.status ?? "Draft", images: product?.images ?? [], variants: product?.variants ?? [], specifications: product?.specifications ?? [],
  });

  const [title, setTitle] = useState(savedSnapshot.title);
  const [description, setDescription] = useState(savedSnapshot.description);
  const [gender, setGender] = useState(savedSnapshot.gender);
  const [category, setCategory] = useState(savedSnapshot.category);
  const [subcategory, setSubcategory] = useState(savedSnapshot.subcategory);
  const [brand, setBrand] = useState(savedSnapshot.brand);
  const [status, setStatus] = useState<string>(savedSnapshot.status);
  const [images, setImages] = useState<ViewProductImage[]>(savedSnapshot.images);
  const [variants, setVariants] = useState<ProductVariant[]>(savedSnapshot.variants);
  const [specifications, setSpecifications] = useState<Specification[]>(savedSnapshot.specifications);
  const [specificationsOpen, setSpecificationsOpen] = useState((product?.specifications?.length ?? 0) > 0);
  const [savedSizeCharts, setSavedSizeCharts] = useState<SavedSizeChart[]>([]);
  const [selectedSizeChartId, setSelectedSizeChartId] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([
    { id: "b-1", name: "Banaras Weavers Co.", logo: null }, { id: "b-2", name: "Royal Threads", logo: null },
    { id: "b-3", name: "SoftWeave", logo: null }, { id: "b-4", name: "CottonCraft", logo: null },
    { id: "b-5", name: "Festive Looms", logo: null }, { id: "b-6", name: "Jaipur Prints", logo: null },
    { id: "b-7", name: "Weave & Wear", logo: null }, { id: "b-8", name: "Linara", logo: null },
  ]);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [headerState, setHeaderState] = useState<HeaderState>("clean");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bypassBlockerRef = useRef(false);

  const hasUnsavedChanges = useMemo(() =>
    title !== savedSnapshot.title || description !== savedSnapshot.description || gender !== savedSnapshot.gender ||
    category !== savedSnapshot.category || subcategory !== savedSnapshot.subcategory || brand !== savedSnapshot.brand ||
    status !== savedSnapshot.status || JSON.stringify(images) !== JSON.stringify(savedSnapshot.images) ||
    JSON.stringify(variants) !== JSON.stringify(savedSnapshot.variants) || JSON.stringify(specifications) !== JSON.stringify(savedSnapshot.specifications),
    [title, description, gender, category, subcategory, brand, status, images, variants, specifications, savedSnapshot]
  );

  useEffect(() => { if (!hasUnsavedChanges) setHeaderState("clean"); else if (headerState === "clean") setHeaderState("unsaved"); /* eslint-disable-next-line */ }, [hasUnsavedChanges]);
  useEffect(() => { setGlobalUnsavedChanges(hasUnsavedChanges); return () => setGlobalUnsavedChanges(false); }, [hasUnsavedChanges, setGlobalUnsavedChanges]);
  useEffect(() => { return () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); }; }, []);

  const unsavedRef = useRef(false);
  unsavedRef.current = hasUnsavedChanges;
  const blockerFn = useCallback(() => unsavedRef.current && !bypassBlockerRef.current, []);
  const blocker = useBlocker(blockerFn);

  useEffect(() => { if (blocker.state === "blocked") { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); setHeaderState("blocked"); } }, [blocker.state]);
  useEffect(() => { if (!hasUnsavedChanges && blocker.state === "blocked") blocker.proceed?.(); }, [hasUnsavedChanges, blocker.state]); // eslint-disable-line

  const handleStatusChange = (newStatus: string) => { if ((ALLOWED_FROM[status] ?? []).includes(newStatus)) setStatus(newStatus); };

  const handleSave = () => {
    if (status !== "Active") {
      setErrors({});
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setSavedSnapshot({ title, description, gender, category, subcategory, brand, status, images, variants, specifications });
      return;
    }
    const hasCompleteVariant = variants.some((v) => v.color && v.size && v.mrp);
    const missing = getMissingActiveFields(title, description, category, subcategory, brand, images.length, hasCompleteVariant);
    if (missing.length > 0) {
      setErrors(buildValidationErrors(title, description, category, subcategory, brand, images.length, hasCompleteVariant));
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
    setTitle(savedSnapshot.title); setDescription(savedSnapshot.description); setGender(savedSnapshot.gender);
    setCategory(savedSnapshot.category); setSubcategory(savedSnapshot.subcategory); setBrand(savedSnapshot.brand);
    setStatus(savedSnapshot.status); setImages(savedSnapshot.images); setVariants(savedSnapshot.variants);
    setSpecifications(savedSnapshot.specifications);
  };

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-w-0 h-full overflow-hidden bg-[#edf1ff]">
        <p className="text-[16px] text-[#475467] font-medium">Product not found.</p>
        <Link to="/vendor/products" className="text-[#220e92] text-[14px] underline">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#edf1ff]">
      <AddProductHeader headerState={headerState} errorFields={errorFields} onDiscard={handleDiscard} onSave={handleSave} />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center gap-2.5 mb-6">
          <Link to="/vendor/products" className="flex items-center justify-center size-8 rounded-lg hover:bg-black/5 transition-colors shrink-0">
            <ArrowLeft className="size-4 text-[#667085]" />
          </Link>
          <h1 className="text-[20px] text-[#101828] truncate" style={{ fontWeight: 700 }}>{product.title}</h1>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          <div className="flex-1 space-y-6">
            <BasicInfoFields title={title} description={description} onTitleChange={setTitle} onDescriptionChange={setDescription} errors={errors} />
            <CategoryCard gender={gender} category={category} subcategory={subcategory} onGenderChange={setGender} onCategoryChange={setCategory} onSubcategoryChange={setSubcategory} categoryError={errors.category} />
            <BrandCard brands={brands} selectedBrand={brand} onBrandChange={setBrand} onAddBrand={() => setBrandModalOpen(true)} error={errors.brand} />
            <FormCard title="Product Images *" error={errors.images}>
              <ProductImagesGallery images={images} onImagesChange={setImages} />
            </FormCard>
            <FormCard title="Variants *" error={errors.variants}>
              <VariantsTable variants={variants} onVariantsChange={setVariants} errors={errors} showDelete={false} />
            </FormCard>
            <FormCard title="Size Chart">
              <SizeChartBuilder isEnabled={!!(gender && category && subcategory)} savedCharts={savedSizeCharts} selectedChartId={selectedSizeChartId} onSelectChart={setSelectedSizeChartId} onSaveChart={(c) => setSavedSizeCharts([...savedSizeCharts, c])} />
            </FormCard>
            <SpecificationsSection specifications={specifications} onSpecificationsChange={setSpecifications} isOpen={specificationsOpen} onToggle={() => setSpecificationsOpen(!specificationsOpen)} />
          </div>

          <div className="w-full lg:w-[280px] space-y-6">
            <StatusCard status={status} onStatusChange={handleStatusChange} />
            <SummaryCard gender={gender} category={category} subcategory={subcategory} brand={brand} imageCount={images.length} variants={variants} status={status} />
          </div>
        </div>
      </main>

      <BrandModal isOpen={brandModalOpen} onClose={() => setBrandModalOpen(false)} onSave={(b) => { setBrands([...brands, b]); setBrand(b.name); }} />
    </div>
  );
}

export default ViewProduct;
