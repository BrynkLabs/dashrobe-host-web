import { useState } from "react";
import {
  Home, Package, Clock, CircleCheck, Settings, RefreshCw,
  X, MapPin, Phone, Mail, Calendar, Truck, Eye, ShoppingBag,
  Timer, ArrowRight, ChevronRight, TriangleAlert, Star, User,
  RotateCcw, CreditCard, MessageSquare, Copy, ExternalLink,
  PackageCheck, PackageX, CircleDot, Check,
} from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { Pagination, usePagination } from "../../components/Pagination";

interface TryItem {
  id: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: string;
  sku: string;
  kept: boolean | null; // null = pending, true = kept, false = returned
}

interface TryOrder {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  items: TryItem[];
  date: string;
  slot: string;
  status: string;
  trialEndDate: string;
  daysLeft: number;
  deliveryPartner: string;
  deliveryPhone: string;
  notes: string;
  totalValue: string;
  deposit: string;
  timeline: { label: string; time: string; done: boolean }[];
}

const IMG1 = "https://images.unsplash.com/photo-1610030468706-9a6dbad49b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHNpbGslMjBzYXJlZSUyMGZhc2hpb258ZW58MXx8fHwxNzcyMTA4MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG2 = "https://images.unsplash.com/photo-1679452233752-3ca4b1b0190b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwZW1icm9pZGVyZWQlMjBrdXJ0aSUyMGV0aG5pY3xlbnwxfHx8fDE3NzIxMDgwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG3 = "https://images.unsplash.com/photo-1767955694884-d4bf352c23c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBicmlkYWwlMjB3ZWFyfGVufDF8fHx8MTc3MjEwODA2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG4 = "https://images.unsplash.com/photo-1654707500805-2352a7c734e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFuYXJrYWxpJTIwZHJlc3N8ZW58MXx8fHwxNzcyMTA4MDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const tryOrders: TryOrder[] = [
  {
    id: "TH-201",
    customer: "Priya Sharma",
    phone: "+91 98765 43210",
    email: "priya.sharma@email.com",
    address: "42, MG Road, Indiranagar, Bengaluru 560038",
    date: "Feb 27, 2026",
    slot: "10:00 AM – 12:00 PM",
    status: "scheduled",
    trialEndDate: "Mar 2, 2026",
    daysLeft: 3,
    deliveryPartner: "Delhivery Express",
    deliveryPhone: "+91 98000 12345",
    notes: "Please call before arriving. Apt 4B, use the side entrance.",
    totalValue: "₹8,450",
    deposit: "₹500",
    items: [
      { id: "SKU-1201", name: "Banarasi Silk Saree", image: IMG1, size: "Free", color: "Royal Blue", price: "₹3,200", sku: "BSS-RB-001", kept: null },
      { id: "SKU-1202", name: "Embroidered Gold Kurti Set", image: IMG2, size: "M", color: "Gold", price: "₹2,450", sku: "EGK-GD-M01", kept: null },
      { id: "SKU-1203", name: "Bridal Lehenga Choli", image: IMG3, size: "S", color: "Maroon", price: "₹2,800", sku: "BLC-MR-S01", kept: null },
    ],
    timeline: [
      { label: "Order Placed", time: "Feb 26, 10:15 AM", done: true },
      { label: "Confirmed by Store", time: "Feb 26, 10:32 AM", done: true },
      { label: "Out for Delivery", time: "Scheduled: Feb 27, 10:00 AM", done: false },
      { label: "Delivered to Customer", time: "Pending", done: false },
      { label: "Trial Period Ends", time: "Mar 2, 2026", done: false },
      { label: "Pickup / Return", time: "Pending", done: false },
    ],
  },
  {
    id: "TH-200",
    customer: "Anita Singh",
    phone: "+91 99887 76655",
    email: "anita.singh@email.com",
    address: "12, Park Street, Kolkata 700016",
    date: "Feb 26, 2026",
    slot: "2:00 PM – 4:00 PM",
    status: "in_progress",
    trialEndDate: "Mar 1, 2026",
    daysLeft: 1,
    deliveryPartner: "BlueDart",
    deliveryPhone: "+91 98000 54321",
    notes: "",
    totalValue: "₹5,650",
    deposit: "₹500",
    items: [
      { id: "SKU-1204", name: "Designer Anarkali Suit", image: IMG4, size: "L", color: "Emerald Green", price: "₹3,200", sku: "DAS-EG-L01", kept: true },
      { id: "SKU-1205", name: "Embroidered Gold Kurti Set", image: IMG2, size: "L", color: "Gold", price: "₹2,450", sku: "EGK-GD-L01", kept: false },
    ],
    timeline: [
      { label: "Order Placed", time: "Feb 25, 3:42 PM", done: true },
      { label: "Confirmed by Store", time: "Feb 25, 4:00 PM", done: true },
      { label: "Out for Delivery", time: "Feb 26, 1:45 PM", done: true },
      { label: "Delivered to Customer", time: "Feb 26, 2:30 PM", done: true },
      { label: "Trial Period Ends", time: "Mar 1, 2026", done: false },
      { label: "Pickup / Return", time: "Pending", done: false },
    ],
  },
  {
    id: "TH-199",
    customer: "Neha Gupta",
    phone: "+91 87654 32109",
    email: "neha.gupta@email.com",
    address: "88, Connaught Place, New Delhi 110001",
    date: "Feb 25, 2026",
    slot: "11:00 AM – 1:00 PM",
    status: "completed",
    trialEndDate: "Feb 28, 2026",
    daysLeft: 0,
    deliveryPartner: "Delhivery Express",
    deliveryPhone: "+91 98000 12345",
    notes: "Customer kept 3 of 4 items.",
    totalValue: "₹11,900",
    deposit: "₹500",
    items: [
      { id: "SKU-1206", name: "Banarasi Silk Saree", image: IMG1, size: "Free", color: "Royal Blue", price: "₹3,200", sku: "BSS-RB-002", kept: true },
      { id: "SKU-1207", name: "Bridal Lehenga Choli", image: IMG3, size: "M", color: "Maroon", price: "₹2,800", sku: "BLC-MR-M01", kept: true },
      { id: "SKU-1208", name: "Designer Anarkali Suit", image: IMG4, size: "M", color: "Emerald Green", price: "₹3,200", sku: "DAS-EG-M01", kept: true },
      { id: "SKU-1209", name: "Embroidered Gold Kurti Set", image: IMG2, size: "M", color: "Gold", price: "₹2,700", sku: "EGK-GD-M02", kept: false },
    ],
    timeline: [
      { label: "Order Placed", time: "Feb 24, 9:00 AM", done: true },
      { label: "Confirmed by Store", time: "Feb 24, 9:15 AM", done: true },
      { label: "Out for Delivery", time: "Feb 25, 10:30 AM", done: true },
      { label: "Delivered to Customer", time: "Feb 25, 11:22 AM", done: true },
      { label: "Trial Period Ended", time: "Feb 28, 2026", done: true },
      { label: "Items Returned & Settled", time: "Feb 28, 4:00 PM", done: true },
    ],
  },
  {
    id: "TH-198",
    customer: "Kavita Reddy",
    phone: "+91 76543 21098",
    email: "kavita.r@email.com",
    address: "5, Jubilee Hills, Hyderabad 500033",
    date: "Feb 24, 2026",
    slot: "3:00 PM – 5:00 PM",
    status: "refund",
    trialEndDate: "Feb 27, 2026",
    daysLeft: 0,
    deliveryPartner: "BlueDart",
    deliveryPhone: "+91 98000 54321",
    notes: "Customer returned all items. Requested full refund of deposit.",
    totalValue: "₹3,200",
    deposit: "₹500",
    items: [
      { id: "SKU-1210", name: "Banarasi Silk Saree", image: IMG1, size: "Free", color: "Royal Blue", price: "₹3,200", sku: "BSS-RB-003", kept: false },
    ],
    timeline: [
      { label: "Order Placed", time: "Feb 23, 1:00 PM", done: true },
      { label: "Confirmed by Store", time: "Feb 23, 1:20 PM", done: true },
      { label: "Out for Delivery", time: "Feb 24, 2:45 PM", done: true },
      { label: "Delivered to Customer", time: "Feb 24, 3:30 PM", done: true },
      { label: "All Items Returned", time: "Feb 27, 10:00 AM", done: true },
      { label: "Refund Requested", time: "Feb 27, 10:15 AM", done: true },
    ],
  },
  {
    id: "TH-197",
    customer: "Meera Joshi",
    phone: "+91 65432 10987",
    email: "meera.j@email.com",
    address: "32, FC Road, Pune 411004",
    date: "Feb 23, 2026",
    slot: "10:00 AM – 12:00 PM",
    status: "completed",
    trialEndDate: "Feb 26, 2026",
    daysLeft: 0,
    deliveryPartner: "Delhivery Express",
    deliveryPhone: "+91 98000 12345",
    notes: "Customer kept both items. Converted to full purchase.",
    totalValue: "₹5,650",
    deposit: "₹500",
    items: [
      { id: "SKU-1211", name: "Designer Anarkali Suit", image: IMG4, size: "S", color: "Emerald Green", price: "₹3,200", sku: "DAS-EG-S01", kept: true },
      { id: "SKU-1212", name: "Embroidered Gold Kurti Set", image: IMG2, size: "S", color: "Gold", price: "₹2,450", sku: "EGK-GD-S01", kept: true },
    ],
    timeline: [
      { label: "Order Placed", time: "Feb 22, 8:30 AM", done: true },
      { label: "Confirmed by Store", time: "Feb 22, 8:45 AM", done: true },
      { label: "Out for Delivery", time: "Feb 23, 9:40 AM", done: true },
      { label: "Delivered to Customer", time: "Feb 23, 10:15 AM", done: true },
      { label: "Trial Period Ended", time: "Feb 26, 2026", done: true },
      { label: "Purchase Confirmed", time: "Feb 26, 11:00 AM", done: true },
    ],
  },
];

