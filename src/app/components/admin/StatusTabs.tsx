import { Search } from "lucide-react";
import type { StatusCountType } from "@/app/Service/VendorListActionService/Types/storeType";
import type { StoreStatus } from "../../pages/admin/AdminStores";

const TABS: { key: string; label: string; value: "all" | StoreStatus }[] = [
  { key: "all", label: "All Stores", value: "all" },
  { key: "pending", label: "Pending", value: "SUBMITTED" },
  { key: "approved", label: "Approved", value: "APPROVED" },
  { key: "rejected", label: "Rejected", value: "REJECTED" },
  { key: "suspended", label: "Suspended", value: "SUSPENDED" },
];

function getTabCount(key: string, sc: StatusCountType): number {
  if (key === "all") return sc.APPROVED + sc.DRAFT + sc.REJECTED + sc.SUBMITTED + sc.SUSPENDED;
  if (key === "pending") return sc.SUBMITTED;
  if (key === "approved") return sc.APPROVED;
  if (key === "rejected") return sc.REJECTED;
  if (key === "suspended") return sc.SUSPENDED;
  return 0;
}

export function StatusTabs({
  activeTab,
  onTabChange,
  statusCount,
  search,
  onSearchChange,
}: {
  activeTab: "all" | StoreStatus;
  onTabChange: (tab: "all" | StoreStatus) => void;
  statusCount: StatusCountType;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex bg-muted rounded-[12px] p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.value)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] transition-all ${
              activeTab === tab.value
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
              {getTabCount(tab.key, statusCount)}
            </span>
          </button>
        ))}
      </div>
      <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search stores, owners, cities..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-border bg-card"
          style={{ fontSize: "14px" }}
        />
      </div>
    </div>
  );
}
