import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Eye,
  Store,
  CircleCheck,
  CircleX,
  Clock,
  Ban,
  RotateCcw,
} from "lucide-react";
import { Pagination } from "../../components/Pagination";
import {
  approveStore,
  getAll,
  reactivateVendorStore,
  rejectStore,
  suspendVendorStore,
} from "@/app/Service/VendorListActionService/vendorListActionService";
import { StatusCountType, StoreType } from "@/app/Service/VendorListActionService/Types/storeType";

// ─── Types ───────────────────────────────────────────────────
export type StoreStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type ConfirmTone = "purple" | "emerald" | "primary" | "red";

export const CONFIRM_TONE_STYLES: Record<
  ConfirmTone,
  { iconBg: string; iconColor: string; button: string }
> = {
  purple: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    button: "bg-purple-600 text-white hover:bg-purple-700",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    button: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  primary: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    button: "bg-[#220E92] text-white hover:bg-[#220E92]/90",
  },
  red: {
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    button: "bg-red-600 text-white hover:bg-red-700",
  },
};

export function ConfirmModal({
  open,
  icon: Icon,
  tone,
  title,
  subtitle,
  message,
  confirmLabel,
  loadingLabel,
  loading,
  error,
  onConfirm,
  onClose,
}: {
  open: boolean;
  icon: React.ComponentType<{ className?: string }>;
  tone: ConfirmTone;
  title: string;
  subtitle?: string;
  message: ReactNode;
  confirmLabel: string;
  loadingLabel?: string;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  const styles = CONFIRM_TONE_STYLES[tone];
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="bg-card rounded-[12px] p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${styles.iconColor}`} />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{title}</h3>
            {subtitle && (
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <p style={{ fontSize: "14px" }} className="mb-5">
          {message || "store"}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors disabled:opacity-50"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-[10px] transition-colors disabled:opacity-50 ${styles.button}`}
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            {loading ? loadingLabel || `${confirmLabel}...` : confirmLabel}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}

export function formatSubmittedAt(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  const hours24 = d.getHours();
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(hours12)}:${pad(d.getMinutes())} ${period}`;
}

export const statusConfig: Record<
  StoreStatus,
  { label: string; color: string; bg: string; icon: typeof CircleCheck }
> = {
  DRAFT: {
    label: "Draft",
    color: "#6B7280",
    bg: "#F3F4F6",
    icon: Clock,
  },
  SUBMITTED: {
    label: "Pending",
    color: "#D97706",
    bg: "#FEF3C7",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    color: "#059669",
    bg: "#D1FAE5",
    icon: CircleCheck,
  },
  REJECTED: {
    label: "Rejected",
    color: "#DC2626",
    bg: "#FEE2E2",
    icon: CircleX,
  },
  SUSPENDED: {
    label: "Suspended",
    color: "#7C3AED",
    bg: "#EDE9FE",
    icon: Ban,
  },
};

// ═══════════════════════════════════════════════════════════════
export function AdminStores() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreType[]>([]);
  const [statusCount, setStatusCount] = useState<StatusCountType>({
    DRAFT: 0,
    SUBMITTED: 0,
    APPROVED: 0,
    REJECTED: 0,
    SUSPENDED: 0
  });
  const [activeTab, setActiveTab] = useState<"all" | StoreStatus>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);
  const [showReactivateModal, setShowReactivateModal] = useState<string | null>(null);
  const [suspendError, setSuspendError] = useState("");
  const [reactivateError, setReactivateError] = useState("");
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [tablePage, setTablePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [approveError, setApproveError] = useState<string>("");
  const [rejectError, setRejectError] = useState("");
  const TABLE_ROWS = 5;

  const fetchStores = async () => {
    try {
      const response = await getAll({
        status: activeTab === "all" ? undefined : activeTab,
        page: tablePage - 1,
        size: TABLE_ROWS,
        search: debouncedSearch || undefined,
      });

      setStores(response.data.stores);
      setStatusCount(response.data.statusCounts);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalEntries);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchStores();
  }, [activeTab, debouncedSearch, tablePage, showRejectModal, showApproveModal]);

  // Actions
  const handleApprove = async (id: string) => {
    try {
      setApproveError("");
      const response = await approveStore(id);
      if (response?.status === 200) {
        setShowApproveModal(null);
        setStores((prev) => prev.map((s) => s.vendorId === id ? { ...s, status: "APPROVED" } : s));
      } else {
        throw new Error(
          response?.data?.message + response?.status ||
            "Failed to approve store"
        );
      }
    } catch (e) {
      console.error("Error approving store:", e);
      setApproveError(
        e instanceof Error ? e.message.slice(0, 40) : "Unknown error"
      );
      return;
    }
  };

  const handleReject = async (id: string) => {
    try {
      setRejectError("");

      const response = await rejectStore(id, rejectReason);

      if (response?.status === 200) {
        setShowRejectModal(null);
        setRejectReason("");
        setStores((prev) => prev.map((s) => s.vendorId === id ? { ...s, status: "REJECTED" } : s));
      } else {
        throw new Error(
          response?.data?.message + response?.status || "Failed to reject store"
        );
      }
    } catch (e) {
      console.error("Error rejecting store:", e);
      setRejectError(
        e instanceof Error ? e.message.slice(0, 40) : "Unknown error"
      );
    }
  };

  const suspendStore = async (id: string) => {
    try {
      setSuspendError("");
      setSuspendLoading(true);
      const response = await suspendVendorStore(id);

      if (response?.status === 200) {
        setShowSuspendModal(null);
        setStores((prev) =>
          prev.map((s) =>
            s.vendorId === id ? { ...s, status: "SUSPENDED" } : s
          )
        );
      } else {
        throw new Error("Failed to suspend store");
      }
    } catch (e) {
      console.error("Error suspending store:", e);
      setSuspendError(e instanceof Error ? e.message : "Failed to suspend store");
    } finally {
      setSuspendLoading(false);
    }
  };

  const reactivateStore = async (id: string) => {
    try {
      setReactivateError("");
      setReactivateLoading(true);
      await reactivateVendorStore(id);
      setShowReactivateModal(null);
      setStores((prev) =>
        prev.map((s) =>
          s.vendorId === id ? { ...s, status: "APPROVED" } : s
        )
      );
      setActionMenuId(null);
    } catch (e) {
      console.error("Error reactivating store:", e);
      setReactivateError(e instanceof Error ? e.message : "Failed to reactivate store");
    } finally {
      setReactivateLoading(false);
    }
  };

  const formatCurrency = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v}`;
  };

  // ─── Main List View ────────────────────────────────────────
  return (
    <div className="space-y-6" onClick={() => setActionMenuId(null)}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Vendor Stores</h1>
        <p
          className="text-muted-foreground mt-0.5"
          style={{ fontSize: "13px" }}
        >
          Manage vendor applications, approvals, and monitor store performance
        </p>
      </div>

      {/* Tab Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-muted rounded-[12px] p-1.5">
          {(
            [
              { key: "all", label: "All Stores", value: "all" },
              { key: "pending", label: "Pending", value: "SUBMITTED" },
              { key: "approved", label: "Approved", value: "APPROVED" },
              { key: "rejected", label: "Rejected", value: "REJECTED" },
              { key: "suspended", label: "Suspended", value: "SUSPENDED" },
            ] as { key: string; label: string; value: "all" | StoreStatus }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.value);
                setTablePage(1);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] transition-all ${
                activeTab === tab.value
                  ? "bg-[#220E92] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-md ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-border text-muted-foreground"
                }`}
                style={{ fontSize: "11px", fontWeight: 700 }}
              >
                {tab.key === "all" ? (statusCount.APPROVED + statusCount.DRAFT + statusCount.REJECTED + statusCount.SUBMITTED + statusCount.SUSPENDED) : tab.key === "pending" ? statusCount.SUBMITTED : tab.key === "approved" ? statusCount.APPROVED : tab.key === "rejected" ? statusCount.REJECTED : tab.key === "suspended" ? statusCount.SUSPENDED : 0}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stores, owners, cities..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setTablePage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-border bg-card"
            style={{ fontSize: "14px" }}
          />
        </div>
      </div>

      {/* Store Table */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {[
                  "Store",
                  "Owner",
                  "Location",
                  "Revenue",
                  "Orders",
                  "Status",
                  "Applied",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
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
                        <div
                          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#220E9212" }}
                        >
                          <Store
                            className="w-4 h-4"
                            style={{ color: "#220E92" }}
                          />
                        </div>
                        <span
                          className="hover:text-[#220E92] transition-colors"
                          style={{ fontSize: "14px", fontWeight: 600 }}
                        >
                          {store.storeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>
                          {store.ownerName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "13px" }}
                      >
                        {store.location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>
                        {store.revenue > 0
                          ? formatCurrency(store.revenue)
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>
                        {store.orderCount > 0
                          ? store.orderCount.toLocaleString()
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: stCfg.color,
                          backgroundColor: stCfg.bg,
                        }}
                      >
                        <stCfg.icon className="w-3.5 h-3.5" />
                        {stCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "12px" }}
                      >
                        {formatSubmittedAt(store.submittedAt)}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative flex items-center gap-1">
                        {/* Pending actions */}
                        {store.status === "SUBMITTED" && (
                          <button
                            onClick={() =>
                              store.status === "SUBMITTED" &&
                              setShowApproveModal(store.vendorId)
                            }
                            disabled={store.status !== "SUBMITTED"}
                            className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-colors ${
                              store.status === "SUBMITTED"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300"
                                : "bg-muted/50 text-muted-foreground/50 border-border cursor-not-allowed"
                            }`}
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title={
                              store.status === "SUBMITTED"
                                ? "Approve"
                                : `Cannot approve a ${store.status} store`
                            }
                          >
                            <CircleCheck className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        {store.status === "SUBMITTED" && (
                          <button
                            onClick={() => setShowRejectModal(store.vendorId)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title="Reject"
                          >
                            <CircleX className="w-3.5 h-3.5" /> Reject
                          </button>
                        )}
                        {/* Approved actions */}
                        {store.status === "APPROVED" && (
                          <button
                            onClick={() => setShowSuspendModal(store.vendorId)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title="Suspend"
                          >
                            <Ban className="w-3.5 h-3.5" /> Suspend
                          </button>
                        )}
                        {/* Rejected actions */}
                        {store.status === "REJECTED" && (
                          <button
                            onClick={() => setShowReactivateModal(store.vendorId)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title="Reactivate"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reactivate
                          </button>
                        )}
                        {/* Suspended actions */}
                        {store.status === "SUSPENDED" && (
                          <button
                            onClick={() => setShowReactivateModal(store.vendorId)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title="Reactivate"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reactivate
                          </button>
                        )}
                        {/* View button for all */}
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/stores/${store.vendorId}`); }}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p style={{ fontSize: "15px", fontWeight: 600 }}>
                      No stores found
                    </p>
                    <p
                      className="text-muted-foreground mt-1"
                      style={{ fontSize: "13px" }}
                    >
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {stores.length > 0 && (
          <Pagination
            currentPage={tablePage}
            totalPages={totalPages}
            totalItems={totalElements}
            itemsPerPage={TABLE_ROWS}
            onPageChange={setTablePage}
            itemLabel="stores"
          />
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* APPROVE MODAL                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showApproveModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowApproveModal(null);
            setApproveError("");
          }}
        >
          <div
            className="bg-card rounded-[12px] p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <CircleCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
                  Approve Store
                </h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "13px" }}
                >
                  This will activate the vendor's store
                </p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-5">
              Are you sure you want to approve{" "}
              <strong>
                {stores.find((s) => s.vendorId === showApproveModal)?.storeName}
              </strong>
              ? The vendor will be able to list products and receive orders.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApproveModal(null);
                  setApproveError("");
                }}
                className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(showApproveModal)}
                className="flex-1 px-4 py-2.5 rounded-[10px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Approve
              </button>
            </div>
            {approveError && (
              <p className="text-xs text-red-500">{approveError}</p>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* REJECT MODAL                                           */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showRejectModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowRejectModal(null);
            setRejectReason("");
            setRejectError("");
          }}
        >
          <div
            className="bg-card rounded-[12px] p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <CircleX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
                  Reject Store Application
                </h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "13px" }}
                >
                  The vendor will be notified
                </p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-4">
              Rejecting{" "}
              <strong>
                {stores.find((s) => s.vendorId === showRejectModal)?.storeName}
              </strong>
              's application.
            </p>
            <div className="mb-5">
              <label
                className="block text-muted-foreground mb-1.5"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Reason for rejection *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Incomplete documentation, invalid GST number..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background resize-none"
                style={{ fontSize: "14px" }}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                  setRejectError("");
                }}
                className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Reject
              </button>
            </div>
            {rejectError && (
              <p className="text-xs text-red-500">{rejectError}</p>
            )}
          </div>
        </div>
      )}
      <ConfirmModal
        open={!!showSuspendModal}
        icon={Ban}
        tone="purple"
        title="Suspend Store"
        message={
          <>
            Are you sure you want to suspend{" "}
            <strong>
              {stores.find((s) => s.vendorId === showSuspendModal)?.storeName}
            </strong>
            ?
          </>
        }
        confirmLabel="Suspend"
        loadingLabel="Suspending..."
        loading={suspendLoading}
        error={suspendError}
        onConfirm={() => showSuspendModal && suspendStore(showSuspendModal)}
        onClose={() => { setShowSuspendModal(null); setSuspendError(""); }}
      />
      <ConfirmModal
        open={!!showReactivateModal}
        icon={RotateCcw}
        tone="primary"
        title="Reactivate Store"
        message={
          <>
            Are you sure you want to reactivate{" "}
            <strong>
              {stores.find((s) => s.vendorId === showReactivateModal)?.storeName}
            </strong>
            ?
          </>
        }
        confirmLabel="Reactivate"
        loadingLabel="Reactivating..."
        loading={reactivateLoading}
        error={reactivateError}
        onConfirm={() => showReactivateModal && reactivateStore(showReactivateModal)}
        onClose={() => { setShowReactivateModal(null); setReactivateError(""); }}
      />
    </div>
  );
}
