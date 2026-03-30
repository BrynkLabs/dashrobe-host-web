import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Plus, Search, SquarePen, Trash2, Copy, X, ChevronDown,
  MoreHorizontal, Check, Package, SlidersHorizontal,
  LayoutGrid, Archive, RotateCcw,
} from "lucide-react";
import { ProductForm } from "./ProductForm";
import type { Product, ProductStatus, ProductVariant, VariantOption } from "./ProductForm";
import { Pagination, usePagination } from "../../components/Pagination";

// ─── Types ────────────────────────────────────────────────────
type FilterTab = "all" | "active" | "draft" | "archived";

// ─── Mock Data ────────────────────────────────────────────────
const productImages = [
  "https://images.unsplash.com/photo-1616756351484-798f37bdffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2FyZWUlMjBmYWJyaWMlMjBpbmRpYW58ZW58MXx8fHwxNzcyODAwMDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1768807478320-fcfd3929acb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyb2lkZXJlZCUyMGt1cnRhJTIwbWVuc3dlYXJ8ZW58MXx8fHwxNzcyODAwMDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1572371179162-9c0141483610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlmZm9uJTIwZHVwYXR0YSUyMHNjYXJmfGVufDF8fHx8MTc3MjgwMDAzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1766556514059-303c3b790424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBwYWxhenpvJTIwcGFudHMlMjB3aGl0ZXxlbnwxfHx8fDE3NzI4MDAwMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1769275061088-85697a30ee50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZHJlc3MlMjBpbmRpYW4lMjB3b21hbnxlbnwxfHx8fDE3NzI4MDAwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1599584082894-52c6d8fc48c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ28lMjBrdXJ0aSUyMGluZGlhbiUyMGZhc2hpb258ZW58MXx8fHwxNzcyODAwMDM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1662376993778-1a1e6ecd9df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjByZWQlMjBnb2xkJTIwYnJpZGFsfGVufDF8fHx8MTc3MjgwMDAzNnww&ixlib=rb-4.1.0&q=80&w=1080",
];

function makeProduct(overrides: Partial<Product> & { id: string; name: string }): Product {
  return {
    description: "", image: productImages[0], images: [], category: "", subcategory: "",
    brand: "", vendor: "", variantsCount: 0, totalStock: 0, status: "active", sku: "",
    channels: ["Online Store"], price: "", compareAt: "", costPerItem: "", chargeTax: true,
    trackInventory: true, quantity: "0", barcode: "", sellWhenOos: false, isPhysical: true,
    weight: "0", weightUnit: "kg", hasVariants: false, variantOptions: [], variants: [],
    colorImages: {}, tags: [], productType: "", seoTitle: "", seoDescription: "",
    specifications: {},
    ...overrides,
  };
}

const initialProducts: Product[] = [
  makeProduct({ id: "P001", name: "Silk Banarasi Saree", image: productImages[0], images: [productImages[0]], category: "Sarees", subcategory: "Banarasi", brand: "FabIndia", vendor: "FabIndia", variantsCount: 6, totalStock: 45, status: "active", sku: "SKU-1042", channels: ["Online Store", "POS"], price: "4999", tags: ["silk", "wedding"] }),
  makeProduct({ id: "P002", name: "Embroidered Kurta Set", image: productImages[1], images: [productImages[1]], category: "Kurta Sets", subcategory: "Men's Kurta", brand: "Manyavar", vendor: "Manyavar", variantsCount: 4, totalStock: 3, status: "active", sku: "SKU-1089", channels: ["Online Store", "POS"], price: "2199" }),
  makeProduct({ id: "P003", name: "Chiffon Dupatta", image: productImages[2], images: [productImages[2]], category: "Dupattas", subcategory: "Chiffon", brand: "W", vendor: "W", variantsCount: 2, totalStock: 0, status: "draft", sku: "SKU-1156", channels: [], price: "799" }),
  makeProduct({ id: "P004", name: "Cotton Palazzo", image: productImages[3], images: [productImages[3]], category: "Bottomwear", subcategory: "Palazzo", brand: "Global Desi", vendor: "Global Desi", variantsCount: 5, totalStock: 4, status: "active", sku: "SKU-1203", channels: ["Online Store", "POS"], price: "999" }),
  makeProduct({ id: "P005", name: "Anarkali Dress", image: productImages[4], images: [productImages[4]], category: "Dresses", subcategory: "Anarkali", brand: "Biba", vendor: "Biba", variantsCount: 3, totalStock: 28, status: "active", sku: "SKU-1267", channels: ["Online Store"], price: "2499" }),
  makeProduct({ id: "P006", name: "Block Print Kurti", image: productImages[5], images: [productImages[5]], category: "Kurtis", subcategory: "A-Line", brand: "Libas", vendor: "Libas", variantsCount: 7, totalStock: 67, status: "active", sku: "SKU-1334", channels: ["Online Store", "POS"], price: "899" }),
  makeProduct({ id: "P007", name: "Lehenga Choli", image: productImages[6], images: [productImages[6]], category: "Lehengas", subcategory: "Bridal", brand: "Kalini", vendor: "Kalini", variantsCount: 2, totalStock: 0, status: "archived", sku: "SKU-1401", channels: [], price: "8999" }),
];

