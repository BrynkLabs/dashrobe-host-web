import { useNavigate } from "react-router";
import { useState, useId, useEffect } from "react";
import {
  Store,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  Eye,
  CircleCheck,
  CircleX,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Pagination, usePagination } from "../../components/Pagination";
import {
  approveStore,
  getAll,
  rejectStore,
} from "@/app/Service/VendorListActionService/vendorListActionService";
import { StoreType } from "@/app/Service/VendorListActionService/Types/storeType";

const revenueData = [
  { month: "Jul", revenue: 4200000 },
  { month: "Aug", revenue: 4800000 },
  { month: "Sep", revenue: 5100000 },
  { month: "Oct", revenue: 6200000 },
  { month: "Nov", revenue: 7800000 },
  { month: "Dec", revenue: 9100000 },
  { month: "Jan", revenue: 8400000 },
  { month: "Feb", revenue: 7200000 },
];

const vendorActivity = [
  { day: "Mon", orders: 342 },
  { day: "Tue", orders: 398 },
  { day: "Wed", orders: 285 },
  { day: "Thu", orders: 420 },
  { day: "Fri", orders: 512 },
  { day: "Sat", orders: 608 },
  { day: "Sun", orders: 445 },
];

const topStores = [
  {
    name: "Kanchipuram Weaves",
    revenue: 5240000,
    orders: 2134,
    city: "Chennai",
  },
  {
    name: "Priya Silks Emporium",
    revenue: 4850000,
    orders: 1842,
    city: "Varanasi",
  },
  { name: "Regal Ethnic Wear", revenue: 3720000, orders: 1256, city: "Jaipur" },
  { name: "Bombay Fashion Hub", revenue: 2890000, orders: 983, city: "Mumbai" },
  {
    name: "Delhi Kurta House",
    revenue: 1950000,
    orders: 756,
    city: "New Delhi",
  },
];

