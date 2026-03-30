import { Outlet, useLocation, useNavigate } from "react-router";
import { Check, Menu, X, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { OnboardingProvider } from "../onboarding/OnboardingContext";

const steps = [
  { id: 1, title: "Vendor Basic Details", path: "/onboarding" },
  { id: 2, title: "Store Operations", path: "/onboarding/operations" },
  { id: 3, title: "Product Categories", path: "/onboarding/categories" },
  { id: 4, title: "Bank & Settlement", path: "/onboarding/banking" },
  { id: 5, title: "Refunds & Returns", path: "/onboarding/returns" },
  { id: 6, title: "Offers & Promotions", path: "/onboarding/offers" },
  { id: 7, title: "Technology & Inventory", path: "/onboarding/technology" },
  { id: 8, title: "Review & Declaration", path: "/onboarding/review" },
];

export function OnboardingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const currentStepIndex = steps.findIndex(step => step.path === location.pathname);
  const currentStep = currentStepIndex + 1;
  const progressPercent = Math.round((currentStep / steps.length) * 100);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <button
                  key={step.id}
                  onClick={() => navigate(step.path)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all group ${
                    isCurrent
                      ? "bg-white/12"
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
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFC100]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-white/8">
          <div className="flex items-center gap-2 text-white/50 hover:text-white/70 transition-colors cursor-pointer">
            <HelpCircle className="w-3.5 h-3.5" />
            <div>
              <p className="text-xs font-medium">Need help?</p>
              <p className="text-[11px] text-white/40">support@dashrobe.com</p>
            </div>
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
    </OnboardingProvider>
  );
}