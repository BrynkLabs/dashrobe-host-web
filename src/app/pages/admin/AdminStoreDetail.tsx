import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { CircleCheck, CircleX, Ban, RotateCcw } from "lucide-react";
import {
  downloadDocument,
  getVendorDetail,
} from "@/app/Service/VendorListActionService/vendorListActionService";
import { StoreType, VendorDetailData } from "@/app/Service/VendorListActionService/Types/storeType";
import { ConfirmModal, RejectModal } from "../../components/admin/StoreActionModals";
import { DocumentPreviewModal } from "../../components/admin/DocumentPreviewModal";
import {
  StoreDetailHeader,
  RejectionBanner,
  OnboardingProgress,
  BasicDetailsSection,
  StoreOperationsSection,
  ProductCategoriesSection,
  BankSettlementSection,
  RefundPolicySection,
  OffersPromotionsSection,
  ReviewDeclarationSection,
  IncompleteNotice,
  StoreInfoCard,
} from "../../components/admin/StoreDetailSections";
import { useStoreActions } from "../../hooks/useStoreActions";

// ═══════════════════════════════════════════════════════════════
export function AdminStoreDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeId: routeStoreId } = useParams<{ storeId?: string }>();

  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [vendorDetail, setVendorDetail] = useState<VendorDetailData | null>(null);
  const [vendorDetailLoading, setVendorDetailLoading] = useState(false);

  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string; fileType: string } | null>(null);
  const [docPreviewLoading, setDocPreviewLoading] = useState(false);

  const actions = useStoreActions((id, newStatus) => {
    setSelectedStore((prev) => prev?.vendorId === id ? { ...prev, status: newStatus } : prev);
    setVendorDetail((prev) => prev?.vendorId === id ? { ...prev, status: newStatus } : prev);
  });

  // Auto-redirect from `/admin/stores` with location.state.store to detail URL.
  useEffect(() => {
    const state = location.state as { store?: StoreType } | null;
    if (state?.store && location.pathname !== `/admin/stores/${state.store.vendorId}`) {
      navigate(`/admin/stores/${state.store.vendorId}`, { replace: true, state: { store: state.store } });
    }
  }, [location.state, location.pathname, navigate]);

  // Sync detail view with URL params (`/admin/stores/:storeId`).
  useEffect(() => {
    if (!routeStoreId) {
      setSelectedStore(null);
      setVendorDetail(null);
      setVendorDetailLoading(false);
      return;
    }
    if (selectedStore?.vendorId === routeStoreId && vendorDetail?.vendorId === routeStoreId) {
      return;
    }
    const stateStore = (location.state as { store?: StoreType } | null)?.store;
    const found =
      (stateStore && stateStore.vendorId === routeStoreId ? stateStore : null) ||
      ({
        vendorId: routeStoreId,
        storeName: "",
        ownerName: "",
        location: "",
        revenue: 0,
        orderCount: 0,
        status: "",
        submittedAt: "",
      } as StoreType);
    handleViewVendorDetail(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeStoreId]);

  const handleViewDocument = async (s3Key: string, name: string) => {
    try {
      setDocPreviewLoading(true);
      const url = await downloadDocument(s3Key);
      const ext = s3Key.split(".").pop()?.toLowerCase() || "";
      const fileType = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext) ? "image" : ext === "pdf" ? "pdf" : "image";
      setPreviewDoc({ name, url, fileType });
    } catch (error) {
      console.error("Error previewing document:", error);
    } finally {
      setDocPreviewLoading(false);
    }
  };

  const handleViewVendorDetail = async (store: StoreType) => {
    setSelectedStore(store);
    setVendorDetailLoading(true);
    setVendorDetail(null);
    try {
      const response = await getVendorDetail(store.vendorId);
      if (response.success) {
        setVendorDetail(response.data);
      }
    } catch (error) {
      console.error("Error fetching vendor detail:", error);
    } finally {
      setVendorDetailLoading(false);
    }
  };

  // ─── Loading State ──────────────────────────────────────────
  if (routeStoreId && (vendorDetailLoading || vendorDetail?.vendorId !== routeStoreId)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-[10px] hover:bg-muted border border-border transition-colors" style={{ fontSize: "13px" }}>
            ← Back
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>{selectedStore?.storeName || "Vendor Store"}</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#220E92] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Loading vendor details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vendorDetail || !selectedStore) return null;

  const s = selectedStore;
  const vd = vendorDetail;
  const storeName = vd.basicDetails?.storeName || s.storeName;

  return (
    <div className="space-y-6">
      <StoreDetailHeader
        store={s}
        vendorDetail={vd}
        onBack={() => navigate(-1)}
        onApprove={actions.setShowApproveModal}
        onReject={actions.setShowRejectModal}
        onSuspend={actions.setShowSuspendModal}
        onReactivate={actions.setShowReactivateModal}
      />

      {vd.rejectionReason && vd.status === "REJECTED" && (
        <RejectionBanner reason={vd.rejectionReason} />
      )}

      <OnboardingProgress vd={vd} />

      <div className="space-y-5">
        <BasicDetailsSection vd={vd} />
        <StoreOperationsSection vd={vd} />
        <ProductCategoriesSection vd={vd} />
        <BankSettlementSection vd={vd} onViewDocument={handleViewDocument} docPreviewLoading={docPreviewLoading} />
        <RefundPolicySection vd={vd} />
        <OffersPromotionsSection vd={vd} />
        <ReviewDeclarationSection vd={vd} />
        <IncompleteNotice vd={vd} />
      </div>

      <StoreInfoCard store={s} vendorDetail={vd} />

      {/* Action Modals */}
      <ConfirmModal
        open={!!actions.showApproveModal}
        icon={CircleCheck}
        tone="emerald"
        title="Approve Store"
        subtitle="This will activate the vendor's store"
        message={<>Are you sure you want to approve <strong>{storeName}</strong>? The vendor will be able to list products and receive orders.</>}
        confirmLabel="Approve"
        error={actions.approveError}
        onConfirm={() => actions.showApproveModal && actions.handleApprove(actions.showApproveModal)}
        onClose={() => { actions.setShowApproveModal(null); actions.setApproveError(""); }}
      />
      <RejectModal
        open={!!actions.showRejectModal}
        icon={CircleX}
        storeName={storeName}
        error={actions.rejectError}
        onReject={(reason) => actions.showRejectModal && actions.handleReject(actions.showRejectModal, reason)}
        onClose={() => { actions.setShowRejectModal(null); actions.setRejectError(""); }}
      />
      <ConfirmModal
        open={!!actions.showSuspendModal}
        icon={Ban}
        tone="purple"
        title="Suspend Store"
        message={<>Are you sure you want to suspend <strong>{storeName}</strong>?</>}
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
        message={<>Are you sure you want to reactivate <strong>{storeName}</strong>?</>}
        confirmLabel="Reactivate"
        loadingLabel="Reactivating..."
        loading={actions.reactivateLoading}
        error={actions.reactivateError}
        onConfirm={() => actions.showReactivateModal && actions.handleReactivate(actions.showReactivateModal)}
        onClose={() => { actions.setShowReactivateModal(null); actions.setReactivateError(""); }}
      />

      {previewDoc && <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </div>
  );
}
