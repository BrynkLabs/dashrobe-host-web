import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import {
  Tag, CalendarCheck, Megaphone, Info, Percent, ShoppingBag, Gift, Lock,
} from "lucide-react";

export function OffersPromotions() {
  const navigate = useNavigate();
  const { data, updateOffersPromotions } = useOnboarding();
  const offers = data.offersPromotions;

  const handleNext = () => {
    navigate("/onboarding/technology");
  };

  const handleBack = () => navigate("/onboarding/returns");

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">
          Offers & Promotions
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Set up introductory offers to attract customers when your store goes live
        </p>
      </div>

      {/* ──────────────── Section 1: Discount Types ──────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#220E92]" />
          <h3 className="text-lg font-semibold text-gray-900">Discounts</h3>
        </div>

        <p className="text-sm text-gray-600">
          The following discount types will be available in your Vendor Dashboard after onboarding is complete.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 flex flex-col items-center text-center space-y-3">
            <div className="w-11 h-11 rounded-lg bg-[#220E92]/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#220E92]" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">Item Level Discount</h4>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400 font-medium">Available after onboarding</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 flex flex-col items-center text-center space-y-3">
            <div className="w-11 h-11 rounded-lg bg-[#220E92]/10 flex items-center justify-center">
              <Percent className="w-5 h-5 text-[#220E92]" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">Store Level Flat Discount</h4>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400 font-medium">Available after onboarding</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 flex flex-col items-center text-center space-y-3">
            <div className="w-11 h-11 rounded-lg bg-[#220E92]/10 flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#220E92]" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">Store Level Buy X Get Y Free</h4>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400 font-medium">Available after onboarding</span>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── Section 2: Platform Sales, Campaigns & Ads ──────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#220E92]" />
          <h3 className="text-lg font-semibold text-gray-900">
            Platform Sales, Campaigns & Ads
          </h3>
        </div>

        <p className="text-sm text-gray-600">
          Dashrobe runs seasonal campaigns (festive sales, end-of-season, new arrivals week, etc.)
          and is building an advertising platform to help vendors boost visibility. Opt in to be notified and participate.
        </p>

        <div
          className={`rounded-xl border-2 transition-all ${
            offers.joinPlatformSalesAds
              ? "border-[#220E92] bg-[#220E92]/[0.03]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-4 p-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                offers.joinPlatformSalesAds ? "bg-[#220E92] text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${offers.joinPlatformSalesAds ? "text-[#220E92]" : "text-gray-900"}`}>
                I'm interested in platform sales & Dashrobe Ads
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Participation is always optional — no commitment required.
              </p>
            </div>
            <Switch
              checked={offers.joinPlatformSalesAds}
              onCheckedChange={(v) => updateOffersPromotions({ joinPlatformSalesAds: v })}
            />
          </div>
        </div>

        {offers.joinPlatformSalesAds && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800">
              Great! We'll suggest relevant campaigns and reach out when Dashrobe Ads launches. You review and approve each one individually.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          onClick={handleBack}
          variant="outline"
          style={{ borderRadius: "12px" }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          style={{ backgroundColor: "#220E92", borderRadius: "12px" }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium shadow-lg shadow-[#220E92]/20 hover:shadow-xl hover:shadow-[#220E92]/25 transition-all"
        >
          Continue to Inventory & Photography
        </Button>
      </div>
    </div>
  );
}