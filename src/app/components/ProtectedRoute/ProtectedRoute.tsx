import { Navigate } from "react-router";

export default function ProtectedRoute({ children }: any) {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  return children;
}