import { Navigate } from "react-router";
import { getCookie } from "@/app/utils/cookieUtils";

export default function ProtectedRoute({ children }: any) {
  const token = getCookie("token");

  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  const role = localStorage.getItem("role");

  // Admin area is restricted to SUPERADMIN. Vendors logged in here are
  // redirected back to their own onboarding flow.
  if (role && role !== "SUPERADMIN") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}