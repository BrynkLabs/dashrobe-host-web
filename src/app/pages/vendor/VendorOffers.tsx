import { useState, useMemo } from "react";
import {
  Plus, Search, SquarePen, Trash2, X, Tag, Percent, Gift,
  Calendar, TrendingUp, ShoppingCart, IndianRupee, Eye,
  TriangleAlert, Clock, CircleCheck, Pause, ToggleLeft,
  ChevronDown, ChevronUp, Copy, Filter, Zap, Package,
} from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { Pagination, usePagination } from "../../components/Pagination";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
type OfferType = "percentage" | "flat" | "bogo";
type OfferApplyTo = "all" | "categories" | "products";
type OfferStatus = "active" | "scheduled" | "expired" | "paused";

interface StoreOffer {
  id: string;
  name: string;
  type: OfferType;
  discountPercent?: number;
  flatAmount?: number;
  buyQty?: number;
  getQty?: number;
  minCartValue?: number;
  maxDiscountCap?: number;
  startDate: string;
  endDate: string;
  applyTo: OfferApplyTo;
  selectedCategories?: string[];
  selectedProducts?: string[];
  applicableProducts?: string[];
  stackable: boolean;
  active: boolean;
  autoApply?: boolean;
  limitPerCustomer?: number;
  status: OfferStatus;
  usageCount: number;
  revenue: number;
}

interface ProductOffer {
  productId: string;
  productName: string;
  category: string;
  mrp: number;
  sellingPrice: number;
  offerEnabled: boolean;
  offerType?: OfferType;
  discountPercent?: number;
  flatAmount?: number;
  buyQty?: number;
  getQty?: number;
  maxRedemption?: number;
  startDate?: string;
  endDate?: string;
  hasStoreOffer: boolean;
  storeOfferName?: string;
}

// ═══════════════════════════════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════════════════════════════
const categories = ["Sarees", "Kurta Sets", "Lehengas", "Kurtis", "Dresses", "Bottomwear", "Dupattas"];

const productsList = [
  "Silk Banarasi Saree", "Embroidered Kurta Set",
  "Chiffon Dupatta", "Cotton Palazzo",
  "Anarkali Dress", "Block Print Kurti", "Lehenga Choli",
];

const initialStoreOffers: StoreOffer[] = [
  {
    id: "SO-001", name: "Summer Sale 20%", type: "percentage", discountPercent: 20,
    minCartValue: 1999, maxDiscountCap: 500, startDate: "2026-02-20", endDate: "2026-03-15",
    applyTo: "all", stackable: false, active: true, status: "active", usageCount: 342, revenue: 285000,
  },
  {
    id: "SO-002", name: "Flat ₹300 Off", type: "flat", flatAmount: 300,
    minCartValue: 2499, maxDiscountCap: 300, startDate: "2026-02-25", endDate: "2026-03-10",
    applyTo: "categories", selectedCategories: ["Sarees", "Lehengas"],
    stackable: false, active: true, status: "active", usageCount: 156, revenue: 178000,
  },
  {
    id: "SO-003", name: "Buy 1 Get 1 Dupattas", type: "bogo", buyQty: 1, getQty: 1,
    applicableProducts: ["Chiffon Dupatta"],
    startDate: "2026-03-01", endDate: "2026-03-31",
    applyTo: "products", stackable: false, active: true, autoApply: true,
    limitPerCustomer: 2, status: "scheduled", usageCount: 0, revenue: 0,
  },
  {
    id: "SO-004", name: "Holi Special 15%", type: "percentage", discountPercent: 15,
    minCartValue: 999, maxDiscountCap: 400, startDate: "2026-03-10", endDate: "2026-03-16",
    applyTo: "all", stackable: true, active: true, status: "scheduled", usageCount: 0, revenue: 0,
  },
  {
    id: "SO-005", name: "Clearance Flat ₹500", type: "flat", flatAmount: 500,
    minCartValue: 3999, maxDiscountCap: 500, startDate: "2026-01-01", endDate: "2026-02-15",
    applyTo: "categories", selectedCategories: ["Bottomwear"],
    stackable: false, active: false, status: "expired", usageCount: 89, revenue: 67000,
  },
];

const initialProductOffers: ProductOffer[] = [
  { productId: "P001", productName: "Silk Banarasi Saree", category: "Sarees", mrp: 4999, sellingPrice: 3499, offerEnabled: true, offerType: "percentage", discountPercent: 20, startDate: "2026-02-20", endDate: "2026-03-15", hasStoreOffer: true, storeOfferName: "Summer Sale 20%" },
  { productId: "P002", productName: "Embroidered Kurta Set", category: "Kurta Sets", mrp: 3299, sellingPrice: 2599, offerEnabled: false, hasStoreOffer: false },
  { productId: "P003", productName: "Chiffon Dupatta", category: "Dupattas", mrp: 999, sellingPrice: 699, offerEnabled: false, hasStoreOffer: true, storeOfferName: "Buy 1 Get 1 Dupattas" },
  { productId: "P004", productName: "Cotton Palazzo", category: "Bottomwear", mrp: 1899, sellingPrice: 1499, offerEnabled: true, offerType: "flat", flatAmount: 200, startDate: "2026-02-25", endDate: "2026-03-10", hasStoreOffer: false },
  { productId: "P005", productName: "Anarkali Dress", category: "Dresses", mrp: 5499, sellingPrice: 4299, offerEnabled: false, hasStoreOffer: false },
  { productId: "P006", productName: "Block Print Kurti", category: "Kurtis", mrp: 1499, sellingPrice: 999, offerEnabled: true, offerType: "bogo", buyQty: 2, getQty: 1, maxRedemption: 1, startDate: "2026-03-01", endDate: "2026-03-31", hasStoreOffer: false },
  { productId: "P007", productName: "Lehenga Choli", category: "Lehengas", mrp: 12999, sellingPrice: 9999, offerEnabled: false, hasStoreOffer: true, storeOfferName: "Flat ₹300 Off" },
];

