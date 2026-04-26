import { useState, useEffect, type ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  X,
  Eye,
  Users,
  CircleCheck,
  CircleX,
  TriangleAlert,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Ban,
  RotateCcw,
  FileCheck,
  Shield,
} from "lucide-react";
import {
  approveStore,
  downloadDocument,
  getVendorDetail,
  reactivateVendorStore,
  rejectStore,
  suspendVendorStore,
} from "@/app/Service/VendorListActionService/vendorListActionService";
import { StoreType, VendorDetailData } from "@/app/Service/VendorListActionService/Types/storeType";
import {
  ConfirmModal,
  formatSubmittedAt,
  statusConfig,
  type StoreStatus,
} from "./AdminStores";

// Convert "HH:MM" (24h) to "h:MM AM/PM" (12h). Returns the input untouched
// when it doesn't match the expected pattern.
function formatTime12h(value?: string | null): string {
  if (!value) return "";
  const match = /^(\d{1,2}):(\d{2})/.exec(String(value).trim());
  if (!match) return String(value);
  const hours24 = Number(match[1]);
  const minutes = match[2];
  if (Number.isNaN(hours24)) return String(value);
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
}

// ═══════════════════════════════════════════════════════════════
export function AdminStoreDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeId: routeStoreId } = useParams<{ storeId?: string }>();

  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [vendorDetail, setVendorDetail] = useState<VendorDetailData | null>(null);
  const [vendorDetailLoading, setVendorDetailLoading] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);
  const [showReactivateModal, setShowReactivateModal] = useState<string | null>(null);

  const [approveError, setApproveError] = useState<string>("");
  const [rejectError, setRejectError] = useState("");
  const [suspendError, setSuspendError] = useState("");
  const [reactivateError, setReactivateError] = useState("");

  const [suspendLoading, setSuspendLoading] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);

  const [rejectReason, setRejectReason] = useState("");

  const [previewDoc, setPreviewDoc] = useState<{
    name: string;
    url: string;
    fileType: string;
  } | null>(null);
  const [docPreviewLoading, setDocPreviewLoading] = useState(false);

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

  const handleApprove = async (id: string) => {
    try {
      setApproveError("");
      const response = await approveStore(id);
      if (response?.status === 200) {
        setShowApproveModal(null);
        setSelectedStore((prev) => prev?.vendorId === id ? { ...prev, status: "APPROVED" } : prev);
        setVendorDetail((prev) => prev?.vendorId === id ? { ...prev, status: "APPROVED" } : prev);
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
        setSelectedStore((prev) => prev?.vendorId === id ? { ...prev, status: "REJECTED" } : prev);
        setVendorDetail((prev) => prev?.vendorId === id ? { ...prev, status: "REJECTED" } : prev);
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
        setSelectedStore((prev) => prev?.vendorId === id ? { ...prev, status: "SUSPENDED" } : prev);
        setVendorDetail((prev) => prev?.vendorId === id ? { ...prev, status: "SUSPENDED" } : prev);
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
      setSelectedStore((prev) =>
        prev?.vendorId === id ? { ...prev, status: "APPROVED" } : prev
      );
      setVendorDetail((prev) =>
        prev?.vendorId === id ? { ...prev, status: "APPROVED" } : prev
      );
    } catch (e) {
      console.error("Error reactivating store:", e);
      setReactivateError(e instanceof Error ? e.message : "Failed to reactivate store");
    } finally {
      setReactivateLoading(false);
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

  // ─── Helper: Verified/Boolean badge ────────────────────────
  const VBadge = ({
    ok,
    yes = "Yes",
    no = "No",
  }: {
    ok: boolean;
    yes?: string;
    no?: string;
  }) => (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
      style={{
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: ok ? "#D1FAE5" : "#FEE2E2",
        color: ok ? "#059669" : "#DC2626",
      }}
    >
      {ok ? (
        <CircleCheck className="w-3 h-3" />
      ) : (
        <CircleX className="w-3 h-3" />
      )}
      {ok ? yes : no}
    </span>
  );

  const MissingTag = () => (
    <VBadge ok={false} yes="Present" no="Missing" />
  );

  const isMissingValue = (v?: string) => {
    if (v === undefined || v === null) return true;
    const s = String(v).trim();
    if (!s) return true;
    const lower = s.toLowerCase();
    if (lower === "—" || lower === "-" || lower === "na" || lower === "n/a" || lower === "null" || lower === "undefined") return true;
    if (lower === "undefined (undefined)" || lower === "(undefined)" || lower === "()") return true;
    return false;
  };

  const DField = ({
    label,
    value,
    badge,
  }: {
    label: string;
    value?: string;
    badge?: ReactNode;
  }) => {
    const missing = isMissingValue(value) && !badge;
    return (
      <div className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
        <span
          className="text-muted-foreground shrink-0"
          style={{ fontSize: "13px" }}
        >
          {label}
        </span>
        <div className="text-right flex items-center gap-2">
          {!missing && value && !isMissingValue(value) && (
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>
          )}
          {badge}
          {missing && <MissingTag />}
        </div>
      </div>
    );
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

  // ─── Detail Panel ──────────────────────────────────────────
  if (!vendorDetail || !selectedStore) {
    return null;
  }

  const s = selectedStore;
  const vd = vendorDetail;
  const stCfg = statusConfig[vd.status as StoreStatus] || statusConfig["SUBMITTED"];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-[10px] hover:bg-muted border border-border transition-colors" style={{ fontSize: "13px" }}>
            ← Back
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 style={{ fontSize: "22px", fontWeight: 700 }}>{vd.basicDetails?.storeName || s.storeName}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600, color: stCfg.color, backgroundColor: stCfg.bg }}>
                <stCfg.icon className="w-3.5 h-3.5" />
                {stCfg.label}
              </span>
            </div>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>Store ID: {s.vendorId} · Applied {formatSubmittedAt(vd.submittedAt || s.submittedAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {vd.status === "SUBMITTED" && (
            <>
              <button onClick={() => setShowRejectModal(s.vendorId)} className="px-4 py-2.5 rounded-[10px] border border-red-200 text-red-600 hover:bg-red-50 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                <span className="flex items-center gap-2"><CircleX className="w-4 h-4" /> Reject</span>
              </button>
              <button
                onClick={() => vd.currentStep >= 7 && setShowApproveModal(s.vendorId)}
                disabled={vd.currentStep < 7}
                className={`px-4 py-2.5 rounded-[10px] transition-colors ${
                  vd.currentStep >= 7
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-muted text-muted-foreground/50 cursor-not-allowed"
                }`}
                style={{ fontSize: "14px", fontWeight: 500 }}
                title={vd.currentStep >= 7 ? "Approve this store" : `Onboarding incomplete (Step ${vd.currentStep}/7)`}
              >
                <span className="flex items-center gap-2"><CircleCheck className="w-4 h-4" /> Approve</span>
              </button>
            </>
          )}
          {vd.status === "APPROVED" && (
            <button onClick={() => setShowSuspendModal(s.vendorId)} className="px-4 py-2.5 rounded-[10px] border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
              <span className="flex items-center gap-2"><Ban className="w-4 h-4" /> Suspend</span>
            </button>
          )}
          {(vd.status === "SUSPENDED" || vd.status === "REJECTED") && (
            <button onClick={() => setShowReactivateModal(s.vendorId)} className="px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
              <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reactivate</span>
            </button>
          )}
        </div>
      </div>

      {/* Rejection Reason Banner */}
      {vd.rejectionReason && vd.status === "REJECTED" && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-start gap-3">
          <TriangleAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#DC2626" }}>Rejection Reason</p>
            <p style={{ fontSize: "13px", color: "#991B1B" }} className="mt-0.5">{vd.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Onboarding Progress Banner */}
      <div className={`rounded-[12px] border p-4 ${vd.currentStep >= 7 ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"}`}>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Onboarding Progress</span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: vd.currentStep >= 8 ? "#059669" : "#D97706" }}>
            {vd.status != "DRAFT" || vd.currentStep - 1 >= 7 ? "All 7 steps complete" : `Step ${vd.currentStep - 1} of 7`}
          </span>
        </div>
        <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-border">
          <div className="h-full rounded-full transition-all" style={{ width: `${vd.status != "DRAFT" ? "100%" : ((vd.currentStep - 1) / 7) * 100}%`, backgroundColor: vd.status != "DRAFT" || vd.currentStep - 1 >= 7 ? "#059669" : "#D97706" }} />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {["Basic Details", "Operations", "Categories", "Banking", "Returns", "Offers", "Review"].map((step, i) => (
            <span key={step} className="px-2.5 py-1 rounded-lg" style={{ fontSize: "11px", fontWeight: 600, backgroundColor: vd.status != "DRAFT" || i < vd.currentStep - 1 ? "#D1FAE5" : "#F3F4F6", color: vd.status != "DRAFT" || i < vd.currentStep - 1 ? "#059669" : "#9CA3AF" }}>
              {vd.status != "DRAFT" || i < vd.currentStep - 1 ? "✓ " : ""}{step}
            </span>
          ))}
        </div>
      </div>

      {/* ───── Onboarding Details ───── */}
      <div className="space-y-5">
        {/* Step 1: Basic Details */}
        {vd.basicDetails && (
          <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>1</span>
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Vendor Basic Details</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                <div>
                  <DField label="Store Name" value={vd.basicDetails.storeName} />
                  <DField label="Store Type" value={vd.basicDetails.storeType || undefined} />
                  <DField label="Business Name" value={vd.basicDetails.businessName} />
                  <DField label="Owner" value={vd.basicDetails.ownerName} />
                  <DField label="Legal Entity" value={vd.basicDetails.legalEntityType} />
                  <DField label="GSTIN" value={vd.basicDetails.gstin} />
                  <DField label="PAN" value={vd.basicDetails.pan} />
                </div>
                <div>
                  <DField
                    label="Contact Person"
                    value={
                      vd.basicDetails.contactPersonName
                        ? vd.basicDetails.designation
                          ? `${vd.basicDetails.contactPersonName} (${vd.basicDetails.designation})`
                          : vd.basicDetails.contactPersonName
                        : undefined
                    }
                  />
                  <DField label="Phone" value={vd.basicDetails.phoneNumber} />
                  {/* <DField label="WhatsApp" value={vd.basicDetails.whatsappNumber} /> */}
                  {/* <DField label="Alt. Phone" value={vd.basicDetails.alternatePhone || undefined} /> */}
                  <DField label="Email" value={vd.basicDetails.email} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Business Address</p>
                {(() => {
                  const composed = [
                    vd.basicDetails.registeredAddress,
                    vd.basicDetails.street,
                    vd.basicDetails.landmark,
                    vd.basicDetails.city,
                    vd.basicDetails.district,
                    vd.basicDetails.state,
                    vd.basicDetails.pincode,
                  ]
                    .filter((v) => v && String(v).trim())
                    .join(", ");
                  const finalVal = composed || vd.basicDetails.businessAddress;
                  return isMissingValue(finalVal) ? (
                    <div className="mt-1"><MissingTag /></div>
                  ) : (
                    <p style={{ fontSize: "13px", fontWeight: 500 }} className="mt-1">{finalVal}</p>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Store Operations */}
        {vd.currentStep >= 2 && vd.storeOperations && (
          <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>2</span>
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Store Operations</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                <div>
                  <DField label="Store Location" value={vd.storeOperations.storeLocation} />
                  <DField
                    label="Store Address"
                    value={
                      [
                        vd.storeOperations.shopNo,
                        vd.storeOperations.street,
                        vd.storeOperations.landmark,
                        vd.storeOperations.city,
                        vd.storeOperations.district,
                        vd.storeOperations.state,
                        vd.storeOperations.pincode,
                      ]
                        .filter((v) => v && String(v).trim())
                        .join(", ") || undefined
                    }
                  />
                  <DField label="Preparation Time" value={isMissingValue(vd.storeOperations.orderPreparationTime) ? undefined : `${vd.storeOperations.orderPreparationTime} mins`} />
                  <DField label="Packing Time" value={isMissingValue(vd.storeOperations.averagePackingTime) ? undefined : `${vd.storeOperations.averagePackingTime} mins`} />
                </div>
                <div>
                  <DField label="30-min Delivery" badge={<VBadge ok={vd.storeOperations.readyFor30MinDelivery} yes="Enabled" no="Disabled" />} />
                  {/* <DField label="Packaging" value={vd.storeOperations.packagingResponsibility} /> */}
                  <DField label="Delivery Coverage" value={vd.storeOperations.deliveryCoverageKm != null ? `${vd.storeOperations.deliveryCoverageKm} km` : undefined} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-muted-foreground mb-2" style={{ fontSize: "12px", fontWeight: 500 }}>Operating Hours</p>
                {vd.storeOperations.operatingHours.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {vd.storeOperations.operatingHours.map((oh) => (
                      <span key={oh.day} className={`px-3 py-1 rounded-full ${oh.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                        {oh.day}: {oh.isOpen ? `${formatTime12h(oh.openTime)} – ${formatTime12h(oh.closeTime)}` : "Closed"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <MissingTag />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Product Categories */}
        {vd.currentStep >= 3 && vd.productCategories && (
          <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>3</span>
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Product Categories</h3>
            </div>
            <div className="p-5">
              <div className="mb-3">
                <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Selected Categories</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {vd.productCategories.selectedCategories && vd.productCategories.selectedCategories.length > 0 ? (
                    vd.productCategories.selectedCategories.map((cat) => (
                      <span key={cat.id} className="bg-[#220E92]/8 text-[#220E92] px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{cat.name}</span>
                    ))
                  ) : (
                    <MissingTag />
                  )}
                </div>
              </div>
              <div className="mb-3">
                <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Selected Sub-Categories</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {vd.productCategories.selectedSubcategories && vd.productCategories.selectedSubcategories.length > 0 ? (
                    vd.productCategories.selectedSubcategories.map((cat) => (
                      <span key={cat.id} className="bg-[#220E92]/8 text-[#220E92] px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{cat.name}</span>
                    ))
                  ) : (
                    <MissingTag />
                  )}
                </div>
              </div>
              <DField label="SKU Count (Approx)" value={vd.productCategories.skuCountApprox != null ? String(vd.productCategories.skuCountApprox) : undefined} />
              <DField label="Pricing Type" value={vd.productCategories.pricingType} />
              <DField label="Price Range" value={vd.productCategories.averagePriceRange} />
              <DField label="Customization Offered" badge={<VBadge ok={vd.productCategories.customizationAvailable} yes="Available" no="Not Available" />} />
            </div>
          </div>
        )}

        {/* Step 4: Bank & Settlement */}
        {vd.currentStep >= 4 && vd.bankSettlement && (
          <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>4</span>
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Bank & Settlement Details</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                <div>
                  <DField label="Account Holder" value={vd.bankSettlement.accountHolderName || undefined} />
                  <DField label="Bank Name" value={vd.bankSettlement.bankName || undefined} />
                  <DField label="Account Number" value={vd.bankSettlement.accountNumber || undefined} />
                  <DField label="Account Type" value={vd.bankSettlement.accountType || undefined} />
                  <DField label="IFSC Code" value={vd.bankSettlement.ifscCode || undefined} />
                  {/* <DField label="UPI ID" value={vd.bankSettlement.upiId || undefined} /> */}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-[#220E92]" />
                    <p style={{ fontSize: "13px", fontWeight: 600 }}>Documents & Certificates</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "GST Certificate", uploaded: !!vd.bankSettlement.docGstCertificateS3Key, s3Key: vd.bankSettlement.docGstCertificateS3Key },
                      { name: "Business PAN", uploaded: !!vd.bankSettlement.docBusinessPanS3Key, s3Key: vd.bankSettlement.docBusinessPanS3Key },
                      { name: "Owner PAN", uploaded: !!vd.bankSettlement.docOwnerPanS3Key, s3Key: vd.bankSettlement.docOwnerPanS3Key },
                      { name: "Bank Proof", uploaded: !!vd.bankSettlement.docBankProofS3Key, s3Key: vd.bankSettlement.docBankProofS3Key },
                    ].map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between py-2.5 px-3.5 rounded-[10px] bg-muted/40 border border-border/60">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${doc.uploaded ? "bg-emerald-100" : "bg-red-100"}`}>
                            {doc.uploaded ? <FileCheck className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-red-500" />}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{doc.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <VBadge ok={doc.uploaded} yes="Uploaded" no="Missing" />
                          {doc.uploaded && doc.s3Key && (
                            <button
                              onClick={() => handleViewDocument(doc.s3Key!, doc.name)}
                              disabled={docPreviewLoading}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#220E92]/10 transition-colors"
                              title={`View ${doc.name}`}
                            >
                              <Eye className="w-4 h-4 text-[#220E92]" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Refund Policy */}
        {vd.currentStep >= 5 && vd.refundPolicy && (
          <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>5</span>
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Refund Policy</h3>
            </div>
            <div className="p-5">
              <DField label="Refund Window" value={vd.refundPolicy.refundWindow || undefined} />
              <DField label="Exchange Policy" value={vd.refundPolicy.exchangePolicy || undefined} />
              <DField label="Refund Mode" value={vd.refundPolicy.refundMode || undefined} />
              <DField label="Contact Number" value={vd.refundPolicy.refundContactNumber} />
              {/* <DField label="Contact Email" value={vd.refundPolicy.refundContactEmail} /> */}
            </div>
          </div>
        )}

        {/* Step 6: Offers & Promotions */}
        {vd.currentStep >= 6 && vd.offersPromotions && (
          <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>6</span>
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Offers & Promotions</h3>
            </div>
            <div className="p-5">
              {/* <DField label="Free Shipping" badge={<VBadge ok={vd.offersPromotions.freeShippingEnabled} yes="Enabled" no="Disabled" />} /> */}
              <DField label="Platform Ads" badge={<VBadge ok={vd.offersPromotions.platformAdsOptedIn} yes="Opted In" no="Not Opted In" />} />
            </div>
          </div>
        )}

        {/* Step 8: Review & Declaration */}
        {vd.currentStep >= 7 && (
          <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>7</span>
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Review & Declaration</h3>
            </div>
            <div className="p-5">
              <DField label="Declaration Accepted" badge={<VBadge ok={vd.declarationsAccepted} yes="Accepted" no="Not accepted" />} />
              <DField label="Submitted At" value={formatSubmittedAt(vd.submittedAt)} />
            </div>
          </div>
        )}

        {/* Incomplete notice */}
        {vd.currentStep < 7 && (
          <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4 flex items-start gap-3">
            <TriangleAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#92400E" }}>Onboarding Incomplete</p>
              <p style={{ fontSize: "13px", color: "#92400E" }} className="mt-0.5">
                This vendor has completed {vd.currentStep} of 7 onboarding steps. Steps {vd.currentStep}–7 have not been filled yet. The store cannot be approved until all steps are complete.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Store Info Card */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
        <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Store Information</h3>
        <div className="space-y-4">
          {[
            { icon: Users, label: "Owner", value: vd.basicDetails?.ownerName || s.ownerName },
            { icon: Mail, label: "Email", value: vd.basicDetails?.email || "—" },
            { icon: Phone, label: "Phone", value: vd.basicDetails?.phoneNumber || "—" },
            { icon: MapPin, label: "Location", value: s.location || vd.storeOperations?.storeLocation || "—" },
            { icon: FileText, label: "GSTIN", value: vd.basicDetails?.gstin || "—" },
            { icon: Calendar, label: "Submitted At", value: formatSubmittedAt(vd.submittedAt || s.submittedAt) },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <item.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{item.label}</p>
                <p style={{ fontSize: "14px", fontWeight: 500 }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approve Modal (in detail view) */}
      {showApproveModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowApproveModal(null); setApproveError(""); }}
        >
          <div className="bg-card rounded-[12px] p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <CircleCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Approve Store</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>This will activate the vendor's store</p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-5">
              Are you sure you want to approve <strong>{vd.basicDetails?.storeName || s.storeName}</strong>? The vendor will be able to list products and receive orders.
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setShowApproveModal(null); setApproveError(""); }} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={() => handleApprove(showApproveModal)} className="flex-1 px-4 py-2.5 rounded-[10px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                Approve
              </button>
            </div>
            {approveError && <p className="text-xs text-red-500 mt-2">{approveError}</p>}
          </div>
        </div>
      )}

      {/* Reject Modal (in detail view) */}
      {showRejectModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowRejectModal(null); setRejectReason(""); setRejectError(""); }}
        >
          <div className="bg-card rounded-[12px] p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <CircleX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Reject Store Application</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>The vendor will be notified</p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-4">
              Rejecting <strong>{vd.basicDetails?.storeName || s.storeName}</strong>'s application.
            </p>
            <div className="mb-5">
              <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Reason for rejection *</label>
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
              <button onClick={() => { setShowRejectModal(null); setRejectReason(""); setRejectError(""); }} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={() => handleReject(showRejectModal)} disabled={!rejectReason.trim()} className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50" style={{ fontSize: "14px", fontWeight: 500 }}>
                Reject
              </button>
            </div>
            {rejectError && <p className="text-xs text-red-500 mt-2">{rejectError}</p>}
          </div>
        </div>
      )}

      {/* Suspend Modal (in detail view) */}
      <ConfirmModal
        open={!!showSuspendModal}
        icon={Ban}
        tone="purple"
        title="Suspend Store"
        message={
          <>
            Are you sure you want to suspend <strong>{vd.basicDetails?.storeName || s.storeName}</strong>?
          </>
        }
        confirmLabel="Suspend"
        loadingLabel="Suspending..."
        loading={suspendLoading}
        error={suspendError}
        onConfirm={() => showSuspendModal && suspendStore(showSuspendModal)}
        onClose={() => { setShowSuspendModal(null); setSuspendError(""); }}
      />

      {/* Reactivate Modal (in detail view) */}
      <ConfirmModal
        open={!!showReactivateModal}
        icon={RotateCcw}
        tone="primary"
        title="Reactivate Store"
        message={
          <>
            Are you sure you want to reactivate <strong>{vd.basicDetails?.storeName || s.storeName}</strong>?
          </>
        }
        confirmLabel="Reactivate"
        loadingLabel="Reactivating..."
        loading={reactivateLoading}
        error={reactivateError}
        onConfirm={() => showReactivateModal && reactivateStore(showReactivateModal)}
        onClose={() => { setShowReactivateModal(null); setReactivateError(""); }}
      />

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-card rounded-[12px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/8 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5 text-[#220E92]" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate" style={{ fontSize: "16px", fontWeight: 600 }}>{previewDoc.name}</h3>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{previewDoc.fileType} Document</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-muted/20">
              {previewDoc.fileType === "pdf" ? (
                <iframe
                  src={previewDoc.url}
                  className="w-full rounded-[12px] border border-border"
                  style={{ minHeight: "500px" }}
                  title={previewDoc.name}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.name}
                    className="max-w-full max-h-[70vh] rounded-[12px] border border-border shadow-sm object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
