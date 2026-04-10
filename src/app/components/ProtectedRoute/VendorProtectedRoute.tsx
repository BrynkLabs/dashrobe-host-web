import { Navigate } from "react-router";
import { getCookie } from "@/app/utils/cookieUtils";

export default function VendorProtectedRoute({ children }: any) {
  const token = getCookie("token");

  if (!token || token === "undefined") {
    return <Navigate to="/vendor-login" replace />;
  }

  const role = localStorage.getItem("role");

  // Vendor area is restricted to VENDOR role. Superadmins logged in here
  // are redirected to the admin dashboard.
  if (role && role !== "VENDOR") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
