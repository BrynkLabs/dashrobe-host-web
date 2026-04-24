import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { TimeChip } from "../../components/onboarding/TimeChip";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { Info, RefreshCw, Phone, Mail, Loader2, AlertCircle } from "lucide-react";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { getCookie } from "@/app/utils/cookieUtils";

const refundWindowOptions = [
  { id: "No Refund", label: "No Refund" },
  { id: "24 Hours", label: "24 Hours" },
  { id: "3 Days", label: "3 Days" },
  { id: "7 Days", label: "7 Days" },
];

const exchangePolicyOptions = [
  { id: "Same Day", label: "Same Day" },
  { id: "3 Days", label: "3 Days" },
  { id: "7 Days", label: "7 Days" },
];

const refundModeOptions = [
  { id: "Bank Transfer", label: "Bank Transfer" },
  { id: "Exchange Only", label: "Exchange only" },
  { id: "Bank Transfer & Exchanges", label: "Bank transfer & Exchanges" },
];

// Normalize API values to match preset IDs (case-insensitive) or standard custom format "X Days"/"X Hrs"
function normalizeTimeValue(raw: string, presetIds: string[]): string {
  if (!raw) return "";
  // Try case-insensitive match against presets first
  const preset = presetIds.find((id) => id.toLowerCase() === raw.toLowerCase());
  if (preset) return preset;
  // Parse number + unit, normalize to "X Days" or "X Hrs"
  const match = raw.match(/^(\d+)\s*(days?|hours?|hrs?)$/i);
  if (match) {
    const num = match[1];
    const u = match[2].toLowerCase();
    if (u.startsWith("h")) return `${num} Hrs`;
    return `${num} Days`;
  }
  return raw;
}

// Normalize refund mode (case-insensitive match)
function normalizeRefundMode(raw: string): string {
  if (!raw) return "";
  const preset = refundModeOptions.find((o) => o.id.toLowerCase() === raw.toLowerCase());
  return preset ? preset.id : raw;
}

