import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, LogOut, Loader2 } from "lucide-react";
import { getCookie, removeCookie } from "@/app/utils/cookieUtils";
import { logoutUser } from "@/app/Service/AuthService/authService";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";

export function SubmissionSuccess() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const token = getCookie("token");
      if (token) await logoutUser(token);
    } catch {
      // proceed with local cleanup
    } finally {
      removeCookie("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("userType");
      localStorage.removeItem("role");
      localStorage.removeItem("newUser");
      localStorage.removeItem("refreshToken");
      setLoggingOut(false);
      navigate("/vendor-login", { replace: true });
    }
  };

  const handleEditApplication = async () => {
    setIsEditing(true);
    try {
      const token = getCookie("token");
      await axiosClient.post(
        `/api/v1/onboarding/edit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/onboarding", { replace: true });
    } catch (err: any) {
      console.error("Failed to enable editing:", err);
      // Still navigate to onboarding even if edit API fails
      navigate("/onboarding", { replace: true });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a0a6e 0%, #220E92 30%, #3318c7 60%, #1a0a6e 100%)",
      }}
    >
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Yellow checkmark circle with glow */}
        <div
          className="w-24 h-24 rounded-full bg-[#FFD700] flex items-center justify-center mb-8"
          style={{ boxShadow: "0 0 60px rgba(255, 215, 0, 0.4)" }}
        >
          <CheckCircle2 className="w-12 h-12 text-[#1a0a6e]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-10 leading-tight">
          Application Submitted
          <br />
          Successfully
        </h1>

        {/* Edit Application button */}
        <button
          onClick={handleEditApplication}
          disabled={isEditing}
          className="bg-[#FFC100] text-[#220E92] font-semibold text-base px-12 py-3 rounded-lg hover:bg-[#FFD54F] transition-colors disabled:opacity-70 min-w-[250px]"
        >
          {isEditing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </span>
          ) : (
            "Edit Application"
          )}
        </button>

        {/* Logout link */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 text-white/80 hover:text-white mt-5 text-sm transition-colors"
        >
          {loggingOut ? "Logging out..." : "Logout"}
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