const formatCurrency = (v: number) => {
  if (v >= 10000000) return `\u20B9${(v / 10000000).toFixed(2)}Cr`;
  if (v >= 100000) return `\u20B9${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `\u20B9${(v / 1000).toFixed(1)}K`;
  return `\u20B9${v}`;
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const chartId1 = useId();
  const chartId2 = useId();
  const gradientId = `revGrad-${chartId1.replace(/:/g, "")}`;

  const [stores, setStores] = useState<StoreType[]>([]);
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [pendingPage, setPendingPage] = useState(1);
  const [approveError, setApproveError] = useState<string>("");
  const [rejectError, setRejectError] = useState("");
  const ROWS_PER_PAGE = 5;

  const {
    paginated: paginatedStores,
    totalPages: totalPendingPages,
    safePage: safePendingPage,
  } = usePagination(stores, ROWS_PER_PAGE, pendingPage);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await getAll({ status: "SUBMITTED" });
        setStores(response.data.stores);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStores();
  }, [approvedIds, rejectedIds]);

  const handleApprove = async (id: string) => {
    try {
      setApproveError("");
      const response = await approveStore(id);
      if (response?.status === 200) {
        setApprovedIds((prev) => new Set(prev).add(id));
        setShowApproveModal(null);
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
        setRejectedIds((prev) => new Set(prev).add(id));
        setShowRejectModal(null);
        setRejectReason("");
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Admin Dashboard</h1>
          <p
            className="text-muted-foreground mt-0.5"
            style={{ fontSize: "13px" }}
          >
            Marketplace overview and key metrics
          </p>
        </div>
        {stores.length > 0 && (
          <button
            onClick={() => navigate("/admin/stores")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl hover:shadow-md transition-all"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            <Clock className="w-4 h-4" />
            {stores.length} stores awaiting approval
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Pending Stores Section */}
      {stores.length > 0 && (
        <div className="bg-card rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-amber-50/80 to-orange-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>
                  Pending Store Applications
                </h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "12px" }}
                >
                  {stores.length} vendors waiting for review
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/25">
                  {[
                    "Store Name",
                    "Owner",
                    "Location",
                    "Applied",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-muted-foreground whitespace-nowrap"
                      style={{
                        fontSize: "11px",
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
                {paginatedStores.map((s) => (
                  <tr
                    key={s.vendorId}
                    className="border-b border-border last:border-b-0 hover:bg-muted/15 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#220E92]/8 flex items-center justify-center shrink-0">
                          <Store className="w-3.5 h-3.5 text-[#220E92]" />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>
                          {s.storeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px" }}>{s.ownerName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "13px" }}
                      >
                        {s.location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "12px" }}
                      >
                        {s.submittedAt?.split("T")[0]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setShowApproveModal(s.vendorId)}
                          disabled={s.status !== "SUBMITTED"}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-colors ${
                            s.status === "SUBMITTED"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300"
                              : "bg-muted/50 text-muted-foreground/50 border-border cursor-not-allowed"
                          }`}
                          style={{ fontSize: "12px", fontWeight: 600 }}
                          title={
                            s.status ? "APPROVED" : "Onboarding incomplete"
                          }
                        >
                          <CircleCheck className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => setShowRejectModal(s.vendorId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                          style={{ fontSize: "12px", fontWeight: 600 }}
                          title="Reject"
                        >
                          <CircleX className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            navigate("/admin/stores", {
                              state: { store: s },
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#220E92]/8 text-[#220E92] hover:bg-[#220E92]/15 border border-[#220E92]/20 transition-colors"
                          style={{ fontSize: "12px", fontWeight: 600 }}
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={safePendingPage}
            totalPages={totalPendingPages}
            totalItems={stores.length}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChange={setPendingPage}
            itemLabel="stores"
          />
          <div className="px-5 py-2 flex items-center justify-end border-t border-border">
            <button
              onClick={() => navigate("/admin/stores")}
              className="text-[#220E92] hover:underline flex items-center gap-1"
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Vendors", value: "1,248", change: "+12%", up: true, icon: Store, color: "#220E92" },
          { label: "Active Products", value: "34,567", change: "+8%", up: true, icon: Package, color: "#3B82F6" },
          { label: "Monthly Orders", value: "18,923", change: "+23%", up: true, icon: ShoppingCart, color: "#10b981" },
          { label: "GMV (Monthly)", value: "\u20B97.2Cr", change: "-3%", up: false, icon: TrendingUp, color: "#FFC100" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-2xl border border-border shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{kpi.label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${kpi.color}12` }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </div>
            <p style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>{kpi.value}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${kpi.up ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </span>
              <span className="text-muted-foreground" style={{ fontSize: "11px" }}>vs last month</span>
            </div>
          </div>
        ))}
      </div> */}

      {/* Charts */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Platform Revenue</h3>
          <svg width={0} height={0} style={{ position: "absolute" }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#220E92" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#220E92" stopOpacity={0} />
              </linearGradient>
            </defs>
          </svg>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} id={`area-${chartId1.replace(/:/g, "")}`}>
              <XAxis key="xaxis" dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} />
              <YAxis key="yaxis" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickCount={6} tickFormatter={(v) => `\u20B9${(v / 1000000).toFixed(1)}M`} />
              <Tooltip key="tooltip" formatter={(v: number) => [`\u20B9${(v / 100000).toFixed(1)}L`, "Revenue"]} />
              <Area key="area" type="monotone" dataKey="revenue" stroke="#220E92" fill={`url(#${gradientId})`} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Weekly Order Activity</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={vendorActivity} id={`bar-${chartId2.replace(/:/g, "")}`}>
              <XAxis key="xaxis" dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} />
              <YAxis key="yaxis" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickCount={6} />
              <Tooltip key="tooltip" />
              <Bar key="bar" dataKey="orders" fill="#220E92" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* Top Stores */}
      {/* <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Top Revenue Stores</h3>
          <button onClick={() => navigate("/admin/stores")} className="text-[#220E92] hover:underline flex items-center gap-1" style={{ fontSize: "12px", fontWeight: 600 }}>
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {topStores.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-muted/30 transition-colors -mx-1">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: i < 3 ? "linear-gradient(135deg, #FFC100 0%, #FFD54F 100%)" : "#F3F4F6",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: i < 3 ? "#220E92" : "#6B7280",
                  boxShadow: i < 3 ? "0 2px 6px rgba(255,193,0,0.25)" : "none",
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontSize: "14px", fontWeight: 700 }}>{formatCurrency(s.revenue)}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{s.orders.toLocaleString()} orders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Approve Modal */}
      {showApproveModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowApproveModal(null);
            setApproveError("")
          }}
        >
          <div
            className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
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
                className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(showApproveModal)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowRejectModal(null);
            setRejectReason("");
            setRejectError("");
          }}
        >
          <div
            className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
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
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background resize-none"
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
                className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
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
    </div>
  );
}
