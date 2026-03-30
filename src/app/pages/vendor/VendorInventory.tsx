import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search, ChevronDown, X, Check,
  Package, TriangleAlert, Bell, Settings, Plus, SlidersHorizontal,
  LayoutGrid,
} from "lucide-react";
import { Pagination, usePagination } from "../../components/Pagination";

// ─── Types ────────────────────────────────────────────────────
type FilterTab = "all" | "low_stock" | "out_of_stock";

interface InventoryVariant {
  id: string;
  productName: string;
  productImage: string;
  variantTag: string;
  sku: string;
  unavailable: number;
  committed: number;
  available: number;
  onHand: number;
  lowStockThreshold: number;
}

// ─── Mock Data ────────────────────────────────────────────────
const productImages = [
  "https://images.unsplash.com/photo-1616756351484-798f37bdffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2FyZWUlMjBmYWJyaWMlMjBpbmRpYW58ZW58MXx8fHwxNzcyODAwMDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1768807478320-fcfd3929acb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyb2lkZXJlZCUyMGt1cnRhJTIwbWVuc3dlYXJ8ZW58MXx8fHwxNzcyODAwMDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1572371179162-9c0141483610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlmZm9uJTIwZHVwYXR0YSUyMHNjYXJmfGVufDF8fHx8MTc3MjgwMDAzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1766556514059-303c3b790424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBwYWxhenpvJTIwcGFudHMlMjB3aGl0ZXxlbnwxfHx8fDE3NzI4MDAwMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1769275061088-85697a30ee50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZHJlc3MlMjBpbmRpYW4lMjB3b21hbnxlbnwxfHx8fDE3NzI4MDAwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
];

const variantColors: Record<string, { bg: string; text: string }> = {
  "Royal Blue": { bg: "bg-blue-100", text: "text-blue-800" },
  "Emerald Green": { bg: "bg-emerald-100", text: "text-emerald-800" },
  "Maroon": { bg: "bg-red-100", text: "text-red-800" },
  "Navy": { bg: "bg-indigo-100", text: "text-indigo-800" },
  "Peach": { bg: "bg-orange-100", text: "text-orange-800" },
  "Sky Blue": { bg: "bg-sky-100", text: "text-sky-800" },
  "Off White": { bg: "bg-gray-100", text: "text-gray-800" },
  "Beige": { bg: "bg-amber-100", text: "text-amber-800" },
  "Pink": { bg: "bg-pink-100", text: "text-pink-800" },
};
function getTagColor(tag: string) { return variantColors[tag] || { bg: "bg-gray-100", text: "text-gray-700" }; }

