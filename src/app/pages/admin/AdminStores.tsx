import { useState, useEffect } from "react";
import {
  CircleCheck,
  CircleX,
  Clock,
  Ban,
  RotateCcw,
} from "lucide-react";
import {
  ConfirmModal,
  RejectModal,
} from "../../components/admin/StoreActionModals";
import { StatusTabs } from "../../components/admin/StatusTabs";
import { StoreTable } from "../../components/admin/StoreTable";
import { useStoreActions } from "../../hooks/useStoreActions";
import { getAll } from "@/app/Service/VendorListActionService/vendorListActionService";
import { StatusCountType, StoreType } from "@/app/Service/VendorListActionService/Types/storeType";

// ─── Types & Config (re-exported for other files) ────────────
export type StoreStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export { ConfirmModal, RejectModal, type ConfirmTone, CONFIRM_TONE_STYLES } from "../../components/admin/StoreActionModals";

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

function parseAsUtc(value: string): Date {
  const s = value.trim();
  const hasTz = /(Z|[+-]\d{2}:?\d{2})$/.test(s);
  return new Date(hasTz ? s : `${s}Z`);
}

export function formatSubmittedAt(value?: string | null): string {
  if (!value) return "—";
  const parsed = parseAsUtc(value);
  if (isNaN(parsed.getTime())) return "—";
  const d = new Date(parsed.getTime() + IST_OFFSET_MS);
  const pad = (n: number) => String(n).padStart(2, "0");
  const hours24 = d.getUTCHours();
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()} ${hours12}:${pad(d.getUTCMinutes())}${period}`;
}

export const statusConfig: Record<
  StoreStatus,
  { label: string; color: string; bg: string; icon: typeof CircleCheck }
> = {
  DRAFT: { label: "Draft", color: "#6B7280", bg: "#F3F4F6", icon: Clock },
  SUBMITTED: { label: "Pending", color: "#D97706", bg: "#FEF3C7", icon: Clock },
  APPROVED: { label: "Approved", color: "#059669", bg: "#D1FAE5", icon: CircleCheck },
  REJECTED: { label: "Rejected", color: "#DC2626", bg: "#FEE2E2", icon: CircleX },
  SUSPENDED: { label: "Suspended", color: "#7C3AED", bg: "#EDE9FE", icon: Ban },
};

// ═══════════════════════════════════════════════════════════════
export function AdminStores() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [statusCount, setStatusCount] = useState<StatusCountType>({
    DRAFT: 0, SUBMITTED: 0, APPROVED: 0, REJECTED: 0, SUSPENDED: 0,
  });
  const [activeTab, setActiveTab] = useState<"all" | StoreStatus>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const TABLE_ROWS = 5;

  const actions = useStoreActions((id, newStatus) => {
    setStores((prev) => prev.map((s) => s.vendorId === id ? { ...s, status: newStatus } : s));
  });

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
  }, [activeTab, debouncedSearch, tablePage, actions.showRejectModal, actions.showApproveModal]);

  const storeName = (modalId: string | null) =>
    stores.find((s) => s.vendorId === modalId)?.storeName || "store";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Vendor Stores</h1>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
          Manage vendor applications, approvals, and monitor store performance
        </p>
      </div>

      <StatusTabs
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setTablePage(1); }}
        statusCount={statusCount}
        search={search}
        onSearchChange={(v) => { setSearch(v); setTablePage(1); }}
      />

      <StoreTable
        stores={stores}
        tablePage={tablePage}
        totalPages={totalPages}
        totalElements={totalElements}
        itemsPerPage={TABLE_ROWS}
        onPageChange={setTablePage}
        onApprove={actions.setShowApproveModal}
        onReject={actions.setShowRejectModal}
        onSuspend={actions.setShowSuspendModal}
        onReactivate={actions.setShowReactivateModal}
      />

      {/* Action Modals */}
      <ConfirmModal
        open={!!actions.showApproveModal}
        icon={CircleCheck}
        tone="emerald"
        title="Approve Store"
        subtitle="This will activate the vendor's store"
        message={<>Are you sure you want to approve <strong>{storeName(actions.showApproveModal)}</strong>? The vendor will be able to list products and receive orders.</>}
        confirmLabel="Approve"
        error={actions.approveError}
        onConfirm={() => actions.showApproveModal && actions.handleApprove(actions.showApproveModal)}
        onClose={() => { actions.setShowApproveModal(null); actions.setApproveError(""); }}
      />
      <RejectModal
        open={!!actions.showRejectModal}
        icon={CircleX}
        storeName={storeName(actions.showRejectModal)}
        error={actions.rejectError}
        onReject={(reason) => actions.showRejectModal && actions.handleReject(actions.showRejectModal, reason)}
        onClose={() => { actions.setShowRejectModal(null); actions.setRejectError(""); }}
      />
      <ConfirmModal
        open={!!actions.showSuspendModal}
        icon={Ban}
        tone="purple"
        title="Suspend Store"
        message={<>Are you sure you want to suspend <strong>{storeName(actions.showSuspendModal)}</strong>?</>}
        confirmLabel="Suspend"
        loadingLabel="Suspending..."
        loading={actions.suspendLoading}
        error={actions.suspendError}
        onConfirm={() => actions.showSuspendModal && actions.handleSuspend(actions.showSuspendModal)}
        onClose={() => { actions.setShowSuspendModal(null); actions.setSuspendError(""); }}
      />
      <ConfirmModal
        open={!!actions.showReactivateModal}
        icon={RotateCcw}
        tone="primary"
        title="Reactivate Store"
        message={<>Are you sure you want to reactivate <strong>{storeName(actions.showReactivateModal)}</strong>?</>}
        confirmLabel="Reactivate"
        loadingLabel="Reactivating..."
        loading={actions.reactivateLoading}
        error={actions.reactivateError}
        onConfirm={() => actions.showReactivateModal && actions.handleReactivate(actions.showReactivateModal)}
        onClose={() => { actions.setShowReactivateModal(null); actions.setReactivateError(""); }}
      />
    </div>
  );
}
