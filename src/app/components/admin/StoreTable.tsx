import { useNavigate } from "react-router";
import {
  Store,
  Eye,
  CircleCheck,
  CircleX,
  Ban,
  RotateCcw,
} from "lucide-react";
import { Pagination } from "../Pagination";
import type { StoreType } from "@/app/Service/VendorListActionService/Types/storeType";
import { formatSubmittedAt, statusConfig, type StoreStatus } from "../../pages/admin/AdminStores";

function formatCurrency(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v}`;
}

const HEADERS = ["Store", "Owner", "Location", "Revenue", "Orders", "Status", "Applied", "Actions"];

export function StoreTable({
  stores,
  tablePage,
  totalPages,
  totalElements,
  itemsPerPage,
  onPageChange,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
}: {
  stores: StoreType[];
  tablePage: number;
  totalPages: number;
  totalElements: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap"
                  style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => {
              const stCfg = statusConfig[store.status as StoreStatus];
              return (
                <tr
                  key={store.vendorId}
                  className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/stores/${store.vendorId}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "#220E9212" }}>
                        <Store className="w-4 h-4" style={{ color: "#220E92" }} />
                      </div>
                      <span className="hover:text-[#220E92] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>
                        {store.storeName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{store.ownerName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{store.location}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{store.revenue > 0 ? formatCurrency(store.revenue) : "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{store.orderCount > 0 ? store.orderCount.toLocaleString() : "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{ fontSize: "12px", fontWeight: 600, color: stCfg.color, backgroundColor: stCfg.bg }}
                    >
                      <stCfg.icon className="w-3.5 h-3.5" />
                      {stCfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{formatSubmittedAt(store.submittedAt)}</span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <ActionButtons
                      store={store}
                      onApprove={onApprove}
                      onReject={onReject}
                      onSuspend={onSuspend}
                      onReactivate={onReactivate}
                      onView={(id) => navigate(`/admin/stores/${id}`)}
                    />
                  </td>
                </tr>
              );
            })}
            {stores.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p style={{ fontSize: "15px", fontWeight: 600 }}>No stores found</p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>Try adjusting your search or filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {stores.length > 0 && (
        <Pagination
          currentPage={tablePage}
          totalPages={totalPages}
          totalItems={totalElements}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          itemLabel="stores"
        />
      )}
    </div>
  );
}

function ActionButtons({
  store,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
  onView,
}: {
  store: StoreType;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
  onView: (id: string) => void;
}) {
  return (
    <div className="relative flex items-center gap-1">
      {store.status === "SUBMITTED" && (
        <>
          <button
            onClick={() => onApprove(store.vendorId)}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-colors bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300"
            style={{ fontSize: "11px", fontWeight: 600 }}
            title="Approve"
          >
            <CircleCheck className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            onClick={() => onReject(store.vendorId)}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
            style={{ fontSize: "11px", fontWeight: 600 }}
            title="Reject"
          >
            <CircleX className="w-3.5 h-3.5" /> Reject
          </button>
        </>
      )}
      {store.status === "APPROVED" && (
        <button
          onClick={() => onSuspend(store.vendorId)}
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 transition-colors"
          style={{ fontSize: "11px", fontWeight: 600 }}
          title="Suspend"
        >
          <Ban className="w-3.5 h-3.5" /> Suspend
        </button>
      )}
      {(store.status === "REJECTED" || store.status === "SUSPENDED") && (
        <button
          onClick={() => onReactivate(store.vendorId)}
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          style={{ fontSize: "11px", fontWeight: 600 }}
          title="Reactivate"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reactivate
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onView(store.vendorId); }}
        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  );
}
