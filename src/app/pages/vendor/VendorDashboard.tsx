import {
  DollarSign, ShoppingCart, Clock,
  TrendingUp, TrendingDown, Lock,
  Check, X, ShoppingBag, CalendarDays, CheckCheck, ArrowUpRight,
} from "lucide-react";
import { useRole } from "../../components/RoleContext";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Pagination, usePagination } from "../../components/Pagination";

const stats = [
  {
    label: "Total Sales",
    value: "\u20B94,27,850",
    change: "+18.2%",
    up: true,
    icon: DollarSign,
    accent: true,
  },
  {
    label: "Total Orders",
    value: "347",
    change: "+12.5%",
    up: true,
    icon: ShoppingCart,
    accent: false,
  },
  {
    label: "Accepted Orders Ratio",
    value: "92.8%",
    change: "+3.4%",
    up: true,
    icon: CheckCheck,
    accent: false,
  },
  {
    label: "Today's Orders",
    value: "18",
    change: "+6.3%",
    up: true,
    icon: CalendarDays,
    accent: false,
  },
  {
    label: "New Orders",
    value: "5",
    change: "-8.1%",
    up: false,
    icon: Clock,
    accent: false,
  },
];

interface NewOrder {
  id: string;
  customer: string;
  phone: string;
  amount: string;
  items: number;
  time: string;
}

const newOrders: NewOrder[] = [
  { id: "ORD-8012", customer: "Priya Sharma", phone: "+91 98765 43210", amount: "\u20B94,250", items: 3, time: "2 min ago" },
  { id: "ORD-8006", customer: "Deepa Iyer", phone: "+91 87654 32109", amount: "\u20B97,890", items: 5, time: "8 min ago" },
  { id: "ORD-8003", customer: "Karan Malhotra", phone: "+91 76543 21098", amount: "\u20B92,640", items: 2, time: "15 min ago" },
  { id: "ORD-8001", customer: "Suman Das", phone: "+91 65432 10987", amount: "\u20B95,120", items: 4, time: "22 min ago" },
  { id: "ORD-7998", customer: "Fatima Sheikh", phone: "+91 54321 09876", amount: "\u20B93,450", items: 1, time: "35 min ago" },
];

export function VendorDashboard() {
  const { role } = useRole();
  const canViewStats = role === "admin";
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const DASH_PER_PAGE = 5;
  const { paginated: paginatedOrders, totalPages: dashTotalPages, safePage: safeDashPage } = usePagination(newOrders, DASH_PER_PAGE, currentPage);

  return (
    <div className="space-y-6">
      {/* Role-restricted notice */}
      {!canViewStats && (
        <div className="relative rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/50 p-5 flex items-center gap-4 overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600 }} className="text-amber-900">
              Restricted View
            </p>
            <p style={{ fontSize: "13px" }} className="text-amber-700 mt-0.5">
              Stats and metrics are only visible to Admin users. You're viewing as <span className="font-medium capitalize">{role}</span>.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1 flex flex-col">
            <div className="flex-1 bg-red-400/70" />
            <div className="flex-1 bg-orange-400/70" />
            <div className="flex-1 bg-yellow-400/70" />
            <div className="flex-1 bg-emerald-400/70" />
            <div className="flex-1 bg-blue-400/70" />
          </div>
        </div>
      )}

      {/* Stat cards */}
      {canViewStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                s.accent
                  ? "bg-gradient-to-br from-[#220E92] to-[#1a0a6e] border-[#220E92] text-white shadow-[0_4px_20px_rgba(34,14,146,0.2)]"
                  : "bg-card border-border shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    s.accent ? "bg-[#FFC100] shadow-[0_2px_8px_rgba(255,193,0,0.3)]" : "bg-[#220E92]/8"
                  }`}
                >
                  <s.icon className="w-5 h-5" style={{ color: "#220E92" }} />
                </div>
                <span
                  className={`flex items-center gap-0.5 px-2 py-0.5 rounded-lg ${
                    s.accent
                      ? "text-[#FFC100] bg-white/10"
                      : s.up
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-red-500 bg-red-50"
                  }`}
                  style={{ fontSize: "12px", fontWeight: 600 }}
                >
                  {s.up ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {s.change}
                </span>
              </div>
              <p
                className={s.accent ? "text-white/60" : "text-muted-foreground"}
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                {s.label}
              </p>
              <p style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px" }} className="mt-0.5">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* New Orders table */}
      {newOrders.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>New Orders</h3>
              <span
                className="bg-[#220E92]/8 text-[#220E92] px-2.5 py-1 rounded-lg"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                {newOrders.length} pending
              </span>
            </div>
            <button
              className="inline-flex items-center gap-1 text-[#220E92] hover:underline"
              style={{ fontSize: "13px", fontWeight: 500 }}
              onClick={() => navigate("/vendor/orders")}
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Order ID", "Customer Details", "Items", "Order Value", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-muted-foreground whitespace-nowrap"
                      style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => navigate(`/vendor/orders?order=${o.id}`)}
                        className="text-[#220E92] hover:underline cursor-pointer"
                        style={{ fontSize: "14px", fontWeight: 600 }}
                      >
                        {o.id}
                      </button>
                      <p className="text-muted-foreground mt-0.5" style={{ fontSize: "11px" }}>{o.time}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p style={{ fontSize: "14px", fontWeight: 500 }}>{o.customer}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{o.phone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>
                        {o.items} {o.items === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5" style={{ fontSize: "14px", fontWeight: 700 }}>{o.amount}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-all hover:shadow-md"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <Pagination
              currentPage={safeDashPage}
              totalPages={dashTotalPages}
              totalItems={newOrders.length}
              itemsPerPage={DASH_PER_PAGE}
              onPageChange={setCurrentPage}
              itemLabel="orders"
            />
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <p style={{ fontSize: "15px", fontWeight: 600 }}>No new orders</p>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
            New orders will appear here when customers place them.
          </p>
        </div>
      )}
    </div>
  );
}