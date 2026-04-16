import { useState, useEffect } from "react";
import {
  Settings, Save, Users, Plus, X, Mail, Shield, SquarePen,
  CircleCheckBig, Trash2, Search, UserPlus, Clock, Eye, Loader2,
} from "lucide-react";
import { Pagination, usePagination } from "../../components/Pagination";
import { Switch } from "../../components/ui/switch";
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

// ─── Team & Access Tab ─────────────────────────────
function TeamAccessTab() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "Staff" as UserRole });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const [settingsPage, setSettingsPage] = useState(1);
  const SETTINGS_PER_PAGE = 5;
  const { paginated: paginatedSettingsMembers, totalPages: settingsTotalPages, safePage: safeSettingsPage } = usePagination(filteredMembers, SETTINGS_PER_PAGE, settingsPage);

  const activeCount = members.filter((m) => m.status === "active").length;
  const pendingCount = members.filter((m) => m.status === "pending").length;

  const handleInvite = () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;
    const newMember: TeamMember = {
      id: `u${Date.now()}`,
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      role: inviteForm.role,
      status: "pending",
      invitedAt: new Date().toISOString().split("T")[0],
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteForm({ name: "", email: "", role: "Staff" });
    setShowInvite(false);
  };

  const updateRole = (id: string, role: UserRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    setEditingId(null);
  };

  const toggleStatus = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        if (m.status === "active") return { ...m, status: "deactivated" as UserStatus };
        if (m.status === "deactivated") return { ...m, status: "active" as UserStatus };
        return m;
      })
    );
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setDeleteConfirm(null);
  };

  const resendInvite = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, invitedAt: new Date().toISOString().split("T")[0] } : m))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header + Invite */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-[10px] border border-border bg-background"
            style={{ fontSize: "14px" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>
            {activeCount} active
          </span>
          {pendingCount > 0 && (
            <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>
              {pendingCount} pending
            </span>
          )}
          <button
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 bg-[#220E92] text-white px-4 py-2.5 rounded-[10px] hover:bg-[#220E92]/90 transition-colors"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <UserPlus className="w-4 h-4" /> Invite User
          </button>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Member", "Role", "Status", "Invited", "Last Active", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedSettingsMembers.map((member) => {
                const roleStyle = roleColors[member.role];
                const statusStyle = statusConfig[member.status];
                return (
                  <tr key={member.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: roleStyle.bg }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: roleStyle.text }}>
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{member.name}</p>
                          <p className="text-muted-foreground truncate" style={{ fontSize: "12px" }}>{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {editingId === member.id ? (
                        <select
                          value={member.role}
                          onChange={(e) => updateRole(member.id, e.target.value as UserRole)}
                          onBlur={() => setEditingId(null)}
                          autoFocus
                          className="px-2 py-1 rounded-[8px] border border-[#220E92] bg-background"
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          {(["Super Admin", "Admin", "Manager", "Staff"] as UserRole[]).map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingId(member.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:ring-1 hover:ring-[#220E92]/30 transition-all"
                          style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, fontSize: "12px", fontWeight: 600 }}
                        >
                          <Shield className="w-3 h-3" />
                          {member.role}
                          <SquarePen className="w-2.5 h-2.5 opacity-40" />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, fontSize: "12px", fontWeight: 600 }}
                      >
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{member.invitedAt}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
                        {member.lastActive || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {member.status === "pending" && (
                          <button
                            onClick={() => resendInvite(member.id)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-[#220E92] transition-colors"
                            title="Resend Invite"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {member.status !== "pending" && (
                          <button
                            onClick={() => toggleStatus(member.id)}
                            className={`p-1.5 rounded-lg hover:bg-muted transition-colors ${
                              member.status === "active" ? "text-muted-foreground hover:text-amber-600" : "text-muted-foreground hover:text-emerald-600"
                            }`}
                            title={member.status === "active" ? "Deactivate" : "Reactivate"}
                          >
                            {member.status === "active" ? (
                              <Clock className="w-3.5 h-3.5" />
                            ) : (
                              <CircleCheckBig className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                        {member.role !== "Super Admin" && (
                          <button
                            onClick={() => setDeleteConfirm(member.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p style={{ fontSize: "15px", fontWeight: 600 }}>No team members found</p>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>Try adjusting your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredMembers.length > 0 && (
          <Pagination
            currentPage={safeSettingsPage}
            totalPages={settingsTotalPages}
            totalItems={filteredMembers.length}
            itemsPerPage={SETTINGS_PER_PAGE}
            onPageChange={setSettingsPage}
            itemLabel="members"
          />
        )}
      </div>

      {/* Role Legend */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
        <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { role: "Super Admin" as UserRole, desc: "Full platform access including settings, billing, and team management" },
            { role: "Admin" as UserRole, desc: "Manage stores, orders, and customer home. Cannot modify billing or team" },
            { role: "Manager" as UserRole, desc: "View and manage stores and orders. Read-only access to settings" },
            { role: "Staff" as UserRole, desc: "View-only access to stores and orders. Cannot modify any settings" },
          ].map((item) => {
            const style = roleColors[item.role];
            return (
              <div key={item.role} className="flex items-start gap-3 p-3 rounded-[10px] bg-muted/30">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: style.bg }}>
                  <Shield className="w-4 h-4" style={{ color: style.text }} />
                </div>
                <div className="min-w-0">
                  <p style={{ fontSize: "14px", fontWeight: 600, color: style.text }}>{item.role}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="bg-card rounded-[12px] p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#220E92]/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-[#220E92]" />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Invite Team Member</h3>
                  <p className="text-muted-foreground" style={{ fontSize: "13px" }}>They'll receive an email invitation</p>
                </div>
              </div>
              <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className={inputClasses}
                  style={{ fontSize: "14px" }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. priya@dashrobe.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className={inputClasses}
                  style={{ fontSize: "14px" }}
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
                  className={selectClasses}
                  style={{ fontSize: "14px" }}
                >
                  {(["Admin", "Manager", "Staff"] as UserRole[]).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "11px" }}>
                  {inviteForm.role === "Admin" && "Can manage stores, orders, and customer home"}
                  {inviteForm.role === "Manager" && "Can view and manage stores and orders"}
                  {inviteForm.role === "Staff" && "View-only access to stores and orders"}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteForm.name.trim() || !inviteForm.email.trim()}
                  className="flex-1 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors disabled:opacity-50"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-card rounded-[12px] p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Remove Team Member</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>This action cannot be undone</p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-5">
              Are you sure you want to remove <strong>{members.find((m) => m.id === deleteConfirm)?.name}</strong> from the team? They will immediately lose access.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={() => removeMember(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}