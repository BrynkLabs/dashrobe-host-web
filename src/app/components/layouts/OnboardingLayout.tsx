import { Outlet, useLocation, useNavigate } from "react-router";
import { Check, Menu, X, HelpCircle, Lock, LogOut, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { OnboardingProvider } from "../onboarding/OnboardingContext";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { getCookie, removeCookie } from "@/app/utils/cookieUtils";
import { logoutUser } from "@/app/Service/AuthService/authService";
import suspendImage from "@/assets/suspend-icon.png";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";

const steps = [
  { id: 1, title: "Vendor Basic Details", path: "/onboarding" },
  { id: 2, title: "Store Operations", path: "/onboarding/operations" },
  { id: 3, title: "Product Categories", path: "/onboarding/categories" },
  { id: 4, title: "Bank & Settlement", path: "/onboarding/banking" },
  { id: 5, title: "Refunds & Returns", path: "/onboarding/returns" },
  { id: 6, title: "Offers & Promotions", path: "/onboarding/offers" },
  { id: 7, title: "Review & Declaration", path: "/onboarding/review" },
];

export function OnboardingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stepCompletion, setStepCompletion] = useState<Record<string, boolean>>({});

  const [hasRedirected, setHasRedirected] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showSuspended, setShowSuspended] = useState(false);

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
      setLoggingOut(false);
      navigate("/vendor-login", { replace: true });
    }
  };

  const currentStepIndex = steps.findIndex(step => step.path === location.pathname);
  const currentStep = currentStepIndex + 1;
  const progressPercent = Math.round((currentStep / steps.length) * 100);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch onboarding status whenever the route changes so the sidebar reflects
  // the latest step completion as the user progresses through the flow.
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = getCookie("token");
        const res = await axiosClient.get(`/api/v1/onboarding/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data?.data;
        const completion = d?.stepCompletion;
        if (completion && typeof completion === "object") {
          setStepCompletion(completion);

          // On first load, redirect to the first incomplete step
          if (!hasRedirected) {
            setHasRedirected(true);
            const firstIncompleteStep = steps.find(
              (step) => !completion[String(step.id)]
            );
            if (firstIncompleteStep && firstIncompleteStep.path !== location.pathname) {
              navigate(firstIncompleteStep.path, { replace: true });
            }
          }
        }

        // Show global approved/suspended screens
        if (d?.status === "APPROVED") {
          setShowApproved(true);
        } else if (d?.status === "SUSPENDED") {
          setShowSuspended(true);
        } else {
          setShowApproved(false);
          setShowSuspended(false);
        }
      } catch (e) {
        console.error("Failed to fetch onboarding status:", e);
      }
    };
    fetchStatus();
  }, [location.pathname]);

  // A step is unlocked iff every previous step is marked complete in the API.
  // Step 1 is always unlocked.
  const isStepUnlocked = (stepId: number) => {
    if (stepId === 1) return true;
    for (let i = 1; i < stepId; i++) {
      if (!stepCompletion[String(i)]) return false;
    }
    return true;
  };

  if (showApproved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0a6e 0%, #220E92 30%, #3318c7 60%, #1a0a6e 100%)" }}
      >
        {/* Confetti particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE"];
            const color = colors[i % colors.length];
            const left = `${Math.random() * 100}%`;
            const delay = `${Math.random() * 3}s`;
            const duration = `${3 + Math.random() * 4}s`;
            const size = Math.random() > 0.5 ? "w-2 h-2" : "w-1.5 h-4";
            const rotation = `${Math.random() * 360}deg`;
            return (
              <div
                key={i}
                className={`absolute ${size} rounded-sm opacity-80`}
                style={{
                  backgroundColor: color,
                  left,
                  top: "-20px",
                  transform: `rotate(${rotation})`,
                  animation: `confettiFall ${duration} ${delay} linear infinite`,
                }}
              />
            );
          })}
        </div>

        <style>{`
          @keyframes confettiFall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}</style>

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="w-24 h-24 rounded-full bg-[#FFD700] flex items-center justify-center mb-8"
            style={{ boxShadow: "0 0 40px rgba(255, 215, 0, 0.4)" }}
          >
            <CheckCircle2 className="w-12 h-12 text-[#1a0a6e]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Welcome to
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-10">
            Dashrobe
          </h1>
          <p className="text-md text-white">Congratulations! Your application is approved. Our team will reach out to you shortly.</p>
        </div>
      </div>
    );
  }

  if (showSuspended) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0a6e 0%, #220E92 30%, #3318c7 60%, #1a0a6e 100%)" }}
      >
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <img src={suspendImage} alt="suspend" className="w-[128px] h-[128px] text-[#1a0a6e]" />
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Account Suspended
          </h1>
          <p className="text-sm text-white md:w-[500px]">Your account has been suspended. For further information or assistance, please reach out to our customer support team. We're here to help.</p>
          <a href="tel:+919999999999" className="bg-[#FFC100] text-[#220E92] font-[700] px-4 py-2 mt-5 rounded-md inline-block">
            Contact : +91 9999 999 999
          </a>
        </div>
      </div>
    );
  }

  return (
    <OnboardingProvider>
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50">
        <div
          className="px-4 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #220E92 0%, #1a0a6e 100%)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-white text-lg" style={{ fontWeight: 700, letterSpacing: '0.5px' }}>Dashrobe</span>
            <div className="h-5 w-px bg-white/20" />
            <div>
              <p className="text-white/90 text-xs font-medium">Step {currentStep} of {steps.length}</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {/* Mobile progress bar */}
        <div className="h-1 bg-white/10" style={{ background: "linear-gradient(90deg, #220E92 0%, #1a0a6e 100%)" }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%`, background: "#FFC100" }}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`
          fixed md:sticky md:top-0 inset-y-0 left-0 z-40
          w-72 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:h-screen
        `}
        style={{ background: "linear-gradient(180deg, #220E92 0%, #1a0a6e 60%, #150854 100%)" }}
      >
        {/* Logo area */}
        <div className="p-5 md:p-6 pb-4 md:pb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFC100] flex items-center justify-center" style={{ boxShadow: "0 4px 12px rgba(255,193,0,0.3)" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#220E92" }}>D</span>
            </div>
            <span className="text-white text-lg" style={{ fontWeight: 700, letterSpacing: '0.3px' }}>Dashrobe</span>
          </div>
          <p className="text-xs text-white/50 mt-2 ml-0.5">Vendor Onboarding</p>
          {/* Progress indicator */}
          <div className="mt-3 bg-white/8 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg, #FFC100, #FFD54F)" }}
            />
          </div>
          <p className="text-[11px] text-white/40 mt-1 ml-0.5">{progressPercent}% complete</p>
        </div>

        {/* Steps */}
        <div className="flex-1 px-3 md:px-4 overflow-y-auto pb-3">
          <div className="space-y-0.5">
            {steps.map((step, index) => {
              const isCompleted = !!stepCompletion[String(step.id)];
              const isCurrent = index === currentStepIndex;
              const isUnlocked = isStepUnlocked(step.id);
              const isLocked = !isUnlocked && !isCurrent;

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (isLocked) return;
                    navigate(step.path);
                  }}
                  disabled={isLocked}
                  aria-disabled={isLocked}
                  title={isLocked ? "Complete the previous step to unlock" : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all group ${
                    isCurrent
                      ? "bg-white/12"
                      : isLocked
                      ? "cursor-not-allowed opacity-60"
                      : "hover:bg-white/6"
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-[#FFC100]/90 text-[#220E92]'
                          : isCurrent
                          ? 'bg-white text-[#220E92] shadow-lg shadow-white/20'
                          : 'bg-white/10 text-white/35'
                      }`}
                      style={{ fontSize: 12, fontWeight: 700 }}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : step.id}
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <span
                      className={`text-[12.5px] transition-colors ${
                        isCurrent ? 'text-white font-semibold' : isCompleted ? 'text-white/75' : 'text-white/40'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {isCurrent ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFC100]" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-white/30" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-white/8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/50 hover:text-white/70 transition-colors cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5" />
              <div>
                <p className="text-xs font-medium">Need help?</p>
                <p className="text-[11px] text-white/40">support@dashrobe.com</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-[#FFC100B2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>

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
    </OnboardingProvider>
  );
}