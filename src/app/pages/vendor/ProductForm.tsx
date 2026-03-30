import { useState, useRef, useEffect } from "react";
import {
  Plus, Search, X, ChevronDown, Upload, Image as ImageIcon, Ban,
  Check, Package, ArrowLeft, Pencil, Trash2,
} from "lucide-react";

// Re-export types that the parent needs
export type ProductStatus = "active" | "draft" | "archived";

export interface ProductVariant {
  id: string;
  combination: string;
  sku: string;
  price: string;
  stock: string;
  status: "active" | "disabled";
  image: string;
}

export interface VariantOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  vendor: string;
  variantsCount: number;
  totalStock: number;
  status: ProductStatus;
  sku: string;
  channels: string[];
  price: string;
  compareAt: string;
  costPerItem: string;
  chargeTax: boolean;
  trackInventory: boolean;
  quantity: string;
  barcode: string;
  sellWhenOos: boolean;
  isPhysical: boolean;
  weight: string;
  weightUnit: string;
  hasVariants: boolean;
  variantOptions: VariantOption[];
  variants: ProductVariant[];
  colorImages: Record<string, string>;
  tags: string[];
  productType: string;
  seoTitle: string;
  seoDescription: string;
  specifications: Record<string, string>;
}

function isColorOption(name: string): boolean {
  const n = name.toLowerCase().trim();
  return n === "color" || n === "colour" || n === "colors" || n === "colours";
}

const productImages = [
  "https://images.unsplash.com/photo-1616756351484-798f37bdffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2FyZWUlMjBmYWJyaWMlMjBpbmRpYW58ZW58MXx8fHwxNzcyODAwMDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1768807478320-fcfd3929acb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyb2lkZXJlZCUyMGt1cnRhJTIwbWVuc3dlYXJ8ZW58MXx8fHwxNzcyODAwMDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1572371179162-9c0141483610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlmZm9uJTIwZHVwYXR0YSUyMHNjYXJmfGVufDF8fHx8MTc3MjgwMDAzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1766556514059-303c3b790424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBwYWxhenpvJTIwcGFudHMlMjB3aGl0ZXxlbnwxfHx8fDE3NzI4MDAwMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1769275061088-85697a30ee50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZHJlc3MlMjBpbmRpYW4lMjB3b21hbnxlbnwxfHx8fDE3NzI4MDAwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1599584082894-52c6d8fc48c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ28lMjBrdXJ0aSUyMGluZGlhbiUyMGZhc2hpb258ZW58MXx8fHwxNzcyODAwMDM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1662376993778-1a1e6ecd9df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjByZWQlMjBnb2xkJTIwYnJpZGFsfGVufDF8fHx8MTc3MjgwMDAzNnww&ixlib=rb-4.1.0&q=80&w=1080",
];

const defaultCategories: Record<string, string[]> = {
  "Sarees": ["Banarasi", "Silk", "Cotton", "Chiffon", "Georgette"],
  "Kurta Sets": ["Men's Kurta", "Women's Kurta", "Kurta Pajama"],
  "Lehengas": ["Bridal", "Party Wear", "Casual", "Designer"],
  "Kurtis": ["A-Line", "Straight", "Anarkali", "Kaftan"],
  "Dresses": ["Maxi", "Midi", "Mini", "Gown"],
  "Bottomwear": ["Palazzo", "Pants", "Skirts", "Churidar"],
  "Dupattas": ["Silk", "Cotton", "Chiffon", "Net"],
  "Men's Wear": ["Sherwani", "Nehru Jacket", "Indo-Western", "Pathani Suit", "Dhoti Set"],
};

interface BrandItem { name: string; image: string; }

