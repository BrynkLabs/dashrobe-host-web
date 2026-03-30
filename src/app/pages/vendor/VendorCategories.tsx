import { useState, useRef } from "react";
import {
  Plus, Search, SquarePen, Trash2, X, Check,
  GripVertical, FolderTree, TriangleAlert,
  ToggleLeft, ToggleRight, Tags, Filter, ChevronDown,
  ImageIcon, Upload,
} from "lucide-react";
import { Pagination, usePagination } from "../../components/Pagination";

// ─── Types ───────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  subcategoryCount: number;
  active: boolean;
  createdAt: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  productCount: number;
  active: boolean;
  createdAt: string;
}

// ─── Category images ─────────────────────────────────────────
const categoryImages: Record<string, string> = {
  "cat-1": "https://images.unsplash.com/photo-1616756351484-798f37bdffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBzaWxrJTIwc2FyZWUlMjBmYWJyaWN8ZW58MXx8fHwxNzczNTAzNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "cat-2": "https://images.unsplash.com/photo-1768807478287-9e7953cfdca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBrdXJ0YSUyMGV0aG5pYyUyMHdlYXJ8ZW58MXx8fHwxNzczNTAzNTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "cat-3": "https://images.unsplash.com/photo-1724856604254-f7cf4e9c8f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBicmlkYWwlMjBsZWhlbmdhfGVufDF8fHx8MTc3MzUwMzUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "cat-4": "https://images.unsplash.com/photo-1769063382706-8156b3b33eac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBrdXJ0aSUyMHdvbWVuJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzM1MDM1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "cat-5": "https://images.unsplash.com/photo-1765229276796-c93c73cc3f3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBkcmVzcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzczNDE1MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "cat-6": "https://images.unsplash.com/photo-1767785829486-a48a5b7b9c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxhenpvJTIwcGFudHMlMjB3b21lbiUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MzUwMzUzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "cat-7": "https://images.unsplash.com/photo-1762780700690-3fbb53fcd4e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdXBhdHRhJTIwSW5kaWFuJTIwZmFicmljJTIwdGV4dGlsZXxlbnwxfHx8fDE3NzM1MDM1MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "cat-8": "https://images.unsplash.com/photo-1769116416641-e714b71851e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBqZXdlbHJ5fGVufDF8fHx8MTc3MzQ2NDQ2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "cat-9": "https://images.unsplash.com/photo-1756376748107-12c98ec6b969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBtZW4lMjBldGhuaWMlMjBzaGVyd2FuaXxlbnwxfHx8fDE3NzM1MDM1MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

// ─── Mock Data ───────────────────────────────────────────────
const initialCategories: Category[] = [
  { id: "cat-1", name: "Sarees", slug: "sarees", description: "Traditional and modern sarees for all occasions", image: categoryImages["cat-1"], productCount: 342, subcategoryCount: 6, active: true, createdAt: "2025-01-15" },
  { id: "cat-2", name: "Kurta Sets", slug: "kurta-sets", description: "Complete kurta sets for men and women", image: categoryImages["cat-2"], productCount: 218, subcategoryCount: 4, active: true, createdAt: "2025-01-15" },
  { id: "cat-3", name: "Lehengas", slug: "lehengas", description: "Bridal and party wear lehengas", image: categoryImages["cat-3"], productCount: 156, subcategoryCount: 4, active: true, createdAt: "2025-02-01" },
  { id: "cat-4", name: "Kurtis", slug: "kurtis", description: "Stylish kurtis for every occasion", image: categoryImages["cat-4"], productCount: 289, subcategoryCount: 4, active: true, createdAt: "2025-02-10" },
  { id: "cat-5", name: "Dresses", slug: "dresses", description: "Western and fusion dresses", image: categoryImages["cat-5"], productCount: 194, subcategoryCount: 4, active: true, createdAt: "2025-02-20" },
  { id: "cat-6", name: "Bottomwear", slug: "bottomwear", description: "Palazzos, pants, skirts and more", image: categoryImages["cat-6"], productCount: 167, subcategoryCount: 4, active: true, createdAt: "2025-03-01" },
  { id: "cat-7", name: "Dupattas", slug: "dupattas", description: "Dupatta collection in various fabrics", image: categoryImages["cat-7"], productCount: 98, subcategoryCount: 4, active: false, createdAt: "2025-03-10" },
  { id: "cat-8", name: "Accessories", slug: "accessories", description: "Jewelry, bags, footwear and fashion accessories", image: categoryImages["cat-8"], productCount: 124, subcategoryCount: 5, active: true, createdAt: "2025-03-15" },
  { id: "cat-9", name: "Men's Wear", slug: "mens-wear", description: "Ethnic and casual wear for men", image: categoryImages["cat-9"], productCount: 176, subcategoryCount: 3, active: true, createdAt: "2025-04-01" },
];

const initialSubcategories: SubCategory[] = [
  { id: "sc-1", name: "Banarasi", slug: "banarasi", categoryId: "cat-1", categoryName: "Sarees", productCount: 78, active: true, createdAt: "2025-01-15" },
  { id: "sc-2", name: "Silk", slug: "silk", categoryId: "cat-1", categoryName: "Sarees", productCount: 65, active: true, createdAt: "2025-01-15" },
  { id: "sc-3", name: "Cotton", slug: "cotton", categoryId: "cat-1", categoryName: "Sarees", productCount: 54, active: true, createdAt: "2025-01-16" },
  { id: "sc-4", name: "Chiffon", slug: "chiffon", categoryId: "cat-1", categoryName: "Sarees", productCount: 42, active: true, createdAt: "2025-01-16" },
  { id: "sc-5", name: "Georgette", slug: "georgette", categoryId: "cat-1", categoryName: "Sarees", productCount: 38, active: true, createdAt: "2025-01-17" },
  { id: "sc-6", name: "Printed", slug: "printed", categoryId: "cat-1", categoryName: "Sarees", productCount: 65, active: false, createdAt: "2025-01-17" },
  { id: "sc-7", name: "Men's Kurta", slug: "mens-kurta", categoryId: "cat-2", categoryName: "Kurta Sets", productCount: 62, active: true, createdAt: "2025-01-18" },
  { id: "sc-8", name: "Women's Kurta", slug: "womens-kurta", categoryId: "cat-2", categoryName: "Kurta Sets", productCount: 58, active: true, createdAt: "2025-01-18" },
  { id: "sc-9", name: "Kurta Pajama", slug: "kurta-pajama", categoryId: "cat-2", categoryName: "Kurta Sets", productCount: 48, active: true, createdAt: "2025-01-19" },
  { id: "sc-10", name: "Kurta Palazzo", slug: "kurta-palazzo", categoryId: "cat-2", categoryName: "Kurta Sets", productCount: 50, active: true, createdAt: "2025-01-19" },
  { id: "sc-11", name: "Bridal", slug: "bridal", categoryId: "cat-3", categoryName: "Lehengas", productCount: 45, active: true, createdAt: "2025-02-01" },
  { id: "sc-12", name: "Party Wear", slug: "party-wear", categoryId: "cat-3", categoryName: "Lehengas", productCount: 52, active: true, createdAt: "2025-02-01" },
  { id: "sc-13", name: "Casual", slug: "casual", categoryId: "cat-3", categoryName: "Lehengas", productCount: 32, active: true, createdAt: "2025-02-02" },
  { id: "sc-14", name: "Designer", slug: "designer", categoryId: "cat-3", categoryName: "Lehengas", productCount: 27, active: true, createdAt: "2025-02-02" },
  { id: "sc-15", name: "A-Line", slug: "a-line", categoryId: "cat-4", categoryName: "Kurtis", productCount: 72, active: true, createdAt: "2025-02-10" },
  { id: "sc-16", name: "Straight", slug: "straight", categoryId: "cat-4", categoryName: "Kurtis", productCount: 68, active: true, createdAt: "2025-02-10" },
  { id: "sc-17", name: "Anarkali", slug: "anarkali", categoryId: "cat-4", categoryName: "Kurtis", productCount: 85, active: true, createdAt: "2025-02-11" },
  { id: "sc-18", name: "Kaftan", slug: "kaftan", categoryId: "cat-4", categoryName: "Kurtis", productCount: 64, active: true, createdAt: "2025-02-11" },
  { id: "sc-19", name: "Maxi", slug: "maxi", categoryId: "cat-5", categoryName: "Dresses", productCount: 56, active: true, createdAt: "2025-02-20" },
  { id: "sc-20", name: "Midi", slug: "midi", categoryId: "cat-5", categoryName: "Dresses", productCount: 48, active: true, createdAt: "2025-02-20" },
  { id: "sc-21", name: "Mini", slug: "mini", categoryId: "cat-5", categoryName: "Dresses", productCount: 42, active: true, createdAt: "2025-02-21" },
  { id: "sc-22", name: "Gown", slug: "gown", categoryId: "cat-5", categoryName: "Dresses", productCount: 48, active: true, createdAt: "2025-02-21" },
  { id: "sc-23", name: "Palazzo", slug: "palazzo", categoryId: "cat-6", categoryName: "Bottomwear", productCount: 45, active: true, createdAt: "2025-03-01" },
  { id: "sc-24", name: "Pants", slug: "pants", categoryId: "cat-6", categoryName: "Bottomwear", productCount: 38, active: true, createdAt: "2025-03-01" },
  { id: "sc-25", name: "Skirts", slug: "skirts", categoryId: "cat-6", categoryName: "Bottomwear", productCount: 42, active: true, createdAt: "2025-03-02" },
  { id: "sc-26", name: "Churidar", slug: "churidar", categoryId: "cat-6", categoryName: "Bottomwear", productCount: 42, active: true, createdAt: "2025-03-02" },
];

let idCounter = 200;
const genId = (prefix: string) => `${prefix}-${++idCounter}`;
const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ITEMS_PER_PAGE = 6;

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════
export function VendorCategories() {
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">("categories");

  // ── Category state ──
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [catSearch, setCatSearch] = useState("");
  const [catFilterStatus, setCatFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catDeleteId, setCatDeleteId] = useState<string | null>(null);
  const [catFormName, setCatFormName] = useState("");
  const [catFormDesc, setCatFormDesc] = useState("");
  const [catFormActive, setCatFormActive] = useState(true);
  const [catFormImage, setCatFormImage] = useState<string>("");
  const [catPage, setCatPage] = useState(1);

  // ── Subcategory state ──
  const [subcategories, setSubcategories] = useState<SubCategory[]>(initialSubcategories);
  const [scSearch, setScSearch] = useState("");
  const [scFilterStatus, setScFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [scFilterCategory, setScFilterCategory] = useState<string>("all");
  const [scCatDropdownOpen, setScCatDropdownOpen] = useState(false);
  const [showScModal, setShowScModal] = useState(false);
  const [editingSc, setEditingSc] = useState<SubCategory | null>(null);
  const [scDeleteId, setScDeleteId] = useState<string | null>(null);
  const [scFormName, setScFormName] = useState("");
  const [scFormCategoryId, setScFormCategoryId] = useState("");
  const [scFormActive, setScFormActive] = useState(true);
  const [scFormCatDropdownOpen, setScFormCatDropdownOpen] = useState(false);
  const [scPage, setScPage] = useState(1);

  const catImageRef = useRef<HTMLInputElement>(null);

  // ── Stats ──
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.active).length;
  const totalSubcategories = subcategories.length;
  const activeSubcategories = subcategories.filter(s => s.active).length;
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  // ── Category CRUD ──
  const filteredCats = categories.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(catSearch.toLowerCase()) || c.description.toLowerCase().includes(catSearch.toLowerCase());
    const matchStatus = catFilterStatus === "all" || (catFilterStatus === "active" ? c.active : !c.active);
    return matchSearch && matchStatus;
  });

  const { paginated: paginatedCats, totalPages: catTotalPages, safePage: safeCatPage } = usePagination(filteredCats, ITEMS_PER_PAGE, catPage);

  const openAddCat = () => { setEditingCat(null); setCatFormName(""); setCatFormDesc(""); setCatFormActive(true); setCatFormImage(""); setShowCatModal(true); };
  const openEditCat = (cat: Category) => { setEditingCat(cat); setCatFormName(cat.name); setCatFormDesc(cat.description); setCatFormActive(cat.active); setCatFormImage(cat.image); setShowCatModal(true); };
  const saveCat = () => {
    if (!catFormName.trim()) return;
    if (editingCat) {
      setCategories(prev => prev.map(c => c.id === editingCat.id ? { ...c, name: catFormName.trim(), slug: toSlug(catFormName.trim()), description: catFormDesc.trim(), active: catFormActive, image: catFormImage } : c));
    } else {
      setCategories(prev => [...prev, { id: genId("cat"), name: catFormName.trim(), slug: toSlug(catFormName.trim()), description: catFormDesc.trim(), image: catFormImage, productCount: 0, subcategoryCount: 0, active: catFormActive, createdAt: new Date().toISOString().split("T")[0] }]);
    }
    setShowCatModal(false);
  };
  const toggleCat = (id: string) => setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  const deleteCat = (id: string) => { setCategories(prev => prev.filter(c => c.id !== id)); setCatDeleteId(null); };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCatFormImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ── Subcategory CRUD ──
  const filteredScs = subcategories.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(scSearch.toLowerCase()) || s.categoryName.toLowerCase().includes(scSearch.toLowerCase());
    const matchStatus = scFilterStatus === "all" || (scFilterStatus === "active" ? s.active : !s.active);
    const matchCat = scFilterCategory === "all" || s.categoryId === scFilterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const { paginated: paginatedScs, totalPages: scTotalPages, safePage: safeScPage } = usePagination(filteredScs, ITEMS_PER_PAGE, scPage);

  const openAddSc = () => { setEditingSc(null); setScFormName(""); setScFormCategoryId(""); setScFormActive(true); setShowScModal(true); };
  const openEditSc = (sc: SubCategory) => { setEditingSc(sc); setScFormName(sc.name); setScFormCategoryId(sc.categoryId); setScFormActive(sc.active); setShowScModal(true); };
  const saveSc = () => {
    if (!scFormName.trim() || !scFormCategoryId) return;
    const parentName = categories.find(c => c.id === scFormCategoryId)?.name || "";
    if (editingSc) {
      setSubcategories(prev => prev.map(s => s.id === editingSc.id ? { ...s, name: scFormName.trim(), slug: toSlug(scFormName.trim()), categoryId: scFormCategoryId, categoryName: parentName, active: scFormActive } : s));
    } else {
      setSubcategories(prev => [...prev, { id: genId("sc"), name: scFormName.trim(), slug: toSlug(scFormName.trim()), categoryId: scFormCategoryId, categoryName: parentName, productCount: 0, active: scFormActive, createdAt: new Date().toISOString().split("T")[0] }]);
    }
    setShowScModal(false);
  };
  const toggleSc = (id: string) => setSubcategories(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const deleteSc = (id: string) => { setSubcategories(prev => prev.filter(s => s.id !== id)); setScDeleteId(null); };

  const selectedFilterCatName = scFilterCategory === "all" ? "All Categories" : categories.find(c => c.id === scFilterCategory)?.name || "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Categories</h1>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
            Manage your product categories and subcategories
          </p>
        </div>
        <button
          onClick={activeTab === "categories" ? openAddCat : openAddSc}
          className="inline-flex items-center gap-2 text-white px-4 py-2.5 rounded-[10px] transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ fontSize: "14px", fontWeight: 500, background: "linear-gradient(135deg, #220E92, #4318ca)", boxShadow: "0 4px 20px rgba(34,14,146,0.35)" }}
        >
          <Plus className="w-4 h-4" />
          {activeTab === "categories" ? "Add Category" : "Add Subcategory"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Categories", value: totalCategories, icon: FolderTree, color: "#220E92" },
          { label: "Active Categories", value: activeCategories, icon: Check, color: "#10b981" },
          { label: "Subcategories", value: totalSubcategories, icon: Tags, color: "#3B82F6" },
          { label: "Active Subs", value: activeSubcategories, icon: Check, color: "#8B5CF6" },
          { label: "Products", value: totalProducts.toLocaleString(), icon: FolderTree, color: "#FFC100" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{stat.label}</span>
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p style={{ fontSize: "24px", fontWeight: 700 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-muted rounded-[12px] p-1.5 w-fit">
        <button
          onClick={() => setActiveTab("categories")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-[10px] transition-all ${
            activeTab === "categories"
              ? "bg-[#220E92] text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-card"
          }`}
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          <FolderTree className="w-4 h-4" />
          Categories
          <span
            className={`px-1.5 py-0.5 rounded-md ${
              activeTab === "categories" ? "bg-white/20 text-white" : "bg-border text-muted-foreground"
            }`}
            style={{ fontSize: "11px", fontWeight: 700 }}
          >
            {totalCategories}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("subcategories")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-[10px] transition-all ${
            activeTab === "subcategories"
              ? "bg-[#220E92] text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-card"
          }`}
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          <Tags className="w-4 h-4" />
          Subcategories
          <span
            className={`px-1.5 py-0.5 rounded-md ${
              activeTab === "subcategories" ? "bg-white/20 text-white" : "bg-border text-muted-foreground"
            }`}
            style={{ fontSize: "11px", fontWeight: 700 }}
          >
            {totalSubcategories}
          </span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CATEGORIES TAB                                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "categories" && (
        <>
          {/* Search + Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search categories..."
                value={catSearch}
                onChange={(e) => { setCatSearch(e.target.value); setCatPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-border bg-card focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92] transition-all"
                style={{ fontSize: "14px" }}
              />
            </div>
            <div className="flex bg-muted rounded-[10px] p-1">
              {(["all", "active", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => { setCatFilterStatus(status); setCatPage(1); }}
                  className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                    catFilterStatus === status ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Category Table */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {["", "Category", "Slug", "Subcategories", "Products", "Status", "Created", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedCats.map((cat) => (
                    <tr key={cat.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 w-10">
                        <button className="text-muted-foreground/40 cursor-grab hover:text-muted-foreground transition-colors">
                          <GripVertical className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-10 h-10 rounded-[10px] object-cover shrink-0 border border-border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: cat.active ? "#220E9212" : "#71718212" }}>
                              <FolderTree className="w-4 h-4" style={{ color: cat.active ? "#220E92" : "#717182" }} />
                            </div>
                          )}
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 600 }}>{cat.name}</p>
                            <p className="text-muted-foreground truncate max-w-[200px]" style={{ fontSize: "12px" }}>{cat.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground font-mono" style={{ fontSize: "12px" }}>/{cat.slug}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-[#220E92]/8 text-[#220E92] px-2 py-0.5 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{cat.subcategoryCount}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-[#FFC100]/15 text-[#220E92] px-2 py-0.5 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{cat.productCount}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleCat(cat.id)}>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cat.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`} style={{ fontSize: "12px", fontWeight: 600 }}>
                            {cat.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                            {cat.active ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{cat.createdAt}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditCat(cat)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                            <SquarePen className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setCatDeleteId(cat.id)} className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCats.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <FolderTree className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p style={{ fontSize: "15px", fontWeight: 600 }}>No categories found</p>
                        <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
                          {catSearch ? "Try adjusting your search or filters" : "Get started by adding your first category"}
                        </p>
                        {!catSearch && (
                          <button onClick={openAddCat} className="inline-flex items-center gap-2 text-white px-4 py-2.5 rounded-[10px] transition-colors shadow-sm mt-4" style={{ fontSize: "14px", fontWeight: 500, background: "linear-gradient(135deg, #220E92, #4318ca)" }}>
                            <Plus className="w-4 h-4" /> Add Category
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredCats.length > 0 && (
              <Pagination
                currentPage={safeCatPage}
                totalPages={catTotalPages}
                totalItems={filteredCats.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCatPage}
                itemLabel="categories"
              />
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SUBCATEGORIES TAB                                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "subcategories" && (
        <>
          {/* Search + Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search subcategories..."
                value={scSearch}
                onChange={(e) => { setScSearch(e.target.value); setScPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-border bg-card focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92] transition-all"
                style={{ fontSize: "14px" }}
              />
            </div>
            {/* Category Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setScCatDropdownOpen(!scCatDropdownOpen)}
                className="inline-flex items-center gap-2 px-3 py-2.5 rounded-[10px] border border-border bg-card hover:bg-muted transition-colors"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                {selectedFilterCatName}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {scCatDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 bg-card rounded-[12px] border border-border shadow-lg z-20 p-2 min-w-[200px]">
                  <button
                    onClick={() => { setScFilterCategory("all"); setScCatDropdownOpen(false); setScPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between ${scFilterCategory === "all" ? "bg-[#220E92]/5 text-[#220E92]" : ""}`}
                    style={{ fontSize: "13px" }}
                  >
                    All Categories
                    {scFilterCategory === "all" && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setScFilterCategory(c.id); setScCatDropdownOpen(false); setScPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between ${scFilterCategory === c.id ? "bg-[#220E92]/5 text-[#220E92]" : ""}`}
                      style={{ fontSize: "13px" }}
                    >
                      {c.name}
                      {scFilterCategory === c.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Status Filter */}
            <div className="flex bg-muted rounded-[10px] p-1">
              {(["all", "active", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => { setScFilterStatus(status); setScPage(1); }}
                  className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                    scFilterStatus === status ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Table */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {["", "Subcategory", "Parent Category", "Slug", "Products", "Status", "Created", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedScs.map((sc) => (
                    <tr key={sc.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 w-10">
                        <button className="text-muted-foreground/40 cursor-grab hover:text-muted-foreground transition-colors">
                          <GripVertical className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: sc.active ? "#3B82F612" : "#71718212" }}>
                            <Tags className="w-4 h-4" style={{ color: sc.active ? "#3B82F6" : "#717182" }} />
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: 600 }}>{sc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 bg-[#220E92]/6 text-[#220E92] px-2.5 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>
                          <FolderTree className="w-3 h-3" />
                          {sc.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground font-mono" style={{ fontSize: "12px" }}>
                          /{sc.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/{sc.slug}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-[#FFC100]/15 text-[#220E92] px-2 py-0.5 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{sc.productCount}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleSc(sc.id)}>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`} style={{ fontSize: "12px", fontWeight: 600 }}>
                            {sc.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                            {sc.active ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{sc.createdAt}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditSc(sc)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                            <SquarePen className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setScDeleteId(sc.id)} className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredScs.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <Tags className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p style={{ fontSize: "15px", fontWeight: 600 }}>No subcategories found</p>
                        <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
                          {scSearch || scFilterCategory !== "all" ? "Try adjusting your search or filters" : "Get started by adding your first subcategory"}
                        </p>
                        {!scSearch && scFilterCategory === "all" && (
                          <button onClick={openAddSc} className="inline-flex items-center gap-2 text-white px-4 py-2.5 rounded-[10px] transition-colors shadow-sm mt-4" style={{ fontSize: "14px", fontWeight: 500, background: "linear-gradient(135deg, #220E92, #4318ca)" }}>
                            <Plus className="w-4 h-4" /> Add Subcategory
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredScs.length > 0 && (
              <Pagination
                currentPage={safeScPage}
                totalPages={scTotalPages}
                totalItems={filteredScs.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setScPage}
                itemLabel="subcategories"
              />
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CATEGORY MODAL                                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCatModal(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>{editingCat ? "Edit Category" : "Add New Category"}</h3>
              <button onClick={() => setShowCatModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Category Image</label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => catImageRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-[#220E92]/40 bg-muted/30 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group"
                  >
                    {catFormImage ? (
                      <img src={catFormImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-muted-foreground/50 group-hover:text-[#220E92] transition-colors" />
                        <span className="text-muted-foreground/50 mt-1 group-hover:text-[#220E92] transition-colors" style={{ fontSize: "9px", fontWeight: 500 }}>Upload</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={catImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="flex-1">
                    <button
                      onClick={() => catImageRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      {catFormImage ? "Change Image" : "Upload Image"}
                    </button>
                    {catFormImage && (
                      <button
                        onClick={() => setCatFormImage("")}
                        className="ml-2 text-red-500 hover:text-red-600 transition-colors"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        Remove
                      </button>
                    )}
                    <p className="text-muted-foreground mt-1" style={{ fontSize: "10px" }}>PNG, JPG or WEBP. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Category Name *</label>
                <input type="text" value={catFormName} onChange={(e) => setCatFormName(e.target.value)} placeholder="e.g., Sarees" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92] transition-all" style={{ fontSize: "14px" }} autoFocus />
                {catFormName.trim() && <p className="text-muted-foreground mt-1" style={{ fontSize: "12px" }}>Slug: /{toSlug(catFormName)}</p>}
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Description</label>
                <textarea value={catFormDesc} onChange={(e) => setCatFormDesc(e.target.value)} placeholder="Brief description of this category" rows={3} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92] transition-all" style={{ fontSize: "14px" }} />
              </div>
              <div className="flex items-center justify-between bg-muted/30 px-4 py-3 rounded-[10px]">
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>Active Status</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Visible on the marketplace</p>
                </div>
                <button onClick={() => setCatFormActive(!catFormActive)} className={`w-10 h-6 rounded-full transition-colors ${catFormActive ? "bg-[#220E92]" : "bg-gray-300"} relative`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${catFormActive ? "left-5" : "left-1"}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCatModal(false)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
                <button
                  onClick={saveCat}
                  disabled={!catFormName.trim()}
                  className="flex-1 px-4 py-2.5 rounded-[10px] text-white transition-all disabled:opacity-50"
                  style={{ fontSize: "14px", fontWeight: 500, background: "linear-gradient(135deg, #220E92, #4318ca)", boxShadow: "0 4px 20px rgba(34,14,146,0.35)" }}
                >
                  {editingCat ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SUBCATEGORY MODAL                                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showScModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowScModal(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>{editingSc ? "Edit Subcategory" : "Add New Subcategory"}</h3>
              <button onClick={() => setShowScModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Parent Category *</label>
                <div className="relative">
                  <button onClick={() => setScFormCatDropdownOpen(!scFormCatDropdownOpen)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] border border-border bg-background text-left" style={{ fontSize: "14px" }}>
                    <span className={scFormCategoryId ? "text-foreground" : "text-muted-foreground"}>
                      {scFormCategoryId ? categories.find(c => c.id === scFormCategoryId)?.name : "Select a category"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  {scFormCatDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-card rounded-[12px] border border-border shadow-lg z-30 p-2 max-h-48 overflow-y-auto">
                      {categories.map((c) => (
                        <button key={c.id} onClick={() => { setScFormCategoryId(c.id); setScFormCatDropdownOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between ${scFormCategoryId === c.id ? "bg-[#220E92]/5 text-[#220E92]" : ""}`} style={{ fontSize: "13px" }}>
                          <span className="flex items-center gap-2"><FolderTree className="w-3.5 h-3.5" />{c.name}</span>
                          {scFormCategoryId === c.id && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Subcategory Name *</label>
                <input type="text" value={scFormName} onChange={(e) => setScFormName(e.target.value)} placeholder="e.g., Banarasi" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92] transition-all" style={{ fontSize: "14px" }} autoFocus />
                {scFormName.trim() && scFormCategoryId && (
                  <p className="text-muted-foreground mt-1" style={{ fontSize: "12px" }}>
                    Slug: /{categories.find(c => c.id === scFormCategoryId)?.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/{toSlug(scFormName)}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between bg-muted/30 px-4 py-3 rounded-[10px]">
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>Active Status</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Visible in product creation</p>
                </div>
                <button onClick={() => setScFormActive(!scFormActive)} className={`w-10 h-6 rounded-full transition-colors ${scFormActive ? "bg-[#220E92]" : "bg-gray-300"} relative`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${scFormActive ? "left-5" : "left-1"}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowScModal(false)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
                <button
                  onClick={saveSc}
                  disabled={!scFormName.trim() || !scFormCategoryId}
                  className="flex-1 px-4 py-2.5 rounded-[10px] text-white transition-all disabled:opacity-50"
                  style={{ fontSize: "14px", fontWeight: 500, background: "linear-gradient(135deg, #220E92, #4318ca)", boxShadow: "0 4px 20px rgba(34,14,146,0.35)" }}
                >
                  {editingSc ? "Save Changes" : "Add Subcategory"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DELETE CONFIRMATION (Category)                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {catDeleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCatDeleteId(null)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center"><TriangleAlert className="w-5 h-5 text-red-600" /></div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Delete Category</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>This action cannot be undone</p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-5">
              Are you sure you want to delete <strong>{categories.find(c => c.id === catDeleteId)?.name}</strong> and all its associated subcategories?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setCatDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
              <button onClick={() => deleteCat(catDeleteId)} className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DELETE CONFIRMATION (Subcategory)                       */}
      {/* ═══════════════════════════════════════════════════════ */}
      {scDeleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setScDeleteId(null)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center"><TriangleAlert className="w-5 h-5 text-red-600" /></div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Delete Subcategory</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>This action cannot be undone</p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-5">
              Are you sure you want to delete <strong>{subcategories.find(s => s.id === scDeleteId)?.name}</strong>? Products under this subcategory will become uncategorized.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setScDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
              <button onClick={() => deleteSc(scDeleteId)} className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