const offerPerformanceData = [
  { name: "Summer Sale 20%", revenue: 285000, orders: 342 },
  { name: "Flat ₹300 Off", revenue: 178000, orders: 156 },
  { name: "Clearance ₹500", revenue: 67000, orders: 89 },
  { name: "Cotton ₹200 Off", revenue: 42000, orders: 58 },
];

const statusConfig: Record<OfferStatus, { label: string; color: string; bg: string; icon: typeof CircleCheck }> = {
  active: { label: "Active", color: "#059669", bg: "#D1FAE5", icon: CircleCheck },
  scheduled: { label: "Scheduled", color: "#3B82F6", bg: "#DBEAFE", icon: Clock },
  expired: { label: "Expired", color: "#6B7280", bg: "#F3F4F6", icon: Pause },
  paused: { label: "Paused", color: "#D97706", bg: "#FEF3C7", icon: Pause },
};

const typeLabels: Record<OfferType, { label: string; icon: typeof Percent }> = {
  percentage: { label: "Percentage Discount", icon: Percent },
  flat: { label: "Flat Discount", icon: IndianRupee },
  bogo: { label: "Buy 1 Get 1", icon: Gift },
};

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════
const formatCurrency = (v: number) => {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v}`;
};

const getCountdown = (endDate: string) => {
  const end = new Date(endDate).getTime();
  const now = new Date("2026-02-26").getTime();
  const diff = end - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 30) return `${Math.floor(days / 30)}mo left`;
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours}h left`;
};

const getDiscountedPrice = (sellingPrice: number, offer: ProductOffer): number => {
  if (!offer.offerEnabled) return sellingPrice;
  if (offer.offerType === "percentage" && offer.discountPercent)
    return Math.round(sellingPrice * (1 - offer.discountPercent / 100));
  if (offer.offerType === "flat" && offer.flatAmount)
    return Math.max(0, sellingPrice - offer.flatAmount);
  return sellingPrice;
};

