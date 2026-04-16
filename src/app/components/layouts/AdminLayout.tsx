import { Outlet, useLocation, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Settings,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield,
  Store,
  Home,
  Tag,
  Megaphone,
  Search,
  Palette,
  LogOut,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { logoutUser } from "../../Service/AuthService/authService";
import { getCookie, removeCookie } from "../../utils/cookieUtils";

import dashrobeLogo from "../../../assets/a78789c3d1496ae95d940d2dcd13ebf4260231d3.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Stores", icon: Store, path: "/admin/stores" },
  // { label: "Brands", icon: Tag, path: "/admin/brands" },
  // { label: "Customer Home", icon: Home, path: "/admin/customer-home" },
  // { label: "Ads Interest", icon: Megaphone, path: "/admin/ads-interest" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
  // { label: "Design System", icon: Palette, path: "/admin/design-system" },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const logoutMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (logoutMenuRef.current && !logoutMenuRef.current.contains(e.target as Node)) {
        setShowLogoutMenu(false);
      }
    }
    if (showLogoutMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLogoutMenu]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const token = getCookie("token");
      if (token) {
        await logoutUser(token);
      }
    } catch {
      // proceed with local cleanup even if API fails
    } finally {
      removeCookie("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("userType");
      localStorage.removeItem("role");
      localStorage.removeItem("newUser");
      setLoggingOut(false);
      setShowLogoutConfirm(false);
      setShowLogoutMenu(false);
      navigate("/login", { replace: true });
    }
  };

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 sticky top-0 h-screen ${
          collapsed ? "w-[64px]" : "w-[224px]"
        }`}
        style={{ background: "linear-gradient(180deg, #0F0538 0%, #0a0328 60%, #06021a 100%)" }}
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
                <span style={{ fontSize: 14, fontWeight: 800, color: "#0F0538" }}>D</span>
              </div>
              {!collapsed && (
                <span className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>
                  Dashrobe
                </span>
              )}
            </div>
          )}
          {!collapsed && (
            <span className="ml-auto bg-[#FFC100]/15 text-[#FFC100] px-1.5 py-0.5 rounded-md" style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>
              Admin
            </span>
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

        {/* Switch to Vendor */}
        {/* {!collapsed && (
          <div className="mx-2.5 mb-2.5">
            <button
              onClick={() => navigate("/vendor")}
              className="w-full rounded-lg bg-white/6 border border-white/8 px-3 py-2.5 text-left hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-3.5 h-3.5 text-[#FFC100]" />
                <span className="text-white/70" style={{ fontSize: "11px", fontWeight: 500 }}>
                  Switch to Vendor
                </span>
              </div>
            </button>
          </div>
        )} */}

        {/* Collapse button */}
        <div className="px-2.5 pb-4 pt-2 border-t border-white/8">
          <button
            onClick={() => {
              setShowLogoutMenu(false);
              setShowLogoutConfirm(true);
            }}
            className={`w-full flex items-center gap-2 text-white/40 hover:text-white/70 py-1.5 rounded-lg hover:bg-white/6 transition-all ${
              collapsed ? "justify-center" : "px-3"
            }`}
          >
            <>
              <span className="text-sm font-medium text-[#FFFFFF]">Logout</span>
              <LogOut className="h-5 w-5 ml-auto text-[#D6BBFB]"/>
            </>
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
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-[240px] flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "linear-gradient(180deg, #0F0538 0%, #0a0328 60%, #06021a 100%)" }}
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
              <span className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Dashrobe</span>
            )}
            <span className="bg-[#FFC100]/15 text-[#FFC100] px-1.5 py-0.5 rounded-md" style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>
              Admin
            </span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col flex-1 min-h-0">
          <nav className="px-2.5 space-y-0.5 flex-1 overflow-y-auto">
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
          <div className="px-2.5 pb-4 pt-2 border-t border-white/8 mt-auto">
            <button
              onClick={() => {
                setShowLogoutMenu(false);
                setShowLogoutConfirm(true);
              }}
              className="w-full flex items-center gap-2 text-white/40 hover:text-white/70 py-1.5 rounded-lg hover:bg-white/6 transition-all px-3"
            >
              <span className="text-sm font-medium text-[#FFFFFF]">Logout</span>
              <LogOut className="h-5 w-5 ml-auto text-[#D6BBFB]"/>
            </button>
          </div>
        </div>
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
            <h2 style={{ fontSize: "15px", fontWeight: 600 }}>
              {navItems.find((n) => isActive(n.path))?.label || "Admin Portal"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button className="hidden sm:flex items-center gap-2 text-muted-foreground/70 hover:text-foreground px-3 py-1.5 rounded-xl border border-border hover:border-gray-300 transition-all bg-muted/30">
              <Search className="w-3.5 h-3.5" />
              <span style={{ fontSize: "12px" }}>Search...</span>
            </button>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-muted">
              <Bell className="w-[18px] h-[18px]" />
              {/* <span
                className="absolute top-1 right-1 w-4 h-4 bg-[#FFC100] rounded-full flex items-center justify-center ring-2 ring-card"
                style={{ fontSize: "9px", fontWeight: 700, color: "#0F0538" }}
              >
                3
              </span> */}
            </button>
            <div className="hidden sm:block relative" ref={logoutMenuRef}>
              <button
                onClick={() => setShowLogoutMenu((prev) => !prev)}
                className="flex items-center gap-2.5 pl-2.5 ml-0.5 border-l border-border cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F0538] to-[#1a0a6e] flex items-center justify-center shadow-sm">
                  <Shield className="w-4 h-4 text-[#FFC100]" />
                </div>
                <div className="hidden lg:block text-left">
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>Admin User</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
                    Super Admin
                  </p>
                </div>
              </button>
              {showLogoutMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowLogoutMenu(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
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

      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogHeader className="flex flex-row items-center gap-4">
              <LogOut className="w-10 h-10 text-destructive bg-[#FEF2F2] p-2 rounded-full" />
              <AlertDialogTitle>Do you want to Logout?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-sm text-[#1A1A2E]">
              Are you sure you want to logout ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex-1 h-[43px]" disabled={loggingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-[#E7000B]/60 text-white hover:bg-[#E7000B]/80 flex-1 h-[43px]"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}