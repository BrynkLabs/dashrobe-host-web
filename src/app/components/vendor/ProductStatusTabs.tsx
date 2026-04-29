type Status = "Active" | "Draft" | "Hidden";

const TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Active", label: "Active" },
  { key: "Draft", label: "Draft" },
  { key: "Hidden", label: "Hidden" },
];

export function ProductStatusTabs({
  activeTab,
  counts,
  onTabChange,
}: {
  activeTab: "all" | Status;
  counts: Record<"all" | Status, number>;
  onTabChange: (tab: "all" | Status) => void;
}) {
  return (
    <div className="border-b border-[#eaecf0] px-5">
      <div className="flex items-center gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const isActive = activeTab === t.key;
          const count = counts[t.key];
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className={`relative flex items-center gap-2 px-1 py-3.5 text-[13px] transition-colors whitespace-nowrap mr-4 ${
                isActive ? "text-[#220e92]" : "text-[#667085] hover:text-[#344054]"
              }`}
              style={{ fontWeight: isActive ? 600 : 500 }}
            >
              <span>{t.label}</span>
              <span
                className={`inline-flex items-center justify-center rounded-full min-w-[20px] h-5 px-1.5 text-[11px] ${
                  isActive ? "bg-[#ede9fe] text-[#220e92]" : "bg-[#f2f4f7] text-[#667085]"
                }`}
                style={{ fontWeight: 500 }}
              >
                {count}
              </span>
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#220e92] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
