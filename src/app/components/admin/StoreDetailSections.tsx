import {
  CircleCheck,
  CircleX,
  Ban,
  RotateCcw,
  TriangleAlert,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  FileCheck,
  Eye,
  Users,
  Shield,
} from "lucide-react";
import type { StoreType, VendorDetailData } from "@/app/Service/VendorListActionService/Types/storeType";
import { formatSubmittedAt, statusConfig, type StoreStatus } from "../../pages/admin/AdminStores";
import { DField, VBadge, MissingTag, StepSection, isMissingValue } from "./StoreDetailHelpers";

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

// ─── Header ──────────────────────────────────────────────────
export function StoreDetailHeader({
  store,
  vendorDetail,
  onBack,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
}: {
  store: StoreType;
  vendorDetail: VendorDetailData;
  onBack: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
}) {
  const vd = vendorDetail;
  const s = store;
  const stCfg = statusConfig[vd.status as StoreStatus] || statusConfig["SUBMITTED"];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-[10px] hover:bg-muted border border-border transition-colors" style={{ fontSize: "13px" }}>
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
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
            Store ID: {s.vendorId} · Applied {formatSubmittedAt(vd.submittedAt || s.submittedAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {vd.status === "SUBMITTED" && (
          <>
            <button onClick={() => onReject(s.vendorId)} className="px-4 py-2.5 rounded-[10px] border border-red-200 text-red-600 hover:bg-red-50 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
              <span className="flex items-center gap-2"><CircleX className="w-4 h-4" /> Reject</span>
            </button>
            <button
              onClick={() => vd.currentStep >= 7 && onApprove(s.vendorId)}
              disabled={vd.currentStep < 7}
              className={`px-4 py-2.5 rounded-[10px] transition-colors ${vd.currentStep >= 7 ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-muted text-muted-foreground/50 cursor-not-allowed"}`}
              style={{ fontSize: "14px", fontWeight: 500 }}
              title={vd.currentStep >= 7 ? "Approve this store" : `Onboarding incomplete (Step ${vd.currentStep}/7)`}
            >
              <span className="flex items-center gap-2"><CircleCheck className="w-4 h-4" /> Approve</span>
            </button>
          </>
        )}
        {vd.status === "APPROVED" && (
          <button onClick={() => onSuspend(s.vendorId)} className="px-4 py-2.5 rounded-[10px] border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
            <span className="flex items-center gap-2"><Ban className="w-4 h-4" /> Suspend</span>
          </button>
        )}
        {(vd.status === "SUSPENDED" || vd.status === "REJECTED") && (
          <button onClick={() => onReactivate(s.vendorId)} className="px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
            <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reactivate</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Rejection Banner ────────────────────────────────────────
export function RejectionBanner({ reason }: { reason: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-start gap-3">
      <TriangleAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#DC2626" }}>Rejection Reason</p>
        <p style={{ fontSize: "13px", color: "#991B1B" }} className="mt-0.5">{reason}</p>
      </div>
    </div>
  );
}

// ─── Onboarding Progress ─────────────────────────────────────
export function OnboardingProgress({ vd }: { vd: VendorDetailData }) {
  const complete = vd.status !== "DRAFT" || vd.currentStep - 1 >= 7;
  const pct = vd.status !== "DRAFT" ? 100 : ((vd.currentStep - 1) / 7) * 100;
  const color = complete ? "#059669" : "#D97706";

  return (
    <div className={`rounded-[12px] border p-4 ${complete ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"}`}>
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: "14px", fontWeight: 600 }}>Onboarding Progress</span>
        <span style={{ fontSize: "12px", fontWeight: 600, color }}>
          {complete ? "All 7 steps complete" : `Step ${vd.currentStep - 1} of 7`}
        </span>
      </div>
      <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-border">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {["Basic Details", "Operations", "Categories", "Banking", "Returns", "Offers", "Review"].map((step, i) => {
          const done = vd.status !== "DRAFT" || i < vd.currentStep - 1;
          return (
            <span key={step} className="px-2.5 py-1 rounded-lg" style={{ fontSize: "11px", fontWeight: 600, backgroundColor: done ? "#D1FAE5" : "#F3F4F6", color: done ? "#059669" : "#9CA3AF" }}>
              {done ? "✓ " : ""}{step}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1: Basic Details ───────────────────────────────────
export function BasicDetailsSection({ vd }: { vd: VendorDetailData }) {
  if (!vd.basicDetails) return null;
  const bd = vd.basicDetails;

  const address = [bd.registeredAddress, bd.street, bd.landmark, bd.city, bd.district, bd.state, bd.pincode]
    .filter((v) => v && String(v).trim())
    .join(", ") || bd.businessAddress;

  return (
    <StepSection step={1} title="Vendor Basic Details">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        <div>
          <DField label="Store Name" value={bd.storeName} />
          <DField label="Store Type" value={bd.storeType || undefined} />
          <DField label="Business Name" value={bd.businessName} />
          <DField label="Owner" value={bd.ownerName} />
          <DField label="Legal Entity" value={bd.legalEntityType} />
          <DField label="GSTIN" value={bd.gstin} />
          <DField label="PAN" value={bd.pan} />
        </div>
        <div>
          <DField
            label="Contact Person"
            value={bd.contactPersonName ? (bd.designation ? `${bd.contactPersonName} (${bd.designation})` : bd.contactPersonName) : undefined}
          />
          <DField label="Phone" value={bd.phoneNumber} />
          <DField label="Email" value={bd.email} />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Business Address</p>
        {isMissingValue(address) ? (
          <div className="mt-1"><MissingTag /></div>
        ) : (
          <p style={{ fontSize: "13px", fontWeight: 500 }} className="mt-1">{address}</p>
        )}
      </div>
    </StepSection>
  );
}

// ─── Step 2: Store Operations ────────────────────────────────
export function StoreOperationsSection({ vd }: { vd: VendorDetailData }) {
  if (vd.currentStep < 2 || !vd.storeOperations) return null;
  const so = vd.storeOperations;

  const storeAddress = [so.shopNo, so.street, so.landmark, so.city, so.district, so.state, so.pincode]
    .filter((v) => v && String(v).trim())
    .join(", ") || undefined;

  return (
    <StepSection step={2} title="Store Operations">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        <div>
          <DField label="Store Location" value={so.storeLocation} />
          <DField label="Store Address" value={storeAddress} />
          <DField label="Preparation Time" value={isMissingValue(so.orderPreparationTime) ? undefined : `${so.orderPreparationTime} mins`} />
          <DField label="Packing Time" value={isMissingValue(so.averagePackingTime) ? undefined : `${so.averagePackingTime} mins`} />
        </div>
        <div>
          <DField label="30-min Delivery" badge={<VBadge ok={so.readyFor30MinDelivery} yes="Enabled" no="Disabled" />} />
          <DField label="Delivery Coverage" value={so.deliveryCoverageKm != null ? `${so.deliveryCoverageKm} km` : undefined} />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-muted-foreground mb-2" style={{ fontSize: "12px", fontWeight: 500 }}>Operating Hours</p>
        {so.operatingHours.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {so.operatingHours.map((oh) => (
              <span key={oh.day} className={`px-3 py-1 rounded-full ${oh.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                {oh.day}: {oh.isOpen ? `${formatTime12h(oh.openTime)} – ${formatTime12h(oh.closeTime)}` : "Closed"}
              </span>
            ))}
          </div>
        ) : (
          <MissingTag />
        )}
      </div>
    </StepSection>
  );
}

// ─── Step 3: Product Categories ──────────────────────────────
export function ProductCategoriesSection({ vd }: { vd: VendorDetailData }) {
  if (vd.currentStep < 3 || !vd.productCategories) return null;
  const pc = vd.productCategories;

  const CategoryTags = ({ items }: { items: { id: number; name: string }[] | undefined }) =>
    items && items.length > 0 ? (
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((cat) => (
          <span key={cat.id} className="bg-[#220E92]/8 text-[#220E92] px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{cat.name}</span>
        ))}
      </div>
    ) : (
      <div className="mt-2"><MissingTag /></div>
    );

  return (
    <StepSection step={3} title="Product Categories">
      <div className="mb-3">
        <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Selected Categories</p>
        <CategoryTags items={pc.selectedCategories} />
      </div>
      <div className="mb-3">
        <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Selected Sub-Categories</p>
        <CategoryTags items={pc.selectedSubcategories} />
      </div>
      <DField label="SKU Count (Approx)" value={pc.skuCountApprox != null ? String(pc.skuCountApprox) : undefined} />
      <DField label="Pricing Type" value={pc.pricingType} />
      <DField label="Price Range" value={pc.averagePriceRange} />
      <DField label="Customization Offered" badge={<VBadge ok={pc.customizationAvailable} yes="Available" no="Not Available" />} />
    </StepSection>
  );
}

// ─── Step 4: Bank & Settlement ───────────────────────────────
export function BankSettlementSection({
  vd,
  onViewDocument,
  docPreviewLoading,
}: {
  vd: VendorDetailData;
  onViewDocument: (s3Key: string, name: string) => void;
  docPreviewLoading: boolean;
}) {
  if (vd.currentStep < 4 || !vd.bankSettlement) return null;
  const bs = vd.bankSettlement;

  const docs = [
    { name: "GST Certificate", uploaded: !!bs.docGstCertificateS3Key, s3Key: bs.docGstCertificateS3Key },
    { name: "Business PAN", uploaded: !!bs.docBusinessPanS3Key, s3Key: bs.docBusinessPanS3Key },
    { name: "Owner PAN", uploaded: !!bs.docOwnerPanS3Key, s3Key: bs.docOwnerPanS3Key },
    { name: "Bank Proof", uploaded: !!bs.docBankProofS3Key, s3Key: bs.docBankProofS3Key },
  ];

  return (
    <StepSection step={4} title="Bank & Settlement Details">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        <div>
          <DField label="Account Holder" value={bs.accountHolderName || undefined} />
          <DField label="Bank Name" value={bs.bankName || undefined} />
          <DField label="Account Number" value={bs.accountNumber || undefined} />
          <DField label="Account Type" value={bs.accountType || undefined} />
          <DField label="IFSC Code" value={bs.ifscCode || undefined} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#220E92]" />
            <p style={{ fontSize: "13px", fontWeight: 600 }}>Documents & Certificates</p>
          </div>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.name} className="flex items-center justify-between py-2.5 px-3.5 rounded-[10px] bg-muted/40 border border-border/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${doc.uploaded ? "bg-emerald-100" : "bg-red-100"}`}>
                    {doc.uploaded ? <FileCheck className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-red-500" />}
                  </div>
                  <p className="truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{doc.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <VBadge ok={doc.uploaded} yes="Uploaded" no="Missing" />
                  {doc.uploaded && doc.s3Key && (
                    <button
                      onClick={() => onViewDocument(doc.s3Key!, doc.name)}
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
    </StepSection>
  );
}

// ─── Step 5: Refund Policy ───────────────────────────────────
export function RefundPolicySection({ vd }: { vd: VendorDetailData }) {
  if (vd.currentStep < 5 || !vd.refundPolicy) return null;
  const rp = vd.refundPolicy;

  return (
    <StepSection step={5} title="Refund Policy">
      <DField label="Refund Window" value={rp.refundWindow || undefined} />
      <DField label="Exchange Policy" value={rp.exchangePolicy || undefined} />
      <DField label="Refund Mode" value={rp.refundMode || undefined} />
      <DField label="Contact Number" value={rp.refundContactNumber} />
    </StepSection>
  );
}

// ─── Step 6: Offers & Promotions ─────────────────────────────
export function OffersPromotionsSection({ vd }: { vd: VendorDetailData }) {
  if (vd.currentStep < 6 || !vd.offersPromotions) return null;

  return (
    <StepSection step={6} title="Offers & Promotions">
      <DField label="Platform Ads" badge={<VBadge ok={vd.offersPromotions.platformAdsOptedIn} yes="Opted In" no="Not Opted In" />} />
    </StepSection>
  );
}

// ─── Step 7: Review & Declaration ────────────────────────────
export function ReviewDeclarationSection({ vd }: { vd: VendorDetailData }) {
  if (vd.currentStep < 7) return null;

  return (
    <StepSection step={7} title="Review & Declaration">
      <DField label="Declaration Accepted" badge={<VBadge ok={vd.declarationsAccepted} yes="Accepted" no="Not accepted" />} />
      <DField label="Submitted At" value={formatSubmittedAt(vd.submittedAt)} />
    </StepSection>
  );
}

// ─── Incomplete Notice ───────────────────────────────────────
export function IncompleteNotice({ vd }: { vd: VendorDetailData }) {
  if (vd.currentStep >= 7) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4 flex items-start gap-3">
      <TriangleAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#92400E" }}>Onboarding Incomplete</p>
        <p style={{ fontSize: "13px", color: "#92400E" }} className="mt-0.5">
          This vendor has completed {vd.currentStep} of 7 onboarding steps. Steps {vd.currentStep}–7 have not been filled yet. The store cannot be approved until all steps are complete.
        </p>
      </div>
    </div>
  );
}

// ─── Store Info Card ─────────────────────────────────────────
export function StoreInfoCard({ store, vendorDetail }: { store: StoreType; vendorDetail: VendorDetailData }) {
  const s = store;
  const vd = vendorDetail;

  const items = [
    { icon: Users, label: "Owner", value: vd.basicDetails?.ownerName || s.ownerName },
    { icon: Mail, label: "Email", value: vd.basicDetails?.email || "—" },
    { icon: Phone, label: "Phone", value: vd.basicDetails?.phoneNumber || "—" },
    { icon: MapPin, label: "Location", value: s.location || vd.storeOperations?.storeLocation || "—" },
    { icon: FileText, label: "GSTIN", value: vd.basicDetails?.gstin || "—" },
    { icon: Calendar, label: "Submitted At", value: formatSubmittedAt(vd.submittedAt || s.submittedAt) },
  ];

  return (
    <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
      <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Store Information</h3>
      <div className="space-y-4">
        {items.map((item) => (
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
  );
}
