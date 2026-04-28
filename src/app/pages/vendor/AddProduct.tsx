import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useBlocker } from "react-router";
import { ArrowLeft } from "lucide-react";
import { AddProductHeader, type HeaderState } from "../../components/vendor/AddProductHeader";
import { ImageUploadSection, ProductImage } from "../../components/vendor/ImageUploadSection";
import { VariantsTable, ProductVariant } from "../../components/vendor/VariantsTable";
import { SizeChartBuilder, SavedSizeChart } from "../../components/vendor/SizeChartBuilder";
import { SpecificationsSection, Specification } from "../../components/vendor/SpecificationsSection";
import { BrandModal, Brand } from "../../components/vendor/BrandModal";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";
import {
  BasicInfoFields, CategoryCard, BrandCard, FormCard,
  ALLOWED_FROM, getMissingActiveFields, buildValidationErrors,
} from "../../components/vendor/ProductFormSections";
import { StatusCard, SummaryCard } from "../../components/vendor/ProductSidebar";

export function AddProduct() {
  const navigate = useNavigate();
  const { setHasUnsavedChanges: setGlobalUnsavedChanges } = useUnsavedChanges();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("Women's");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState<Brand[]>([
    { id: "1", name: "Nike", logo: null },
    { id: "2", name: "Adidas", logo: null },
    { id: "3", name: "Puma", logo: null },
    { id: "4", name: "Reebok", logo: null },
  ]);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: "1", color: null, size: "", mrp: "", offerPrice: "", status: "Active", image: null, isDefault: true },
  ]);
  const [savedSizeCharts, setSavedSizeCharts] = useState<SavedSizeChart[]>([]);
  const [selectedSizeChartId, setSelectedSizeChartId] = useState<string | null>(null);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [specificationsOpen, setSpecificationsOpen] = useState(false);
  const [status, setStatus] = useState("Draft");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [headerState, setHeaderState] = useState<HeaderState>("clean");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bypassBlockerRef = useRef(false);
  const unsavedRef = useRef(false);
  unsavedRef.current = hasUnsavedChanges;

  const blockerFn = useCallback(() => unsavedRef.current && !bypassBlockerRef.current, []);
  const blocker = useBlocker(blockerFn);

  useEffect(() => { setGlobalUnsavedChanges(hasUnsavedChanges); return () => setGlobalUnsavedChanges(false); }, [hasUnsavedChanges, setGlobalUnsavedChanges]);

  useEffect(() => {
    const hasChanges = title !== "" || description !== "" || category !== "" || brand !== "" || images.length > 0 || variants.some((v) => v.color || v.size || v.mrp || v.offerPrice);
    setHasUnsavedChanges(hasChanges);
    if (!hasChanges) setHeaderState("clean");
    else if (headerState === "clean") setHeaderState("unsaved");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, category, brand, images, variants]);

  useEffect(() => { return () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); }; }, []);
  useEffect(() => { if (blocker.state === "blocked") { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); setHeaderState("blocked"); } }, [blocker.state]);

  const handleStatusChange = (newStatus: string) => {
    if ((ALLOWED_FROM[status] ?? []).includes(newStatus)) setStatus(newStatus);
  };

  const handleSave = () => {
    if (status !== "Active") {
      bypassBlockerRef.current = true;
      setHasUnsavedChanges(false);
      setHeaderState("clean");
      blocker.state === "blocked" ? blocker.proceed?.() : navigate("/vendor/products");
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
    bypassBlockerRef.current = true;
    setHasUnsavedChanges(false);
    setHeaderState("clean");
    blocker.state === "blocked" ? blocker.proceed?.() : navigate("/vendor/products");
  };

  const handleDiscard = () => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    bypassBlockerRef.current = true;
    setHasUnsavedChanges(false);
    setHeaderState("clean");
    blocker.state === "blocked" ? blocker.proceed?.() : navigate("/vendor/products");
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#edf1ff]">
      <AddProductHeader headerState={headerState} errorFields={errorFields} onDiscard={handleDiscard} onSave={handleSave} />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center gap-2.5 mb-6">
          <Link to="/vendor/products" className="flex items-center justify-center size-8 rounded-lg hover:bg-black/5 transition-colors shrink-0">
            <ArrowLeft className="size-4 text-[#667085]" />
          </Link>
          <h1 className="text-[20px] text-[#101828]" style={{ fontWeight: 700 }}>Add product</h1>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          <div className="flex-1 space-y-6">
            <BasicInfoFields title={title} description={description} onTitleChange={setTitle} onDescriptionChange={setDescription} errors={errors} />
            <CategoryCard gender={gender} category={category} subcategory={subcategory} onGenderChange={setGender} onCategoryChange={setCategory} onSubcategoryChange={setSubcategory} categoryError={errors.category} />
            <BrandCard brands={brands} selectedBrand={brand} onBrandChange={setBrand} onAddBrand={() => setBrandModalOpen(true)} error={errors.brand} />
            <FormCard title="Product Images *" error={errors.images}>
              <ImageUploadSection images={images} onImagesChange={setImages} />
            </FormCard>
            <FormCard title="Variants *" error={errors.variants}>
              <VariantsTable variants={variants} onVariantsChange={setVariants} errors={errors} />
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

export default AddProduct;
