import { useState } from "react";
import {
  Megaphone, Search, Phone, Store, User, CircleCheck,
  CircleX, Clock, Filter, ChevronDown,
} from "lucide-react";
import { Pagination, usePagination } from "../../components/Pagination";

type LeadStatus = "new" | "lead" | "not-interested";

interface AdsLead {
  id: string;
  storeName: string;
  contactPerson: string;
  phone: string;
  city: string;
  appliedAt: string;
  status: LeadStatus;
}

const initialLeads: AdsLead[] = [
  { id: "al-1", storeName: "Priya Silks Emporium", contactPerson: "Priya Sharma", phone: "+91 98765 43210", city: "Varanasi", appliedAt: "2025-01-08", status: "new" },
  { id: "al-2", storeName: "Regal Ethnic Wear", contactPerson: "Arjun Mehta", phone: "+91 87654 32109", city: "Jaipur", appliedAt: "2025-01-13", status: "lead" },
  { id: "al-3", storeName: "Bombay Fashion Hub", contactPerson: "Sneha Patil", phone: "+91 76543 21098", city: "Mumbai", appliedAt: "2025-01-24", status: "new" },
  { id: "al-4", storeName: "Delhi Kurta House", contactPerson: "Rahul Singh", phone: "+91 65432 10987", city: "New Delhi", appliedAt: "2025-02-04", status: "lead" },
  { id: "al-5", storeName: "Kanchipuram Weaves", contactPerson: "Lakshmi Iyer", phone: "+91 54321 09876", city: "Chennai", appliedAt: "2025-02-13", status: "not-interested" },
  { id: "al-6", storeName: "Lucknow Chikan Studio", contactPerson: "Fatima Khan", phone: "+91 43210 98765", city: "Lucknow", appliedAt: "2025-02-20", status: "new" },
  { id: "al-7", storeName: "Kolkata Handloom Co.", contactPerson: "Ananya Das", phone: "+91 21098 76543", city: "Kolkata", appliedAt: "2025-02-24", status: "new" },
  { id: "al-8", storeName: "Mysore Silk Creations", contactPerson: "Deepak Gowda", phone: "+91 32109 87654", city: "Mysuru", appliedAt: "2025-02-22", status: "lead" },
];

const statusConfig: Record<LeadStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  new: { label: "New", color: "#2563EB", bg: "#DBEAFE", icon: Clock },
  lead: { label: "Lead", color: "#059669", bg: "#D1FAE5", icon: CircleCheck },
  "not-interested": { label: "Not Interested", color: "#DC2626", bg: "#FEE2E2", icon: CircleX },
};

export function AdminAdsInterest() {
  const [leads, setLeads] = useState<AdsLead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | LeadStatus>("all");
  const [showFilter, setShowFilter] = useState(false);

  const filteredLeads = leads.filter((l) => {
    const matchSearch = l.storeName.toLowerCase().includes(search.toLowerCase()) ||
      l.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
  };

  const newCount = leads.filter((l) => l.status === "new").length;
  const leadCount = leads.filter((l) => l.status === "lead").length;
  const notIntCount = leads.filter((l) => l.status === "not-interested").length;

  const [adsPage, setAdsPage] = useState(1);
  const ADS_PER_PAGE = 5;
  const { paginated: paginatedLeads, totalPages: adsTotalPages, safePage: safeAdsPage } = usePagination(filteredLeads, ADS_PER_PAGE, adsPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Megaphone className="w-6 h-6 text-[#220E92]" />
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Ads Interest</h1>
        </div>
        <p className="text-muted-foreground" style={{ fontSize: "14px" }}>
          Stores that expressed interest in Dashrobe Ads during onboarding
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "New Requests", value: newCount, color: "#2563EB", bg: "#DBEAFE" },
          { label: "Marked as Lead", value: leadCount, color: "#059669", bg: "#D1FAE5" },
          { label: "Not Interested", value: notIntCount, color: "#DC2626", bg: "#FEE2E2" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-[12px] border border-border shadow-sm p-4">
            <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{stat.label}</p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: stat.color }} className="mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by store, contact or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92]"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-[10px] text-sm hover:bg-muted transition-colors"
          >
            <Filter className="w-4 h-4" />
            {filterStatus === "all" ? "All Status" : statusConfig[filterStatus].label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showFilter && (
            <div className="absolute right-0 top-full mt-1 bg-card rounded-[10px] border border-border shadow-lg z-20 p-1.5 min-w-[160px]">
              {(["all", "new", "lead", "not-interested"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setFilterStatus(s); setShowFilter(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filterStatus === s ? "bg-[#220E92]/8 text-[#220E92] font-medium" : "hover:bg-muted"
                  }`}
                >
                  {s === "all" ? "All Status" : statusConfig[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Store Name", "Contact Person", "Phone Number", "City", "Opted In", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => {
                const stCfg = statusConfig[lead.status];
                return (
                  <tr key={lead.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: "#220E9212" }}>
                          <Store className="w-3.5 h-3.5" style={{ color: "#220E92" }} />
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 600 }}>{lead.storeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>{lead.contactPerson}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{lead.city}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{lead.appliedAt}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                        style={{ fontSize: "12px", fontWeight: 600, color: stCfg.color, backgroundColor: stCfg.bg }}
                      >
                        <stCfg.icon className="w-3.5 h-3.5" />
                        {stCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {lead.status !== "lead" && (
                          <button
                            onClick={() => updateStatus(lead.id, "lead")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                          >
                            <CircleCheck className="w-3 h-3" />
                            Mark Lead
                          </button>
                        )}
                        {lead.status !== "not-interested" && (
                          <button
                            onClick={() => updateStatus(lead.id, "not-interested")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                          >
                            <CircleX className="w-3 h-3" />
                            Not Interested
                          </button>
                        )}
                        {lead.status !== "new" && (
                          <button
                            onClick={() => updateStatus(lead.id, "new")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                          >
                            <Clock className="w-3 h-3" />
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Megaphone className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p style={{ fontSize: "15px", fontWeight: 600 }}>No leads found</p>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredLeads.length > 0 && (
          <Pagination
            currentPage={safeAdsPage}
            totalPages={adsTotalPages}
            totalItems={filteredLeads.length}
            itemsPerPage={ADS_PER_PAGE}
            onPageChange={setAdsPage}
            itemLabel="stores"
          />
        )}
      </div>
    </div>
  );
}