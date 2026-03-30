import { useState, useMemo } from "react";
import {
  Shield, ShieldCheck, UserCog, Users, Plus, Search, MoreHorizontal,
  SquarePen, Trash2, X, Check, ChevronDown, Eye, EyeOff, Crown, Briefcase, User,
  Bell, BellRing, Package, ShoppingCart, TriangleAlert, Truck, RotateCcw,
  Settings, Lock, Unlock, Mail, MessageSquare, Smartphone,
} from "lucide-react";
import { useRole, type UserRole } from "../../components/RoleContext";
import { Switch } from "../../components/ui/switch";
import { Pagination, usePagination } from "../../components/Pagination";

// ─── Permissions ───────────────────────────────────────────────
type PermissionGroup = {
  group: string;
  permissions: Permission[];
};

type Permission = {
  key: string;
  label: string;
  description: string;
};

const permissionGroups: PermissionGroup[] = [
  {
    group: "Dashboard",
    permissions: [
      { key: "dashboard_stats", label: "View Dashboard Stats", description: "Revenue, charts, KPI cards" },
    ],
  },
  {
    group: "Products",
    permissions: [
      { key: "products_view", label: "View Products", description: "Browse product listings" },
      { key: "products_manage", label: "Manage Products", description: "Add, edit, delete products" },
    ],
  },
  {
    group: "Categories",
    permissions: [
      { key: "categories_manage", label: "Manage Categories", description: "Create and edit categories" },
    ],
  },
  {
    group: "Orders",
    permissions: [
      { key: "orders_view", label: "View Orders", description: "View order history and details" },
      { key: "orders_manage", label: "Manage Orders", description: "Process, fulfill, cancel orders" },
    ],
  },
  {
    group: "Marketing",
    permissions: [
      { key: "promotions_manage", label: "Manage Promotions", description: "Create and edit promotions" },
      { key: "offers_manage", label: "Manage Offers", description: "Create and edit offers" },
    ],
  },
  {
    group: "Store",
    permissions: [
      { key: "inventory_manage", label: "Manage Inventory", description: "Update stock levels and variants" },
      { key: "access_manage", label: "Manage Access", description: "Invite and manage team members" },
      { key: "settings_manage", label: "Manage Settings", description: "Store settings, brand, location" },
    ],
  },
];

const allPermissions = permissionGroups.flatMap((g) => g.permissions);

// ─── Roles ─────────────────────────────────────────────────────
type RoleDef = {
  id: UserRole;
  label: string;
  icon: typeof Crown;
  color: string;
  bgColor: string;
  description: string;
  permissions: string[];
};

const roleDefinitions: RoleDef[] = [
  {
    id: "admin",
    label: "Admin",
    icon: Crown,
    color: "#220E92",
    bgColor: "#220E92/10",
    description: "Full access to all features including dashboard stats, analytics, and user management.",
    permissions: allPermissions.map((p) => p.key),
  },
  {
    id: "manager",
    label: "Manager",
    icon: Briefcase,
    color: "#0d9488",
    bgColor: "teal-50",
    description: "Can manage products, orders, promotions and offers but cannot view revenue stats or manage access.",
    permissions: [
      "products_manage", "products_view", "categories_manage",
      "orders_manage", "orders_view", "promotions_manage", "offers_manage", "inventory_manage",
    ],
  },
  {
    id: "staff",
    label: "Staff",
    icon: User,
    color: "#6366f1",
    bgColor: "indigo-50",
    description: "Limited to viewing products and processing orders. No access to revenue stats or settings.",
    permissions: ["products_view", "orders_view", "orders_manage"],
  },
];

// ─── Alert Types ───────────────────────────────────────────────
type AlertType = {
  key: string;
  label: string;
  description: string;
  icon: typeof Bell;
  color: string;
  bgColor: string;
};

