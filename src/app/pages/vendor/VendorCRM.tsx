import { useState } from "react";
import { Users, ArrowLeft, ShoppingCart, DollarSign, RefreshCw, Tag } from "lucide-react";
import { Pagination, usePagination } from "../../components/Pagination";

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  ltv: string;
  returnPct: string;
  preferredCategory: string;
  lastOrder: string;
  purchases: { date: string; item: string; amount: string; type: string }[];
}

const customers: Customer[] = [
  {
    id: "C01", name: "Priya Sharma", email: "priya@email.com", totalOrders: 12, ltv: "₹34,500", returnPct: "8%", preferredCategory: "Sarees", lastOrder: "Feb 26",
    purchases: [
      { date: "Feb 26", item: "Silk Banarasi Saree", amount: "₹4,250", type: "Normal" },
      { date: "Feb 10", item: "Chiffon Dupatta", amount: "₹1,299", type: "Normal" },
      { date: "Jan 22", item: "Kurta Set", amount: "₹3,499", type: "Try-at-Home" },
      { date: "Jan 05", item: "Cotton Palazzo", amount: "₹1,899", type: "Normal" },
    ],
  },
  {
    id: "C02", name: "Rahul Mehta", email: "rahul@email.com", totalOrders: 5, ltv: "₹12,800", returnPct: "20%", preferredCategory: "Kurtas", lastOrder: "Feb 25",
    purchases: [
      { date: "Feb 25", item: "Block Print Kurti", amount: "₹2,180", type: "Try-at-Home" },
      { date: "Feb 01", item: "Embroidered Kurta", amount: "₹3,499", type: "Normal" },
    ],
  },
  {
    id: "C03", name: "Anita Singh", email: "anita@email.com", totalOrders: 8, ltv: "₹22,400", returnPct: "5%", preferredCategory: "Lehengas", lastOrder: "Feb 25",
    purchases: [
      { date: "Feb 25", item: "Lehenga Choli", amount: "₹6,320", type: "Normal" },
      { date: "Feb 08", item: "Anarkali Dress", amount: "₹4,999", type: "Try-at-Home" },
    ],
  },
  {
    id: "C04", name: "Vikram Patel", email: "vikram@email.com", totalOrders: 3, ltv: "₹6,200", returnPct: "33%", preferredCategory: "Bottomwear", lastOrder: "Feb 24",
    purchases: [{ date: "Feb 24", item: "Cotton Palazzo", amount: "₹1,890", type: "Normal" }],
  },
  {
    id: "C05", name: "Neha Gupta", email: "neha@email.com", totalOrders: 15, ltv: "₹48,900", returnPct: "6%", preferredCategory: "Sarees", lastOrder: "Feb 24",
    purchases: [
      { date: "Feb 24", item: "Banarasi Saree", amount: "₹3,450", type: "Try-at-Home" },
      { date: "Feb 12", item: "Silk Dupatta", amount: "₹2,200", type: "Normal" },
    ],
  },
];

export function VendorCRM() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = customers.find((c) => c.id === selectedId);

  if (selected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedId(null)} className="p-2 rounded-[10px] hover:bg-muted transition-colors text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>{selected.name}</h1>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>{selected.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: String(selected.totalOrders), icon: ShoppingCart, color: "#220E92" },
            { label: "Lifetime Value", value: selected.ltv, icon: DollarSign, color: "#FFC100" },
            { label: "Return %", value: selected.returnPct, icon: RefreshCw, color: "#ef4444" },
            { label: "Preferred", value: selected.preferredCategory, icon: Tag, color: "#10b981" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-[12px] border border-border p-5 shadow-sm">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3" style={{ backgroundColor: s.color + "12" }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{s.label}</p>
              <p style={{ fontSize: "20px", fontWeight: 700 }} className="mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Purchase history */}
        <div className="bg-card rounded-[12px] border border-border shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Purchase History</h3>
          </div>
          <div className="divide-y divide-border">
            {selected.purchases.map((p, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{p.item}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                    {p.date} ·{" "}
                    {p.type === "Try-at-Home" ? (
                      <span className="text-[#220E92]">Try-at-Home</span>
                    ) : (
                      "Normal"
                    )}
                  </p>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{p.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const [crmPage, setCrmPage] = useState(1);
  const CRM_PER_PAGE = 6;
  const { paginated: paginatedCustomers, totalPages: crmTotalPages, safePage: safeCrmPage } = usePagination(customers, CRM_PER_PAGE, crmPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>CRM</h1>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
          Customer relationships and insights
        </p>
      </div>

      <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Customer", "Total Orders", "Lifetime Value", "Return %", "Preferred Category", "Last Order"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((c) => (
              <tr key={c.id} className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedId(c.id)}>
                <td className="px-5 py-3.5">
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{c.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{c.email}</p>
                </td>
                <td className="px-5 py-3.5" style={{ fontSize: "14px" }}>{c.totalOrders}</td>
                <td className="px-5 py-3.5" style={{ fontSize: "14px", fontWeight: 600 }}>{c.ltv}</td>
                <td className="px-5 py-3.5">
                  <span className={`${parseInt(c.returnPct) > 15 ? "text-red-600" : "text-emerald-600"}`} style={{ fontSize: "14px", fontWeight: 500 }}>
                    {c.returnPct}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-[#220E92]/8 text-[#220E92] px-2 py-0.5 rounded-full" style={{ fontSize: "12px", fontWeight: 500 }}>{c.preferredCategory}</span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground" style={{ fontSize: "13px" }}>{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {customers.length > 0 && (
          <Pagination
            currentPage={safeCrmPage}
            totalPages={crmTotalPages}
            totalItems={customers.length}
            itemsPerPage={CRM_PER_PAGE}
            onPageChange={setCrmPage}
            itemLabel="customers"
          />
        )}
      </div>
    </div>
  );
}
