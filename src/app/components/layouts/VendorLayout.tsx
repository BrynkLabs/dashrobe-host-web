import { Outlet, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  Store,
  Shield,
  FolderTree,
  Tags,
  UserCog,
  Settings,
  Warehouse,
  Search,
  ClipboardList,
} from "lucide-react";

import dashrobeLogo from "../../../assets/a78789c3d1496ae95d940d2dcd13ebf4260231d3.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/vendor" },
  { label: "Products", icon: Package, path: "/vendor/products" },
  { label: "Inventory", icon: Warehouse, path: "/vendor/inventory" },
  { label: "Categories", icon: FolderTree, path: "/vendor/categories" },
  { label: "Orders", icon: ShoppingCart, path: "/vendor/orders" },
  { label: "Offline Orders", icon: ClipboardList, path: "/vendor/offline-orders" },
  { label: "Offers", icon: Tags, path: "/vendor/offers" },
  { label: "Access Management", icon: UserCog, path: "/vendor/access-management" },
  { label: "Settings", icon: Settings, path: "/vendor/settings" },
];

export function VendorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/vendor") return location.pathname === "/vendor";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 sticky top-0 h-screen ${
          collapsed ? "w-[64px]" : "w-[224px]"
        }`}
        style={{ background: "linear-gradient(180deg, #220E92 0%, #1a0a6e 60%, #150854 100%)" }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-4 pt-5 pb-5 ${collapsed ? "justify-center" : ""}`}>
          {dashrobeLogo ? (
            <img
              src={dashrobeLogo}
              alt="Dashrobe"
              className={`shrink-0 object-contain ${collapsed ? "h-7" : "h-8"}`}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFC100] flex items-center justify-center" style={{ boxShadow: "0 4px 12px rgba(255,193,0,0.3)" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#220E92" }}>D</span>
              </div>
              {!collapsed && (
                <span className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>
                  Dashrobe
                </span>
              )}
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2.5 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2.5 rounded-lg transition-all group relative ${
                  collapsed ? "justify-center px-0 py-2" : "px-3 py-2"
                } ${
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/55 hover:bg-white/6 hover:text-white/85"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {active && !collapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#FFC100]" />
                )}
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[#FFC100]" : ""}`} />
                {!collapsed && (
                  <span style={{ fontSize: "12.5px", fontWeight: active ? 600 : 400 }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Store status & switch */}
        {!collapsed && (
          <div className="mx-2.5 mb-2.5 space-y-1.5">
            <div className="rounded-lg bg-white/6 px-3 py-2.5 border border-white/8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-white/80" style={{ fontSize: "11px", fontWeight: 500 }}>
                  Store Online
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="w-full rounded-lg bg-white/6 border border-white/8 px-3 py-2.5 text-left hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#FFC100]" />
                <span className="text-white/70" style={{ fontSize: "11px", fontWeight: 500 }}>
                  Switch to Admin
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Collapse button */}
        <div className="px-2.5 pb-4 pt-2 border-t border-white/8">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-2 text-white/40 hover:text-white/70 py-1.5 rounded-lg hover:bg-white/6 transition-all ${
              collapsed ? "justify-center" : "px-3"
            }`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span style={{ fontSize: "12px" }}>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-[240px] transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "linear-gradient(180deg, #220E92 0%, #1a0a6e 60%, #150854 100%)" }}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-5">
          <div className="flex items-center gap-3">
            {dashrobeLogo ? (
              <img
                src={dashrobeLogo}
                alt="Dashrobe"
                className="h-8 shrink-0 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <span className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>Dashrobe</span>
            )}
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="px-2.5 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all relative ${
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/55 hover:bg-white/6 hover:text-white/85"
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#FFC100]" />
                )}
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[#FFC100]" : ""}`} />
                <span style={{ fontSize: "12.5px", fontWeight: active ? 600 : 400 }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-[56px] border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 style={{ fontSize: "15px", fontWeight: 600 }} className="text-foreground">
              {navItems.find((n) => isActive(n.path))?.label || "Vendor Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button className="hidden sm:flex items-center gap-2 text-muted-foreground/70 hover:text-foreground px-3 py-1.5 rounded-xl border border-border hover:border-gray-300 transition-all bg-muted/30">
              <Search className="w-3.5 h-3.5" />
              <span style={{ fontSize: "12px" }}>Search...</span>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded-md border border-border bg-muted/50 px-1.5 text-[10px] text-muted-foreground/60">
                /
              </kbd>
            </button>
            {/* Notification bell */}
            <button className="relative text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-muted">
              <Bell className="w-[18px] h-[18px]" />
              <span
                className="absolute top-1 right-1 w-4 h-4 bg-[#FFC100] rounded-full flex items-center justify-center ring-2 ring-card"
                style={{ fontSize: "9px", fontWeight: 700, color: "#220E92" }}
              >
                5
              </span>
            </button>
            {/* Profile */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2.5 ml-0.5 border-l border-border">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#220E92] to-[#3B1FBE] flex items-center justify-center shadow-sm">
                <Store className="w-4 h-4 text-white" />
              </div>
              <div className="hidden lg:block">
                <p style={{ fontSize: "13px", fontWeight: 600 }}>StyleCraft India</p>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
                  Premium Vendor
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}