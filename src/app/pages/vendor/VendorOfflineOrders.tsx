import { useState, useMemo } from "react";
import {
  Plus, Search, X, Send, Mail, Phone, Copy, Check,
  Link2, ExternalLink, CreditCard, Clock, CircleCheck,
  CircleX, ChevronDown, Eye, Pencil, ShoppingBag,
  IndianRupee, Users, TrendingUp, MessageCircle,
  Hash, FileText, AlertCircle, RefreshCw, Trash2,
  ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Pagination, usePagination } from "../../components/Pagination";

/* ─── Types ─── */
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface OfflineOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
  };
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentLink: string;
  paymentStatus: "pending" | "sent" | "paid" | "failed" | "expired";
  linkSentVia: ("email" | "whatsapp")[];
  notes: string;
  createdAt: string;
  paidAt?: string;
}

/* ─── Mock data ─── */
const generateMockOrders = (): OfflineOrder[] => [
  {
    id: "off-001", orderNumber: "OFF-2026-001",
    customer: { name: "Priya Sharma", email: "priya.sharma@email.com", phone: "+91 98765 43210", whatsapp: "+91 98765 43210" },
    items: [{ name: "Silk Kurta Set - Navy Blue", qty: 2, price: 2499 }, { name: "Cotton Dupatta - Gold Printed", qty: 1, price: 899 }],
    totalAmount: 5897, discount: 500, finalAmount: 5397,
    paymentLink: "https://pay.dashrobe.in/OFF-2026-001",
    paymentStatus: "paid", linkSentVia: ["email", "whatsapp"],
    notes: "Regular customer, wants gift wrapping", createdAt: "2026-03-13T10:30:00Z", paidAt: "2026-03-13T14:22:00Z",
  },
  {
    id: "off-002", orderNumber: "OFF-2026-002",
    customer: { name: "Rahul Mehta", email: "rahul.m@gmail.com", phone: "+91 87654 32109", whatsapp: "+91 87654 32109" },
    items: [{ name: "Linen Blazer - Charcoal", qty: 1, price: 4999 }, { name: "Slim Fit Trousers - Beige", qty: 1, price: 1999 }],
    totalAmount: 6998, discount: 0, finalAmount: 6998,
    paymentLink: "https://pay.dashrobe.in/OFF-2026-002",
    paymentStatus: "sent", linkSentVia: ["whatsapp"],
    notes: "Needs alterations - will pick up from store", createdAt: "2026-03-14T09:15:00Z",
  },
  {
    id: "off-003", orderNumber: "OFF-2026-003",
    customer: { name: "Anita Desai", email: "anita.desai@outlook.com", phone: "+91 76543 21098", whatsapp: "+91 76543 21098" },
    items: [{ name: "Bridal Lehenga - Maroon Gold", qty: 1, price: 24999 }, { name: "Matching Jewelry Set", qty: 1, price: 3999 }],
    totalAmount: 28998, discount: 2000, finalAmount: 26998,
    paymentLink: "https://pay.dashrobe.in/OFF-2026-003",
    paymentStatus: "pending", linkSentVia: [],
    notes: "Bridal order - delivery needed by March 25", createdAt: "2026-03-14T11:00:00Z",
  },
  {
    id: "off-004", orderNumber: "OFF-2026-004",
    customer: { name: "Vikram Singh", email: "vikram.s@company.in", phone: "+91 65432 10987", whatsapp: "+91 65432 10987" },
    items: [{ name: "Designer Sherwani - Ivory", qty: 1, price: 12999 }],
    totalAmount: 12999, discount: 1000, finalAmount: 11999,
    paymentLink: "https://pay.dashrobe.in/OFF-2026-004",
    paymentStatus: "expired", linkSentVia: ["email"],
    notes: "Payment link expired, needs resend", createdAt: "2026-03-10T15:45:00Z",
  },
  {
    id: "off-005", orderNumber: "OFF-2026-005",
    customer: { name: "Meera Patel", email: "meera.p@gmail.com", phone: "+91 54321 09876", whatsapp: "+91 54321 09876" },
    items: [{ name: "Casual Kurti - Teal", qty: 3, price: 1299 }, { name: "Palazzo Pants - White", qty: 2, price: 999 }],
    totalAmount: 5895, discount: 300, finalAmount: 5595,
    paymentLink: "https://pay.dashrobe.in/OFF-2026-005",
    paymentStatus: "failed", linkSentVia: ["email", "whatsapp"],
    notes: "Payment failed - customer will retry", createdAt: "2026-03-12T13:20:00Z",
  },
  {
    id: "off-006", orderNumber: "OFF-2026-006",
    customer: { name: "Arjun Kapoor", email: "arjun.k@email.com", phone: "+91 43210 98765", whatsapp: "+91 43210 98765" },
    items: [{ name: "Formal Shirt - White", qty: 5, price: 1599 }],
    totalAmount: 7995, discount: 800, finalAmount: 7195,
    paymentLink: "https://pay.dashrobe.in/OFF-2026-006",
    paymentStatus: "paid", linkSentVia: ["email"],
    notes: "Bulk order for office team", createdAt: "2026-03-11T08:00:00Z", paidAt: "2026-03-11T10:15:00Z",
  },
];