const getBadgeText = (offer: ProductOffer): string | null => {
  if (!offer.offerEnabled) return null;
  if (offer.offerType === "percentage" && offer.discountPercent) return `${offer.discountPercent}% OFF`;
  if (offer.offerType === "flat" && offer.flatAmount) return `₹${offer.flatAmount} OFF`;
  if (offer.offerType === "bogo") return `Buy ${offer.buyQty || 1} Get ${offer.getQty || 1}`;
  return null;
};

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════
export function VendorOffers() {
  const [activeTab, setActiveTab] = useState<"store" | "product">("store");
  const [storeOffers, setStoreOffers] = useState<StoreOffer[]>(initialStoreOffers);
  const [productOffers, setProductOffers] = useState<ProductOffer[]>(initialProductOffers);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<StoreOffer | null>(null);
  const [showProductOfferModal, setShowProductOfferModal] = useState<ProductOffer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // ── Create/Edit modal form state ──
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<OfferType>("percentage");
  const [formDiscountPercent, setFormDiscountPercent] = useState("");
  const [formFlatAmount, setFormFlatAmount] = useState("");
  const [formMinCart, setFormMinCart] = useState("");
  const [formMaxCap, setFormMaxCap] = useState("");
  const [formBuyQty, setFormBuyQty] = useState("1");
  const [formGetQty, setFormGetQty] = useState("1");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formApplyTo, setFormApplyTo] = useState<OfferApplyTo>("all");
  const [formSelectedCategories, setFormSelectedCategories] = useState<string[]>([]);
  const [formSelectedProducts, setFormSelectedProducts] = useState<string[]>([]);
  const [formStackable, setFormStackable] = useState(false);
  const [formActive, setFormActive] = useState(true);
  const [formAutoApply, setFormAutoApply] = useState(false);
  const [formLimitPerCustomer, setFormLimitPerCustomer] = useState("");

  // ── Product offer edit modal state ──
  const [pOfferType, setPOfferType] = useState<OfferType>("percentage");
  const [pDiscountPercent, setPDiscountPercent] = useState("");
  const [pFlatAmount, setPFlatAmount] = useState("");
  const [pBuyQty, setPBuyQty] = useState("2");
  const [pGetQty, setPGetQty] = useState("1");
  const [pMaxRedemption, setPMaxRedemption] = useState("1");
  const [pStartDate, setPStartDate] = useState("");
  const [pEndDate, setPEndDate] = useState("");
  const [pEnabled, setPEnabled] = useState(false);

  // ── Analytics ──
  const totalOfferRevenue = storeOffers.reduce((s, o) => s + o.revenue, 0);
  const activeOfferCount = storeOffers.filter(o => o.status === "active").length;
  const avgConversionUplift = 12.4;
  const topOffer = storeOffers.reduce((best, o) => o.revenue > best.revenue ? o : best, storeOffers[0]);

  const pieData = [
    { name: "Active", value: storeOffers.filter(o => o.status === "active").length, color: "#059669" },
    { name: "Scheduled", value: storeOffers.filter(o => o.status === "scheduled").length, color: "#3B82F6" },
    { name: "Expired", value: storeOffers.filter(o => o.status === "expired").length, color: "#6B7280" },
    { name: "Paused", value: storeOffers.filter(o => o.status === "paused").length, color: "#D97706" },
  ].filter(d => d.value > 0);

  const [offersPage, setOffersPage] = useState(1);

  // ── Filter ──
  const filteredStoreOffers = storeOffers.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    typeLabels[o.type].label.toLowerCase().includes(search.toLowerCase())
  );

  const OFFERS_PER_PAGE = 5;
  const { paginated: paginatedOffers, totalPages: offersTotalPages, safePage: safeOffersPage } = usePagination(filteredStoreOffers, OFFERS_PER_PAGE, offersPage);

  const filteredProductOffers = productOffers.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const [prodOffersPage, setProdOffersPage] = useState(1);
  const PROD_OFFERS_PER_PAGE = 5;
  const { paginated: paginatedProductOffers, totalPages: prodOffersTotalPages, safePage: safeProdOffersPage } = usePagination(filteredProductOffers, PROD_OFFERS_PER_PAGE, prodOffersPage);

  // ── Conflict detection ──
  const checkConflicts = (productName: string, startDate: string, endDate: string, excludeId?: string) => {
    // Check store-level offers on same product
    const conflicts: string[] = [];
    storeOffers.forEach(o => {
      if (excludeId && o.id === excludeId) return;
      if (o.status === "expired" || !o.active) return;
      const overlaps = new Date(startDate) <= new Date(o.endDate) && new Date(endDate) >= new Date(o.startDate);
      if (!overlaps) return;
      if (o.applyTo === "all") conflicts.push(o.name);
      if (o.applyTo === "products" && o.applicableProducts?.includes(productName)) conflicts.push(o.name);
    });
    // Check product-level offers
    productOffers.forEach(p => {
      if (!p.offerEnabled || p.productName !== productName) return;
      if (p.startDate && p.endDate) {
        const overlaps = new Date(startDate) <= new Date(p.endDate) && new Date(endDate) >= new Date(p.startDate);
        if (overlaps) conflicts.push(`Product offer on ${p.productName}`);
      }
    });
    return conflicts;
  };

  // ── Reset form ──
  const resetForm = () => {
    setFormName(""); setFormType("percentage"); setFormDiscountPercent(""); setFormFlatAmount("");
    setFormMinCart(""); setFormMaxCap(""); setFormBuyQty("1"); setFormGetQty("1");
    setFormStartDate(""); setFormEndDate(""); setFormApplyTo("all");
    setFormSelectedCategories([]); setFormSelectedProducts([]);
    setFormStackable(false); setFormActive(true); setFormAutoApply(false);
    setFormLimitPerCustomer(""); setEditingOffer(null); setConflictWarning(null);
  };

  const openCreateModal = () => { resetForm(); setShowCreateModal(true); };

  const openEditModal = (offer: StoreOffer) => {
    setEditingOffer(offer);
    setFormName(offer.name);
    setFormType(offer.type);
    setFormDiscountPercent(offer.discountPercent?.toString() || "");
    setFormFlatAmount(offer.flatAmount?.toString() || "");
    setFormMinCart(offer.minCartValue?.toString() || "");
    setFormMaxCap(offer.maxDiscountCap?.toString() || "");
    setFormBuyQty(offer.buyQty?.toString() || "1");
    setFormGetQty(offer.getQty?.toString() || "1");
    setFormStartDate(offer.startDate);
    setFormEndDate(offer.endDate);
    setFormApplyTo(offer.applyTo);
    setFormSelectedCategories(offer.selectedCategories || []);
    setFormSelectedProducts(offer.selectedProducts || []);
    setFormStackable(offer.stackable);
    setFormActive(offer.active);
    setFormAutoApply(offer.autoApply || false);
    setFormLimitPerCustomer(offer.limitPerCustomer?.toString() || "");
    setShowCreateModal(true);
  };

  // ── Save store offer ──
  const handleSaveOffer = () => {
    const now = new Date("2026-02-26");
    const start = new Date(formStartDate);
    const end = new Date(formEndDate);
    let status: OfferStatus = "active";
    if (end < now) status = "expired";
    else if (start > now) status = "scheduled";
    if (!formActive) status = "paused";

    const newOffer: StoreOffer = {
      id: editingOffer?.id || `SO-${String(storeOffers.length + 1).padStart(3, "0")}`,
      name: formName,
      type: formType,
      discountPercent: formType === "percentage" ? Number(formDiscountPercent) : undefined,
      flatAmount: formType === "flat" ? Number(formFlatAmount) : undefined,
      buyQty: formType === "bogo" ? Number(formBuyQty) : undefined,
      getQty: formType === "bogo" ? Number(formGetQty) : undefined,
      minCartValue: formType !== "bogo" ? Number(formMinCart) || undefined : undefined,
      maxDiscountCap: formType === "percentage" ? Number(formMaxCap) || undefined : undefined,
      startDate: formStartDate,
      endDate: formEndDate,
      applyTo: formApplyTo,
      selectedCategories: formApplyTo === "categories" ? formSelectedCategories : undefined,
      selectedProducts: formApplyTo === "products" ? formSelectedProducts : undefined,
      applicableProducts: formType === "bogo" ? formSelectedProducts : undefined,
      stackable: formStackable,
      active: formActive,
      autoApply: formAutoApply,
      limitPerCustomer: formType === "bogo" ? Number(formLimitPerCustomer) || undefined : undefined,
      status,
      usageCount: editingOffer?.usageCount || 0,
      revenue: editingOffer?.revenue || 0,
    };

    if (editingOffer) {
      setStoreOffers(prev => prev.map(o => o.id === editingOffer.id ? newOffer : o));
    } else {
      setStoreOffers(prev => [...prev, newOffer]);
    }
    setShowCreateModal(false);
    resetForm();
  };

  const handleDeleteOffer = (id: string) => {
    setStoreOffers(prev => prev.filter(o => o.id !== id));
    setShowDeleteConfirm(null);
  };

  // ── Open product offer modal ──
  const openProductOfferModal = (po: ProductOffer) => {
    setShowProductOfferModal(po);
    setPEnabled(po.offerEnabled);
    setPOfferType(po.offerType || "percentage");
    setPDiscountPercent(po.discountPercent?.toString() || "");
    setPFlatAmount(po.flatAmount?.toString() || "");
    setPBuyQty(po.buyQty?.toString() || "2");
    setPGetQty(po.getQty?.toString() || "1");
    setPMaxRedemption(po.maxRedemption?.toString() || "1");
    setPStartDate(po.startDate || "");
    setPEndDate(po.endDate || "");
  };

  const saveProductOffer = () => {
    if (!showProductOfferModal) return;
    setProductOffers(prev => prev.map(p =>
      p.productId === showProductOfferModal.productId
        ? {
            ...p,
            offerEnabled: pEnabled,
            offerType: pEnabled ? pOfferType : undefined,
            discountPercent: pEnabled && pOfferType === "percentage" ? Number(pDiscountPercent) : undefined,
            flatAmount: pEnabled && pOfferType === "flat" ? Number(pFlatAmount) : undefined,
            buyQty: pEnabled && pOfferType === "bogo" ? Number(pBuyQty) : undefined,
            getQty: pEnabled && pOfferType === "bogo" ? Number(pGetQty) : undefined,
            maxRedemption: pEnabled && pOfferType === "bogo" ? Number(pMaxRedemption) : undefined,
            startDate: pEnabled ? pStartDate : undefined,
            endDate: pEnabled ? pEndDate : undefined,
          }
        : p
    ));
    setShowProductOfferModal(null);
  };

  // live preview for product offer modal
  const livePreview = useMemo(() => {
    if (!showProductOfferModal) return null;
    const sp = showProductOfferModal.sellingPrice;
    const mrp = showProductOfferModal.mrp;
    let discounted = sp;
    let badge: string | null = null;
    if (pEnabled) {
      if (pOfferType === "percentage" && pDiscountPercent) {
        discounted = Math.round(sp * (1 - Number(pDiscountPercent) / 100));
        badge = `${pDiscountPercent}% OFF`;
      } else if (pOfferType === "flat" && pFlatAmount) {
        discounted = Math.max(0, sp - Number(pFlatAmount));
        badge = `₹${pFlatAmount} OFF`;
      } else if (pOfferType === "bogo") {
        badge = `Buy ${pBuyQty} Get ${pGetQty}`;
      }
    }
    return { mrp, sellingPrice: sp, discounted, badge };
  }, [showProductOfferModal, pEnabled, pOfferType, pDiscountPercent, pFlatAmount, pBuyQty, pGetQty]);

  // ═══════════════════���═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Offers</h1>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
            Create and manage store-level and product-level offers
          </p>
        </div>
        {activeTab === "store" && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#220E92] text-white px-4 py-2.5 rounded-[10px] hover:bg-[#220E92]/90 transition-colors shadow-sm"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <Plus className="w-4 h-4" /> Create Offer
          </button>
        )}
      </div>

      {/* ── Analytics Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenue from Offers", value: formatCurrency(totalOfferRevenue), icon: IndianRupee, color: "#220E92", sub: "+18% vs last month" },
          { label: "Active Offers", value: activeOfferCount.toString(), icon: Tag, color: "#059669", sub: `${storeOffers.length} total` },
          { label: "Conversion Uplift", value: `+${avgConversionUplift}%`, icon: TrendingUp, color: "#FFC100", sub: "vs non-offer products" },
          { label: "Top Offer", value: topOffer?.name || "—", icon: Zap, color: "#3B82F6", sub: topOffer ? formatCurrency(topOffer.revenue) + " revenue" : "" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-[12px] border border-border shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{stat.label}</span>
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="truncate" style={{ fontSize: "22px", fontWeight: 700 }}>{stat.value}</p>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-[12px] border border-border shadow-sm p-5">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Top Performing Offers</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={offerPerformanceData} layout="vertical" id="offers-perf-chart">
              <XAxis key="xaxis" type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
              <YAxis key="yaxis" type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip key="tooltip" formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Bar key="bar" dataKey="revenue" fill="#220E92" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Offer Status</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart id="offers-status-pie">
              <Pie key="pie" data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip key="tooltip" />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-muted rounded-[12px] p-1.5">
          {[
            { key: "store" as const, label: "Store Offers", count: storeOffers.length },
            { key: "product" as const, label: "Product Offers", count: productOffers.filter(p => p.offerEnabled).length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(""); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-[10px] transition-all ${
                activeTab === tab.key
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
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={activeTab === "store" ? "Search offers..." : "Search products..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-border bg-card"
            style={{ fontSize: "14px" }}
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* STORE OFFERS TAB                                        */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "store" && (
        <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Offer Name", "Type", "Discount", "Apply To", "Validity", "Usage", "Revenue", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedOffers.map((offer) => {
                  const stCfg = statusConfig[offer.status];
                  const tLabel = typeLabels[offer.type];
                  const countdown = getCountdown(offer.endDate);
                  return (
                    <tr key={offer.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: "#220E9212" }}>
                            <tLabel.icon className="w-4 h-4" style={{ color: "#220E92" }} />
                          </div>
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 600 }}>{offer.name}</p>
                            <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{offer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-[#220E92]/8 text-[#220E92] px-2 py-0.5 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>
                          {tLabel.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px]" style={{ backgroundColor: "#FFC10020", color: "#220E92", fontSize: "13px", fontWeight: 700 }}>
                          {offer.type === "percentage" ? `${offer.discountPercent}%` :
                           offer.type === "flat" ? `₹${offer.flatAmount}` :
                           `B${offer.buyQty}G${offer.getQty}`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground" style={{ fontSize: "13px" }}>
                          {offer.applyTo === "all" ? "All Products" :
                           offer.applyTo === "categories" ? offer.selectedCategories?.join(", ") :
                           `${offer.selectedProducts?.length || offer.applicableProducts?.length || 0} products`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p style={{ fontSize: "12px" }}>{offer.startDate} — {offer.endDate}</p>
                          {countdown && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[#220E92]" style={{ fontSize: "11px", fontWeight: 600 }}>
                              <Clock className="w-3 h-3" /> {countdown}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{offer.usageCount.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{offer.revenue > 0 ? formatCurrency(offer.revenue) : "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600, color: stCfg.color, backgroundColor: stCfg.bg }}>
                          <stCfg.icon className="w-3.5 h-3.5" /> {stCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditModal(offer)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                            <SquarePen className="w-4 h-4" />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(offer.id)} className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredStoreOffers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <Tag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p style={{ fontSize: "15px", fontWeight: 600 }}>No offers found</p>
                      <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>Create your first store offer to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredStoreOffers.length > 0 && (
            <Pagination
              currentPage={safeOffersPage}
              totalPages={offersTotalPages}
              totalItems={filteredStoreOffers.length}
              itemsPerPage={OFFERS_PER_PAGE}
              onPageChange={setOffersPage}
              itemLabel="offers"
            />
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* PRODUCT OFFERS TAB                                      */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "product" && (
        <div className="space-y-4">
          {/* Conflict info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-4 flex items-start gap-3">
            <TriangleAlert className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600 }} className="text-blue-800">Product-level offers override store-level offers</p>
              <p style={{ fontSize: "12px" }} className="text-blue-600 mt-0.5">When a product has both a store offer and a product offer enabled, the product-level offer takes priority for that product.</p>
            </div>
          </div>

          <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {["Product", "Category", "MRP", "Selling Price", "Product Offer", "Discounted Price", "Badge", "Store Offer", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedProductOffers.map((po) => {
                    const discounted = getDiscountedPrice(po.sellingPrice, po);
                    const badge = getBadgeText(po);
                    const hasConflict = po.offerEnabled && po.hasStoreOffer;
                    return (
                      <tr key={po.productId} className={`border-b border-border hover:bg-muted/20 transition-colors ${hasConflict ? "bg-amber-50/50" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#220E92]/8 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-[#220E92]" />
                            </div>
                            <div>
                              <p className="whitespace-nowrap" style={{ fontSize: "14px", fontWeight: 500 }}>{po.productName}</p>
                              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{po.productId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ fontSize: "13px" }}>{po.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground line-through" style={{ fontSize: "13px" }}>₹{po.mrp.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>₹{po.sellingPrice.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          {po.offerEnabled ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#220E9215", color: "#220E92", fontSize: "12px", fontWeight: 600 }}>
                              <CircleCheck className="w-3 h-3" />
                              {po.offerType === "percentage" ? `${po.discountPercent}%` :
                               po.offerType === "flat" ? `₹${po.flatAmount}` :
                               `B${po.buyQty}G${po.getQty}`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {po.offerEnabled && po.offerType !== "bogo" ? (
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#220E92" }}>₹{discounted.toLocaleString()}</span>
                          ) : (
                            <span className="text-muted-foreground" style={{ fontSize: "13px" }}>₹{po.sellingPrice.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {badge ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-[8px]" style={{ backgroundColor: "#FFC100", color: "#220E92", fontSize: "11px", fontWeight: 800 }}>
                              {badge}
                            </span>
                          ) : (
                            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {po.hasStoreOffer ? (
                            <div className="flex items-center gap-1.5">
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600 }}>{po.storeOfferName}</span>
                              {hasConflict && (
                                <span title="Product offer overrides this store offer">
                                  <TriangleAlert className="w-3.5 h-3.5 text-amber-500" />
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => openProductOfferModal(po)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#220E92]/8 text-[#220E92] hover:bg-[#220E92]/15 transition-colors" style={{ fontSize: "12px", fontWeight: 600 }}>
                            <SquarePen className="w-3 h-3" /> Configure
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredProductOffers.length > 0 && (
              <Pagination
                currentPage={safeProdOffersPage}
                totalPages={prodOffersTotalPages}
                totalItems={filteredProductOffers.length}
                itemsPerPage={PROD_OFFERS_PER_PAGE}
                onPageChange={setProdOffersPage}
                itemLabel="products"
              />
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* CREATE / EDIT STORE OFFER MODAL                         */}
      {/* ════════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowCreateModal(false); resetForm(); }}>
          <div className="bg-card rounded-[12px] w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10 rounded-t-[12px]">
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600 }}>{editingOffer ? "Edit Offer" : "Create Store Offer"}</h3>
                <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>Configure offer type, discount, and validity</p>
              </div>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Offer Name */}
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Offer Name *</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g., Summer Sale 20%" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
              </div>

              {/* Offer Type Selector */}
              <div>
                <label className="block text-muted-foreground mb-2" style={{ fontSize: "13px", fontWeight: 500 }}>Offer Type *</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["percentage", "flat", "bogo"] as OfferType[]).map((type) => {
                    const t = typeLabels[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setFormType(type)}
                        className={`p-4 rounded-[12px] border-2 text-left transition-all ${
                          formType === type
                            ? "border-[#220E92] bg-[#220E92]/5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <t.icon className="w-5 h-5 mb-2" style={{ color: formType === type ? "#220E92" : "#9CA3AF" }} />
                        <p style={{ fontSize: "14px", fontWeight: 600, color: formType === type ? "#220E92" : undefined }}>{t.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Percentage Fields ── */}
              {formType === "percentage" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Discount % *</label>
                    <div className="relative">
                      <input type="number" value={formDiscountPercent} onChange={(e) => setFormDiscountPercent(e.target.value)} placeholder="e.g., 20" className="w-full px-3 py-2.5 pr-10 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Maximum Discount Cap (₹)</label>
                    <input type="number" value={formMaxCap} onChange={(e) => setFormMaxCap(e.target.value)} placeholder="e.g., 500" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Minimum Cart Value (₹)</label>
                    <input type="number" value={formMinCart} onChange={(e) => setFormMinCart(e.target.value)} placeholder="e.g., 1999" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                  </div>
                </div>
              )}

              {/* ── Flat Fields ── */}
              {formType === "flat" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Flat Discount (₹) *</label>
                    <input type="number" value={formFlatAmount} onChange={(e) => setFormFlatAmount(e.target.value)} placeholder="e.g., 300" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Minimum Cart Value (₹)</label>
                    <input type="number" value={formMinCart} onChange={(e) => setFormMinCart(e.target.value)} placeholder="e.g., 2499" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                  </div>
                </div>
              )}

              {/* ── BOGO Fields ── */}
              {formType === "bogo" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Buy Quantity *</label>
                    <input type="number" value={formBuyQty} onChange={(e) => setFormBuyQty(e.target.value)} placeholder="1" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Get Quantity *</label>
                    <input type="number" value={formGetQty} onChange={(e) => setFormGetQty(e.target.value)} placeholder="1" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Limit per Customer</label>
                    <input type="number" value={formLimitPerCustomer} onChange={(e) => setFormLimitPerCustomer(e.target.value)} placeholder="e.g., 2" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Applicable Products *</label>
                    <div className="flex flex-wrap gap-1.5 border border-border rounded-[10px] p-2 min-h-[44px] bg-background">
                      {formSelectedProducts.map(p => (
                        <span key={p} className="inline-flex items-center gap-1 bg-[#220E92]/8 text-[#220E92] px-2 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600 }}>
                          {p}
                          <button onClick={() => setFormSelectedProducts(prev => prev.filter(x => x !== p))}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      <select
                        className="flex-1 min-w-[120px] bg-transparent border-none outline-none"
                        style={{ fontSize: "13px" }}
                        value=""
                        onChange={(e) => {
                          if (e.target.value && !formSelectedProducts.includes(e.target.value))
                            setFormSelectedProducts(prev => [...prev, e.target.value]);
                        }}
                      >
                        <option value="">+ Add product</option>
                        {productsList.filter(p => !formSelectedProducts.includes(p)).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Start Date *</label>
                  <input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>End Date *</label>
                  <input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                </div>
              </div>

              {/* Apply To (not for BOGO) */}
              {formType !== "bogo" && (
                <div>
                  <label className="block text-muted-foreground mb-2" style={{ fontSize: "13px", fontWeight: 500 }}>Apply To</label>
                  <div className="flex gap-3">
                    {([
                      { key: "all" as OfferApplyTo, label: "All Products" },
                      { key: "categories" as OfferApplyTo, label: "Selected Categories" },
                      { key: "products" as OfferApplyTo, label: "Selected Products" },
                    ]).map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setFormApplyTo(opt.key)}
                        className={`px-4 py-2 rounded-[10px] border transition-all ${
                          formApplyTo === opt.key
                            ? "border-[#220E92] bg-[#220E92]/5 text-[#220E92]"
                            : "border-border text-muted-foreground hover:border-muted-foreground"
                        }`}
                        style={{ fontSize: "13px", fontWeight: 600 }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Category selector */}
                  {formApplyTo === "categories" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() =>
                            setFormSelectedCategories(prev =>
                              prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                            )
                          }
                          className={`px-3 py-1.5 rounded-full border transition-all ${
                            formSelectedCategories.includes(cat)
                              ? "border-[#220E92] bg-[#220E92]/10 text-[#220E92]"
                              : "border-border text-muted-foreground hover:border-muted-foreground"
                          }`}
                          style={{ fontSize: "12px", fontWeight: 600 }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Product selector */}
                  {formApplyTo === "products" && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1.5 border border-border rounded-[10px] p-2 min-h-[44px] bg-background">
                        {formSelectedProducts.map(p => (
                          <span key={p} className="inline-flex items-center gap-1 bg-[#220E92]/8 text-[#220E92] px-2 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600 }}>
                            {p}
                            <button onClick={() => setFormSelectedProducts(prev => prev.filter(x => x !== p))}><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                        <select
                          className="flex-1 min-w-[120px] bg-transparent border-none outline-none"
                          style={{ fontSize: "13px" }}
                          value=""
                          onChange={(e) => {
                            if (e.target.value && !formSelectedProducts.includes(e.target.value))
                              setFormSelectedProducts(prev => [...prev, e.target.value]);
                          }}
                        >
                          <option value="">+ Add product</option>
                          {productsList.filter(p => !formSelectedProducts.includes(p)).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-muted/30 px-4 py-3 rounded-[10px]">
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500 }}>Stackable</p>
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Allow combining with other offers</p>
                  </div>
                  <Switch checked={formStackable} onCheckedChange={setFormStackable} />
                </div>
                <div className="flex items-center justify-between bg-muted/30 px-4 py-3 rounded-[10px]">
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500 }}>Active</p>
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Offer is live when within date range</p>
                  </div>
                  <Switch checked={formActive} onCheckedChange={setFormActive} />
                </div>
                {formType === "bogo" && (
                  <div className="flex items-center justify-between bg-muted/30 px-4 py-3 rounded-[10px]">
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 500 }}>Auto Apply</p>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Automatically apply when conditions are met</p>
                    </div>
                    <Switch checked={formAutoApply} onCheckedChange={setFormAutoApply} />
                  </div>
                )}
              </div>

              {/* Conflict Warning Preview */}
              {formStartDate && formEndDate && formApplyTo === "all" && (
                <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-3 flex items-start gap-2.5">
                  <TriangleAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 600 }} className="text-amber-800">Conflict Check</p>
                    <p style={{ fontSize: "12px" }} className="text-amber-600 mt-0.5">
                      This offer applies to all products. Products with individual offers will use their product-level offer instead.
                    </p>
                  </div>
                </div>
              )}

              {/* Live Preview */}
              {formType !== "bogo" && (formDiscountPercent || formFlatAmount) && (
                <div className="bg-muted/30 rounded-[12px] p-4 border border-border">
                  <p className="text-muted-foreground mb-2" style={{ fontSize: "12px", fontWeight: 600 }}>LIVE PREVIEW</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Example: Product at ₹2,999</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="line-through text-muted-foreground" style={{ fontSize: "14px" }}>₹2,999</span>
                        <span style={{ fontSize: "18px", fontWeight: 700, color: "#220E92" }}>
                          ₹{formType === "percentage" && formDiscountPercent
                            ? Math.round(2999 * (1 - Number(formDiscountPercent) / 100)).toLocaleString()
                            : formType === "flat" && formFlatAmount
                            ? Math.max(0, 2999 - Number(formFlatAmount)).toLocaleString()
                            : "2,999"}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-[8px]" style={{ backgroundColor: "#FFC100", color: "#220E92", fontSize: "13px", fontWeight: 800 }}>
                      {formType === "percentage" ? `${formDiscountPercent}% OFF` : `₹${formFlatAmount} OFF`}
                    </span>
                  </div>
                </div>
              )}
              {formType === "bogo" && formBuyQty && formGetQty && (
                <div className="bg-muted/30 rounded-[12px] p-4 border border-border">
                  <p className="text-muted-foreground mb-2" style={{ fontSize: "12px", fontWeight: 600 }}>LIVE PREVIEW</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p style={{ fontSize: "14px", fontWeight: 600 }}>Buy {formBuyQty}, Get {formGetQty} Free</p>
                      <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>
                        {formLimitPerCustomer ? `Limit: ${formLimitPerCustomer} per customer` : "No limit per customer"}
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-[8px]" style={{ backgroundColor: "#FFC100", color: "#220E92", fontSize: "13px", fontWeight: 800 }}>
                      Buy {formBuyQty} Get {formGetQty}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border flex gap-3 sticky bottom-0 bg-card rounded-b-[12px]">
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
              <button
                onClick={handleSaveOffer}
                disabled={!formName.trim() || !formStartDate || !formEndDate}
                className="flex-1 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors disabled:opacity-50"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                {editingOffer ? "Update Offer" : "Create Offer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* PRODUCT OFFER MODAL                                     */}
      {/* ════════════════════════════════════════════════════════ */}
      {showProductOfferModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowProductOfferModal(null)}>
          <div className="bg-card rounded-[12px] w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10 rounded-t-[12px]">
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Product Offer</h3>
                <p className="text-muted-foreground mt-0.5 truncate max-w-[320px]" style={{ fontSize: "13px" }}>{showProductOfferModal.productName}</p>
              </div>
              <button onClick={() => setShowProductOfferModal(null)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Conflict warning */}
              {showProductOfferModal.hasStoreOffer && (
                <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-3 flex items-start gap-2.5">
                  <TriangleAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 600 }} className="text-amber-800">Active store offer detected</p>
                    <p style={{ fontSize: "12px" }} className="text-amber-600 mt-0.5">
                      "{showProductOfferModal.storeOfferName}" is active on this product. Enabling a product offer will override it.
                    </p>
                  </div>
                </div>
              )}

              {/* Enable toggle */}
              <div className="flex items-center justify-between bg-muted/30 px-4 py-3 rounded-[10px]">
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>Enable Offer for this Product</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Product-level offer overrides store-level</p>
                </div>
                <Switch checked={pEnabled} onCheckedChange={setPEnabled} />
              </div>

              {pEnabled && (
                <>
                  {/* Offer Type */}
                  <div>
                    <label className="block text-muted-foreground mb-2" style={{ fontSize: "13px", fontWeight: 500 }}>Offer Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["percentage", "flat", "bogo"] as OfferType[]).map((type) => {
                        const t = typeLabels[type];
                        return (
                          <button
                            key={type}
                            onClick={() => setPOfferType(type)}
                            className={`p-3 rounded-[10px] border-2 text-center transition-all ${
                              pOfferType === type
                                ? "border-[#220E92] bg-[#220E92]/5"
                                : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <t.icon className="w-4 h-4 mx-auto mb-1" style={{ color: pOfferType === type ? "#220E92" : "#9CA3AF" }} />
                            <p style={{ fontSize: "12px", fontWeight: 600, color: pOfferType === type ? "#220E92" : undefined }}>{t.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Type-specific fields */}
                  {pOfferType === "percentage" && (
                    <div>
                      <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Discount % *</label>
                      <div className="relative">
                        <input type="number" value={pDiscountPercent} onChange={(e) => setPDiscountPercent(e.target.value)} placeholder="e.g., 20" className="w-full px-3 py-2.5 pr-10 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {pOfferType === "flat" && (
                    <div>
                      <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Flat Discount (₹) *</label>
                      <input type="number" value={pFlatAmount} onChange={(e) => setPFlatAmount(e.target.value)} placeholder="e.g., 200" className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                    </div>
                  )}

                  {pOfferType === "bogo" && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Buy Qty</label>
                        <input type="number" value={pBuyQty} onChange={(e) => setPBuyQty(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                      </div>
                      <div>
                        <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Get Qty</label>
                        <input type="number" value={pGetQty} onChange={(e) => setPGetQty(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                      </div>
                      <div>
                        <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Max / Order</label>
                        <input type="number" value={pMaxRedemption} onChange={(e) => setPMaxRedemption(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Start Date</label>
                      <input type="date" value={pStartDate} onChange={(e) => setPStartDate(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                    </div>
                    <div>
                      <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>End Date</label>
                      <input type="date" value={pEndDate} onChange={(e) => setPEndDate(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
                    </div>
                  </div>
                </>
              )}

              {/* ── Live Price Preview ── */}
              {livePreview && (
                <div className="bg-muted/30 rounded-[12px] p-4 border border-border">
                  <p className="text-muted-foreground mb-3" style={{ fontSize: "12px", fontWeight: 600 }}>LIVE PRICE PREVIEW</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground" style={{ fontSize: "13px" }}>MRP</span>
                      <span className="line-through text-muted-foreground" style={{ fontSize: "14px" }}>₹{livePreview.mrp.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Selling Price</span>
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>₹{livePreview.sellingPrice.toLocaleString()}</span>
                    </div>
                    {pEnabled && pOfferType !== "bogo" && (
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#220E92" }}>Discounted Price</span>
                        <span style={{ fontSize: "20px", fontWeight: 700, color: "#220E92" }}>₹{livePreview.discounted.toLocaleString()}</span>
                      </div>
                    )}
                    {livePreview.badge && (
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Badge Preview</span>
                        <span className="px-3 py-1.5 rounded-[8px]" style={{ backgroundColor: "#FFC100", color: "#220E92", fontSize: "13px", fontWeight: 800 }}>
                          {livePreview.badge}
                        </span>
                      </div>
                    )}
                    {pEnabled && pOfferType !== "bogo" && livePreview.sellingPrice > 0 && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>You save</span>
                        <span className="text-emerald-600" style={{ fontSize: "13px", fontWeight: 600 }}>
                          ₹{(livePreview.sellingPrice - livePreview.discounted).toLocaleString()} ({Math.round(((livePreview.sellingPrice - livePreview.discounted) / livePreview.sellingPrice) * 100)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex gap-3 sticky bottom-0 bg-card rounded-b-[12px]">
              <button onClick={() => setShowProductOfferModal(null)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
              <button onClick={saveProductOffer} className="flex-1 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Save Offer</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* DELETE CONFIRM MODAL                                     */}
      {/* ════════════════════════════════════════════════════════ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-card rounded-[12px] p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Delete Offer</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>This action cannot be undone</p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-5">
              Are you sure you want to delete <strong>{storeOffers.find(o => o.id === showDeleteConfirm)?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
              <button onClick={() => handleDeleteOffer(showDeleteConfirm)} className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
