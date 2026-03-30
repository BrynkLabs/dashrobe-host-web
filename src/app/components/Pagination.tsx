import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "items",
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="px-5 py-3 border-t border-border bg-muted/20">
        <span className="text-muted-foreground" style={{ fontSize: "13px" }}>
          Showing {totalItems} {itemLabel}
        </span>
      </div>
    );
  }

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const rangeStart = Math.max(2, currentPage - 1);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="px-5 py-3 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="text-muted-foreground" style={{ fontSize: "13px" }}>
        Showing {start}–{end} of {totalItems} {itemLabel}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-1.5 text-muted-foreground" style={{ fontSize: "12px" }}>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 rounded-lg border transition-colors ${
                currentPage === page
                  ? "bg-[#220E92] text-white border-[#220E92]"
                  : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontSize: "12px", fontWeight: currentPage === page ? 600 : 400 }}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/** Utility hook logic — use inline or copy */
export function usePagination<T>(items: T[], itemsPerPage: number, page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginated = items.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);
  return { paginated, totalPages, safePage, totalItems: items.length };
}
