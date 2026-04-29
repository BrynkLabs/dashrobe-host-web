import { useNavigate } from "react-router";
import { ArrowUpDown, Copy, Eye, Search } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../ui/table";
import { ImageWithFallback } from "../figma/ImageWithFallback";

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

const STATUS_CONFIG: Record<Status, { dot: string; text: string; bg: string }> = {
  Active: { dot: "bg-[#12b76a]", text: "text-[#027a48]", bg: "bg-[#ecfdf3]" },
  Draft: { dot: "bg-[#f79009]", text: "text-[#b54708]", bg: "bg-[#fffaeb]" },
  Hidden: { dot: "bg-[#98a2b3]", text: "text-[#475467]", bg: "bg-[#f2f4f7]" },
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

export function ProductTable({
  items,
  selected,
  allVisibleSelected,
  onToggleAll,
  onToggleOne,
  onDuplicate,
  sortOrder,
  onSortToggle,
}: {
  items: Product[];
  selected: Set<string>;
  allVisibleSelected: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onDuplicate: (id: string) => void;
  sortOrder: "asc" | "desc";
  onSortToggle: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f9fafb] hover:bg-[#f9fafb] border-b border-[#eaecf0]">
            <TableHead className="w-10 pl-5">
              <Checkbox checked={allVisibleSelected} onCheckedChange={onToggleAll} aria-label="Select all" />
            </TableHead>
            <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>Product</TableHead>
            <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>
              <button onClick={onSortToggle} className="inline-flex items-center gap-1 hover:text-[#220e92] transition-colors">
                <ArrowUpDown className="size-3" /> Status
              </button>
            </TableHead>
            <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>Gender</TableHead>
            <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>Category</TableHead>
            <TableHead className="text-[#667085] text-[12px] py-3" style={{ fontWeight: 500 }}>Subcategory</TableHead>
            <TableHead className="text-[#667085] text-[12px] text-right pr-5 py-3" style={{ fontWeight: 500 }}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-14">
                <div className="flex flex-col items-center gap-2">
                  <div className="size-10 rounded-full bg-[#f2f4f7] flex items-center justify-center">
                    <Search className="size-4 text-[#98a2b3]" />
                  </div>
                  <p className="text-[14px] text-[#344054]" style={{ fontWeight: 500 }}>No products found</p>
                  <p className="text-[13px] text-[#98a2b3]">Try adjusting your filters or search term</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {items.map((p) => (
            <TableRow key={p.id} className="border-b border-[#eaecf0] hover:bg-[#fafafa] transition-colors">
              <TableCell className="pl-5">
                <Checkbox checked={selected.has(p.id)} onCheckedChange={() => onToggleOne(p.id)} aria-label={`Select ${p.title}`} />
              </TableCell>
              <TableCell className="py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-lg overflow-hidden bg-[#f2f4f7] shrink-0 border border-[#eaecf0]">
                    <ImageWithFallback src={p.image} alt={p.title} className="size-full object-cover" />
                  </div>
                  <span className="truncate max-w-[220px] text-[13px] text-[#101828]" style={{ fontWeight: 500 }}>{p.title}</span>
                </div>
              </TableCell>
              <TableCell className="py-3"><StatusBadge status={p.status} /></TableCell>
              <TableCell className="text-[13px] text-[#475467] py-3">{p.gender}</TableCell>
              <TableCell className="text-[13px] text-[#475467] py-3">{p.category}</TableCell>
              <TableCell className="text-[13px] text-[#475467] py-3">{p.subcategory}</TableCell>
              <TableCell className="text-right pr-5 py-3">
                <div className="inline-flex items-center gap-1">
                  <button title="View product" onClick={() => navigate(`/vendor/products/${p.id}`)} className="size-8 flex items-center justify-center rounded-lg text-[#98a2b3] hover:bg-[#f2f4f7] hover:text-[#344054] transition-colors">
                    <Eye className="size-4" />
                  </button>
                  <button title="Duplicate product" onClick={() => onDuplicate(p.id)} className="size-8 flex items-center justify-center rounded-lg text-[#98a2b3] hover:bg-[#f2f4f7] hover:text-[#344054] transition-colors">
                    <Copy className="size-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ProductPagination({
  page,
  totalPages,
  filteredCount,
  itemsPerPage,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  filteredCount: number;
  itemsPerPage: number;
  onPageChange: (p: number) => void;
}) {
  const go = (p: number) => onPageChange(Math.max(1, Math.min(totalPages, p)));
  const btn = "size-8 flex items-center justify-center rounded-lg text-[13px] text-[#475467] hover:bg-[#f2f4f7] disabled:opacity-30 disabled:hover:bg-transparent transition-colors";

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-[#eaecf0] flex-wrap gap-3">
      <p className="text-[12px] text-[#667085]">
        Showing{" "}
        <span style={{ fontWeight: 500 }}>
          {Math.min((page - 1) * itemsPerPage + 1, filteredCount)}–{Math.min(page * itemsPerPage, filteredCount)}
        </span>{" "}
        of <span style={{ fontWeight: 500 }}>{filteredCount}</span> products
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-0.5">
          <button onClick={() => go(page - 1)} disabled={page === 1} className={btn}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => go(p)}
              className={`size-8 flex items-center justify-center rounded-lg text-[13px] transition-colors ${
                p === page ? "bg-[#220e92] text-white" : "text-[#475467] hover:bg-[#f2f4f7]"
              }`}
              style={{ fontWeight: p === page ? 600 : 400 }}
            >
              {p}
            </button>
          ))}
          <button onClick={() => go(page + 1)} disabled={page === totalPages} className={btn}>›</button>
        </div>
      )}
    </div>
  );
}