const statusConf: Record<string, { label: string; bg: string; text: string }> = {
  scheduled: { label: "Scheduled", bg: "bg-blue-50", text: "text-blue-700" },
  in_progress: { label: "In Progress", bg: "bg-amber-50", text: "text-amber-700" },
  completed: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700" },
  refund: { label: "Refund", bg: "bg-red-50", text: "text-red-600" },
};

export function VendorTryAtHome() {
  const [enabled, setEnabled] = useState(true);
  const [maxSkus, setMaxSkus] = useState("5");
  const [tryStock, setTryStock] = useState("3");
  const [selectedOrder, setSelectedOrder] = useState<TryOrder | null>(null);
  const [viewTab, setViewTab] = useState<"details" | "items" | "timeline">("details");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = filterStatus === "all"
    ? tryOrders
    : tryOrders.filter((o) => o.status === filterStatus);

  const [tryPage, setTryPage] = useState(1);
  const TRY_PER_PAGE = 5;
  const { paginated: paginatedTryOrders, totalPages: tryTotalPages, safePage: safeTryPage } = usePagination(filteredOrders, TRY_PER_PAGE, tryPage);

  const keptCount = (order: TryOrder) => order.items.filter((i) => i.kept === true).length;
  const returnedCount = (order: TryOrder) => order.items.filter((i) => i.kept === false).length;
  const pendingCount = (order: TryOrder) => order.items.filter((i) => i.kept === null).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Try at Home</h1>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
          Manage home trial settings and orders
        </p>
      </div>

      {/* Feature toggle + settings */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[10px] bg-[#220E92]/8 flex items-center justify-center">
              <Home className="w-6 h-6 text-[#220E92]" />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Try at Home Feature</h3>
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                Let customers try products at home before purchasing
              </p>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        {enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-border">
            <div>
              <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Max SKUs per Try Order</label>
              <input type="number" value={maxSkus} onChange={(e) => setMaxSkus(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Try Stock per SKU</label>
              <input type="number" value={tryStock} onChange={(e) => setTryStock(e.target.value)} className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background" style={{ fontSize: "14px" }} />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Conversion Rate</label>
              <p style={{ fontSize: "22px", fontWeight: 700 }} className="text-[#220E92]">68%</p>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>of try orders convert to purchase</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Try Orders", value: "89", icon: Home, color: "#220E92" },
          { label: "Upcoming", value: "5", icon: Clock, color: "#FFC100" },
          { label: "Completed", value: "72", icon: CircleCheck, color: "#10b981" },
          { label: "Refunded", value: "12", icon: RefreshCw, color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-[12px] border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: s.color + "12" }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{s.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 700 }} className="mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: "all", label: "All Orders" },
          { id: "scheduled", label: "Scheduled" },
          { id: "in_progress", label: "In Progress" },
          { id: "completed", label: "Completed" },
          { id: "refund", label: "Refund" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id)}
            className={`px-3.5 py-1.5 rounded-full border transition-colors ${
              filterStatus === f.id
                ? "bg-[#220E92] text-white border-[#220E92]"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Try orders table */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Try Orders</h3>
          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{filteredOrders.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Order ID", "Customer", "Items", "Value", "Date", "Time Slot", "Trial Left", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedTryOrders.map((o) => {
                const sc = statusConf[o.status];
                return (
                  <tr
                    key={o.id}
                    className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => { setSelectedOrder(o); setViewTab("details"); }}
                  >
                    <td className="px-5 py-3.5" style={{ fontSize: "14px", fontWeight: 600 }}>{o.id}</td>
                    <td className="px-5 py-3.5">
                      <p style={{ fontSize: "14px" }}>{o.customer}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{o.phone}</p>
                    </td>
                    <td className="px-5 py-3.5" style={{ fontSize: "14px" }}>{o.items.length}</td>
                    <td className="px-5 py-3.5" style={{ fontSize: "14px", fontWeight: 600 }}>{o.totalValue}</td>
                    <td className="px-5 py-3.5" style={{ fontSize: "14px" }}>{o.date}</td>
                    <td className="px-5 py-3.5 text-muted-foreground" style={{ fontSize: "13px" }}>{o.slot}</td>
                    <td className="px-5 py-3.5">
                      {o.daysLeft > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFC100]/15 text-[#220E92]" style={{ fontSize: "12px", fontWeight: 600 }}>
                          <Timer className="w-3 h-3" /> {o.daysLeft}d left
                        </span>
                      ) : (
                        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Ended</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`} style={{ fontSize: "12px", fontWeight: 600 }}>{sc.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); setViewTab("details"); }}
                        className="inline-flex items-center gap-1 text-[#220E92] hover:underline"
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredOrders.length > 0 && (
          <Pagination
            currentPage={safeTryPage}
            totalPages={tryTotalPages}
            totalItems={filteredOrders.length}
            itemsPerPage={TRY_PER_PAGE}
            onPageChange={setTryPage}
            itemLabel="requests"
          />
        )}
      </div>

      {/* ═══════════════ VIEW PANEL (SLIDE-OVER) ═══════════════ */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[600px] bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/8 flex items-center justify-center">
                    <Home className="w-5 h-5 text-[#220E92]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 style={{ fontSize: "18px", fontWeight: 700 }}>{selectedOrder.id}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full ${statusConf[selectedOrder.status].bg} ${statusConf[selectedOrder.status].text}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                        {statusConf[selectedOrder.status].label}
                      </span>
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                      {selectedOrder.date} · {selectedOrder.slot}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4 bg-muted rounded-[10px] p-1">
                {(["details", "items", "timeline"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setViewTab(t)}
                    className={`flex-1 px-3 py-2 rounded-lg transition-colors capitalize ${
                      viewTab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                    }`}
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {t === "details" ? "Details" : t === "items" ? `Items (${selectedOrder.items.length})` : "Timeline"}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* ── DETAILS TAB ── */}
              {viewTab === "details" && (
                <>
                  {/* Trial Countdown */}
                  {selectedOrder.daysLeft > 0 && (
                    <div className="rounded-[10px] p-4 bg-[#FFC100]/10 border border-[#FFC100]/30">
                      <div className="flex items-center gap-3">
                        <Timer className="w-5 h-5 text-[#220E92]" />
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 600 }} className="text-[#220E92]">
                            Trial ends in {selectedOrder.daysLeft} day{selectedOrder.daysLeft > 1 ? "s" : ""}
                          </p>
                          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                            Trial period ends on {selectedOrder.trialEndDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="rounded-[10px] border border-border p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Customer Information</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#220E92]/8 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-[#220E92]" />
                        </div>
                        <div>
                          <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Name</p>
                          <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedOrder.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#220E92]/8 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-[#220E92]" />
                        </div>
                        <div>
                          <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Phone</p>
                          <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedOrder.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 sm:col-span-2">
                        <div className="w-9 h-9 rounded-full bg-[#220E92]/8 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-[#220E92]" />
                        </div>
                        <div>
                          <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Email</p>
                          <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedOrder.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#220E92]/8 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-[#220E92]" />
                        </div>
                        <div>
                          <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Delivery Address</p>
                          <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedOrder.address}</p>
                        </div>
                      </div>
                    </div>
                    {selectedOrder.notes && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#FFC100]/15 flex items-center justify-center shrink-0 mt-0.5">
                            <MessageSquare className="w-4 h-4 text-[#FFC100]" />
                          </div>
                          <div>
                            <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Customer Notes</p>
                            <p style={{ fontSize: "13px" }}>{selectedOrder.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="rounded-[10px] border border-border p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                      <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Order Summary</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/40 rounded-[8px] p-3">
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Total Value</p>
                        <p style={{ fontSize: "18px", fontWeight: 700 }}>{selectedOrder.totalValue}</p>
                      </div>
                      <div className="bg-muted/40 rounded-[8px] p-3">
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Security Deposit</p>
                        <p style={{ fontSize: "18px", fontWeight: 700 }}>{selectedOrder.deposit}</p>
                      </div>
                      <div className="bg-muted/40 rounded-[8px] p-3">
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Items Sent</p>
                        <p style={{ fontSize: "18px", fontWeight: 700 }}>{selectedOrder.items.length}</p>
                      </div>
                      <div className="bg-muted/40 rounded-[8px] p-3">
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Trial Period</p>
                        <p style={{ fontSize: "18px", fontWeight: 700 }}>3 days</p>
                      </div>
                    </div>
                    {(selectedOrder.status === "completed" || selectedOrder.status === "in_progress") && (
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center gap-1.5">
                          <PackageCheck className="w-4 h-4 text-emerald-600" />
                          <span style={{ fontSize: "13px", fontWeight: 500 }} className="text-emerald-700">{keptCount(selectedOrder)} kept</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PackageX className="w-4 h-4 text-red-500" />
                          <span style={{ fontSize: "13px", fontWeight: 500 }} className="text-red-600">{returnedCount(selectedOrder)} returned</span>
                        </div>
                        {pendingCount(selectedOrder) > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span style={{ fontSize: "13px", fontWeight: 500 }} className="text-amber-600">{pendingCount(selectedOrder)} pending</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delivery Partner */}
                  <div className="rounded-[10px] border border-border p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                      <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Delivery Partner</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedOrder.deliveryPartner}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selectedOrder.deliveryPhone}</p>
                      </div>
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" style={{ fontSize: "12px" }}>
                        <Phone className="w-3 h-3" /> Call
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ── ITEMS TAB ── */}
              {viewTab === "items" && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                      {selectedOrder.items.length} item{selectedOrder.items.length > 1 ? "s" : ""} in this try order
                    </p>
                    {(selectedOrder.status === "completed" || selectedOrder.status === "in_progress") && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-emerald-700" style={{ fontSize: "12px", fontWeight: 600 }}>
                          <PackageCheck className="w-3.5 h-3.5" /> {keptCount(selectedOrder)} kept
                        </span>
                        <span className="inline-flex items-center gap-1 text-red-600" style={{ fontSize: "12px", fontWeight: 600 }}>
                          <PackageX className="w-3.5 h-3.5" /> {returnedCount(selectedOrder)} returned
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className={`rounded-[10px] border overflow-hidden transition-colors ${
                        item.kept === true ? "border-emerald-200 bg-emerald-50/30" :
                        item.kept === false ? "border-red-200 bg-red-50/30" :
                        "border-border"
                      }`}>
                        <div className="flex gap-4 p-4">
                          <div className="w-20 h-24 rounded-[8px] overflow-hidden shrink-0 bg-muted">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p style={{ fontSize: "14px", fontWeight: 600 }} className="line-clamp-1">{item.name}</p>
                                <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>SKU: {item.sku}</p>
                              </div>
                              {item.kept === true && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0" style={{ fontSize: "11px", fontWeight: 600 }}>
                                  <Check className="w-3 h-3" /> Kept
                                </span>
                              )}
                              {item.kept === false && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0" style={{ fontSize: "11px", fontWeight: 600 }}>
                                  <RotateCcw className="w-3 h-3" /> Returned
                                </span>
                              )}
                              {item.kept === null && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0" style={{ fontSize: "11px", fontWeight: 600 }}>
                                  <Clock className="w-3 h-3" /> Pending
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <div className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-md">
                                <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Size:</span>
                                <span style={{ fontSize: "12px", fontWeight: 600 }}>{item.size}</span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-md">
                                <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Color:</span>
                                <span style={{ fontSize: "12px", fontWeight: 600 }}>{item.color}</span>
                              </div>
                              <p style={{ fontSize: "15px", fontWeight: 700 }} className="ml-auto">{item.price}</p>
                            </div>
                          </div>
                        </div>

                        {/* Per-item actions for in_progress */}
                        {selectedOrder.status === "in_progress" && item.kept === null && (
                          <div className="flex items-center gap-2 px-4 pb-3">
                            <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[8px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>
                              <PackageCheck className="w-3.5 h-3.5" /> Mark as Kept
                            </button>
                            <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[8px] border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>
                              <RotateCcw className="w-3.5 h-3.5" /> Mark as Returned
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Total kept value */}
                  {keptCount(selectedOrder) > 0 && (
                    <div className="rounded-[10px] bg-[#220E92]/5 border border-[#220E92]/15 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Kept Items Value</p>
                          <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-[#220E92]">
                            ₹{selectedOrder.items.filter((i) => i.kept).reduce((sum, i) => sum + parseInt(i.price.replace(/[₹,]/g, "")), 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <CreditCard className="w-5 h-5 text-[#220E92]" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── TIMELINE TAB ── */}
              {viewTab === "timeline" && (
                <>
                  <div className="relative">
                    {selectedOrder.timeline.map((step, i) => {
                      const isLast = i === selectedOrder.timeline.length - 1;
                      return (
                        <div key={i} className="flex gap-4 pb-6 last:pb-0">
                          {/* Dot + line */}
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              step.done
                                ? "bg-[#220E92] text-white"
                                : "bg-muted border-2 border-border"
                            }`}>
                              {step.done ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <CircleDot className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            {!isLast && (
                              <div className={`w-0.5 flex-1 mt-1 ${step.done ? "bg-[#220E92]" : "bg-border"}`} />
                            )}
                          </div>

                          {/* Content */}
                          <div className={`pb-2 ${!step.done ? "opacity-60" : ""}`}>
                            <p style={{ fontSize: "14px", fontWeight: step.done ? 600 : 400 }}>{step.label}</p>
                            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>{step.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Trial period info */}
                  <div className="rounded-[10px] bg-muted/50 border border-border p-4 space-y-2">
                    <h4 style={{ fontSize: "13px", fontWeight: 600 }}>Trial Period Details</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Start Date</p>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>{selectedOrder.date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>End Date</p>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>{selectedOrder.trialEndDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Duration</p>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>3 days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Status</p>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>
                          {selectedOrder.daysLeft > 0 ? `${selectedOrder.daysLeft} day(s) remaining` : "Trial ended"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-border shrink-0 bg-card">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedOrder.status === "scheduled" && (
                  <>
                    <button className="flex-1 inline-flex items-center justify-center gap-2 bg-[#220E92] text-white px-4 py-2.5 rounded-[10px] hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
                      <Truck className="w-4 h-4" /> Mark Out for Delivery
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 border border-red-200 text-red-600 px-4 py-2.5 rounded-[10px] hover:bg-red-50 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
                {selectedOrder.status === "in_progress" && (
                  <>
                    <button className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-[10px] hover:bg-emerald-700 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
                      <ShoppingBag className="w-4 h-4" /> Convert to Purchase
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-4 py-2.5 rounded-[10px] hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
                      <Timer className="w-4 h-4" /> Extend Trial
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-4 py-2.5 rounded-[10px] hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
                      <RotateCcw className="w-4 h-4" /> Schedule Pickup
                    </button>
                  </>
                )}
                {selectedOrder.status === "refund" && (
                  <button className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-[10px] hover:bg-red-700 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
                    <CreditCard className="w-4 h-4" /> Process Refund (₹{selectedOrder.deposit.replace("₹", "")})
                  </button>
                )}
                {selectedOrder.status === "completed" && (
                  <div className="flex-1 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-[10px]" style={{ fontSize: "13px", fontWeight: 500 }}>
                    <CircleCheck className="w-4 h-4" />
                    Order completed — {keptCount(selectedOrder)} of {selectedOrder.items.length} items kept
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}