import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowUpDown,
  Copy,
  Eye,
  Plus,
  Search,
} from "lucide-react";
import { ProductsTopbar } from "../../components/vendor/ProductsTopbar";
import { ConfirmationModal } from "../../components/vendor/ConfirmationModal";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

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
  {
    id: "1",
    title: "Silk Banarasi Saree",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=70",
    status: "Active",
    gender: "Women's",
    category: "Sarees",
    subcategory: "Sarees",
  },
  {
    id: "2",
    title: "Embroidered Kurta Set",
    image:
      "https://images.unsplash.com/photo-1617627144234-4e33b6a07c1a?auto=format&fit=crop&w=120&q=70",
    status: "Active",
    gender: "Men's",
    category: "Kurta Sets",
    subcategory: "Kurta Sets",
  },
  {
    id: "3",
    title: "Chiffon Dupatta",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e1?auto=format&fit=crop&w=120&q=70",
    status: "Draft",
    gender: "Unisex",
    category: "Dupattas",
    subcategory: "Dupattas",
  },
  {
    id: "4",
    title: "Cotton Palazzo",
    image:
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=120&q=70",
    status: "Active",
    gender: "Girls",
    category: "Bottomwear",
    subcategory: "Bottomwear",
  },
  {
    id: "5",
    title: "Anarkali Dress",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=120&q=70",
    status: "Active",
    gender: "Women's",
    category: "Dresses",
    subcategory: "Dresses",
  },
  {
    id: "6",
    title: "Block Print Kurti",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=120&q=70",
    status: "Active",
    gender: "Girls",
    category: "Kurtis",
    subcategory: "Kurtis",
  },
  {
    id: "7",
    title: "Ikat Print Kurti",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=120&q=70",
    status: "Draft",
    gender: "Women's",
    category: "Kurtis",
    subcategory: "Kurtis",
  },
  {
    id: "8",
    title: "Linen Casual Shirt",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=120&q=70",
    status: "Hidden",
    gender: "Boys",
    category: "Shirts",
    subcategory: "Shirts",
  },
];

const TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Active", label: "Active" },
  { key: "Draft", label: "Draft" },
  { key: "Hidden", label: "Hidden" },
];

const STATUS_CONFIG: Record<
  Status,
  { dot: string; text: string; bg: string }
> = {
  Active: {
    dot: "bg-[#12b76a]",
    text: "text-[#027a48]",
    bg: "bg-[#ecfdf3]",
  },
  Draft: {
    dot: "bg-[#f79009]",
    text: "text-[#b54708]",
    bg: "bg-[#fffaeb]",
  },
  Hidden: {
    dot: "bg-[#98a2b3]",
    text: "text-[#475467]",
    bg: "bg-[#f2f4f7]",
  },
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] ${cfg.bg} ${cfg.text}`}
      style={{ fontWeight: 500 }}
    >
      <span className={`size-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  );
}

