import { Navigate } from "react-router";
import { getCookie } from "@/app/utils/cookieUtils";

export default function ProtectedRoute({ children }: any) {
  const token = getCookie("token");

  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  return children;
}