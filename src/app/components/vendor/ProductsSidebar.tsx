import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { LogOut, Package, Settings } from "lucide-react";
import { DashrobeLogoWhite } from "./DashrobeLogo";
import { ConfirmationModal } from "./ConfirmationModal";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";

const items = [
  { to: "/vendor/products", label: "Products", icon: Package },
  { to: "/vendor/settings", label: "Settings", icon: Settings },
];

export function ProductsSidebar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { hasUnsavedChanges } = useUnsavedChanges();

  const handleLogoutClick = () => {
    if (hasUnsavedChanges) {
      // Let the page's navigation blocker handle it
      navigate("/vendor-login");
    } else {
      setShowLogoutModal(true);
    }
  };

  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 bg-[#220e92] text-white flex-col h-screen overflow-y-auto">
      {/* Logo */}
      <div className="px-5 pt-6 pb-7 border-b border-white/10 shrink-0">
        <DashrobeLogoWhite className="h-8 w-[57px]" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 pt-4 flex-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                isActive
                  ? "bg-[#FFC100] text-[#220e92] shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            <Icon className="size-[15px] shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom — logout */}
      <div className="px-3 pb-5 pt-4 border-t border-white/10 shrink-0">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <LogOut className="size-[15px] shrink-0" />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout confirmation — fixed position so it overlays the full screen even though it's inside aside */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          navigate("/vendor-login");
        }}
        title="Log out"
        message="Are you sure you want to log out? You will need to sign in again to access your dashboard."
        confirmText="Log out"
        icon="warning"
      />
    </aside>
  );
}