export function Products() {
  const [activeTab, setActiveTab] = useState<"all" | Status>("all");
  const [gender, setGender] = useState("All");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [bulkAction, setBulkAction] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [items, setItems] = useState(PRODUCTS);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [duplicateProductId, setDuplicateProductId] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const counts = useMemo(() => {
    return {
      all: items.length,
      Active: items.filter((p) => p.status === "Active").length,
      Draft: items.filter((p) => p.status === "Draft").length,
      Hidden: items.filter((p) => p.status === "Hidden").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const statusOrder: Record<Status, number> = {
      Active: 1,
      Draft: 2,
      Hidden: 3,
    };

    return items
      .filter((p) => {
        if (activeTab !== "all" && p.status !== activeTab) return false;
        if (gender !== "All" && p.gender !== gender) return false;
        if (category !== "All" && p.category !== category) return false;
        if (subcategory !== "All" && p.subcategory !== subcategory) return false;
        if (search && !p.title.toLowerCase().includes(search.toLowerCase()))
          return false;
        return true;
      })
      .sort((a, b) => {
        const orderA = statusOrder[a.status];
        const orderB = statusOrder[b.status];
        return sortOrder === "asc" ? orderA - orderB : orderB - orderA;
      });
  }, [items, activeTab, gender, category, subcategory, search, sortOrder]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  const availableBulkActions = useMemo(() => {
    const actions: { value: string; label: string }[] = [];
    if (
      Array.from(selected).some((id) => {
        const p = items.find((p) => p.id === id);
        return p && p.status !== "Active";
      })
    )
      actions.push({ value: "active", label: "Set as Active" });
    if (
      Array.from(selected).some((id) => {
        const p = items.find((p) => p.id === id);
        return p && p.status !== "Draft";
      })
    )
      actions.push({ value: "draft", label: "Set as Draft" });
    if (
      Array.from(selected).some((id) => {
        const p = items.find((p) => p.id === id);
        return p && p.status !== "Hidden";
      })
    )
      actions.push({ value: "hidden", label: "Set as Hidden" });
    return actions;
  }, [items, selected]);

  const toggleAll = () => {
    const next = new Set(selected);
    if (allVisibleSelected) {
      filtered.forEach((p) => next.delete(p.id));
    } else {
      filtered.forEach((p) => next.add(p.id));
    }
    setSelected(next);
    setBulkAction("");
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setBulkAction("");
  };

  const handleBulkClick = () => {
    if (!bulkAction || selected.size === 0) return;
    setShowBulkConfirm(true);
  };

  const applyBulk = () => {
    if (!bulkAction || selected.size === 0) return;
    const newStatus: Status =
      bulkAction === "active"
        ? "Active"
        : bulkAction === "draft"
        ? "Draft"
        : "Hidden";
    setItems((prev) =>
      prev.map((p) => (selected.has(p.id) ? { ...p, status: newStatus } : p))
    );
    setSelected(new Set());
    setBulkAction("");
    setShowBulkConfirm(false);
  };

  const handleDuplicateClick = (productId: string) =>
    setDuplicateProductId(productId);

  const confirmDuplicate = () => {
    if (!duplicateProductId) return;
    const src = items.find((p) => p.id === duplicateProductId);
    if (!src) return;
    setItems((prev) => [
      { ...src, id: `${Date.now()}`, title: `${src.title} (Copy)`, status: "Draft" },
      ...prev,
    ]);
    setDuplicateProductId(null);
  };

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pagedItems = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#edf1ff]">
      <ProductsTopbar title="Products" />

      <main className="flex-1 p-6 overflow-y-auto">
          {/* Page heading */}
          <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
            <div>
              <p className="text-[13px] text-[#667085] mt-0.5">
                {items.length} total products
              </p>
            </div>
            <Link to="/vendor/products/add">
              <Button
                className="bg-[#220e92] hover:bg-[#1a0a73] text-white rounded-lg h-9 px-4 gap-2 text-[13px] shadow-sm transition-all"
                style={{ fontWeight: 600 }}
              >
                <Plus className="size-4" />
                Add product
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-[0px_1px_3px_rgba(16,24,40,0.06),0px_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-[#eaecf0] px-5">
              <div className="flex items-center gap-1 overflow-x-auto">
                {TABS.map((t) => {
                  const isActive = activeTab === t.key;
                  const count = counts[t.key as keyof typeof counts];
                  return (
                    <button
                      key={t.key}
                      onClick={() => { setActiveTab(t.key); setPage(1); }}
                      className={`relative flex items-center gap-2 px-1 py-3.5 text-[13px] transition-colors whitespace-nowrap mr-4 ${
                        isActive
                          ? "text-[#220e92]"
                          : "text-[#667085] hover:text-[#344054]"
                      }`}
                      style={{ fontWeight: isActive ? 600 : 500 }}
                    >
                      <span>{t.label}</span>
                      <span
                        className={`inline-flex items-center justify-center rounded-full min-w-[20px] h-5 px-1.5 text-[11px] ${
                          isActive
                            ? "bg-[#ede9fe] text-[#220e92]"
                            : "bg-[#f2f4f7] text-[#667085]"
                        }`}
                        style={{ fontWeight: 500 }}
                      >
                        {count}
                      </span>
                      {isActive && (
                        <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#220e92] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border-b border-[#eaecf0]">
              <FilterSelect
                label="Gender"
                value={gender}
                onChange={(v) => { setGender(v); setPage(1); }}
                options={["All", "Women's", "Men's", "Girls", "Boys", "Unisex"]}
              />
              <FilterSelect
                label="Category"
                value={category}
                onChange={(v) => { setCategory(v); setPage(1); }}
                options={[
                  "All",
                  "Sarees",
                  "Kurta Sets",
                  "Dupattas",
                  "Bottomwear",
                  "Dresses",
                  "Kurtis",
                  "Shirts",
                ]}
                allLabel="All Categories"
              />
              <FilterSelect
                label="Subcategory"
                value={subcategory}
                onChange={(v) => { setSubcategory(v); setPage(1); }}
                options={[
                  "All",
                  "Sarees",
                  "Kurta Sets",
                  "Dupattas",
                  "Bottomwear",
                  "Dresses",
                  "Kurtis",
                  "Shirts",
                ]}
                allLabel="All Subcategories"
              />
            </div>

            {/* Bulk + search row */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#eaecf0] flex-wrap">
              <div className="flex items-center gap-2.5 min-h-[36px]">
                {selected.size > 0 ? (
                  <>
                    <span className="text-[12px] text-[#667085] bg-[#f9fafb] border border-[#eaecf0] rounded-lg px-2.5 py-1" style={{ fontWeight: 500 }}>
                      {selected.size} selected
                    </span>
                    {availableBulkActions.length > 0 ? (
                      <>
                        <Select value={bulkAction} onValueChange={setBulkAction}>
                          <SelectTrigger className="w-[180px] h-9 rounded-lg bg-white border-[#d0d5dd] text-[13px]">
                            <SelectValue placeholder="Bulk action…" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableBulkActions.map((a) => (
                              <SelectItem key={a.value} value={a.value}>
                                {a.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleBulkClick}
                          disabled={!bulkAction}
                          className="h-9 px-4 rounded-lg bg-[#220e92] hover:bg-[#1a0a73] text-white text-[13px] disabled:opacity-40"
                          style={{ fontWeight: 500 }}
                        >
                          Apply
                        </Button>
                      </>
                    ) : (
                      <span className="text-[12px] text-[#98a2b3]">
                        No actions available
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[12px] text-[#98a2b3]">
                    Select rows to take bulk action
                  </span>
                )}
              </div>

              <div className="relative w-full md:w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#98a2b3]" />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products…"
                  className="pl-9 h-9 rounded-lg border-[#d0d5dd] bg-white text-[13px] placeholder:text-[#98a2b3]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f9fafb] hover:bg-[#f9fafb] border-b border-[#eaecf0]">
                    <TableHead className="w-10 pl-5">
                      <Checkbox
                        checked={allVisibleSelected}
                        onCheckedChange={toggleAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>
                      Product
                    </TableHead>
                    <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>
                      <button
                        onClick={() =>
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                        className="inline-flex items-center gap-1 hover:text-[#220e92] transition-colors"
                      >
                        <ArrowUpDown className="size-3" />
                        Status
                      </button>
                    </TableHead>
                    <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>
                      Gender
                    </TableHead>
                    <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>
                      Category
                    </TableHead>
                    <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>
                      Subcategory
                    </TableHead>
                    <TableHead className="text-[#667085] text-[12px] text-right pr-5 py-3" style={{ fontWeight: 500 }}>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedItems.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-14"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="size-10 rounded-full bg-[#f2f4f7] flex items-center justify-center">
                            <Search className="size-4 text-[#98a2b3]" />
                          </div>
                          <p className="text-[14px] text-[#344054]" style={{ fontWeight: 500 }}>
                            No products found
                          </p>
                          <p className="text-[13px] text-[#98a2b3]">
                            Try adjusting your filters or search term
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {pagedItems.map((p) => (
                    <TableRow
                      key={p.id}
                      className="border-b border-[#eaecf0] hover:bg-[#fafafa] transition-colors"
                    >
                      <TableCell className="pl-5">
                        <Checkbox
                          checked={selected.has(p.id)}
                          onCheckedChange={() => toggleOne(p.id)}
                          aria-label={`Select ${p.title}`}
                        />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-10 rounded-lg overflow-hidden bg-[#f2f4f7] shrink-0 border border-[#eaecf0]">
                            <ImageWithFallback
                              src={p.image}
                              alt={p.title}
                              className="size-full object-cover"
                            />
                          </div>
                          <span
                            className="truncate max-w-[220px] text-[13px] text-[#101828]"
                            style={{ fontWeight: 500 }}
                          >
                            {p.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="text-[13px] text-[#475467] py-3">
                        {p.gender}
                      </TableCell>
                      <TableCell className="text-[13px] text-[#475467] py-3">
                        {p.category}
                      </TableCell>
                      <TableCell className="text-[13px] text-[#475467] py-3">
                        {p.subcategory}
                      </TableCell>
                      <TableCell className="text-right pr-5 py-3">
                        <div className="inline-flex items-center gap-1">
                          <button
                            title="View product"
                            onClick={() => navigate(`/vendor/products/${p.id}`)}
                            className="size-8 flex items-center justify-center rounded-lg text-[#98a2b3] hover:bg-[#f2f4f7] hover:text-[#344054] transition-colors"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            title="Duplicate product"
                            onClick={() => handleDuplicateClick(p.id)}
                            className="size-8 flex items-center justify-center rounded-lg text-[#98a2b3] hover:bg-[#f2f4f7] hover:text-[#344054] transition-colors"
                          >
                            <Copy className="size-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#eaecf0] flex-wrap gap-3">
              <p className="text-[12px] text-[#667085]">
                Showing{" "}
                <span style={{ fontWeight: 500 }}>
                  {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
                  {Math.min(page * ITEMS_PER_PAGE, filtered.length)}
                </span>{" "}
                of{" "}
                <span style={{ fontWeight: 500 }}>{filtered.length}</span>{" "}
                products
              </p>
              <Pagination
                page={page}
                onChange={setPage}
                total={totalPages}
              />
            </div>
          </div>
      </main>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        onConfirm={applyBulk}
        title="Apply Changes"
        message={`Are you sure you want to set all items to "${
          bulkAction === "active"
            ? "Active"
            : bulkAction === "draft"
            ? "Draft"
            : "Hidden"
        }"?`}
        confirmText="Yes, Apply"
        icon="alert"
      />

      <ConfirmationModal
        isOpen={duplicateProductId !== null}
        onClose={() => setDuplicateProductId(null)}
        onConfirm={confirmDuplicate}
        title="Duplicate product"
        message="Are you sure you want to duplicate this product?"
        confirmText="Yes, Duplicate"
        icon="alert"
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] text-[#475467]" style={{ fontWeight: 500 }}>
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 rounded-lg bg-white border-[#d0d5dd] text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt === "All" && allLabel ? allLabel : opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Pagination({
  page,
  onChange,
  total,
}: {
  page: number;
  onChange: (p: number) => void;
  total: number;
}) {
  if (total <= 1) return null;
  const go = (p: number) => onChange(Math.max(1, Math.min(total, p)));
  const btn =
    "size-8 flex items-center justify-center rounded-lg text-[13px] text-[#475467] hover:bg-[#f2f4f7] disabled:opacity-30 disabled:hover:bg-transparent transition-colors";
  return (
    <div className="flex items-center gap-0.5">
      <button onClick={() => go(page - 1)} disabled={page === 1} className={btn}>
        ‹
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`size-8 flex items-center justify-center rounded-lg text-[13px] transition-colors ${
            p === page
              ? "bg-[#220e92] text-white"
              : "text-[#475467] hover:bg-[#f2f4f7]"
          }`}
          style={{ fontWeight: p === page ? 600 : 400 }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => go(page + 1)}
        disabled={page === total}
        className={btn}
      >
        ›
      </button>
    </div>
  );
}

export default Products;