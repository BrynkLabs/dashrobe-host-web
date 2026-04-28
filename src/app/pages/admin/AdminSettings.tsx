import { useState, useEffect } from "react";
import {
  Save, Users, X, Mail, Shield, SquarePen,
  CircleCheckBig, Trash2, Search, UserPlus, Clock, Eye, Loader2,
} from "lucide-react";
import { Pagination, usePagination } from "../../components/Pagination";
import {
  getPlatformSettings,
  updatePlatformSettings,
} from "../../Service/AdminService/adminSettingsService";

// ─── Types ─────────────────────────────────────────
type UserRole = "Super Admin" | "Admin" | "Manager" | "Staff";
type UserStatus = "active" | "pending" | "deactivated";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  invitedAt: string;
  lastActive?: string;
}

// ─── Mock Data ─────────────────────────────────────
const initialMembers: TeamMember[] = [
  { id: "u1", name: "Arun Kapoor", email: "arun@dashrobe.com", role: "Super Admin", status: "active", invitedAt: "2024-06-15", lastActive: "2026-03-07" },
  { id: "u2", name: "Meera Joshi", email: "meera@dashrobe.com", role: "Admin", status: "active", invitedAt: "2024-09-20", lastActive: "2026-03-07" },
  { id: "u3", name: "Rahul Verma", email: "rahul@dashrobe.com", role: "Manager", status: "active", invitedAt: "2025-01-10", lastActive: "2026-03-06" },
  { id: "u4", name: "Sneha Patil", email: "sneha@dashrobe.com", role: "Staff", status: "active", invitedAt: "2025-04-05", lastActive: "2026-03-05" },
  { id: "u5", name: "Deepak Gowda", email: "deepak@dashrobe.com", role: "Staff", status: "pending", invitedAt: "2026-03-01" },
  { id: "u6", name: "Fatima Khan", email: "fatima@dashrobe.com", role: "Manager", status: "deactivated", invitedAt: "2025-02-15", lastActive: "2026-01-20" },
];

const roleColors: Record<UserRole, { text: string; bg: string }> = {
  "Super Admin": { text: "#220E92", bg: "#220E9215" },
  "Admin": { text: "#7C3AED", bg: "#7C3AED15" },
  "Manager": { text: "#0891B2", bg: "#0891B215" },
  "Staff": { text: "#6B7280", bg: "#6B728015" },
};

const statusConfig: Record<UserStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#059669", bg: "#D1FAE5" },
  pending: { label: "Invite Pending", color: "#D97706", bg: "#FEF3C7" },
  deactivated: { label: "Deactivated", color: "#DC2626", bg: "#FEE2E2" },
};

const inputClasses = "w-full px-3 py-2.5 rounded-[10px] border border-border bg-background";
const selectClasses = "w-full px-3 py-2.5 rounded-[10px] border border-border bg-background appearance-none";

// ─── Main Component ────────────────────────────────
export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<"general" | "team">("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Admin Settings</h1>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
          Platform configuration and team management
        </p>
      </div>

      {/* Tab Navigation */}
      {/* <div className="bg-card rounded-[12px] border border-border shadow-sm p-1.5 flex gap-1">
        {[
          { id: "general" as const, label: "General Settings", icon: Settings },
          { id: "team" as const, label: "Team & Access", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[10px] transition-all ${
                isActive
                  ? "bg-[#220E92] text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
              style={{ fontSize: "13px", fontWeight: isActive ? 600 : 500 }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div> */}

      {activeTab === "general" && <GeneralSettingsTab />}
      {/* {activeTab === "team" && <TeamAccessTab />} */}
    </div>
  );
}

// ─── General Settings Tab ──────────────────────────
function GeneralSettingsTab() {
  const [platformName, setPlatformName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPlatformSettings();
      setPlatformName(data.name || "");
      setSupportEmail(data.supportEmail || "");
      setSupportPhone(data.phone || "");
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updatePlatformSettings({
        name: platformName,
        supportEmail,
        phone: supportPhone,
      });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchSettings();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm p-6">
        <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-5">Platform Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Platform Name</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              disabled={!editing}
              className={`${inputClasses} ${!editing ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`}
              style={{ fontSize: "14px" }}
            />
          </div>
          <div>
            <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              disabled={!editing}
              className={`${inputClasses} ${!editing ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`}
              style={{ fontSize: "14px" }}
            />
          </div>
          <div>
            <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Phone</label>
            <input
              type="tel"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              disabled={!editing}
              className={`${inputClasses} ${!editing ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`}
              style={{ fontSize: "14px" }}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-destructive" style={{ fontSize: "13px", fontWeight: 500 }}>{error}</p>
      )}

      <div className="flex items-center gap-3">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#220E92] text-white px-4 py-2.5 rounded-[10px] hover:bg-[#220E92]/90 transition-colors disabled:opacity-50"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Settings"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors disabled:opacity-50"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 bg-[#220E92] text-white px-4 py-2.5 rounded-[10px] hover:bg-[#220E92]/90 transition-colors"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <SquarePen className="w-4 h-4" /> Edit Settings
          </button>
        )}
      </div>

      {saved && (
        <span className="text-emerald-600 flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 500 }}>
          <CircleCheckBig className="w-4 h-4" /> Settings saved
        </span>
      )}
    </div>
  );
}