const initialInventory: InventoryVariant[] = [
  { id: "V1", productName: "Silk Banarasi Saree", productImage: productImages[0], variantTag: "Royal Blue", sku: "SKU-1042-RB", unavailable: 0, committed: 3, available: 18, onHand: 21, lowStockThreshold: 5 },
  { id: "V2", productName: "Silk Banarasi Saree", productImage: productImages[0], variantTag: "Emerald Green", sku: "SKU-1042-EG", unavailable: 0, committed: 2, available: 14, onHand: 16, lowStockThreshold: 5 },
  { id: "V3", productName: "Silk Banarasi Saree", productImage: productImages[0], variantTag: "Maroon", sku: "SKU-1042-MR", unavailable: 0, committed: 1, available: 13, onHand: 14, lowStockThreshold: 5 },
  { id: "V4", productName: "Embroidered Kurta Set", productImage: productImages[1], variantTag: "Maroon", sku: "SKU-1089-M", unavailable: 0, committed: 1, available: 2, onHand: 3, lowStockThreshold: 5 },
  { id: "V5", productName: "Embroidered Kurta Set", productImage: productImages[1], variantTag: "Maroon", sku: "SKU-1089-L", unavailable: 0, committed: 0, available: 1, onHand: 1, lowStockThreshold: 5 },
  { id: "V6", productName: "Embroidered Kurta Set", productImage: productImages[1], variantTag: "Maroon", sku: "SKU-1089-XL", unavailable: 0, committed: 0, available: 0, onHand: 0, lowStockThreshold: 5 },
  { id: "V7", productName: "Embroidered Kurta Set", productImage: productImages[1], variantTag: "Navy", sku: "SKU-1089-NM", unavailable: 0, committed: 0, available: 0, onHand: 0, lowStockThreshold: 5 },
  { id: "V8", productName: "Chiffon Dupatta", productImage: productImages[2], variantTag: "Peach", sku: "SKU-1156-PC", unavailable: 0, committed: 0, available: 0, onHand: 0, lowStockThreshold: 3 },
  { id: "V9", productName: "Chiffon Dupatta", productImage: productImages[2], variantTag: "Sky Blue", sku: "SKU-1156-SB", unavailable: 0, committed: 0, available: 0, onHand: 0, lowStockThreshold: 3 },
  { id: "V10", productName: "Cotton Palazzo", productImage: productImages[3], variantTag: "Off White", sku: "SKU-1203-S", unavailable: 0, committed: 0, available: 0, onHand: 0, lowStockThreshold: 3 },
  { id: "V11", productName: "Cotton Palazzo", productImage: productImages[3], variantTag: "Off White", sku: "SKU-1203-M", unavailable: 0, committed: 1, available: 2, onHand: 3, lowStockThreshold: 3 },
  { id: "V12", productName: "Cotton Palazzo", productImage: productImages[3], variantTag: "Off White", sku: "SKU-1203-L", unavailable: 0, committed: 0, available: 1, onHand: 1, lowStockThreshold: 3 },
  { id: "V13", productName: "Cotton Palazzo", productImage: productImages[3], variantTag: "Off White", sku: "SKU-1203-XL", unavailable: 0, committed: 0, available: 1, onHand: 1, lowStockThreshold: 3 },
  { id: "V14", productName: "Cotton Palazzo", productImage: productImages[3], variantTag: "Beige", sku: "No SKU", unavailable: 0, committed: 0, available: 0, onHand: 0, lowStockThreshold: 3 },
  { id: "V15", productName: "Anarkali Dress", productImage: productImages[4], variantTag: "Pink", sku: "SKU-1267-S", unavailable: 0, committed: 2, available: 8, onHand: 10, lowStockThreshold: 5 },
  { id: "V16", productName: "Anarkali Dress", productImage: productImages[4], variantTag: "Pink", sku: "SKU-1267-M", unavailable: 0, committed: 3, available: 12, onHand: 15, lowStockThreshold: 5 },
  { id: "V17", productName: "Anarkali Dress", productImage: productImages[4], variantTag: "Pink", sku: "SKU-1267-L", unavailable: 0, committed: 1, available: 8, onHand: 9, lowStockThreshold: 5 },
];

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "low_stock", label: "Low stock" },
  { key: "out_of_stock", label: "Out of stock" },
];

function getStockStatus(v: InventoryVariant): "in_stock" | "low_stock" | "out_of_stock" {
  if (v.available === 0 && v.onHand === 0) return "out_of_stock";
  if (v.available <= v.lowStockThreshold) return "low_stock";
  return "in_stock";
}