const alertTypes: AlertType[] = [
  { key: "new_order", label: "New Order Received", description: "When a customer places a new order", icon: ShoppingCart, color: "#220E92", bgColor: "bg-[#220E92]/8" },
  { key: "order_cancelled", label: "Order Cancelled", description: "When an order is cancelled by the customer", icon: X, color: "#dc2626", bgColor: "bg-red-50" },
  { key: "order_ready", label: "Order Ready for Delivery", description: "When an order is packed and ready for dispatch", icon: Package, color: "#0d9488", bgColor: "bg-teal-50" },
  { key: "low_inventory", label: "Low Inventory Alert", description: "When a product's stock falls below the threshold", icon: TriangleAlert, color: "#ea580c", bgColor: "bg-orange-50" },
];

type AlertChannel = "dashboard" | "email" | "sms";

// ─── Team Member ───────────────────────────────────────────────
type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "active" | "invited" | "deactivated";
  lastActive: string;
  avatar: string;
  customPermissions: string[] | null; // null = use role defaults
  alertSubscriptions: Record<string, AlertChannel[]>;
};

const initialMembers: TeamMember[] = [
  {
    id: "1", name: "Ravi Kumar", email: "ravi@stylecraft.in", phone: "+91 98765 43210",
    role: "admin", status: "active", lastActive: "Just now", avatar: "RK",
    customPermissions: null,
    alertSubscriptions: {
      new_order: ["dashboard", "email", "sms"],
      order_cancelled: ["dashboard", "email"],
      order_ready: ["dashboard"],
      low_inventory: ["dashboard", "email"],
    },
  },
  {
    id: "2", name: "Priya Sharma", email: "priya@stylecraft.in", phone: "+91 98765 43211",
    role: "manager", status: "active", lastActive: "2 hours ago", avatar: "PS",
    customPermissions: null,
    alertSubscriptions: {
      new_order: ["dashboard", "email"],
      order_cancelled: ["dashboard"],
      order_ready: ["dashboard"],
      low_inventory: ["dashboard"],
    },
  },
  {
    id: "3", name: "Amit Patel", email: "amit@stylecraft.in", phone: "+91 98765 43212",
    role: "staff", status: "active", lastActive: "1 day ago", avatar: "AP",
    customPermissions: null,
    alertSubscriptions: {
      new_order: ["dashboard"],
      order_cancelled: [],
      order_ready: ["dashboard"],
      low_inventory: [],
    },
  },
  {
    id: "4", name: "Sneha Gupta", email: "sneha@stylecraft.in", phone: "+91 98765 43213",
    role: "staff", status: "invited", lastActive: "—", avatar: "SG",
    customPermissions: null,
    alertSubscriptions: {
      new_order: [],
      order_cancelled: [],
      order_ready: [],
      low_inventory: [],
    },
  },
  {
    id: "5", name: "Vikram Singh", email: "vikram@stylecraft.in", phone: "+91 98765 43214",
    role: "manager", status: "deactivated", lastActive: "30 days ago", avatar: "VS",
    customPermissions: null,
    alertSubscriptions: {
      new_order: [],
      order_cancelled: [],
      order_ready: [],
      low_inventory: [],
    },
  },
];

