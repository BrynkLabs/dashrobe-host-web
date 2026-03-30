import {
  TrendingUp, DollarSign, RefreshCw, Target,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell,
} from "recharts";

const revenueGraph = [
  { month: "Sep", revenue: 180000 },
  { month: "Oct", revenue: 220000 },
  { month: "Nov", revenue: 260000 },
  { month: "Dec", revenue: 340000 },
  { month: "Jan", revenue: 380000 },
  { month: "Feb", revenue: 427000 },
];

const topSkus = [
  { name: "Silk Banarasi Saree", sold: 142, revenue: "₹12,06,858" },
  { name: "Block Print Kurti", sold: 98, revenue: "₹4,89,902" },
  { name: "Lehenga Choli", sold: 67, revenue: "₹6,89,233" },
  { name: "Embroidered Kurta Set", sold: 54, revenue: "₹1,88,946" },
  { name: "Anarkali Dress", sold: 43, revenue: "₹2,14,957" },
];

const campaignROI = [
  { name: "Flash Sale", value: 210 },
  { name: "Festival", value: 185 },
  { name: "Summer", value: 142 },
  { name: "New Arrivals", value: 95 },
];

const pieColors = ["#220E92", "#FFC100", "#10b981", "#8b5cf6"];

export function VendorAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Analytics</h1>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
          Performance metrics and insights
        </p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Conversion Rate", value: "4.2%", change: "+0.8%", icon: Target, color: "#220E92" },
          { label: "Refund Rate", value: "3.1%", change: "-1.2%", icon: RefreshCw, color: "#ef4444" },
          { label: "Campaign ROI", value: "+179%", change: "+22%", icon: TrendingUp, color: "#FFC100" },
          { label: "Avg. Order Value", value: "₹3,280", change: "+15%", icon: DollarSign, color: "#10b981" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-[12px] border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: s.color + "12" }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <span className="text-emerald-600" style={{ fontSize: "13px", fontWeight: 600 }}>
                {s.change}
              </span>
            </div>
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{s.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 700 }} className="mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue graph */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Revenue Trend</h3>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>6-month performance</p>
          </div>
          <span className="flex items-center gap-1 text-emerald-600" style={{ fontSize: "13px", fontWeight: 600 }}>
            <TrendingUp className="w-3.5 h-3.5" /> +137%
          </span>
        </div>
        {/* Gradient defined outside recharts to avoid duplicate null-key warnings */}
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#220E92" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#220E92" stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueGraph}>
            <XAxis key="xaxis" dataKey="month" tick={{ fontSize: 12, fill: "#717182" }} axisLine={false} tickLine={false} />
            <YAxis key="yaxis" tick={{ fontSize: 12, fill: "#717182" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip key="tooltip" formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "13px" }} />
            <Area key="area" type="monotone" dataKey="revenue" stroke="#220E92" fill="url(#analyticsGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top SKUs */}
        <div className="bg-card rounded-[12px] border border-border shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Top Selling SKUs</h3>
          </div>
          <div className="divide-y divide-border">
            {topSkus.map((s, i) => (
              <div key={s.name} className="px-6 py-3.5 flex items-center gap-4">
                <span className="w-6 text-center text-muted-foreground" style={{ fontSize: "13px", fontWeight: 700 }}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{s.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{s.sold} sold</p>
                </div>
                <span className="text-[#220E92] shrink-0" style={{ fontSize: "14px", fontWeight: 600 }}>{s.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign ROI */}
        <div className="bg-card rounded-[12px] border border-border shadow-sm p-6">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Campaign ROI</h3>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie key="pie" data={campaignROI} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {campaignROI.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
              </Pie>
            </PieChart>
            <div className="flex-1 space-y-3">
              {campaignROI.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                    <span style={{ fontSize: "13px" }}>{c.name}</span>
                  </div>
                  <span className="text-emerald-600" style={{ fontSize: "14px", fontWeight: 600 }}>+{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}