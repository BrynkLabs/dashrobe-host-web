import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { ProductsTopbar } from "../../components/vendor/ProductsTopbar";
import { ConfirmationModal } from "../../components/vendor/ConfirmationModal";
import { Button } from "../../components/ui/button";
import { ProductStatusTabs } from "../../components/vendor/ProductStatusTabs";
import { ProductFilterRow, BulkActionBar } from "../../components/vendor/ProductFilters";
import { ProductTable, ProductPagination } from "../../components/vendor/ProductTable";
import warningIcon from "@/assets/icons/warning-icon.png";

type Status = "Active" | "Draft" | "Hidden";

interface Product {
  id: string;
  title: string;
  image: string;
  status: Status;
  gender: string;
  category: string;
  subcategory: string;
}

const PRODUCTS: Product[] = [
  { id: "1", title: "Silk Banarasi Saree", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=70", status: "Active", gender: "Women's", category: "Sarees", subcategory: "Sarees" },
  { id: "2", title: "Embroidered Kurta Set", image: "https://images.unsplash.com/photo-1617627144234-4e33b6a07c1a?auto=format&fit=crop&w=120&q=70", status: "Active", gender: "Men's", category: "Kurta Sets", subcategory: "Kurta Sets" },
  { id: "3", title: "Chiffon Dupatta", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?auto=format&fit=crop&w=120&q=70", status: "Draft", gender: "Unisex", category: "Dupattas", subcategory: "Dupattas" },
  { id: "4", title: "Cotton Palazzo", image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=120&q=70", status: "Active", gender: "Girls", category: "Bottomwear", subcategory: "Bottomwear" },
  { id: "5", title: "Anarkali Dress", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=120&q=70", status: "Active", gender: "Women's", category: "Dresses", subcategory: "Dresses" },
  { id: "6", title: "Block Print Kurti", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=120&q=70", status: "Active", gender: "Girls", category: "Kurtis", subcategory: "Kurtis" },
  { id: "7", title: "Ikat Print Kurti", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=120&q=70", status: "Draft", gender: "Women's", category: "Kurtis", subcategory: "Kurtis" },
  { id: "8", title: "Linen Casual Shirt", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=120&q=70", status: "Hidden", gender: "Boys", category: "Shirts", subcategory: "Shirts" },
];

const ITEMS_PER_PAGE = 6;

export function Products() {
  const [activeTab, setActiveTab] = useState<"all" | Status>("all");
  const [gender, setGender] = useState("All");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [bulkAction, setBulkAction] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [items, setItems] = useState(PRODUCTS);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [duplicateProductId, setDuplicateProductId] = useState<string | null>(null);
  const [showDraftWarning, setShowDraftWarning] = useState(false);

  const counts = useMemo(() => ({
    all: items.length,
    Active: items.filter((p) => p.status === "Active").length,
    Draft: items.filter((p) => p.status === "Draft").length,
    Hidden: items.filter((p) => p.status === "Hidden").length,
  }), [items]);

  const filtered = useMemo(() => {
    const statusOrder: Record<Status, number> = { Active: 1, Draft: 2, Hidden: 3 };
    return items
      .filter((p) => {
        if (activeTab !== "all" && p.status !== activeTab) return false;
        if (gender !== "All" && p.gender !== gender) return false;
        if (category !== "All" && p.category !== category) return false;
        if (subcategory !== "All" && p.subcategory !== subcategory) return false;
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => sortOrder === "asc" ? statusOrder[a.status] - statusOrder[b.status] : statusOrder[b.status] - statusOrder[a.status]);
  }, [items, activeTab, gender, category, subcategory, search, sortOrder]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  const availableBulkActions = useMemo(() => {
    const actions: { value: string; label: string }[] = [];
    if (Array.from(selected).some((id) => items.find((p) => p.id === id)?.status !== "Active")) actions.push({ value: "active", label: "Set as Active" });
    if (Array.from(selected).some((id) => items.find((p) => p.id === id)?.status !== "Draft")) actions.push({ value: "draft", label: "Set as Draft" });
    if (Array.from(selected).some((id) => items.find((p) => p.id === id)?.status !== "Hidden")) actions.push({ value: "hidden", label: "Set as Hidden" });
    return actions;
  }, [items, selected]);

  const toggleAll = () => {
    const next = new Set(selected);
    if (allVisibleSelected) { filtered.forEach((p) => next.delete(p.id)); } else { filtered.forEach((p) => next.add(p.id)); }
    setSelected(next);
    setBulkAction("");
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setBulkAction("");
  };

  const hasDraftInSelection = Array.from(selected).some((id) => items.find((p) => p.id === id)?.status === "Draft");

  const handleBulkApplyClick = () => {
    if (!bulkAction || selected.size === 0) return;
    if (hasDraftInSelection) {
      setShowDraftWarning(true);
    } else {
      setShowBulkConfirm(true);
    }
  };

  const excludeDraftAndContinue = () => {
    setShowDraftWarning(false);
    const next = new Set(selected);
    items.forEach((p) => { if (p.status === "Draft" && next.has(p.id)) next.delete(p.id); });
    setSelected(next);
    if (next.size > 0) {
      setShowBulkConfirm(true);
    }
  };

  const applyBulk = () => {
    if (!bulkAction || selected.size === 0) return;
    const newStatus: Status = bulkAction === "active" ? "Active" : bulkAction === "draft" ? "Draft" : "Hidden";
    setItems((prev) => prev.map((p) => selected.has(p.id) ? { ...p, status: newStatus } : p));
    setSelected(new Set());
    setBulkAction("");
    setShowBulkConfirm(false);
  };

  const confirmDuplicate = () => {
    if (!duplicateProductId) return;
    const src = items.find((p) => p.id === duplicateProductId);
    if (!src) return;
    setItems((prev) => [{ ...src, id: `${Date.now()}`, title: `${src.title} (Copy)`, status: "Draft" }, ...prev]);
    setDuplicateProductId(null);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pagedItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#edf1ff]">
      <ProductsTopbar title="Products" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <p className="text-[13px] text-[#667085] mt-0.5">{items.length} total products</p>
          <Link to="/vendor/products/add">
            <Button className="bg-[#220e92] hover:bg-[#1a0a73] text-white rounded-lg h-9 px-4 gap-2 text-[13px] shadow-sm transition-all" style={{ fontWeight: 600 }}>
              <Plus className="size-4" /> Add product
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-[#eaecf0] shadow-[0px_1px_3px_rgba(16,24,40,0.06),0px_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
          <ProductStatusTabs activeTab={activeTab} counts={counts} onTabChange={(t) => { setActiveTab(t); setPage(1); }} />
          <ProductFilterRow
            gender={gender} category={category} subcategory={subcategory}
            onGenderChange={(v) => { setGender(v); setPage(1); }}
            onCategoryChange={(v) => { setCategory(v); setPage(1); }}
            onSubcategoryChange={(v) => { setSubcategory(v); setPage(1); }}
          />
          <BulkActionBar
            selectedCount={selected.size} bulkAction={bulkAction} onBulkActionChange={setBulkAction}
            availableBulkActions={availableBulkActions}
            onApplyBulk={handleBulkApplyClick}
            search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
          />
          <ProductTable
            items={pagedItems} selected={selected} allVisibleSelected={allVisibleSelected}
            onToggleAll={toggleAll} onToggleOne={toggleOne} onDuplicate={setDuplicateProductId}
            sortOrder={sortOrder} onSortToggle={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          />
          <ProductPagination page={page} totalPages={totalPages} filteredCount={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
        </div>
      </main>

      {showDraftWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowDraftWarning(false)} />
          <div className="relative bg-white rounded-2xl shadow-[0px_20px_60px_rgba(0,0,0,0.15)] w-full max-w-[420px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={warningIcon} alt="Warning" className="size-10 shrink-0" />
              <h2 className="text-[16px] text-[#101828]" style={{ fontWeight: 600 }}>Apply Changes</h2>
            </div>
            <p className="text-[14px] text-[#475467] leading-[21px] mb-6">
              Bulk Actions cannot be applied to "Draft" status items. Do you want to continue and exclude draft items?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={excludeDraftAndContinue}
                className="w-full h-11 rounded-xl text-[14px] text-white bg-[#220e92] hover:bg-[#1a0a73] transition-colors shadow-sm"
                style={{ fontWeight: 600 }}
              >
                Exclude Draft and Continue
              </button>
              <button
                onClick={() => setShowDraftWarning(false)}
                className="w-full h-11 rounded-xl text-[14px] text-[#344054] border border-[#d0d5dd] hover:bg-[#f9fafb] transition-colors"
                style={{ fontWeight: 500 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal isOpen={showBulkConfirm} onClose={() => setShowBulkConfirm(false)} onConfirm={applyBulk}
        title="Apply Changes" message={`Are you sure you want to set all items to "${bulkAction === "active" ? "Active" : bulkAction === "draft" ? "Draft" : "Hidden"}"?`}
        confirmText="Yes, Apply" icon="alert" />
      <ConfirmationModal isOpen={duplicateProductId !== null} onClose={() => setDuplicateProductId(null)} onConfirm={confirmDuplicate}
        title="Duplicate product" message="Are you sure you want to duplicate this product?" confirmText="Yes, Duplicate" icon="alert" />
    </div>
  );
}

export default Products;