/* ─── Payment status config ─── */
const paymentStatusConfig: Record<string, { label: string; icon: typeof Clock; color: string; bg: string; border: string }> = {
  pending:  { label: "Pending",       icon: Clock,       color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  sent:     { label: "Link Sent",     icon: Send,        color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  paid:     { label: "Paid",          icon: CircleCheck,  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  failed:   { label: "Failed",        icon: CircleX,     color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200" },
  expired:  { label: "Expired",       icon: AlertCircle, color: "text-gray-600",    bg: "bg-gray-50",    border: "border-gray-200" },
};

/* ─── Helpers ─── */
function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function VendorOfflineOrders() {
  const [orders, setOrders] = useState<OfflineOrder[]>(generateMockOrders);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OfflineOrder | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [offlinePage, setOfflinePage] = useState(1);

  /* ─── Stats ─── */
  const stats = useMemo(() => {
    const total = orders.length;
    const paid = orders.filter(o => o.paymentStatus === "paid").length;
    const pending = orders.filter(o => o.paymentStatus === "pending" || o.paymentStatus === "sent").length;
    const revenue = orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.finalAmount, 0);
    return { total, paid, pending, revenue };
  }, [orders]);

  /* ─── Filter ─── */
  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") result = result.filter(o => o.paymentStatus === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }
    return result;
  }, [orders, statusFilter, search]);

  const OFFLINE_PER_PAGE = 6;
  const { paginated: paginatedFiltered, totalPages: offlineTotalPages, safePage: safeOfflinePage } = usePagination(filtered, OFFLINE_PER_PAGE, offlinePage);

  /* ─── Copy link ─── */
  const copyLink = (link: string, id: string) => {
    try { navigator.clipboard.writeText(link); } catch { document.execCommand("copy"); }
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  /* ─── Update payment status ─── */
  const updatePaymentStatus = (orderId: string, newStatus: OfflineOrder["paymentStatus"]) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? { ...o, paymentStatus: newStatus, paidAt: newStatus === "paid" ? new Date().toISOString() : o.paidAt }
        : o
    ));
    setShowStatusDropdown(null);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newStatus, paidAt: newStatus === "paid" ? new Date().toISOString() : prev.paidAt } : null);
    }
  };

  /* ─── Send link ─── */
  const sendLink = (orderId: string, via: "email" | "whatsapp") => {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? { ...o, paymentStatus: o.paymentStatus === "pending" ? "sent" : o.paymentStatus, linkSentVia: [...new Set([...o.linkSentVia, via])] }
        : o
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev
        ? { ...prev, paymentStatus: prev.paymentStatus === "pending" ? "sent" : prev.paymentStatus, linkSentVia: [...new Set([...prev.linkSentVia, via])] }
        : null
      );
    }
  };

  /* ─── Create order ─── */
  const handleCreateOrder = (order: Omit<OfflineOrder, "id" | "orderNumber" | "paymentLink" | "paymentStatus" | "linkSentVia" | "createdAt">) => {
    const num = orders.length + 1;
    const newOrder: OfflineOrder = {
      ...order,
      id: `off-${String(num).padStart(3, "0")}`,
      orderNumber: `OFF-2026-${String(num).padStart(3, "0")}`,
      paymentLink: `https://pay.dashrobe.in/OFF-2026-${String(num).padStart(3, "0")}`,
      paymentStatus: "pending",
      linkSentVia: [],
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800 }}>Offline Orders</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
            Create manual orders, generate payment links and track payments
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontSize: "13px", fontWeight: 600,
            background: "linear-gradient(135deg, #220E92, #4318ca)",
            boxShadow: "0 4px 20px rgba(34,14,146,0.35)",
          }}
        >
          <Plus className="w-4 h-4" />
          Create Offline Order
        </button>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",    value: stats.total,                       icon: ShoppingBag,  color: "#220E92", bg: "bg-[#220E92]/5" },
          { label: "Paid Orders",     value: stats.paid,                        icon: CircleCheck,   color: "#059669", bg: "bg-emerald-50" },
          { label: "Pending / Sent",  value: stats.pending,                     icon: Clock,         color: "#d97706", bg: "bg-amber-50" },
          { label: "Revenue",         value: formatCurrency(stats.revenue),     icon: IndianRupee,   color: "#220E92", bg: "bg-[#220E92]/5" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className="w-[18px] h-[18px]" style={{ color: s.color }} />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 500 }}>{s.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 800, marginTop: "2px" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ─── Filters Bar ─── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order #, customer name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92] transition-all"
            style={{ fontSize: "13px" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "sent", "paid", "failed", "expired"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2 rounded-xl border transition-all ${
                statusFilter === s
                  ? "bg-[#220E92] text-white border-[#220E92]"
                  : "bg-card border-border text-muted-foreground hover:border-[#220E92]/30 hover:text-foreground"
              }`}
              style={{ fontSize: "12px", fontWeight: statusFilter === s ? 600 : 400 }}
            >
              {s === "all" ? "All" : paymentStatusConfig[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Orders Table ─── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Order #", "Customer", "Items", "Amount", "Payment Status", "Link Sent Via", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedFiltered.map((order) => {
                const sc = paymentStatusConfig[order.paymentStatus];
                const StatusIcon = sc.icon;
                return (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-[#220E92]" style={{ fontSize: "13px", fontWeight: 600 }}>{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p style={{ fontSize: "13px", fontWeight: 500 }}>{order.customer.name}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px" }}>{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{formatCurrency(order.finalAmount)}</span>
                      {order.discount > 0 && (
                        <p className="text-emerald-600" style={{ fontSize: "10px" }}>-{formatCurrency(order.discount)} disc.</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setShowStatusDropdown(showStatusDropdown === order.id ? null : order.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${sc.bg} ${sc.color} border ${sc.border} transition-all hover:opacity-80`}
                          style={{ fontSize: "11px", fontWeight: 600 }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                          <ChevronDown className="w-3 h-3 ml-0.5" />
                        </button>
                        <AnimatePresence>
                          {showStatusDropdown === order.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="absolute top-full left-0 mt-1 w-40 bg-card border border-border rounded-xl shadow-lg z-50 py-1 overflow-hidden"
                            >
                              {(["pending", "sent", "paid", "failed", "expired"] as const).map(s => {
                                const cfg = paymentStatusConfig[s];
                                const Icon = cfg.icon;
                                return (
                                  <button
                                    key={s}
                                    onClick={() => updatePaymentStatus(order.id, s)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors text-left ${
                                      order.paymentStatus === s ? "bg-muted/30" : ""
                                    }`}
                                    style={{ fontSize: "12px" }}
                                  >
                                    <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                                    <span className={order.paymentStatus === s ? "font-semibold" : ""}>{cfg.label}</span>
                                    {order.paymentStatus === s && <Check className="w-3 h-3 ml-auto text-[#220E92]" />}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {order.linkSentVia.includes("email") && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200" style={{ fontSize: "10px", fontWeight: 500 }}>
                            <Mail className="w-2.5 h-2.5" /> Email
                          </span>
                        )}
                        {order.linkSentVia.includes("whatsapp") && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200" style={{ fontSize: "10px", fontWeight: 500 }}>
                            <MessageCircle className="w-2.5 h-2.5" /> WhatsApp
                          </span>
                        )}
                        {order.linkSentVia.length === 0 && (
                          <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Not sent</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p style={{ fontSize: "12px" }}>{formatDate(order.createdAt)}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "10px" }}>{formatTime(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => copyLink(order.paymentLink, order.id)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Copy Payment Link"
                        >
                          {copiedLink === order.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => sendLink(order.id, "email")}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-muted-foreground hover:text-blue-600"
                          title="Send via Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => sendLink(order.id, "whatsapp")}
                          className="p-1.5 rounded-lg hover:bg-green-50 transition-colors text-muted-foreground hover:text-green-600"
                          title="Send via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {paginatedFiltered.map((order) => {
            const sc = paymentStatusConfig[order.paymentStatus];
            const StatusIcon = sc.icon;
            return (
              <div key={order.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#220E92]" style={{ fontSize: "13px", fontWeight: 600 }}>{order.orderNumber}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg ${sc.bg} ${sc.color} border ${sc.border}`} style={{ fontSize: "10px", fontWeight: 600 }}>
                    <StatusIcon className="w-3 h-3" />
                    {sc.label}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{order.customer.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 700 }}>{formatCurrency(order.finalAmount)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedOrder(order)} className="flex-1 py-1.5 text-center rounded-lg bg-[#220E92]/5 text-[#220E92] border border-[#220E92]/15 hover:bg-[#220E92]/10 transition-colors" style={{ fontSize: "11px", fontWeight: 600 }}>
                    View Details
                  </button>
                  <button onClick={() => sendLink(order.id, "email")} className="p-1.5 rounded-lg border border-border hover:bg-blue-50 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                  <button onClick={() => sendLink(order.id, "whatsapp")} className="p-1.5 rounded-lg border border-border hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {paginatedFiltered.length === 0 && (
          <div className="py-16 text-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground" style={{ fontSize: "14px", fontWeight: 500 }}>No offline orders found</p>
            <p className="text-muted-foreground/60 mt-1" style={{ fontSize: "12px" }}>Try adjusting your search or filters</p>
          </div>
        )}

        {filtered.length > 0 && (
          <Pagination
            currentPage={safeOfflinePage}
            totalPages={offlineTotalPages}
            totalItems={filtered.length}
            itemsPerPage={OFFLINE_PER_PAGE}
            onPageChange={setOfflinePage}
            itemLabel="orders"
          />
        )}
      </div>

      {/* ─── Create Order Modal ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateOrderModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateOrder}
          />
        )}
      </AnimatePresence>

      {/* ─── Order Detail Panel ─── */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={(s) => updatePaymentStatus(selectedOrder.id, s)}
            onSendLink={(via) => sendLink(selectedOrder.id, via)}
            onCopyLink={() => copyLink(selectedOrder.paymentLink, selectedOrder.id)}
            copied={copiedLink === selectedOrder.id}
          />
        )}
      </AnimatePresence>

      {/* Close dropdowns on outside click */}
      {showStatusDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowStatusDropdown(null)} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CREATE ORDER MODAL
   ═══════════════════════════════════════════════════════════════ */
function CreateOrderModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (order: Omit<OfflineOrder, "id" | "orderNumber" | "paymentLink" | "paymentStatus" | "linkSentVia" | "createdAt">) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [items, setItems] = useState<OrderItem[]>([{ name: "", qty: 1, price: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  const totalAmount = items.reduce((s, i) => s + i.qty * i.price, 0);
  const finalAmount = Math.max(0, totalAmount - discount);

  const addItem = () => setItems(prev => [...prev, { name: "", qty: 1, price: 0 }]);
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof OrderItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const canSubmit = customerName.trim() && customerEmail.trim() && customerPhone.trim() && items.every(i => i.name.trim() && i.price > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: customerPhone.trim(),
        whatsapp: sameAsPhone ? customerPhone.trim() : customerWhatsapp.trim(),
      },
      items,
      totalAmount,
      discount,
      finalAmount,
      notes: notes.trim(),
    });
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92] transition-all";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-8 sm:pt-16 px-4 overflow-y-auto pb-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-[640px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#220E92] to-[#4318ca] flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Create Offline Order</h2>
              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Add items and customer details to generate a payment link</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {/* Customer Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#220E92]" />
              <h3 style={{ fontSize: "14px", fontWeight: 600 }}>Customer Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-muted-foreground mb-1 block" style={{ fontSize: "11px", fontWeight: 500 }}>Full Name *</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Priya Sharma" className={inputCls} style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block" style={{ fontSize: "11px", fontWeight: 500 }}>Email Address *</label>
                <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="customer@email.com" className={inputCls} style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block" style={{ fontSize: "11px", fontWeight: 500 }}>Phone Number *</label>
                <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+91 98765 43210" className={inputCls} style={{ fontSize: "13px" }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 500 }}>WhatsApp Number</label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={sameAsPhone} onChange={e => setSameAsPhone(e.target.checked)} className="w-3.5 h-3.5 rounded border-border accent-[#220E92]" />
                    <span className="text-muted-foreground" style={{ fontSize: "10px" }}>Same as phone</span>
                  </label>
                </div>
                <input
                  type="tel"
                  value={sameAsPhone ? customerPhone : customerWhatsapp}
                  onChange={e => setCustomerWhatsapp(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`${inputCls} ${sameAsPhone ? "opacity-50" : ""}`}
                  style={{ fontSize: "13px" }}
                  disabled={sameAsPhone}
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#220E92]" />
                <h3 style={{ fontSize: "14px", fontWeight: 600 }}>Order Items</h3>
              </div>
              <button onClick={addItem} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[#220E92] bg-[#220E92]/5 hover:bg-[#220E92]/10 transition-colors border border-[#220E92]/15" style={{ fontSize: "11px", fontWeight: 600 }}>
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={e => updateItem(idx, "name", e.target.value)}
                      placeholder="Item name (e.g. Silk Kurta Set)"
                      className={inputCls}
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      value={item.qty || ""}
                      onChange={e => updateItem(idx, "qty", parseInt(e.target.value) || 0)}
                      placeholder="Qty"
                      className={inputCls}
                      style={{ fontSize: "13px" }}
                      min={1}
                    />
                  </div>
                  <div className="w-28">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "12px" }}>&#8377;</span>
                      <input
                        type="number"
                        value={item.price || ""}
                        onChange={e => updateItem(idx, "price", parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                        className={`${inputCls} pl-7`}
                        style={{ fontSize: "13px" }}
                        min={0}
                      />
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(idx)} className="p-2.5 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors mt-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Discount & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground mb-1 block" style={{ fontSize: "11px", fontWeight: 500 }}>Discount Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "12px" }}>&#8377;</span>
                <input
                  type="number"
                  value={discount || ""}
                  onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className={`${inputCls} pl-7`}
                  style={{ fontSize: "13px" }}
                  min={0}
                />
              </div>
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block" style={{ fontSize: "11px", fontWeight: 500 }}>Internal Notes</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions..." className={inputCls} style={{ fontSize: "13px" }} />
            </div>
          </div>

          {/* Price Summary */}
          <div className="rounded-xl bg-muted/30 border border-border p-4 space-y-2">
            <div className="flex justify-between text-muted-foreground" style={{ fontSize: "13px" }}>
              <span>Subtotal ({items.filter(i => i.name).length} items)</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600" style={{ fontSize: "13px" }}>
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between" style={{ fontSize: "15px", fontWeight: 700 }}>
              <span>Total</span>
              <span className="text-[#220E92]">{formatCurrency(finalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-muted/20 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all" style={{ fontSize: "13px", fontWeight: 500 }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
            style={{
              fontSize: "13px", fontWeight: 600,
              background: canSubmit ? "linear-gradient(135deg, #220E92, #4318ca)" : "#9ca3af",
              boxShadow: canSubmit ? "0 4px 20px rgba(34,14,146,0.35)" : "none",
            }}
          >
            <Link2 className="w-4 h-4" />
            Create &amp; Generate Payment Link
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORDER DETAIL PANEL (Slide-over)
   ═══════════════════════════════════════════════════════════════ */
function OrderDetailPanel({
  order,
  onClose,
  onUpdateStatus,
  onSendLink,
  onCopyLink,
  copied,
}: {
  order: OfflineOrder;
  onClose: () => void;
  onUpdateStatus: (s: OfflineOrder["paymentStatus"]) => void;
  onSendLink: (via: "email" | "whatsapp") => void;
  onCopyLink: () => void;
  copied: boolean;
}) {
  const sc = paymentStatusConfig[order.paymentStatus];
  const StatusIcon = sc.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-card border-l border-border shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700 }}>{order.orderNumber}</h2>
              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Created {formatDate(order.createdAt)} at {formatTime(order.createdAt)}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${sc.bg} ${sc.color} border ${sc.border}`} style={{ fontSize: "11px", fontWeight: 600 }}>
            <StatusIcon className="w-3 h-3" />
            {sc.label}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: "thin" }}>
          {/* Customer Info */}
          <div className="rounded-xl border border-border p-4">
            <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>
              <Users className="w-4 h-4 text-[#220E92]" /> Customer Information
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#220E92]/10 to-[#4318ca]/10 flex items-center justify-center">
                  <span className="text-[#220E92]" style={{ fontSize: "14px", fontWeight: 700 }}>{order.customer.name.charAt(0)}</span>
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>{order.customer.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Customer</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span style={{ fontSize: "12px" }}>{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span style={{ fontSize: "12px" }}>{order.customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span style={{ fontSize: "12px" }}>{order.customer.whatsapp}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-xl border border-border p-4">
            <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>
              <ShoppingBag className="w-4 h-4 text-[#220E92]" /> Order Items
            </h3>
            <div className="space-y-2.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{item.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Qty: {item.qty} x {formatCurrency(item.price)}</p>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>{formatCurrency(item.qty * item.price)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border space-y-1.5">
              <div className="flex justify-between text-muted-foreground" style={{ fontSize: "12px" }}>
                <span>Subtotal</span><span>{formatCurrency(order.totalAmount)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600" style={{ fontSize: "12px" }}>
                  <span>Discount</span><span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1.5" style={{ fontSize: "15px", fontWeight: 700 }}>
                <span>Total</span><span className="text-[#220E92]">{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Link */}
          <div className="rounded-xl border border-border p-4">
            <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>
              <Link2 className="w-4 h-4 text-[#220E92]" /> Payment Link
            </h3>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-border">
              <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate text-[#220E92]" style={{ fontSize: "12px", fontWeight: 500 }}>{order.paymentLink}</span>
              <button onClick={onCopyLink} className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onSendLink("email")}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                <Mail className="w-3.5 h-3.5" />
                Send via Email
              </button>
              <button
                onClick={() => onSendLink("whatsapp")}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Send via WhatsApp
              </button>
            </div>
            {order.linkSentVia.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-muted-foreground" style={{ fontSize: "11px" }}>
                  Sent via {order.linkSentVia.map(v => v === "email" ? "Email" : "WhatsApp").join(" & ")}
                </span>
              </div>
            )}
          </div>

          {/* Update Payment Status */}
          <div className="rounded-xl border border-border p-4">
            <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>
              <CreditCard className="w-4 h-4 text-[#220E92]" /> Update Payment Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(["pending", "sent", "paid", "failed", "expired"] as const).map(s => {
                const cfg = paymentStatusConfig[s];
                const Icon = cfg.icon;
                const isActive = order.paymentStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => onUpdateStatus(s)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                      isActive
                        ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-2 ring-[#220E92]/20`
                        : "border-border hover:border-[#220E92]/20 hover:bg-muted/30 text-muted-foreground"
                    }`}
                    style={{ fontSize: "11px", fontWeight: isActive ? 600 : 400 }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
            {order.paidAt && order.paymentStatus === "paid" && (
              <p className="text-emerald-600 mt-2.5 flex items-center gap-1.5" style={{ fontSize: "11px" }}>
                <CircleCheck className="w-3.5 h-3.5" />
                Payment received on {formatDate(order.paidAt)} at {formatTime(order.paidAt)}
              </p>
            )}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-xl border border-border p-4">
              <h3 className="flex items-center gap-2 mb-2" style={{ fontSize: "13px", fontWeight: 600 }}>
                <FileText className="w-4 h-4 text-[#220E92]" /> Notes
              </h3>
              <p className="text-muted-foreground" style={{ fontSize: "12px", lineHeight: "1.6" }}>{order.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}