export function RefundsReturns() {
  const navigate = useNavigate();
  const { data, updateRefundsReturns } = useOnboarding();
  const rr = data.refundsReturns;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRefundPolicy = async () => {
      try {
        const token = getCookie("token");
        const res = await axiosClient.get(`/api/v1/onboarding/refund-policy`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data?.data;
        if (d) {
          updateRefundsReturns({
            refundPhone: d.refundContactNumber || "",
            refundEmail: d.refundContactEmail || "",
            refundWindow: normalizeTimeValue(d.refundWindow || "", refundWindowOptions.map((o) => o.id)),
            exchangePolicy: normalizeTimeValue(d.exchangePolicy || "", exchangePolicyOptions.map((o) => o.id)),
            refundMode: normalizeRefundMode(d.refundMode || ""),
          });
        }
      } catch (e) {
        console.error("Failed to fetch refund policy:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRefundPolicy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = async () => {
    setApiError("");
    setSubmitting(true);
    try {
      const token = getCookie("token");
      const payload = {
        refundContactNumber: rr.refundPhone,
        refundContactEmail: rr.refundEmail,
        refundWindow: rr.refundWindow,
        exchangePolicy: rr.exchangePolicy,
        refundMode: rr.refundMode,
      };
      await axiosClient.put(`/api/v1/onboarding/refund-policy`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/onboarding/offers");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      setApiError(msg);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => navigate("/onboarding/banking");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#220E92]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div ref={topRef}>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Refund Policy</h2>
        <p className="text-sm md:text-base text-gray-600">Provide contact details for customer refund requests</p>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{apiError}</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 md:p-5 bg-gradient-to-r from-amber-50 to-orange-50/30 border border-amber-200 rounded-2xl">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-900">Refunds are handled manually by vendors</p>
          <p className="text-sm text-amber-700 mt-1">
            All refund requests from customers will be directed to the contact details you provide below.
            As a vendor, you are responsible for reviewing and processing refunds on a case-by-case basis.
          </p>
        </div>
      </div>

      {/* Refund Details */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#220E92]/8 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-[#220E92]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Refund Details</h3>
        </div>

        <p className="text-sm text-gray-600">
          Customers will use these details to reach out for refund or return queries. Make sure the contact information is accurate and actively monitored.
        </p>

        {/* Refund Window */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-800">Refund Window *</Label>
          <div className="flex flex-wrap gap-3 items-center">
            {refundWindowOptions.map((option) => (
              <TimeChip
                key={option.id}
                label={option.label}
                selected={rr.refundWindow === option.id}
                onClick={() => updateRefundsReturns({ refundWindow: option.id })}
              />
            ))}
            <CustomDaysHrsInput
              value={rr.refundWindow}
              presetIds={refundWindowOptions.map((o) => o.id)}
              onChange={(val) => updateRefundsReturns({ refundWindow: val })}
            />
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-800">Exchange Policy *</Label>
          <div className="flex flex-wrap gap-3 items-center">
            {exchangePolicyOptions.map((option) => (
              <TimeChip
                key={option.id}
                label={option.label}
                selected={rr.exchangePolicy === option.id}
                onClick={() => updateRefundsReturns({ exchangePolicy: option.id })}
              />
            ))}
            <CustomDaysHrsInput
              value={rr.exchangePolicy}
              presetIds={exchangePolicyOptions.map((o) => o.id)}
              onChange={(val) => updateRefundsReturns({ exchangePolicy: val })}
            />
          </div>
        </div>

        {/* Refund Mode */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-800">Refund Mode *</Label>
          <div className="flex flex-wrap gap-3">
            {refundModeOptions.map((option) => (
              <TimeChip
                key={option.id}
                label={option.label}
                selected={rr.refundMode === option.id}
                onClick={() => updateRefundsReturns({ refundMode: option.id })}
              />
            ))}
          </div>
        </div>

        {/* Contact Number & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="refundPhone" className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#220E92]" />
              Contact Number *
            </Label>
            <Input
              id="refundPhone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              className="rounded-xl"
              value={rr.refundPhone}
              onChange={(e) => updateRefundsReturns({ refundPhone: e.target.value })}
            />
            <p className="text-xs text-gray-500">This number will be shared with customers for refund queries</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="refundEmail" className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#220E92]" />
              Contact Email *
            </Label>
            <Input
              id="refundEmail"
              type="email"
              placeholder="refunds@yourstore.com"
              className="rounded-xl"
              value={rr.refundEmail}
              onChange={(e) => updateRefundsReturns({ refundEmail: e.target.value })}
            />
            <p className="text-xs text-gray-500">Refund requests and confirmations will be sent to this email</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
          <p className="text-sm font-medium text-gray-700">How it works</p>
          <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
            <li>Customer raises a refund request through the Dashrobe app</li>
            <li>You receive a notification via phone and email</li>
            <li>Review the request and process the refund directly</li>
            <li>Update the refund status on your Dashrobe vendor dashboard</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={submitting}
          style={{ borderRadius: '12px' }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={submitting}
          style={{ backgroundColor: '#220E92', borderRadius: '12px' }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium shadow-lg shadow-[#220E92]/20 hover:shadow-xl hover:shadow-[#220E92]/25 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Continue to Offers & Promotions"
          )}
        </Button>
      </div>
    </div>
  );
}

function CustomDaysHrsInput({
  value,
  presetIds,
  onChange,
}: {
  value: string;
  presetIds: string[];
  onChange: (val: string) => void;
}) {
  const isCustom = value !== "" && !presetIds.includes(value);

  // Parse custom value: e.g. "5 Days" or "12 Hrs"
  const [unit, setUnit] = useState<"Days" | "Hrs">("Days");
  const [customNum, setCustomNum] = useState("");

  // Sync from value when it's custom
  useEffect(() => {
    if (isCustom && value) {
      const match = value.match(/^(\d+)\s*(days?|hours?|hrs?)$/i);
      if (match) {
        setCustomNum(match[1]);
        const u = match[2].toLowerCase();
        setUnit(u.startsWith("h") ? "Hrs" : "Days");
      }
    }
  }, [isCustom, value]);

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCustomNum(raw);
    if (raw) {
      onChange(`${raw} ${unit}`);
    }
  };

  const handleUnitChange = (newUnit: "Days" | "Hrs") => {
    setUnit(newUnit);
    if (customNum) {
      onChange(`${customNum} ${newUnit}`);
    }
  };

  const activate = () => {
    if (!isCustom) {
      setCustomNum("");
      setUnit("Days");
      // Set a placeholder value so it becomes custom
      onChange(" Days");
    }
  };

  return (
    <div
      onClick={activate}
      className={`inline-flex items-center gap-1 rounded-xl border-2 px-2 py-1.5 text-sm cursor-pointer transition-colors ${
        isCustom
          ? "border-[#220E92] bg-[#220E92]/5"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
      }`}
    >
      {isCustom ? (
        <>
          <input
            type="text"
            inputMode="numeric"
            value={customNum}
            onChange={handleNumChange}
            onClick={(e) => e.stopPropagation()}
            placeholder="0"
            className="w-12 text-center bg-white border border-gray-200 rounded-md py-1 text-sm focus:outline-none focus:border-[#220E92]"
          />
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleUnitChange("Days"); }}
              className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                unit === "Days"
                  ? "bg-[#220E92] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              DAYS
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleUnitChange("Hrs"); }}
              className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                unit === "Hrs"
                  ? "bg-[#220E92] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              HRS
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="w-12 text-center text-gray-400 text-sm">__</span>
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-400">DAYS</span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-white text-gray-400">HRS</span>
          </div>
        </>
      )}
    </div>
  );
}