const statusConfig: Record<ProductStatus, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "bg-emerald-50", text: "text-emerald-700" },
  draft: { label: "Draft", bg: "bg-amber-50", text: "text-amber-700" },
  archived: { label: "Archived", bg: "bg-gray-100", text: "text-gray-500" },
};

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "archived", label: "Archived" },
];

let nextId = 100;

// ─── Main Component ──────────────────────────────────────────
export function VendorProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [prodPage, setProdPage] = useState(1);
  const actionRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) setActionMenuId(null);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreActionsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 2500); return () => clearTimeout(t); }
  }, [toast]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === "all" || p.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter, products]);

  const counts = useMemo(() => ({
    all: products.length,
    active: products.filter(p => p.status === "active").length,
    draft: products.filter(p => p.status === "draft").length,
    archived: products.filter(p => p.status === "archived").length,
  }), [products]);

  const toggleSelectAll = () => {
    setSelectedProducts(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));
  };
  const toggleSelect = (id: string) => {
    setSelectedProducts(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleSave = useCallback((product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.map(p => p.id === product.id ? product : p);
      return [product, ...prev];
    });
    setView("list");
    setEditId(null);
    setToast(view === "edit" ? "Product updated" : "Product created");
  }, [view]);

  const handleDuplicate = (id: string) => {
    const src = products.find(p => p.id === id);
    if (!src) return;
    const newP: Product = { ...src, id: `P${++nextId}`, name: `${src.name} (Copy)`, status: "draft", sku: `${src.sku}-COPY` };
    setProducts(prev => [newP, ...prev]);
    setActionMenuId(null);
    setToast("Product duplicated");
  };

  const handleArchive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "archived" ? "active" as const : "archived" as const, channels: p.status === "archived" ? ["Online Store"] : [] } : p));
    setActionMenuId(null);
    setToast("Product status updated");
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setActionMenuId(null);
    setSelectedProducts(prev => { const n = new Set(prev); n.delete(id); return n; });
    setToast("Product deleted");
  };

  const handleBulkAction = (action: "active" | "archive" | "delete") => {
    if (selectedProducts.size === 0) return;
    if (action === "delete") {
      setProducts(prev => prev.filter(p => !selectedProducts.has(p.id)));
      setToast(`${selectedProducts.size} products deleted`);
    } else if (action === "active") {
      setProducts(prev => prev.map(p => selectedProducts.has(p.id) ? { ...p, status: "active" as const, channels: p.channels.length ? p.channels : ["Online Store"] } : p));
      setToast(`${selectedProducts.size} products set to active`);
    } else {
      setProducts(prev => prev.map(p => selectedProducts.has(p.id) ? { ...p, status: "archived" as const, channels: [] } : p));
      setToast(`${selectedProducts.size} products archived`);
    }
    setSelectedProducts(new Set());
    setMoreActionsOpen(false);
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Status", "Category", "SKU", "Price", "Stock", "Channels"];
    const rows = products.map(p => [p.id, p.name, p.status, p.category, p.sku, p.price, String(p.totalStock), p.channels.join("; ")]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `products-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    setToast("Products exported");
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    setView("edit");
    setActionMenuId(null);
  };

  const getInventoryText = (p: Product) => {
    return `${p.totalStock} in stock${p.variantsCount > 0 ? ` for ${p.variantsCount} variants` : ""}`;
  };

  // ─── FORM VIEW ──────────────────────
  if (view === "add" || view === "edit") {
    const editProduct = view === "edit" ? products.find(p => p.id === editId) : undefined;
    return (
      <ProductForm
        initial={editProduct}
        isEdit={view === "edit"}
        onSave={handleSave}
        onBack={() => { setView("list"); setEditId(null); }}
        onDelete={editProduct ? () => { handleDelete(editProduct.id); setView("list"); setEditId(null); } : undefined}
      />
    );
  }

  // ─── LIST VIEW ──────────────────────
  const PROD_PER_PAGE = 10;
  const { paginated: paginatedProducts, totalPages: prodTotalPages, safePage: safeProdPage } = usePagination(filtered, PROD_PER_PAGE, prodPage);

  return (
    <div className="space-y-0">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#220E92] text-white px-5 py-3 rounded-[10px] shadow-lg flex items-center gap-2" style={{ fontSize: "13px", fontWeight: 500 }}>
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Products</h1>
        <div className="flex items-center gap-2.5">
          <button onClick={handleExport} className="px-4 py-2 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Export</button>
          <button className="px-4 py-2 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Import</button>
          <div ref={moreRef} className="relative">
            <button onClick={() => setMoreActionsOpen(!moreActionsOpen)} className="px-4 py-2 rounded-[10px] border border-border hover:bg-muted transition-colors inline-flex items-center gap-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>
              More actions <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {moreActionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-card rounded-[12px] border border-border shadow-lg z-20 py-1.5">
                <button onClick={() => handleBulkAction("active")} className="w-full text-left px-4 py-2 hover:bg-muted transition-colors" style={{ fontSize: "13px" }}>Set as active{selectedProducts.size > 0 && ` (${selectedProducts.size})`}</button>
                <button onClick={() => handleBulkAction("archive")} className="w-full text-left px-4 py-2 hover:bg-muted transition-colors" style={{ fontSize: "13px" }}>Archive selected{selectedProducts.size > 0 && ` (${selectedProducts.size})`}</button>
                <div className="border-t border-border my-1" />
                <button onClick={() => handleBulkAction("delete")} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors" style={{ fontSize: "13px" }}>Delete selected{selectedProducts.size > 0 && ` (${selectedProducts.size})`}</button>
              </div>
            )}
          </div>
          <button onClick={() => setView("add")} className="inline-flex items-center gap-2 bg-[#220E92] text-white px-5 py-2 rounded-[10px] hover:bg-[#220E92]/90 transition-colors shadow-sm" style={{ fontSize: "13px", fontWeight: 600 }}>
            Add product
          </button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedProducts.size > 0 && (
        <div className="flex items-center gap-3 bg-[#220E92]/5 border border-[#220E92]/20 rounded-[10px] px-4 py-2.5 mb-4">
          <span className="text-[#220E92]" style={{ fontSize: "13px", fontWeight: 600 }}>{selectedProducts.size} selected</span>
          <div className="flex-1" />
          <button onClick={() => handleBulkAction("active")} className="px-3 py-1.5 rounded-[8px] border border-border hover:bg-muted text-foreground transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>Set as active</button>
          <button onClick={() => handleBulkAction("archive")} className="px-3 py-1.5 rounded-[8px] border border-border hover:bg-muted text-foreground transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>Archive</button>
          <button onClick={() => handleBulkAction("delete")} className="px-3 py-1.5 rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50 transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>Delete</button>
          <button onClick={() => setSelectedProducts(new Set())} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-border px-1.5">
          {filterTabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveFilter(tab.key)} className={`px-4 py-3 relative transition-colors ${activeFilter === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`} style={{ fontSize: "13px", fontWeight: activeFilter === tab.key ? 600 : 400 }}>
              {tab.label}
              <span className={`ml-1 ${activeFilter === tab.key ? "text-[#220E92]" : "text-muted-foreground"}`} style={{ fontSize: "11px", fontWeight: 600 }}>{counts[tab.key]}</span>
              {activeFilter === tab.key && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#220E92] rounded-full" />}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "13px" }} />
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-2 rounded-[8px] hover:bg-muted text-muted-foreground transition-colors"><SlidersHorizontal className="w-4 h-4" /></button>
            <button className="p-2 rounded-[8px] hover:bg-muted text-muted-foreground transition-colors"><LayoutGrid className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" checked={selectedProducts.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded accent-[#220E92]" />
                </th>
                {["Product", "Status", "Inventory", "Category", "Channels"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                ))}
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p) => {
                const st = statusConfig[p.status];
                return (
                  <tr key={p.id} className="border-b border-border/60 hover:bg-muted/20 transition-colors cursor-pointer" style={{ height: "60px" }} onClick={() => handleEdit(p.id)}>
                    <td className="px-4" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedProducts.has(p.id)} onChange={() => toggleSelect(p.id)} className="rounded accent-[#220E92]" />
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[8px] overflow-hidden bg-muted shrink-0 border border-border">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="truncate max-w-[280px]" style={{ fontSize: "14px", fontWeight: 500 }}>{p.name}</p>
                      </div>
                    </td>
                    <td className="px-4">
                      <span className={`${st.bg} ${st.text} px-2.5 py-1 rounded-full`} style={{ fontSize: "12px", fontWeight: 600 }}>{st.label}</span>
                    </td>
                    <td className="px-4 text-muted-foreground" style={{ fontSize: "13px" }}>{getInventoryText(p)}</td>
                    <td className="px-4" style={{ fontSize: "13px" }}>{p.category}</td>
                    <td className="px-4" style={{ fontSize: "13px" }}>{p.channels.length}</td>
                    <td className="px-4 relative" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setActionMenuId(actionMenuId === p.id ? null : p.id)} className="p-1.5 rounded-[8px] hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {actionMenuId === p.id && (
                        <div ref={actionRef} className="absolute right-5 top-full mt-1 w-44 bg-card rounded-[10px] border border-border shadow-lg z-20 py-1.5">
                          <button onClick={() => handleEdit(p.id)} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted transition-colors text-left" style={{ fontSize: "13px" }}>
                            <SquarePen className="w-3.5 h-3.5 text-muted-foreground" /> Edit
                          </button>
                          <button onClick={() => handleDuplicate(p.id)} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted transition-colors text-left" style={{ fontSize: "13px" }}>
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" /> Duplicate
                          </button>
                          <button onClick={() => handleArchive(p.id)} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted transition-colors text-left" style={{ fontSize: "13px" }}>
                            {p.status === "archived" ? <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" /> : <Archive className="w-3.5 h-3.5 text-muted-foreground" />}
                            {p.status === "archived" ? "Unarchive" : "Archive"}
                          </button>
                          <div className="border-t border-border my-1" />
                          <button onClick={() => handleDelete(p.id)} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors text-left" style={{ fontSize: "13px" }}>
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p style={{ fontSize: "14px", fontWeight: 500 }} className="text-muted-foreground">No products found</p>
                    <p style={{ fontSize: "13px" }} className="text-muted-foreground/70 mt-1">Try adjusting your search or filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <Pagination
            currentPage={safeProdPage}
            totalPages={prodTotalPages}
            totalItems={filtered.length}
            itemsPerPage={PROD_PER_PAGE}
            onPageChange={setProdPage}
            itemLabel="products"
          />
        )}
      </div>
    </div>
  );
}