function emptyAlerts(): Record<string, AlertChannel[]> {
  return Object.fromEntries(alertTypes.map(a => [a.key, []]));
}

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════
export function VendorAccessManagement() {
  const { role: currentRole, setRole } = useRole();
  const [activeTab, setActiveTab] = useState<"members" | "roles" | "alerts">("members");
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("staff");
  const [permissionsModal, setPermissionsModal] = useState<string | null>(null);
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);
  const [tempAlertSubs, setTempAlertSubs] = useState<Record<string, AlertChannel[]>>({});
  const [tempAlertPhone, setTempAlertPhone] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Invite form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("staff");
  const [inviteAlerts, setInviteAlerts] = useState<string[]>(["new_order"]);

  // Toast auto-dismiss
  useState(() => { /* init */ });
  if (toast) setTimeout(() => setToast(null), 2500);

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === "all" || m.role === filterRole;
    return matchSearch && matchRole;
  });

  const [accessPage, setAccessPage] = useState(1);
  const ACCESS_PER_PAGE = 5;
  const { paginated: paginatedMembers, totalPages: accessTotalPages, safePage: safeAccessPage } = usePagination(filteredMembers, ACCESS_PER_PAGE, accessPage);

  const activeMembers = members.filter(m => m.status === "active" || m.status === "invited");

  const handleInvite = () => {
    if (!inviteName || !inviteEmail) return;
    const alerts: Record<string, AlertChannel[]> = {};
    alertTypes.forEach(a => {
      alerts[a.key] = inviteAlerts.includes(a.key) ? ["dashboard"] : [];
    });
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      phone: invitePhone,
      role: inviteRole,
      status: "invited",
      lastActive: "—",
      avatar: inviteName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      customPermissions: null,
      alertSubscriptions: alerts,
    };
    setMembers([...members, newMember]);
    setInviteName("");
    setInviteEmail("");
    setInvitePhone("");
    setInviteRole("staff");
    setInviteAlerts(["new_order"]);
    setShowInviteModal(false);
    setToast(`Invite sent to ${newMember.name}`);
  };

  const handleUpdateRole = (memberId: string) => {
    setMembers(members.map((m) => (m.id === memberId ? { ...m, role: editRole, customPermissions: null } : m)));
    setEditingMember(null);
    setToast("Role updated");
  };

  const handleToggleStatus = (memberId: string) => {
    setMembers(
      members.map((m) =>
        m.id === memberId ? { ...m, status: m.status === "active" ? "deactivated" : "active" } : m
      )
    );
  };

  const handleDelete = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
    setToast("Member removed");
  };

  // Permissions modal
  const openPermissionsModal = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    const effective = member.customPermissions ?? getRoleDef(member.role).permissions;
    setTempPermissions([...effective]);
    setTempAlertSubs(JSON.parse(JSON.stringify(member.alertSubscriptions)));
    setTempAlertPhone(member.phone);
    setPermissionsModal(memberId);
  };

  const toggleTempPermission = (key: string) => {
    setTempPermissions(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const saveCustomPermissions = () => {
    if (!permissionsModal) return;
    const member = members.find(m => m.id === permissionsModal);
    if (!member) return;
    const roleDefPerms = getRoleDef(member.role).permissions;
    const isDefault = roleDefPerms.length === tempPermissions.length && roleDefPerms.every(p => tempPermissions.includes(p));
    setMembers(prev => prev.map(m =>
      m.id === permissionsModal ? { ...m, customPermissions: isDefault ? null : [...tempPermissions], alertSubscriptions: { ...tempAlertSubs }, phone: tempAlertPhone } : m
    ));
    setPermissionsModal(null);
    setToast("Permissions & alerts updated");
  };

  const resetToRoleDefault = () => {
    if (!permissionsModal) return;
    const member = members.find(m => m.id === permissionsModal);
    if (!member) return;
    setTempPermissions([...getRoleDef(member.role).permissions]);
  };

  // Alert subscriptions
  const toggleAlert = (memberId: string, alertKey: string, channel: AlertChannel) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      const current = m.alertSubscriptions[alertKey] || [];
      const next = current.includes(channel) ? current.filter(c => c !== channel) : [...current, channel];
      return { ...m, alertSubscriptions: { ...m.alertSubscriptions, [alertKey]: next } };
    }));
  };

  const toggleAllForAlert = (alertKey: string, channel: AlertChannel) => {
    const allActive = activeMembers.every(m => (m.alertSubscriptions[alertKey] || []).includes(channel));
    setMembers(prev => prev.map(m => {
      if (m.status === "deactivated") return m;
      const current = m.alertSubscriptions[alertKey] || [];
      const next = allActive ? current.filter(c => c !== channel) : current.includes(channel) ? current : [...current, channel];
      return { ...m, alertSubscriptions: { ...m.alertSubscriptions, [alertKey]: next } };
    }));
  };

  const getRoleDef = (role: UserRole) => roleDefinitions.find((r) => r.id === role)!;
  const getEffectivePermissions = (m: TeamMember) => m.customPermissions ?? getRoleDef(m.role).permissions;

  const statusColors: Record<string, { bg: string; text: string }> = {
    active: { bg: "bg-emerald-50", text: "text-emerald-700" },
    invited: { bg: "bg-amber-50", text: "text-amber-700" },
    deactivated: { bg: "bg-gray-100", text: "text-gray-500" },
  };

  const roleAvatarColors: Record<UserRole, string> = {
    admin: "bg-[#220E92]",
    manager: "bg-teal-600",
    staff: "bg-indigo-500",
  };

  const permMember = permissionsModal ? members.find(m => m.id === permissionsModal) : null;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#220E92] text-white px-5 py-3 rounded-[10px] shadow-lg flex items-center gap-2" style={{ fontSize: "13px", fontWeight: 500 }}>
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }} className="text-gray-900">Access Management</h2>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "14px" }}>Manage team roles, permissions, and order alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-[10px] p-1">
            {roleDefinitions.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`px-3 py-1.5 rounded-[8px] transition-all flex items-center gap-1.5 ${currentRole === r.id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                <r.icon className="w-3.5 h-3.5" />{r.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-[10px] transition-colors hover:opacity-90"
            style={{ backgroundColor: "#220E92", fontSize: "13px", fontWeight: 500 }}
          >
            <Plus className="w-4 h-4" />Invite Member
          </button>
        </div>
      </div>

      {/* Preview badge */}
      <div
        className="rounded-[10px] px-4 py-2.5 flex items-center gap-2.5 border"
        style={{
          backgroundColor: currentRole === "admin" ? "#220E9208" : currentRole === "manager" ? "#0d948808" : "#6366f108",
          borderColor: currentRole === "admin" ? "#220E9220" : currentRole === "manager" ? "#0d948820" : "#6366f120",
        }}
      >
        <Eye className="w-4 h-4" style={{ color: getRoleDef(currentRole).color }} />
        <span style={{ fontSize: "13px", color: getRoleDef(currentRole).color, fontWeight: 500 }}>
          Previewing as <span className="font-semibold capitalize">{currentRole}</span> — Dashboard and pages reflect this role's permissions
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0">
          {[
            { id: "members" as const, label: "Team Members", count: members.filter((m) => m.status !== "deactivated").length },
            { id: "roles" as const, label: "Roles & Permissions" },
            { id: "alerts" as const, label: "Order Alerts", icon: BellRing },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id ? "border-[#220E92] text-[#220E92]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              style={{ fontSize: "14px", fontWeight: activeTab === tab.id ? 600 : 400 }}
            >
              {"icon" in tab && tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
              {"count" in tab && tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-[#220E92]/10 text-[#220E92]" : "bg-gray-100 text-gray-500"}`}
                  style={{ fontSize: "11px", fontWeight: 600 }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Members Tab ═══ */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Search by name or email..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92]"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "admin", "manager", "staff"] as const).map((r) => (
                <button
                  key={r} onClick={() => setFilterRole(r)}
                  className={`px-3.5 py-2 rounded-[10px] border transition-colors capitalize ${filterRole === r ? "bg-[#220E92] text-white border-[#220E92]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  {r === "all" ? "All Roles" : r}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50/50">
                    <th className="text-left px-6 py-3" style={{ fontSize: "12px", fontWeight: 600, color: "#717182" }}>Member</th>
                    <th className="text-left px-6 py-3" style={{ fontSize: "12px", fontWeight: 600, color: "#717182" }}>Role</th>
                    <th className="text-left px-6 py-3" style={{ fontSize: "12px", fontWeight: 600, color: "#717182" }}>Permissions</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell" style={{ fontSize: "12px", fontWeight: 600, color: "#717182" }}>Status</th>
                    <th className="text-left px-6 py-3 hidden lg:table-cell" style={{ fontSize: "12px", fontWeight: 600, color: "#717182" }}>Last Active</th>
                    <th className="text-right px-6 py-3" style={{ fontSize: "12px", fontWeight: 600, color: "#717182" }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedMembers.map((member) => {
                    const roleDef = getRoleDef(member.role);
                    const statusStyle = statusColors[member.status];
                    const effectivePerms = getEffectivePermissions(member);
                    const hasCustom = member.customPermissions !== null;
                    const alertCount = Object.values(member.alertSubscriptions).filter(a => a.length > 0).length;
                    return (
                      <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${roleAvatarColors[member.role]} flex items-center justify-center shrink-0`}>
                              <span className="text-white" style={{ fontSize: "12px", fontWeight: 600 }}>{member.avatar}</span>
                            </div>
                            <div>
                              <p style={{ fontSize: "14px", fontWeight: 500 }}>{member.name}</p>
                              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingMember === member.id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editRole} onChange={(e) => setEditRole(e.target.value as UserRole)}
                                className="rounded-[8px] border border-gray-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#220E92]/20"
                              >
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                              </select>
                              <button onClick={() => handleUpdateRole(member.id)} className="p-1 rounded-md hover:bg-emerald-50 text-emerald-600"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setEditingMember(null)} className="p-1 rounded-md hover:bg-red-50 text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: roleDef.color + "10", color: roleDef.color, fontSize: "12px", fontWeight: 500 }}
                            >
                              <roleDef.icon className="w-3 h-3" />{roleDef.label}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
                              {effectivePerms.length}/{allPermissions.length}
                            </span>
                            {hasCustom && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700" style={{ fontSize: "10px", fontWeight: 600 }}>CUSTOM</span>
                            )}
                            <button
                              onClick={() => openPermissionsModal(member.id)}
                              className="p-1 rounded-[6px] text-muted-foreground hover:text-[#220E92] hover:bg-[#220E92]/5 transition-colors"
                              title="Manage permissions"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full capitalize ${statusStyle.bg} ${statusStyle.text}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{member.lastActive}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => openPermissionsModal(member.id)}
                              className="p-2 rounded-[8px] text-gray-400 hover:text-[#220E92] hover:bg-[#220E92]/5 transition-colors"
                              title="Manage permissions"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setEditRole(member.role); setEditingMember(member.id); }}
                              className="p-2 rounded-[8px] text-gray-400 hover:text-[#220E92] hover:bg-[#220E92]/5 transition-colors"
                              title="Edit role"
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(member.id)}
                              className="p-2 rounded-[8px] text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title={member.status === "active" ? "Deactivate" : "Activate"}
                            >
                              {member.status === "active" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="p-2 rounded-[8px] text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p style={{ fontSize: "14px", fontWeight: 500 }} className="text-gray-500">No members found</p>
                        <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredMembers.length > 0 && (
              <Pagination
                currentPage={safeAccessPage}
                totalPages={accessTotalPages}
                totalItems={filteredMembers.length}
                itemsPerPage={ACCESS_PER_PAGE}
                onPageChange={setAccessPage}
                itemLabel="members"
              />
            )}
          </div>
        </div>
      )}

      {/* ═══ Roles & Permissions Tab ═══ */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roleDefinitions.map((roleDef) => {
            const memberCount = members.filter((m) => m.role === roleDef.id && m.status !== "deactivated").length;
            return (
              <div key={roleDef.id} className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border" style={{ borderTopWidth: "3px", borderTopStyle: "solid", borderTopColor: roleDef.color }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: roleDef.color + "12" }}>
                      <roleDef.icon className="w-5 h-5" style={{ color: roleDef.color }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{roleDef.label}</h3>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                        {memberCount} active {memberCount === 1 ? "member" : "members"}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: "13px", lineHeight: "1.5" }}>{roleDef.description}</p>
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground mb-3" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>PERMISSIONS</p>
                  <div className="space-y-2">
                    {allPermissions.map((perm) => {
                      const hasPermission = roleDef.permissions.includes(perm.key);
                      return (
                        <div key={perm.key} className={`flex items-center gap-3 py-2 px-3 rounded-[8px] transition-colors ${hasPermission ? "bg-gray-50" : ""}`}>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${hasPermission ? "bg-emerald-100" : "bg-gray-100"}`}>
                            {hasPermission ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-gray-400" />}
                          </div>
                          <div className="min-w-0">
                            <p className={hasPermission ? "text-gray-900" : "text-gray-400"} style={{ fontSize: "13px", fontWeight: 500 }}>{perm.label}</p>
                            <p className={hasPermission ? "text-muted-foreground" : "text-gray-300"} style={{ fontSize: "11px" }}>{perm.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ Order Alerts Tab ═══ */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          {/* Intro card */}
          <div className="bg-[#220E92]/5 border border-[#220E92]/15 rounded-[12px] p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/10 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-[#220E92]" />
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600 }} className="text-[#220E92]">Configure Order Alerts</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: "13px", lineHeight: 1.6 }}>
                Choose which team members receive notifications for each order event. Alerts can be delivered via Dashboard notifications, Email, or SMS. Only active and invited members are shown.
              </p>
            </div>
          </div>

          {/* Per-alert-type cards */}
          <div className="space-y-4">
            {alertTypes.map(alert => {
              const subscribedMembers = activeMembers.filter(m => (m.alertSubscriptions[alert.key] || []).length > 0);
              return (
                <div key={alert.key} className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                  {/* Alert header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-[8px] ${alert.bgColor} flex items-center justify-center`}>
                        <alert.icon className="w-4.5 h-4.5" style={{ color: alert.color }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 600 }}>{alert.label}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{alert.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
                        {subscribedMembers.length}/{activeMembers.length} members
                      </span>
                    </div>
                  </div>

                  {/* Member rows */}
                  <div className="divide-y divide-border/60">
                    {/* Header row */}
                    <div className="grid grid-cols-[1fr_100px_100px_100px] gap-2 px-5 py-2.5 bg-muted/30">
                      <span className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>MEMBER</span>
                      <div className="flex items-center justify-center gap-1">
                        <Bell className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 600 }}>Dashboard</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 600 }}>Email</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Smartphone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 600 }}>SMS</span>
                      </div>
                    </div>

                    {/* Toggle all row */}
                    <div className="grid grid-cols-[1fr_100px_100px_100px] gap-2 px-5 py-2.5 bg-muted/10">
                      <span className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600, fontStyle: "italic" }}>Toggle all</span>
                      {(["dashboard", "email", "sms"] as AlertChannel[]).map(ch => {
                        const allOn = activeMembers.every(m => (m.alertSubscriptions[alert.key] || []).includes(ch));
                        return (
                          <div key={ch} className="flex justify-center">
                            <button
                              onClick={() => toggleAllForAlert(alert.key, ch)}
                              className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors ${allOn ? "bg-[#220E92] border-[#220E92]" : "border-gray-300 hover:border-[#220E92]/50"}`}
                            >
                              {allOn && <Check className="w-3 h-3 text-white" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {activeMembers.map(member => {
                      const subs = member.alertSubscriptions[alert.key] || [];
                      const roleDef = getRoleDef(member.role);
                      return (
                        <div key={member.id} className="grid grid-cols-[1fr_100px_100px_100px] gap-2 px-5 py-3 hover:bg-muted/10 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${roleAvatarColors[member.role]} flex items-center justify-center shrink-0`}>
                              <span className="text-white" style={{ fontSize: "10px", fontWeight: 600 }}>{member.avatar}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{member.name}</p>
                              <span style={{ fontSize: "10px", fontWeight: 500, color: roleDef.color }}>{roleDef.label}</span>
                            </div>
                          </div>
                          {(["dashboard", "email", "sms"] as AlertChannel[]).map(ch => (
                            <div key={ch} className="flex justify-center items-center">
                              <button
                                onClick={() => toggleAlert(member.id, alert.key, ch)}
                                className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-all ${
                                  subs.includes(ch)
                                    ? "bg-[#220E92] border-[#220E92] shadow-sm"
                                    : "border-gray-300 hover:border-[#220E92]/50"
                                }`}
                              >
                                {subs.includes(ch) && <Check className="w-3 h-3 text-white" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Invite Modal ═══ */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowInviteModal(false)} />
          <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[8px] bg-[#220E92]/8 flex items-center justify-center">
                  <UserCog className="w-4 h-4 text-[#220E92]" />
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Invite Team Member</h3>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="p-1.5 rounded-[8px] hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label style={{ fontSize: "13px", fontWeight: 500 }}>Full Name *</label>
                  <input
                    type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g., Priya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label style={{ fontSize: "13px", fontWeight: 500 }}>Phone Number</label>
                  <input
                    type="tel" value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label style={{ fontSize: "13px", fontWeight: 500 }}>Email Address *</label>
                <input
                  type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="priya@company.com"
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92]"
                />
              </div>
              <div className="space-y-1.5">
                <label style={{ fontSize: "13px", fontWeight: 500 }}>Assign Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  {roleDefinitions.map((r) => (
                    <button
                      key={r.id} onClick={() => setInviteRole(r.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-[10px] border-2 transition-all ${inviteRole === r.id ? "border-[#220E92] bg-[#220E92]/5" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <r.icon className="w-5 h-5" style={{ color: inviteRole === r.id ? r.color : "#9ca3af" }} />
                      <span style={{ fontSize: "12px", fontWeight: inviteRole === r.id ? 600 : 400, color: inviteRole === r.id ? r.color : "#6b7280" }}>{r.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{getRoleDef(inviteRole).description}</p>
              </div>

              {/* Order Alerts during invite */}
              <div className="space-y-2.5">
                <label style={{ fontSize: "13px", fontWeight: 500 }}>Order Alert Subscriptions</label>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Select which alerts this member should receive. You can change this later.</p>
                <div className="space-y-1.5">
                  {alertTypes.map(alert => (
                    <label key={alert.key} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] hover:bg-muted/30 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={inviteAlerts.includes(alert.key)}
                        onChange={() => setInviteAlerts(prev => prev.includes(alert.key) ? prev.filter(k => k !== alert.key) : [...prev, alert.key])}
                        className="rounded accent-[#220E92]"
                      />
                      <div className={`w-7 h-7 rounded-[6px] ${alert.bgColor} flex items-center justify-center shrink-0`}>
                        <alert.icon className="w-3.5 h-3.5" style={{ color: alert.color }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>{alert.label}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{alert.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-gray-50/50">
              <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 rounded-[10px] border border-gray-200 hover:bg-gray-50 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Cancel</button>
              <button
                onClick={handleInvite} disabled={!inviteName || !inviteEmail}
                className="px-5 py-2 rounded-[10px] text-white transition-colors disabled:opacity-40"
                style={{ backgroundColor: "#220E92", fontSize: "13px", fontWeight: 500 }}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Permissions Modal ═══ */}
      {permissionsModal && permMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPermissionsModal(null)} />
          <div className="relative bg-white rounded-[12px] shadow-xl w-full max-w-xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${roleAvatarColors[permMember.role]} flex items-center justify-center`}>
                  <span className="text-white" style={{ fontSize: "12px", fontWeight: 600 }}>{permMember.avatar}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Manage Permissions</h3>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                    {permMember.name} · <span className="capitalize">{permMember.role}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setPermissionsModal(null)} className="p-1.5 rounded-[8px] hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            </div>

            {/* Info bar */}
            <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span style={{ fontSize: "12px", fontWeight: 500 }} className="text-amber-800">
                  {tempPermissions.length === allPermissions.length
                    ? "Full access"
                    : `${tempPermissions.length} of ${allPermissions.length} permissions enabled`
                  }
                </span>
              </div>
              <button
                onClick={resetToRoleDefault}
                className="text-[#220E92] hover:underline flex items-center gap-1"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                <RotateCcw className="w-3 h-3" /> Reset to {permMember.role} defaults
              </button>
            </div>

            {/* Permissions grouped */}
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
              {permissionGroups.map(group => (
                <div key={group.group}>
                  <p className="text-muted-foreground mb-2" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {group.group}
                  </p>
                  <div className="space-y-1">
                    {group.permissions.map(perm => {
                      const enabled = tempPermissions.includes(perm.key);
                      const isDefault = getRoleDef(permMember.role).permissions.includes(perm.key);
                      return (
                        <div
                          key={perm.key}
                          className={`flex items-center justify-between py-2.5 px-3 rounded-[8px] transition-colors ${enabled ? "bg-gray-50" : "hover:bg-gray-50/50"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${enabled ? "bg-emerald-100" : "bg-gray-100"}`}>
                              {enabled ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-gray-400" />}
                            </div>
                            <div>
                              <p className={enabled ? "text-gray-900" : "text-gray-400"} style={{ fontSize: "13px", fontWeight: 500 }}>{perm.label}</p>
                              <p className={enabled ? "text-muted-foreground" : "text-gray-300"} style={{ fontSize: "11px" }}>{perm.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {enabled !== isDefault && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">
                                {enabled ? "ADDED" : "REMOVED"}
                              </span>
                            )}
                            <Switch
                              checked={enabled}
                              onCheckedChange={() => toggleTempPermission(perm.key)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* ── Order Alerts Section ── */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <BellRing className="w-4 h-4 text-[#220E92]" />
                  <p className="text-[#220E92]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Order Alerts
                  </p>
                </div>
                <p className="text-muted-foreground mb-3" style={{ fontSize: "12px" }}>
                  Configure which order events this member receives alerts for, and through which channels.
                </p>
                <div className="space-y-2">
                  {alertTypes.map(alert => {
                    const subs = tempAlertSubs[alert.key] || [];
                    const hasAny = subs.length > 0;
                    return (
                      <div key={alert.key} className={`rounded-[8px] transition-colors ${hasAny ? "bg-gray-50" : ""}`}>
                        <div className="flex items-center justify-between py-2.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-[6px] ${alert.bgColor} flex items-center justify-center shrink-0`}>
                              <alert.icon className="w-3.5 h-3.5" style={{ color: alert.color }} />
                            </div>
                            <div>
                              <p className={hasAny ? "text-gray-900" : "text-gray-400"} style={{ fontSize: "13px", fontWeight: 500 }}>{alert.label}</p>
                              <p className={hasAny ? "text-muted-foreground" : "text-gray-300"} style={{ fontSize: "11px" }}>{alert.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={hasAny}
                            onCheckedChange={(on) => {
                              setTempAlertSubs(prev => ({
                                ...prev,
                                [alert.key]: on ? ["dashboard"] : [],
                              }));
                            }}
                          />
                        </div>
                        {hasAny && (
                          <div className="flex items-center gap-3 px-3 pb-2.5 pl-[52px]">
                            {([
                              { ch: "dashboard" as AlertChannel, icon: Bell, label: "Dashboard" },
                              { ch: "email" as AlertChannel, icon: Mail, label: "Email" },
                              { ch: "sms" as AlertChannel, icon: Smartphone, label: "SMS" },
                            ]).map(({ ch, icon: Icon, label }) => {
                              const active = subs.includes(ch);
                              return (
                                <button
                                  key={ch}
                                  onClick={() => {
                                    setTempAlertSubs(prev => {
                                      const current = prev[alert.key] || [];
                                      const next = active ? current.filter(c => c !== ch) : [...current, ch];
                                      return { ...prev, [alert.key]: next.length === 0 ? ["dashboard"] : next };
                                    });
                                  }}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                                    active
                                      ? "bg-[#220E92]/8 border-[#220E92]/20 text-[#220E92]"
                                      : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                  }`}
                                  style={{ fontSize: "11px", fontWeight: 500 }}
                                >
                                  <Icon className="w-3 h-3" />
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Settings: Alert Phone Number ── */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-[#220E92]" />
                  <p className="text-[#220E92]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Settings
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2" style={{ fontSize: "13px", fontWeight: 500 }}>
                    Send alerts to number
                    {Object.values(tempAlertSubs).some(ch => ch.includes("sms")) && (
                      <span className="px-1.5 py-0.5 rounded bg-[#220E92]/8 text-[#220E92]" style={{ fontSize: "10px", fontWeight: 600 }}>SMS ENABLED</span>
                    )}
                  </label>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                    SMS alerts for order events will be sent to this number.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={tempAlertPhone}
                        onChange={(e) => setTempAlertPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92]"
                      />
                    </div>
                  </div>
                  {!tempAlertPhone && Object.values(tempAlertSubs).some(ch => ch.includes("sms")) && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <TriangleAlert className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-amber-600" style={{ fontSize: "11px", fontWeight: 500 }}>No phone number set — SMS alerts won't be delivered</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50/50 shrink-0">
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                Changes override the default <span className="capitalize font-semibold">{permMember.role}</span> role permissions for this member only.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setPermissionsModal(null)} className="px-4 py-2 rounded-[10px] border border-gray-200 hover:bg-gray-50 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>Cancel</button>
                <button
                  onClick={saveCustomPermissions}
                  className="px-5 py-2 rounded-[10px] text-white transition-colors"
                  style={{ backgroundColor: "#220E92", fontSize: "13px", fontWeight: 600 }}
                >
                  Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}