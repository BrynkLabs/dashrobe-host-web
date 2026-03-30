import { useState } from "react";
import { Megaphone, Plus, TrendingUp, Eye, DollarSign, Package, X, Check } from "lucide-react";

const campaigns = [
  { id: "C01", name: "Summer Flash Sale", discount: "30%", skus: 12, status: "active", performance: { views: "8.2K", conversions: 342, revenue: "₹1,42,800", roi: "+185%" }, start: "Feb 15", end: "Mar 5" },
  { id: "C02", name: "Festival Collection", discount: "25%", skus: 8, status: "active", performance: { views: "5.6K", conversions: 198, revenue: "₹89,200", roi: "+142%" }, start: "Feb 20", end: "Mar 10" },
  { id: "C03", name: "New Arrivals Promo", discount: "15%", skus: 20, status: "upcoming", performance: { views: "—", conversions: 0, revenue: "—", roi: "—" }, start: "Mar 1", end: "Mar 15" },
  { id: "C04", name: "Clearance Sale", discount: "50%", skus: 6, status: "ended", performance: { views: "12.4K", conversions: 567, revenue: "₹2,34,500", roi: "+210%" }, start: "Jan 10", end: "Jan 31" },
];

const availableSkus = [
  { id: "SKU-1042", name: "Silk Banarasi Saree", price: "₹8,499", margin: "₹2,124" },
  { id: "SKU-1089", name: "Embroidered Kurta Set", price: "₹3,499", margin: "₹874" },
  { id: "SKU-1156", name: "Chiffon Dupatta", price: "₹1,299", margin: "₹324" },
  { id: "SKU-1203", name: "Cotton Palazzo", price: "₹1,899", margin: "₹474" },
  { id: "SKU-1267", name: "Anarkali Dress", price: "₹4,999", margin: "₹1,249" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700" },
  upcoming: { bg: "bg-blue-50", text: "text-blue-700" },
  ended: { bg: "bg-gray-100", text: "text-gray-600" },
};

export function VendorCampaigns() {
  const [showAddSku, setShowAddSku] = useState(false);
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());
  const [discount, setDiscount] = useState("20");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Campaigns</h1>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
            Manage campaign participation and track performance
          </p>
        </div>
        <button
          onClick={() => setShowAddSku(true)}
          className="inline-flex items-center gap-2 bg-[#220E92] text-white px-4 py-2.5 rounded-[10px] hover:bg-[#220E92]/90 transition-colors shadow-sm"
          style={{ fontSize: "14px", fontWeight: 500 }}
        >
          <Plus className="w-4 h-4" /> Add SKUs to Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Campaigns", value: "2", icon: Megaphone, color: "#220E92" },
          { label: "Total SKUs Listed", value: "20", icon: Package, color: "#FFC100" },
          { label: "Total Revenue", value: "₹2,32,000", icon: DollarSign, color: "#10b981" },
          { label: "Avg. ROI", value: "+179%", icon: TrendingUp, color: "#8b5cf6" },
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

      {/* Campaigns list */}
      <div className="space-y-4">
        {campaigns.map((c) => {
          const sc = statusColors[c.status];
          return (
            <div key={c.id} className="bg-card rounded-[12px] border border-border shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{c.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`} style={{ fontSize: "12px", fontWeight: 600 }}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
                    {c.start} → {c.end} · {c.discount} off · {c.skus} SKUs
                  </p>
                </div>
                {c.status === "active" && (
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[#220E92] text-[#220E92] hover:bg-[#220E92]/5 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                )}
              </div>
              {/* Performance metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Views", value: c.performance.views },
                  { label: "Conversions", value: String(c.performance.conversions) },
                  { label: "Revenue", value: c.performance.revenue },
                  { label: "ROI", value: c.performance.roi },
                ].map((m) => (
                  <div key={m.label} className="bg-muted/30 rounded-[10px] px-4 py-3">
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{m.label}</p>
                    <p style={{ fontSize: "16px", fontWeight: 600 }} className="mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add SKUs to Campaign Modal */}
      {showAddSku && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddSku(false)}>
          <div className="bg-card rounded-[12px] w-full max-w-xl shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Add SKUs to Campaign</h3>
              <button onClick={() => setShowAddSku(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Campaign Discount</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-24 px-3 py-2.5 rounded-[10px] border border-border bg-background text-center" style={{ fontSize: "14px" }} />
                  <span className="text-muted-foreground" style={{ fontSize: "14px" }}>%</span>
                </div>
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Select SKUs</label>
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {availableSkus.map((sku) => (
                    <button
                      key={sku.id}
                      onClick={() => setSelectedSkus((prev) => {
                        const next = new Set(prev);
                        next.has(sku.id) ? next.delete(sku.id) : next.add(sku.id);
                        return next;
                      })}
                      className={`w-full flex items-center justify-between p-3 rounded-[10px] border transition-all text-left ${
                        selectedSkus.has(sku.id) ? "border-[#220E92] bg-[#220E92]/5" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 500 }}>{sku.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{sku.id} · {sku.price} · Margin: {sku.margin}</p>
                      </div>
                      {selectedSkus.has(sku.id) && <Check className="w-4 h-4 text-[#220E92] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
              {selectedSkus.size > 0 && (
                <div className="bg-[#FFC100]/10 rounded-[10px] p-4">
                  <p style={{ fontSize: "13px", fontWeight: 500 }}>
                    Projected margin after {discount}% discount: ~₹{Math.round(parseInt(discount) * 45)} per item
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAddSku(false)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={() => setShowAddSku(false)} className="flex-1 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                Add {selectedSkus.size} SKUs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