const predefinedBrandsList: BrandItem[] = [
  { name: "FabIndia", image: "https://images.unsplash.com/photo-1760287364328-e30221615f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhuaWMlMjBjbG90aGluZyUyMGJyYW5kJTIwYm91dGlxdWUlMjBkaXNwbGF5fGVufDF8fHx8MTc3MzA1NDk3MXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Biba", image: "https://images.unsplash.com/photo-1760537826554-b8701b24ba30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwYnJhbmQlMjBtaW5pbWFsJTIwbG9nb3xlbnwxfHx8fDE3NzMwNTQ5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "W", image: "https://images.unsplash.com/photo-1763971922539-7833df0b71c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBicmFuZCUyMHRleHRpbGUlMjBkaXNwbGF5fGVufDF8fHx8MTc3MzA1NDk3Mnww&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Global Desi", image: "https://images.unsplash.com/photo-1767854808145-5adfb3866ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGJvdXRpcXVlJTIwZmFzaGlvbiUyMHN0b3JlJTIwZnJvbnR8ZW58MXx8fHwxNzczMDU0OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Manyavar", image: "https://images.unsplash.com/photo-1747485012312-8de08a87205e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXJlZSUyMHNpbGslMjBmYWJyaWMlMjBjb2xsZWN0aW9uJTIwZGlzcGxheXxlbnwxfHx8fDE3NzMwNTQ5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Libas", image: "https://images.unsplash.com/photo-1765009433753-c7462637d21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjByYWNrJTIwbW9kZXJuJTIwc3RvcmV8ZW58MXx8fHwxNzczMDU0OTc0fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Anouk", image: "https://images.unsplash.com/photo-1767334010488-83cdb8539273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBmYXNoaW9uJTIwYnJhbmQlMjBhcHBhcmVsJTIwZGlzcGxheXxlbnwxfHx8fDE3NzMwNTQ5NzR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Aurelia", image: productImages[0] },
  { name: "Soch", image: productImages[4] },
  { name: "Jaipur Kurti", image: productImages[5] },
  { name: "Kalini", image: productImages[6] },
];

let formNextId = 1000;

// ─── ProductForm ─────────────────────────────────────────────
export function ProductForm({ initial, isEdit, onSave, onBack, onDelete }: {
  initial?: Product;
  isEdit: boolean;
  onSave: (p: Product) => void;
  onBack: () => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [subcategory, setSubcategory] = useState(initial?.subcategory || "");
  const [brand, setBrand] = useState(initial?.brand || "");
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"active" | "draft">(initial?.status === "archived" ? "draft" : (initial?.status || "active"));
  const [channels, setChannels] = useState<string[]>(initial?.channels || ["Online Store"]);
  const [price, setPrice] = useState(initial?.price || "");
  const [compareAt, setCompareAt] = useState(initial?.compareAt || "");
  const [costPerItem, setCostPerItem] = useState(initial?.costPerItem || "");
  const [chargeTax, setChargeTax] = useState(initial?.chargeTax ?? true);
  const [trackInventory] = useState(initial?.trackInventory ?? true);
  const [quantity, setQuantity] = useState(initial?.quantity || "0");
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [hasVariants, setHasVariants] = useState(initial?.hasVariants || false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>(initial?.variantOptions || [{ name: "Color", values: ["Black", "Grey"] }, { name: "Size", values: ["S", "M", "L"] }]);
  const [newOptionName, setNewOptionName] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>(initial?.variants || []);
  const [colorImages, setColorImages] = useState<Record<string, string>>(initial?.colorImages || {});
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");
  const [vendor, setVendor] = useState(initial?.vendor || "");
  const [productType, setProductType] = useState(initial?.productType || "");
  const [variantWeights, setVariantWeights] = useState<Record<string, string>>({});

  const [showCompareAt, setShowCompareAt] = useState(!!initial?.compareAt);
  const [showCost, setShowCost] = useState(!!initial?.costPerItem);
  const [specifications, setSpecifications] = useState<Record<string, string>>(initial?.specifications || {});

  const [inventoryRows, setInventoryRows] = useState<{ color: string; size: string; available: number; committed: number; inHand: number }[]>(() => {
    if (initial?.variants && initial.variants.length > 0) {
      return initial.variants.map(v => {
        const parts = v.combination.split(" / ");
        return { color: parts[0] || "-", size: parts[1] || "-", available: Number(v.stock) || 0, committed: Math.floor(Math.random() * 3), inHand: Number(v.stock) + Math.floor(Math.random() * 3) };
      });
    }
    return [{ color: "Default", size: "One Size", available: Number(initial?.quantity || 0), committed: 0, inHand: Number(initial?.quantity || 0) }];
  });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => { setUnsavedChanges(true); }, [name, description, category, price, quantity, status, images, hasVariants, variants, tags]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCategoryOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!hasVariants || variantOptions.length === 0) { if (!initial?.variants?.length) setVariants([]); return; }
    const validOptions = variantOptions.filter(o => o.values.length > 0);
    if (validOptions.length === 0) { setVariants([]); return; }
    const combos = generateCombinations(validOptions);
    const colorOpt = variantOptions.find(o => isColorOption(o.name));
    setVariants(combos.map((combo, i) => {
      let variantImage = "";
      if (colorOpt) {
        const colorVal = colorOpt.values.find(cv => combo.startsWith(cv + " / ") || combo === cv);
        if (colorVal && colorImages[colorVal]) variantImage = colorImages[colorVal];
      }
      return { id: `V${i + 1}`, combination: combo, sku: `SKU-${String(1000 + i)}`, price: price || "", stock: "10", status: "active" as const, image: variantImage };
    }));
  }, [hasVariants, variantOptions, colorImages]);

  useEffect(() => {
    if (variants.length > 0) {
      setInventoryRows(variants.map(v => {
        const parts = v.combination.split(" / ");
        return { color: parts[0] || "-", size: parts[1] || "-", available: Number(v.stock) || 0, committed: 0, inHand: Number(v.stock) || 0 };
      }));
    } else if (!hasVariants) {
      setInventoryRows([{ color: "Default", size: "One Size", available: Number(quantity || 0), committed: 0, inHand: Number(quantity || 0) }]);
    }
  }, [variants, hasVariants, quantity]);

  function generateCombinations(options: VariantOption[]): string[] {
    if (options.length === 0) return [];
    if (options.length === 1) return options[0].values;
    const [first, ...rest] = options;
    const rc = generateCombinations(rest);
    return first.values.flatMap(v => rc.map(r => `${v} / ${r}`));
  }

  const addTag = () => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags([...tags, tagInput.trim()]); setTagInput(""); } };
  const removeTag = (t: string) => setTags(tags.filter(x => x !== t));
  const addVariantOption = () => { if (newOptionName.trim() && !variantOptions.find(o => o.name === newOptionName.trim())) { setVariantOptions([...variantOptions, { name: newOptionName.trim(), values: [] }]); setNewOptionName(""); } };
  const removeVariantOption = (idx: number) => setVariantOptions(variantOptions.filter((_, i) => i !== idx));
  const addValueToOption = (optIdx: number, value: string) => { if (!value.trim()) return; setVariantOptions(prev => prev.map((o, i) => i === optIdx && !o.values.includes(value.trim()) ? { ...o, values: [...o.values, value.trim()] } : o)); };
  const removeValueFromOption = (optIdx: number, valIdx: number) => {
    const opt = variantOptions[optIdx];
    if (opt && isColorOption(opt.name)) { const rv = opt.values[valIdx]; if (rv) setColorImages(prev => { const n = { ...prev }; delete n[rv]; return n; }); }
    setVariantOptions(prev => prev.map((o, i) => i === optIdx ? { ...o, values: o.values.filter((_, vi) => vi !== valIdx) } : o));
  };
  const uploadColorImage = (colorValue: string) => { setColorImages(prev => ({ ...prev, [colorValue]: productImages[Math.floor(Math.random() * productImages.length)] })); };
  const removeColorImage = (colorValue: string) => { setColorImages(prev => { const n = { ...prev }; delete n[colorValue]; return n; }); };
  const updateVariant = (vIdx: number, field: keyof ProductVariant, value: string) => { setVariants(prev => prev.map((v, i) => i === vIdx ? { ...v, [field]: value } : v)); };
  const toggleVariantStatus = (vIdx: number) => { setVariants(prev => prev.map((v, i) => i === vIdx ? { ...v, status: v.status === "active" ? "disabled" : "active" } : v)); };
  const applyBulkPrice = () => { if (bulkPrice) setVariants(prev => prev.map(v => ({ ...v, price: bulkPrice }))); };
  const applyBulkStock = () => { if (bulkStock) setVariants(prev => prev.map(v => ({ ...v, stock: bulkStock }))); };
  const toggleChannel = (ch: string) => { setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]); };
  const totalStock = hasVariants ? variants.reduce((s, v) => s + (parseInt(v.stock) || 0), 0) : parseInt(quantity) || 0;

  const doSave = () => {
    const product: Product = {
      id: initial?.id || `P${++formNextId}`, name, description,
      image: images[0] || productImages[Math.floor(Math.random() * productImages.length)],
      images, category, subcategory, brand, vendor, variantsCount: hasVariants ? variants.length : 0,
      totalStock, status, sku: initial?.sku || "", channels, price, compareAt, costPerItem, chargeTax,
      trackInventory, quantity, barcode: "", sellWhenOos: false, isPhysical: true,
      weight: "0", weightUnit: "kg", hasVariants, variantOptions, variants, colorImages, tags,
      productType, seoTitle: "", seoDescription: "",
      specifications,
    };
    onSave(product);
  };

  return (
    <div className="space-y-0">
      {unsavedChanges && isEdit && (
        <div className="bg-[#220E92]/5 border border-[#220E92]/20 rounded-[10px] px-4 py-2.5 mb-4 flex items-center justify-between">
          <span className="text-[#220E92]" style={{ fontSize: "13px", fontWeight: 500 }}>Unsaved changes</span>
          <div className="flex gap-2">
            <button onClick={onBack} className="px-3 py-1.5 rounded-[8px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>Discard</button>
            <button onClick={doSave} className="px-3 py-1.5 rounded-[8px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "12px", fontWeight: 600 }}>Save</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-[10px] hover:bg-muted transition-colors text-muted-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>{isEdit ? name || "Edit product" : "Add product"}</h1>
        </div>
        <div className="flex gap-2.5">
          <button onClick={onBack} className="px-4 py-2 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Discard</button>
          <button onClick={doSave} className="px-5 py-2 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors shadow-sm" style={{ fontSize: "13px", fontWeight: 600 }}>Save</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          {/* Title + Description */}
          <div className="bg-card rounded-[12px] border border-border shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Title</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Short sleeve t-shirt" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "14px" }} />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Description</label>
              <div className="border border-border rounded-t-[10px] bg-muted/30 px-2 py-1.5 flex items-center gap-1">
                {["B", "I", "U"].map(t => (<button key={t} className="w-7 h-7 rounded-[6px] hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: "13px", fontWeight: t === "B" ? 700 : 400, fontStyle: t === "I" ? "italic" : "normal", textDecoration: t === "U" ? "underline" : "none" }}>{t}</button>))}
              </div>
              <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product..." className="w-full px-3 py-2.5 rounded-b-[10px] border border-t-0 border-border bg-background resize-none focus:border-[#220E92] outline-none" style={{ fontSize: "14px" }} />
            </div>
          </div>

          {/* Category + Sub Category */}
          <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-4">Category</h3>
            <div ref={catRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Category</label>
                <button onClick={() => setCategoryOpen(!categoryOpen)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] border border-border bg-background text-left" style={{ fontSize: "14px" }}>
                  <span className={category ? "text-foreground" : "text-muted-foreground"}>{category || "Select category"}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                {categoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-[12px] border border-border shadow-lg z-20 py-2 max-h-48 overflow-y-auto">
                    {Object.keys(defaultCategories).map(c => (
                      <button key={c} onClick={() => { setCategory(c); setSubcategory(""); setCategoryOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center justify-between ${category === c ? "bg-[#220E92]/5 text-[#220E92]" : ""}`} style={{ fontSize: "13px" }}>{c}{category === c && <Check className="w-3.5 h-3.5" />}</button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Sub Category</label>
                <select value={subcategory} onChange={e => setSubcategory(e.target.value)} disabled={!category} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none disabled:opacity-50" style={{ fontSize: "14px" }}>
                  <option value="">Select sub category</option>
                  {(defaultCategories[category] || []).map(sc => (<option key={sc} value={sc}>{sc}</option>))}
                </select>
              </div>
            </div>
          </div>

          {/* Brand */}
          <BrandPicker brand={brand} setBrand={setBrand} />

          {/* Media */}
          <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-4">Upload Media</h3>
            <div className="border-2 border-dashed border-border rounded-[12px] p-8 text-center hover:border-[#220E92]/40 transition-colors cursor-pointer" onClick={() => { if (images.length < 10) setImages([...images, productImages[images.length % productImages.length]]); }}>
              <div className="flex items-center justify-center gap-4">
                <button className="px-4 py-2 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Upload new</button>
                <button className="px-4 py-2 rounded-[10px] border border-border hover:bg-muted text-muted-foreground transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Select existing</button>
              </div>
              <p className="text-muted-foreground mt-3" style={{ fontSize: "12px" }}>Accepts images, videos, or 3D models</p>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3 mt-4">
                {images.map((img, i) => (
                  <div key={`img-${i}`} className="relative group aspect-square rounded-[8px] overflow-hidden border border-border">
                    <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && <span className="absolute top-1 left-1 bg-[#220E92] text-white px-1.5 py-0.5 rounded" style={{ fontSize: "9px", fontWeight: 700 }}>COVER</span>}
                    <button onClick={e => { e.stopPropagation(); setImages(images.filter((_, idx) => idx !== i)); }} className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
            <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Status</label>
            <div ref={statusRef} className="relative">
              <button onClick={() => setStatusOpen(!statusOpen)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] border border-border bg-background text-left" style={{ fontSize: "14px" }}>
                <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{status}</span><ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {statusOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-[12px] border border-border shadow-lg z-20 py-2">
                  {(["active", "draft"] as const).map(s => (
                    <button key={s} onClick={() => { setStatus(s); setStatusOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center justify-between ${status === s ? "bg-[#220E92]/5 text-[#220E92]" : ""}`} style={{ fontSize: "13px", fontWeight: 500, textTransform: "capitalize" }}>{s}{status === s && <Check className="w-3.5 h-3.5" />}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Organization */}
          <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
            <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-4">Product Organization</h4>
            <div className="space-y-4">
              <div><label className="block text-muted-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Type</label><input type="text" value={productType} onChange={e => setProductType(e.target.value)} placeholder="e.g. Traditional Wear" className="w-full px-3 py-2 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "13px" }} /></div>
              <div><label className="block text-muted-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Vendor</label><input type="text" value={vendor} onChange={e => setVendor(e.target.value)} placeholder="e.g. FabIndia" className="w-full px-3 py-2 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "13px" }} /></div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Tags</label>
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tags..." className="w-full px-3 py-2 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "13px" }} />
                {tags.length > 0 && (<div className="flex flex-wrap gap-1.5 mt-2">{tags.map(t => (<span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-[#220E92]/8 text-[#220E92] rounded-full" style={{ fontSize: "11px", fontWeight: 500 }}>{t}<button onClick={() => removeTag(t)} className="hover:text-red-600"><X className="w-2.5 h-2.5" /></button></span>))}</div>)}
              </div>
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: 600 }} className="mb-2">Publishing</h4>
                <div className="space-y-2">{["Online Store", "Point of Sale"].map(ch => (<label key={ch} className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={channels.includes(ch)} onChange={() => toggleChannel(ch)} className="rounded accent-[#220E92]" /><span style={{ fontSize: "13px" }}>{ch}</span></label>))}</div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-4">Price</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Price</label>
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "14px" }}>&#8377;</span><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full pl-7 pr-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "14px" }} /></div>
                </div>
                {showCompareAt && (<div><label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Compare-at price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "14px" }}>&#8377;</span><input type="number" value={compareAt} onChange={e => setCompareAt(e.target.value)} placeholder="0.00" className="w-full pl-7 pr-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "14px" }} /></div></div>)}
              </div>
              {showCost && costPerItem && price && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Cost per item</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "14px" }}>&#8377;</span><input type="number" value={costPerItem} onChange={e => setCostPerItem(e.target.value)} className="w-full pl-7 pr-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "14px" }} /></div></div>
                  <div><label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Profit</label><div className="px-3 py-2.5 rounded-[10px] bg-muted/50" style={{ fontSize: "14px" }}>&#8377;{(Number(price) - Number(costPerItem)).toFixed(2)}</div></div>
                  <div><label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Margin</label><div className="px-3 py-2.5 rounded-[10px] bg-muted/50" style={{ fontSize: "14px" }}>{Number(price) > 0 ? (((Number(price) - Number(costPerItem)) / Number(price)) * 100).toFixed(1) : "0"}%</div></div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {!showCompareAt && <button onClick={() => setShowCompareAt(true)} className="px-3 py-1.5 rounded-full border border-border hover:bg-muted text-muted-foreground transition-colors" style={{ fontSize: "12px" }}>+ Compare-at price</button>}
                {!showCost && <button onClick={() => setShowCost(true)} className="px-3 py-1.5 rounded-full border border-border hover:bg-muted text-muted-foreground transition-colors" style={{ fontSize: "12px" }}>+ Cost per item</button>}
                <button onClick={() => setChargeTax(!chargeTax)} className={`px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${chargeTax ? "border-[#220E92]/30 bg-[#220E92]/5 text-[#220E92]" : "border-border text-muted-foreground hover:bg-muted"}`} style={{ fontSize: "12px" }}>
                  Charge tax <span className={`px-1.5 py-0.5 rounded ${chargeTax ? "bg-[#220E92]/10 text-[#220E92]" : "bg-muted text-muted-foreground"}`} style={{ fontSize: "10px", fontWeight: 600 }}>{chargeTax ? "Yes" : "No"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-4">Variants</h3>
            {!hasVariants ? (
              <button onClick={() => setHasVariants(true)} className="inline-flex items-center gap-2 text-[#220E92] hover:text-[#220E92]/80 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}><Plus className="w-4 h-4" /> Add options like size or color</button>
            ) : (
              <div className="space-y-5">
                {variantOptions.map((opt, optIdx) => {
                  const isColor = isColorOption(opt.name);
                  return (
                    <div key={opt.name} className="bg-muted/30 rounded-[10px] p-4">
                      <div className="flex items-center justify-between mb-3"><span style={{ fontSize: "14px", fontWeight: 600 }}>{opt.name}</span><button onClick={() => removeVariantOption(optIdx)} className="text-muted-foreground hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button></div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {opt.values.map((val, valIdx) => (
                            <span key={val} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-card border border-border rounded-[8px]" style={{ fontSize: "13px" }}>
                              {isColor && <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: val.toLowerCase() }} />}
                              {val}
                              <button onClick={() => removeValueFromOption(optIdx, valIdx)} className="text-muted-foreground hover:text-red-500"><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                          <ValInput onAdd={val => addValueToOption(optIdx, val)} placeholder={isColor ? "Add color..." : "Add size..."} />
                        </div>
                        {isColor && opt.values.length > 0 && (
                          <div className="pt-2 border-t border-border/60">
                            <p className="text-muted-foreground mb-2" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Color images</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {opt.values.map(colorVal => {
                                const img = colorImages[colorVal];
                                return (
                                  <div key={colorVal} className="space-y-1.5">
                                    {img ? (
                                      <div className="relative group w-full aspect-square rounded-[8px] overflow-hidden border border-border">
                                        <img src={img} alt={colorVal} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"><button onClick={() => removeColorImage(colorVal)} className="w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3.5 h-3.5" /></button></div>
                                      </div>
                                    ) : (
                                      <button onClick={() => uploadColorImage(colorVal)} className="w-full aspect-square rounded-[8px] border-2 border-dashed border-border bg-muted/20 hover:border-[#220E92]/40 hover:bg-[#220E92]/5 transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer"><Upload className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground" style={{ fontSize: "10px" }}>Upload</span></button>
                                    )}
                                    <p className="text-center truncate" style={{ fontSize: "11px", fontWeight: 500 }}>{colorVal}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2">
                  <input type="text" value={newOptionName} onChange={e => setNewOptionName(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addVariantOption())} placeholder="Add option (e.g., Material)" className="flex-1 max-w-xs px-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "13px" }} />
                  <button onClick={addVariantOption} className="px-3 py-2.5 rounded-[10px] border border-[#220E92] text-[#220E92] hover:bg-[#220E92]/5 transition-colors"><Plus className="w-4 h-4" /></button>
                </div>

                {/* Variant table with price, inventory, weight */}
                {variants.length > 0 && (() => {
                  const hasColorOpt = variantOptions.some(o => isColorOption(o.name));
                  return (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{variants.length} variant combinations</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5"><input type="number" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} placeholder="Bulk price" className="w-20 px-2 py-1.5 rounded-[8px] border border-border bg-background" style={{ fontSize: "12px" }} /><button onClick={applyBulkPrice} className="px-2.5 py-1.5 rounded-[8px] border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" style={{ fontSize: "12px" }}>Apply</button></div>
                          <div className="w-px h-5 bg-border" />
                          <div className="flex items-center gap-1.5"><input type="number" value={bulkStock} onChange={e => setBulkStock(e.target.value)} placeholder="Bulk qty" className="w-20 px-2 py-1.5 rounded-[8px] border border-border bg-background" style={{ fontSize: "12px" }} /><button onClick={applyBulkStock} className="px-2.5 py-1.5 rounded-[8px] border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" style={{ fontSize: "12px" }}>Apply</button></div>
                        </div>
                      </div>
                      <div className="overflow-x-auto rounded-[10px] border border-border">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/40">
                              {[...(hasColorOpt ? [""] : []), "Variant", "Price", "Available", "Committed", "In-Hand", "Weight (kg)", "Status", ""].map((h, i) => (
                                <th key={`vh-${i}`} className={`px-3 py-2.5 text-left text-muted-foreground whitespace-nowrap ${h === "" && i === 0 ? "w-12" : ""}`} style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((v, vIdx) => {
                              const colorOpt = variantOptions.find(o => isColorOption(o.name));
                              let resolvedImg = v.image;
                              if (!resolvedImg && colorOpt) { const cv = colorOpt.values.find(c => v.combination.startsWith(c + " / ") || v.combination === c); if (cv && colorImages[cv]) resolvedImg = colorImages[cv]; }
                              const inv = inventoryRows[vIdx] || { available: 10, committed: 0, inHand: 10 };
                              return (
                                <tr key={v.id} className={`border-t border-border/60 ${v.status === "disabled" ? "opacity-50" : ""}`}>
                                  {hasColorOpt && (
                                    <td className="px-3">
                                      {resolvedImg ? (<div className="w-9 h-9 rounded-[6px] overflow-hidden border border-border"><img src={resolvedImg} alt="" className="w-full h-full object-cover" /></div>) : (
                                        <button onClick={() => { if (colorOpt) { const cv = colorOpt.values.find(c => v.combination.startsWith(c + " / ") || v.combination === c); if (cv) uploadColorImage(cv); } }} className="w-9 h-9 rounded-[6px] border border-dashed border-border bg-muted/30 flex items-center justify-center cursor-pointer hover:border-[#220E92]/40 transition-colors"><ImageIcon className="w-3.5 h-3.5 text-muted-foreground" /></button>
                                      )}
                                    </td>
                                  )}
                                  <td className="px-3" style={{ fontSize: "13px", fontWeight: 500 }}>{v.combination}</td>
                                  <td className="px-3"><input type="number" value={v.price} onChange={e => updateVariant(vIdx, "price", e.target.value)} className="w-20 px-2 py-1.5 rounded-[8px] border border-border bg-background" style={{ fontSize: "12px" }} placeholder="0" /></td>
                                  <td className="px-3"><input type="number" value={inv.available} onChange={e => { const val = Number(e.target.value) || 0; setInventoryRows(prev => prev.map((r, i) => i === vIdx ? { ...r, available: val } : r)); }} className="w-16 px-2 py-1.5 rounded-[8px] border border-border bg-background" style={{ fontSize: "12px" }} /></td>
                                  <td className="px-3"><input type="number" value={inv.committed} onChange={e => { const val = Number(e.target.value) || 0; setInventoryRows(prev => prev.map((r, i) => i === vIdx ? { ...r, committed: val } : r)); }} className="w-16 px-2 py-1.5 rounded-[8px] border border-border bg-background" style={{ fontSize: "12px" }} /></td>
                                  <td className="px-3"><input type="number" value={inv.inHand} onChange={e => { const val = Number(e.target.value) || 0; setInventoryRows(prev => prev.map((r, i) => i === vIdx ? { ...r, inHand: val } : r)); }} className="w-16 px-2 py-1.5 rounded-[8px] border border-border bg-background" style={{ fontSize: "12px" }} /></td>
                                  <td className="px-3"><input type="number" value={variantWeights[v.id] || "0.5"} onChange={e => setVariantWeights(prev => ({ ...prev, [v.id]: e.target.value }))} className="w-16 px-2 py-1.5 rounded-[8px] border border-border bg-background" style={{ fontSize: "12px" }} step="0.1" /></td>
                                  <td className="px-3"><span className={`px-2 py-0.5 rounded-full ${v.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`} style={{ fontSize: "11px", fontWeight: 600 }}>{v.status === "active" ? "Active" : "Off"}</span></td>
                                  <td className="px-3"><button onClick={() => toggleVariantStatus(vIdx)} className={`p-1.5 rounded-[8px] transition-colors ${v.status === "active" ? "hover:bg-red-50 text-muted-foreground hover:text-red-500" : "hover:bg-emerald-50 text-muted-foreground hover:text-emerald-600"}`}>{v.status === "active" ? <Ban className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}</button></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* ═══ Clothing Specifications ═══ */}
          <ClothingSpecifications category={category} specifications={specifications} setSpecifications={setSpecifications} />

          {isEdit && onDelete && (
            <div className="border border-red-200 rounded-[12px] p-5">
              <button onClick={onDelete} className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}><Trash2 className="w-4 h-4" /> Delete this product</button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-5">
          <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
            <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-4">Summary</h4>
            <div className="space-y-3">
              {[
                { label: "Category", value: category && subcategory ? `${category} > ${subcategory}` : category || "-" },
                { label: "Brand", value: brand || "-" },
                { label: "Price", value: price ? `\u20B9${Number(price).toLocaleString("en-IN")}` : "-" },
                { label: "Variants", value: hasVariants ? `${variants.length} combinations` : "No variants" },
                { label: "Total Stock", value: String(totalStock) },
                { label: "Status", value: status },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{r.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500, textTransform: r.label === "Status" ? "capitalize" : "none" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          {trackInventory && (
            <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
              <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Inventory</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between"><span className="text-muted-foreground" style={{ fontSize: "12px" }}>Total Available</span><span style={{ fontSize: "14px", fontWeight: 600 }}>{inventoryRows.reduce((s, r) => s + r.available, 0)}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground" style={{ fontSize: "12px" }}>Total Committed</span><span style={{ fontSize: "14px", fontWeight: 600 }}>{inventoryRows.reduce((s, r) => s + r.committed, 0)}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground" style={{ fontSize: "12px" }}>Total In-Hand</span><span style={{ fontSize: "14px", fontWeight: 600 }}>{inventoryRows.reduce((s, r) => s + r.inHand, 0)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Brand Picker */
function BrandPicker({ brand, setBrand }: { brand: string; setBrand: (b: string) => void }) {
  const [brandSearch, setBrandSearch] = useState("");
  const [brands, setBrands] = useState<BrandItem[]>(predefinedBrandsList);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandImg, setNewBrandImg] = useState("");

  const filtered = brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()));

  const addNewBrand = () => {
    if (!newBrandName.trim()) return;
    const img = newBrandImg || productImages[Math.floor(Math.random() * productImages.length)];
    setBrands(prev => [...prev, { name: newBrandName.trim(), image: img }]);
    setBrand(newBrandName.trim());
    setNewBrandName(""); setNewBrandImg(""); setShowAddBrand(false);
  };

  return (
    <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontSize: "14px", fontWeight: 600 }}>Choose Brand</h3>
        <button onClick={() => setShowAddBrand(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[#220E92] text-[#220E92] hover:bg-[#220E92]/5 transition-colors" style={{ fontSize: "12px", fontWeight: 600 }}><Plus className="w-3.5 h-3.5" /> Add Brand</button>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={brandSearch} onChange={e => setBrandSearch(e.target.value)} placeholder="Search brands..." className="w-full pl-9 pr-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "13px" }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[280px] overflow-y-auto">
        {filtered.map(b => (
          <button key={b.name} onClick={() => setBrand(brand === b.name ? "" : b.name)} className={`rounded-[10px] border-2 p-2 transition-all text-left ${brand === b.name ? "border-[#220E92] bg-[#220E92]/5 shadow-sm" : "border-border hover:border-[#220E92]/30 hover:bg-muted/30"}`}>
            <div className="aspect-[4/3] rounded-[8px] overflow-hidden bg-muted mb-2"><img src={b.image} alt={b.name} className="w-full h-full object-cover" /></div>
            <div className="flex items-center gap-1.5">
              {brand === b.name && <div className="w-4 h-4 rounded-full bg-[#220E92] flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-white" /></div>}
              <span className="truncate" style={{ fontSize: "12px", fontWeight: brand === b.name ? 600 : 500, color: brand === b.name ? "#220E92" : undefined }}>{b.name}</span>
            </div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-6 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>No brands found</p>
          <button onClick={() => { setShowAddBrand(true); setNewBrandName(brandSearch); }} className="mt-2 text-[#220E92] hover:underline" style={{ fontSize: "13px", fontWeight: 500 }}>+ Add "{brandSearch}" as a new brand</button>
        </div>
      )}
      {brand && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Selected:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#220E92]/8 text-[#220E92] rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{brand}<button onClick={() => setBrand("")} className="hover:text-red-500"><X className="w-3 h-3" /></button></span>
        </div>
      )}
      {showAddBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAddBrand(false)}>
          <div className="bg-card rounded-[12px] border border-border shadow-xl w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 style={{ fontSize: "16px", fontWeight: 700 }}>Add New Brand</h3><button onClick={() => setShowAddBrand(false)} className="p-1.5 rounded-[8px] hover:bg-muted text-muted-foreground transition-colors"><X className="w-4 h-4" /></button></div>
            <div><label className="block text-muted-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Brand Name</label><input type="text" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} placeholder="Enter brand name" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "14px" }} autoFocus /></div>
            <div>
              <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Brand Image (optional)</label>
              <div
                onClick={() => { if (!newBrandImg) setNewBrandImg(productImages[Math.floor(Math.random() * productImages.length)]); }}
                className="w-full rounded-[10px] border-2 border-dashed border-border hover:border-[#220E92]/40 bg-muted/20 py-4 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                {newBrandImg ? (
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-10 rounded-[8px] overflow-hidden border border-border"><img src={newBrandImg} alt="Preview" className="w-full h-full object-cover" /></div>
                    <button onClick={e => { e.stopPropagation(); setNewBrandImg(""); }} className="text-red-500 hover:text-red-600 transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>Remove</button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Click to upload brand image</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddBrand(false)} className="px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Cancel</button>
              <button onClick={addNewBrand} disabled={!newBrandName.trim()} className="px-5 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontSize: "13px", fontWeight: 600 }}>Add Brand</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ValInput({ onAdd, placeholder }: { onAdd: (val: string) => void; placeholder?: string }) {
  const [val, setVal] = useState("");
  return <input type="text" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onAdd(val); setVal(""); } }} placeholder={placeholder || "Add value..."} className="w-28 px-2.5 py-1.5 rounded-[8px] border border-dashed border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "13px" }} />;
}

/* ─── Clothing Specification Options ─── */
const specDropdowns: Record<string, { label: string; options: string[] }> = {
  fabric: { label: "Fabric / Material", options: ["Cotton", "Silk", "Polyester", "Linen", "Chiffon", "Georgette", "Satin", "Velvet", "Crepe", "Net", "Organza", "Rayon", "Wool", "Denim", "Khadi", "Lycra Blend", "Cotton Blend", "Silk Blend", "Jacquard", "Brocade", "Tussar Silk", "Banarasi Silk", "Chanderi", "Muslin", "Terry Cotton"] },
  fit: { label: "Fit Type", options: ["Regular Fit", "Slim Fit", "Relaxed Fit", "Oversized", "Tailored Fit", "Comfort Fit", "Body Fit", "Semi-Fitted", "Straight Fit", "Flared"] },
  pattern: { label: "Pattern / Print", options: ["Solid", "Printed", "Striped", "Checked", "Embroidered", "Floral", "Paisley", "Abstract", "Geometric", "Polka Dot", "Animal Print", "Tie & Dye", "Block Print", "Batik", "Ikat", "Kalamkari", "Ajrakh", "Bandhani", "Leheriya", "Phulkari", "Woven Design", "Self Design", "Colorblock"] },
  sleeve: { label: "Sleeve Type", options: ["Full Sleeve", "Half Sleeve", "3/4 Sleeve", "Sleeveless", "Cap Sleeve", "Short Sleeve", "Flutter Sleeve", "Bell Sleeve", "Puff Sleeve", "Raglan Sleeve", "Roll-Up Sleeve", "Cold Shoulder", "Off Shoulder"] },
  neckline: { label: "Neckline / Collar", options: ["Round Neck", "V-Neck", "Mandarin / Chinese Collar", "Boat Neck", "Collared", "Square Neck", "Sweetheart", "Cowl Neck", "High Neck", "Keyhole", "Halter Neck", "Peter Pan Collar", "Notch Lapel", "Shawl Collar", "Band Collar", "Spread Collar", "Button-Down Collar", "U-Neck", "Scoop Neck"] },
  occasion: { label: "Occasion", options: ["Casual", "Party Wear", "Formal", "Wedding", "Festive", "Daily Wear", "Office Wear", "Lounge Wear", "Beach Wear", "Sports Wear", "Traditional", "Ethnic", "Semi-Formal", "Bridal", "Reception", "Engagement", "Sangeet", "Mehendi", "Haldi"] },
  length: { label: "Length", options: ["Crop", "Short", "Regular", "Knee Length", "Midi / Calf Length", "Ankle Length", "Floor Length", "Maxi", "Hip Length", "Thigh Length", "Above Knee"] },
  work: { label: "Work / Embellishment", options: ["Plain", "Embroidered", "Printed", "Sequined", "Zari Work", "Thread Work", "Mirror Work", "Stone Work", "Beadwork", "Lace", "Applique", "Gota Patti", "Resham Work", "Cutdana", "Patch Work", "Crochet", "Smocking", "Ruched", "Pleated", "Ruffled"] },
  closure: { label: "Closure", options: ["Zip", "Button", "Hook & Eye", "Drawstring", "Open Front", "Tie-Up", "Wrap", "Pullover", "Side Zip", "Back Zip", "Front Zip", "Elastic", "Snap Button", "Velcro", "Belt / Buckle"] },
  transparency: { label: "Transparency", options: ["Opaque", "Semi-Sheer", "Sheer"] },
  season: { label: "Season", options: ["All Season", "Summer", "Winter", "Monsoon", "Spring", "Autumn"] },
  care: { label: "Care Instructions", options: ["Machine Wash Cold", "Machine Wash Warm", "Hand Wash Only", "Dry Clean Only", "Do Not Bleach", "Tumble Dry Low", "Line Dry", "Iron Low Heat", "Iron Medium Heat", "Do Not Iron", "Wash Separately", "Gentle Cycle"] },
  origin: { label: "Country of Origin", options: ["India", "China", "Bangladesh", "Vietnam", "Indonesia", "Turkey", "Italy", "Sri Lanka", "Pakistan", "Thailand"] },
  washCare: { label: "Wash Care", options: ["Machine Washable", "Hand Wash Recommended", "Dry Clean Recommended", "Spot Clean Only"] },
  lining: { label: "Lining", options: ["Fully Lined", "Semi-Lined", "Unlined", "Attached Lining", "Detachable Lining"] },
};

const womenSpecificSpecs: Record<string, { label: string; options: string[] }> = {
  dupatta: { label: "Dupatta", options: ["Included", "Not Included", "Optional Add-on"] },
  dupattaFabric: { label: "Dupatta Fabric", options: ["Chiffon", "Net", "Silk", "Cotton", "Georgette", "Organza", "Satin", "Banarasi", "Chanderi", "Nazneen"] },
  blouse: { label: "Blouse (Saree)", options: ["Included - Unstitched", "Included - Stitched", "Not Included", "Running Blouse Fabric"] },
  border: { label: "Border Type", options: ["Woven", "Printed", "Embroidered", "Lace", "Zari", "Temple Border", "Contrast", "Self", "Tasseled"] },
  sareeLength: { label: "Saree Length", options: ["5.5 meters", "6.0 meters", "6.3 meters", "6.5 meters", "8.0 meters (Nauvari)", "9.0 meters (Madisar)"] },
  bottomStyle: { label: "Bottom Style", options: ["Palazzo", "Churidar", "Patiala", "Straight Pants", "Sharara", "Gharara", "Dhoti Pants", "Legging", "Skirt", "Flared Pants"] },
  bottomIncluded: { label: "Bottom Included", options: ["Yes", "No", "Sold Separately"] },
};

const menSpecificSpecs: Record<string, { label: string; options: string[] }> = {
  collarType: { label: "Collar Type", options: ["Spread Collar", "Mandarin Collar", "Band Collar", "Button-Down", "Cutaway", "Club Collar", "Point Collar", "Wing Collar", "Nehru Collar"] },
  hem: { label: "Hem Type", options: ["Straight", "Curved", "Asymmetric", "Rounded", "Split Hem"] },
  rise: { label: "Rise (Bottom)", options: ["Low Rise", "Mid Rise", "High Rise"] },
  pocketStyle: { label: "Pocket Style", options: ["Patch Pocket", "Welt Pocket", "Chest Pocket", "Side Pocket", "Back Pocket", "Cargo Pocket", "No Pocket", "Hidden Pocket"] },
  kurtalength: { label: "Kurta Length", options: ["Short (Above Knee)", "Regular (Knee Length)", "Long (Below Knee)", "Extra Long (Calf Length)"] },
  pajama: { label: "Pajama / Bottom Style", options: ["Churidar", "Straight Pajama", "Salwar", "Dhoti", "Aligarh Pajama", "Patiala", "Trousers"] },
};

const womenCategories = ["Sarees", "Lehengas", "Kurtis", "Dresses", "Bottomwear", "Dupattas"];
const menCategories = ["Men's Wear", "Kurta Sets"];

function ClothingSpecifications({ category, specifications, setSpecifications }: { category: string; specifications: Record<string, string>; setSpecifications: (specs: Record<string, string>) => void }) {
  const [customKey, setCustomKey] = useState("");
  const [customValue, setCustomValue] = useState("");

  const isWomen = womenCategories.includes(category);
  const isMen = menCategories.includes(category);

  const allSpecs = {
    ...specDropdowns,
    ...(isWomen ? womenSpecificSpecs : {}),
    ...(isMen ? menSpecificSpecs : {}),
  };

  const updateSpec = (key: string, value: string) => {
    setSpecifications({ ...specifications, [key]: value });
  };

  const removeSpec = (key: string) => {
    const n = { ...specifications };
    delete n[key];
    setSpecifications(n);
  };

  const addCustomSpec = () => {
    if (!customKey.trim() || !customValue.trim()) return;
    setSpecifications({ ...specifications, [customKey.trim()]: customValue.trim() });
    setCustomKey("");
    setCustomValue("");
  };

  const inputCls = "w-full px-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none";
  const filledCount = Object.keys(specifications).length;

  return (
    <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 style={{ fontSize: "14px", fontWeight: 600 }}>Clothing Specifications</h3>
        {filledCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-[#220E92]/8 text-[#220E92]" style={{ fontSize: "11px", fontWeight: 600 }}>{filledCount} filled</span>
        )}
      </div>
      <p className="text-muted-foreground mb-4" style={{ fontSize: "12px" }}>
        {category ? `Showing specs for ${category}${isWomen ? " (Women)" : isMen ? " (Men)" : ""}` : "Select a category to see relevant specifications"}
      </p>

      {/* Common Specs */}
      <div className="space-y-5">
        {/* Basic Specs Group */}
        <div>
          <p className="text-muted-foreground mb-3" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>General</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(specDropdowns).map(([key, spec]) => (
              <div key={key}>
                <label className="block text-muted-foreground mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>{spec.label}</label>
                <select
                  value={specifications[key] || ""}
                  onChange={e => e.target.value ? updateSpec(key, e.target.value) : removeSpec(key)}
                  className={inputCls}
                  style={{ fontSize: "13px" }}
                >
                  <option value="">Select {spec.label.toLowerCase()}</option>
                  {spec.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Women-specific */}
        {isWomen && (
          <div>
            <p className="text-muted-foreground mb-3" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Women&apos;s Specific</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(womenSpecificSpecs).map(([key, spec]) => (
                <div key={key}>
                  <label className="block text-muted-foreground mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>{spec.label}</label>
                  <select
                    value={specifications[key] || ""}
                    onChange={e => e.target.value ? updateSpec(key, e.target.value) : removeSpec(key)}
                    className={inputCls}
                    style={{ fontSize: "13px" }}
                  >
                    <option value="">Select {spec.label.toLowerCase()}</option>
                    {spec.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Men-specific */}
        {isMen && (
          <div>
            <p className="text-muted-foreground mb-3" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Men&apos;s Specific</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(menSpecificSpecs).map(([key, spec]) => (
                <div key={key}>
                  <label className="block text-muted-foreground mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>{spec.label}</label>
                  <select
                    value={specifications[key] || ""}
                    onChange={e => e.target.value ? updateSpec(key, e.target.value) : removeSpec(key)}
                    className={inputCls}
                    style={{ fontSize: "13px" }}
                  >
                    <option value="">Select {spec.label.toLowerCase()}</option>
                    {spec.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom spec */}
        <div className="border-t border-border pt-4">
          <p className="text-muted-foreground mb-3" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Add Custom Specification</p>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-muted-foreground mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>Name</label>
              <input type="text" value={customKey} onChange={e => setCustomKey(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomSpec())} placeholder="e.g. GSM" className={inputCls} style={{ fontSize: "13px" }} />
            </div>
            <div className="flex-1">
              <label className="block text-muted-foreground mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>Value</label>
              <input type="text" value={customValue} onChange={e => setCustomValue(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomSpec())} placeholder="e.g. 180" className={inputCls} style={{ fontSize: "13px" }} />
            </div>
            <button onClick={addCustomSpec} disabled={!customKey.trim() || !customValue.trim()} className="px-3 py-2.5 rounded-[10px] border border-[#220E92] text-[#220E92] hover:bg-[#220E92]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filled specs summary */}
        {filledCount > 0 && (
          <div className="border-t border-border pt-4">
            <p className="text-muted-foreground mb-2" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Filled Specifications ({filledCount})</p>
            <div className="space-y-1.5">
              {Object.entries(specifications).map(([key, value]) => {
                const specLabel = allSpecs[key]?.label || key;
                return (
                  <div key={key} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{specLabel}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "12px", fontWeight: 500 }}>{value}</span>
                      <button onClick={() => removeSpec(key)} className="text-muted-foreground hover:text-red-500 transition-colors p-0.5"><X className="w-3 h-3" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}