// ─── Main Component ──────────────────────────────────────────
export function VendorInventory() {
  const [inventory, setInventory] = useState<InventoryVariant[]>(initialInventory);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [globalThreshold, setGlobalThreshold] = useState("5");
  const [toast, setToast] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [bulkQty, setBulkQty] = useState("");
  const [invPage, setInvPage] = useState(1);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 2500); return () => clearTimeout(t); }
  }, [toast]);

  const counts = useMemo(() => ({
    all: inventory.length,
    low_stock: inventory.filter(v => getStockStatus(v) === "low_stock").length,
    out_of_stock: inventory.filter(v => getStockStatus(v) === "out_of_stock").length,
  }), [inventory]);

  const filtered = useMemo(() => {
    return inventory.filter((v) => {
      const matchesSearch = search === "" ||
        v.productName.toLowerCase().includes(search.toLowerCase()) ||
        v.sku.toLowerCase().includes(search.toLowerCase()) ||
        v.variantTag.toLowerCase().includes(search.toLowerCase());
      if (activeFilter === "all") return matchesSearch;
      const status = getStockStatus(v);
      return matchesSearch && status === activeFilter;
    });
  }, [search, activeFilter, inventory]);

  const toggleSelectAll = () => {
    setSelectedVariants(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(v => v.id)));
  };
  const toggleSelect = (id: string) => {
    setSelectedVariants(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const updateField = useCallback((id: string, field: "available" | "onHand", value: number) => {
    setInventory(prev => prev.map(v => {
      if (v.id !== id) return v;
      if (field === "available") {
        return { ...v, available: value, onHand: value + v.committed };
      } else {
        return { ...v, onHand: value, available: Math.max(0, value - v.committed) };
      }
    }));
    setHasChanges(true);
  }, []);

  const handleSave = () => {
    setHasChanges(false);
    setToast("Inventory saved");
  };

  const handleBulkUpdate = () => {
    if (!bulkQty || selectedVariants.size === 0) return;
    const qty = parseInt(bulkQty) || 0;
    setInventory(prev => prev.map(v => {
      if (!selectedVariants.has(v.id)) return v;
      return { ...v, available: qty, onHand: qty + v.committed };
    }));
    setHasChanges(true);
    setToast(`Updated ${selectedVariants.size} variants`);
    setBulkQty("");
    setSelectedVariants(new Set());
  };

  const handleExport = () => {
    const headers = ["Product", "Variant", "SKU", "Unavailable", "Committed", "Available", "On hand"];
    const rows = inventory.map(v => [v.productName, v.variantTag, v.sku, String(v.unavailable), String(v.committed), String(v.available), String(v.onHand)]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    setToast("Inventory exported");
  };

  const INV_PER_PAGE = 10;
  const { paginated: paginatedInv, totalPages: invTotalPages, safePage: safeInvPage } = usePagination(filtered, INV_PER_PAGE, invPage);

  return (
    <div className="space-y-0">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#220E92] text-white px-5 py-3 rounded-[10px] shadow-lg flex items-center gap-2" style={{ fontSize: "13px", fontWeight: 500 }}>
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Save bar */}
      {hasChanges && (
        <div className="bg-[#220E92]/5 border border-[#220E92]/20 rounded-[10px] px-4 py-2.5 mb-4 flex items-center justify-between">
          <span className="text-[#220E92]" style={{ fontSize: "13px", fontWeight: 500 }}>You have unsaved inventory changes</span>
          <div className="flex gap-2">
            <button onClick={() => { setInventory(initialInventory); setHasChanges(false); }} className="px-3 py-1.5 rounded-[8px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>Discard</button>
            <button onClick={handleSave} className="px-4 py-1.5 rounded-[8px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "12px", fontWeight: 600 }}>Save</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Inventory</h1>
        <div className="flex items-center gap-2.5">
          <button onClick={() => setShowThresholdModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={handleExport} className="px-4 py-2 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Export</button>
          <button className="px-4 py-2 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Import</button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedVariants.size > 0 && (
        <div className="flex items-center gap-3 bg-[#220E92]/5 border border-[#220E92]/20 rounded-[10px] px-4 py-2.5 mb-4">
          <span className="text-[#220E92]" style={{ fontSize: "13px", fontWeight: 600 }}>{selectedVariants.size} selected</span>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Set available to:</span>
            <input type="number" value={bulkQty} onChange={e => setBulkQty(e.target.value)} placeholder="Qty" className="w-20 px-2.5 py-1.5 rounded-[8px] border border-border bg-background text-center focus:border-[#220E92] outline-none" style={{ fontSize: "12px" }} />
            <button onClick={handleBulkUpdate} className="px-3 py-1.5 rounded-[8px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "12px", fontWeight: 600 }}>Update</button>
          </div>
          <button onClick={() => setSelectedVariants(new Set())} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-border px-1.5">
          {filterTabs.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveFilter(tab.key); setInvPage(1); }} className={`px-4 py-3 relative transition-colors ${activeFilter === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`} style={{ fontSize: "13px", fontWeight: activeFilter === tab.key ? 600 : 400 }}>
              {tab.label}
              <span className={`ml-1 ${activeFilter === tab.key ? "text-[#220E92]" : "text-muted-foreground"}`} style={{ fontSize: "11px", fontWeight: 600 }}>{counts[tab.key]}</span>
              {activeFilter === tab.key && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#220E92] rounded-full" />}
            </button>
          ))}
          <button className="px-3 py-3 text-muted-foreground hover:text-foreground transition-colors"><Plus className="w-4 h-4" /></button>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search by product, variant or SKU..." value={search} onChange={e => { setSearch(e.target.value); setInvPage(1); }} className="w-full pl-10 pr-4 py-2 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "13px" }} />
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
                  <input type="checkbox" checked={selectedVariants.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded accent-[#220E92]" />
                </th>
                <th className="px-4 py-3 text-left text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>
                  Product <ChevronDown className="w-3 h-3 inline ml-0.5" />
                </th>
                <th className="px-4 py-3 text-left text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>SKU</th>
                <th className="px-4 py-3 text-center text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>Unavailable</th>
                <th className="px-4 py-3 text-center text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>Committed</th>
                <th className="px-4 py-3 text-center text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>Available</th>
                <th className="px-4 py-3 text-center text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>On hand</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInv.map((v) => {
                const tagColor = getTagColor(v.variantTag);
                const status = getStockStatus(v);
                const isOut = status === "out_of_stock";
                const isLow = status === "low_stock";

                return (
                  <tr
                    key={v.id}
                    className={`border-b border-border/60 transition-colors ${isOut ? "bg-red-50/40 hover:bg-red-50/60" : isLow ? "bg-amber-50/40 hover:bg-amber-50/60" : "hover:bg-muted/20"}`}
                    style={{ height: "64px" }}
                  >
                    <td className="px-4">
                      <input type="checkbox" checked={selectedVariants.has(v.id)} onChange={() => toggleSelect(v.id)} className="rounded accent-[#220E92]" />
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[8px] overflow-hidden bg-muted shrink-0 border border-border">
                          <img src={v.productImage} alt={v.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate max-w-[260px]" style={{ fontSize: "13px", fontWeight: 500 }}>{v.productName}</p>
                          <span className={`inline-block px-2 py-0.5 rounded mt-0.5 ${tagColor.bg} ${tagColor.text}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                            {v.variantTag}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 text-muted-foreground" style={{ fontSize: "13px" }}>{v.sku}</td>
                    <td className="px-4 text-center text-muted-foreground" style={{ fontSize: "13px" }}>{v.unavailable}</td>
                    <td className="px-4 text-center" style={{ fontSize: "13px" }}>{v.committed}</td>
                    <td className="px-4 text-center">
                      <input
                        type="number"
                        value={v.available}
                        onChange={e => updateField(v.id, "available", parseInt(e.target.value) || 0)}
                        className={`w-16 px-2 py-1.5 rounded-[8px] border bg-background text-center outline-none transition-colors ${
                          isOut ? "border-red-300 text-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                          : isLow ? "border-amber-300 text-amber-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
                          : "border-border focus:border-[#220E92] focus:ring-1 focus:ring-[#220E92]/20"
                        }`}
                        style={{ fontSize: "13px", fontWeight: isOut || isLow ? 600 : 400 }}
                      />
                    </td>
                    <td className="px-4 text-center">
                      <input
                        type="number"
                        value={v.onHand}
                        onChange={e => updateField(v.id, "onHand", parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1.5 rounded-[8px] border border-border bg-background text-center outline-none focus:border-[#220E92] focus:ring-1 focus:ring-[#220E92]/20 transition-colors"
                        style={{ fontSize: "13px" }}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p style={{ fontSize: "14px", fontWeight: 500 }} className="text-muted-foreground">No inventory items found</p>
                    <p style={{ fontSize: "13px" }} className="text-muted-foreground/70 mt-1">Try adjusting your search or filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <Pagination
            currentPage={safeInvPage}
            totalPages={invTotalPages}
            totalItems={filtered.length}
            itemsPerPage={INV_PER_PAGE}
            onPageChange={setInvPage}
            itemLabel="variants"
          />
        )}
      </div>

      {/* Low Stock Threshold Modal */}
      {showThresholdModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowThresholdModal(false)}>
          <div className="bg-card rounded-[12px] p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Low Stock Alert Settings</h3>
              <button onClick={() => setShowThresholdModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-4 flex items-start gap-3">
                <TriangleAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600 }} className="text-amber-900">How low stock alerts work</p>
                  <p style={{ fontSize: "12px" }} className="text-amber-700 mt-1">When stock reaches or falls below the threshold, the item is automatically marked as "Low Stock" and you'll receive a notification.</p>
                </div>
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Default Low Stock Threshold</label>
                <input type="number" value={globalThreshold} onChange={e => setGlobalThreshold(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background focus:border-[#220E92] outline-none" style={{ fontSize: "14px" }} />
                <p className="text-muted-foreground mt-1.5" style={{ fontSize: "12px" }}>Applied to all new products. Override per variant in the inventory table.</p>
              </div>
              <div className="bg-muted/30 rounded-[10px] p-4 space-y-2">
                <div className="flex items-center gap-2"><Bell className="w-4 h-4 text-[#220E92]" /><span style={{ fontSize: "13px", fontWeight: 600 }}>Notification Channels</span></div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="rounded accent-[#220E92]" /><span style={{ fontSize: "13px" }}>Dashboard notifications</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="rounded accent-[#220E92]" /><span style={{ fontSize: "13px" }}>Email alerts</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded accent-[#220E92]" /><span style={{ fontSize: "13px" }}>SMS alerts</span></label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowThresholdModal(false)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
                <button onClick={() => { setInventory(prev => prev.map(v => ({ ...v, lowStockThreshold: parseInt(globalThreshold) || 5 }))); setShowThresholdModal(false); setToast("Threshold updated for all variants"); }} className="flex-1 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>Save Settings</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}