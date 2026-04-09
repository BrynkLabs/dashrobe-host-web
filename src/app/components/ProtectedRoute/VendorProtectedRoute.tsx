import { Navigate } from "react-router";
import { getCookie } from "@/app/utils/cookieUtils";

export default function VendorProtectedRoute({ children }: any) {
  const token = getCookie("token");

  if (!token || token === "undefined") {
    return <Navigate to="/vendor-login" replace />;
  }

  return children;
}
