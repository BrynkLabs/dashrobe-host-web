import { useCallback, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { TimeChip } from "../../components/onboarding/TimeChip";
import { AddressFields } from "../../components/onboarding/AddressFields";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { Clock, MapPin, Copy, CopyCheck, Loader2, AlertCircle } from "lucide-react";
import { axiosClient } from "@/app/Service/AxiosClient/axiosClient";
import { getCookie } from "@/app/utils/cookieUtils";

const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_DISPLAY: Record<string, string> = {
  MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday",
};

export function StoreOperations() {
  const navigate = useNavigate();
  const { data, updateStoreOperations } = useOnboarding();
  const ops = data.storeOperations;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreOperations = async () => {
      try {
        const token = getCookie("token");
        const res = await axiosClient.get(`/api/v1/onboarding/store-operations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data?.data;
        if (d) {
          const scheduleFromApi = d.operatingHours?.length
            ? DAY_ORDER.map((day) => {
                const entry = d.operatingHours.find(
                  (h: { day: string }) => h.day === day
                );
                if (entry) {
                  return {
                    day: DAY_DISPLAY[day] || day,
                    isOpen: entry.isOpen,
                    openTime: entry.isOpen && entry.openTime ? entry.openTime : "",
                    closeTime: entry.isOpen && entry.closeTime ? entry.closeTime : "",
                  };
                }
                return { day: DAY_DISPLAY[day] || day, isOpen: false, openTime: "", closeTime: "" };
              })
            : undefined;

          updateStoreOperations({
            storeLocation: d.storeLocation || "",
            storeAddress: {
              shopNo: d.shopNo || "",
              streetArea: d.street || "",
              landmark: d.landmark || "",
              pincode: d.pincode || "",
              district: d.district || "",
              city: d.city || "",
              state: d.state || "",
            },
            ...(scheduleFromApi ? { schedule: scheduleFromApi } : {}),
            preparationTime: d.orderPreparationTime || "",
            packingTime: d.averagePackingTime || "",
            readyFor30Min: d.readyFor30MinDelivery ?? false,
            deliveryCoverage: d.deliveryCoverageKm ?? 1,
          });
        }
      } catch (e) {
        console.error("Failed to fetch store operations:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreOperations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDaysCount = ops.schedule.filter((s) => s.isOpen).length;

  const updateSchedule = useCallback(
    (index: number, field: string, value: string | boolean) => {
      const newSchedule = ops.schedule.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      updateStoreOperations({ schedule: newSchedule });
    },
    [ops.schedule, updateStoreOperations]
  );

  const applyToAll = useCallback(
    (index: number) => {
      const source = ops.schedule[index];
      const newSchedule = ops.schedule.map((s) => ({
        ...s,
        isOpen: true,
        openTime: source.openTime,
        closeTime: source.closeTime,
      }));
      updateStoreOperations({ schedule: newSchedule });
    },
    [ops.schedule, updateStoreOperations]
  );

  const copyPrevious = useCallback(
    (index: number) => {
      const prev = ops.schedule[index - 1];
      if (prev) {
        const newSchedule = ops.schedule.map((item, i) =>
          i === index
            ? {
                ...item,
                isOpen: prev.isOpen,
                openTime: prev.openTime,
                closeTime: prev.closeTime,
              }
            : item
        );
        updateStoreOperations({ schedule: newSchedule });
      }
    },
    [ops.schedule, updateStoreOperations]
  );

  const setSchedulePreset = (newSchedule: typeof ops.schedule) => {
    updateStoreOperations({ schedule: newSchedule });
  };

  const preparationOptions = [
    { id: "3-5", label: "3\u20135 mins" },
    { id: "5-7", label: "5\u20137 mins" },
    { id: "7-9", label: "7\u20139 mins" },
    { id: "10-15", label: "10\u201315 mins" },
  ];

  const packingTimeOptions = [
    { id: "1-2", label: "1\u20132 mins" },
    { id: "3-5", label: "3\u20135 mins" },
    { id: "5-8", label: "5\u20138 mins" },
    { id: "8-12", label: "8\u201312 mins" },
    { id: "12-15", label: "12\u201315 mins" },
  ];

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const handleNext = async () => {
    setApiError("");

    if (!ops.storeLocation.trim()) {
      setApiError("Store Location Link is required.");
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }

    setSubmitting(true);
    try {
      const addr = ops.storeAddress;

      const payload = {
        storeLocation: ops.storeLocation,
        shopNo: addr.shopNo,
        street: addr.streetArea,
        landmark: addr.landmark,
        pincode: addr.pincode,
        district: addr.district,
        city: addr.city,
        state: addr.state,
        operatingHours: ops.schedule.map((s) => ({
          day: s.day.toUpperCase(),
          isOpen: s.isOpen,
          openTime: s.isOpen ? s.openTime : null,
          closeTime: s.isOpen ? s.closeTime : null,
        })),
        orderPreparationTime: ops.preparationTime,
        averagePackingTime: ops.packingTime,
        readyFor30MinDelivery: ops.readyFor30Min,
        deliveryCoverageKm: ops.deliveryCoverage,
      };

      const token = getCookie("token");
      const res = await axiosClient.put(
        `/api/v1/onboarding/store-operations`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status !== 200) {
        const text = await res.data?.message;
        throw new Error(`API error ${res.status}: ${text}`);
      }

      navigate("/onboarding/categories");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      setApiError(msg);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => navigate("/onboarding");

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
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">
          Store Operations
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Configure your store operational details
        </p>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{apiError}</p>
        </div>
      )}

      {/* Store Information */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#220E92]/8 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#220E92]" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Store Location & Address
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeLink">Store Location Link *</Label>
          <Input
            id="storeLink"
            placeholder="https://maps.google.com/..."
            className="rounded-xl"
            value={ops.storeLocation}
            onChange={(e) =>
              updateStoreOperations({ storeLocation: e.target.value })
            }
          />
          <p className="text-xs text-gray-500">
            Paste your Google Maps or location link
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-800">
            Store Address *
          </Label>
          <AddressFields
            address={ops.storeAddress}
            onChange={(newAddr) =>
              updateStoreOperations({ storeAddress: newAddr })
            }
            idPrefix="store"
          />
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-semibold text-gray-800">
              Operating Hours *
            </Label>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure timings for each day of the week · {openDaysCount} days
              open
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {openDaysCount === 7
                ? "Open all week"
                : `${openDaysCount} of 7 days`}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {ops.schedule.map((s, i) => (
            <div
              key={s.day}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-xl border transition-colors ${
                s.isOpen
                  ? "border-gray-200 bg-white"
                  : "border-gray-100 bg-gray-50/50"
              }`}
            >
              <div className="flex items-center gap-3 w-full sm:w-40 shrink-0">
                <Switch
                  checked={s.isOpen}
                  onCheckedChange={(val) => updateSchedule(i, "isOpen", val)}
                />
                <span
                  className={`text-sm ${
                    s.isOpen ? "font-semibold text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s.day}
                </span>
              </div>
              {s.isOpen ? (
                <div className="flex flex-1 items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={s.openTime}
                      onChange={(e) =>
                        updateSchedule(i, "openTime", e.target.value)
                      }
                      className="px-2.5 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                    />
                    <span className="text-xs text-gray-500">to</span>
                    <input
                      type="time"
                      value={s.closeTime}
                      onChange={(e) =>
                        updateSchedule(i, "closeTime", e.target.value)
                      }
                      className="px-2.5 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => (i === 0 ? applyToAll(i) : copyPrevious(i))}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#220E92] font-medium hover:bg-[#220E92]/5 transition-colors"
                    title={
                      i === 0
                        ? "Apply this timing to all open days"
                        : "Copy timing from previous day"
                    }
                  >
                    {i === 0 ? (
                      <>
                        <Copy className="w-3 h-3" /> Apply to all
                      </>
                    ) : (
                      <>
                        <CopyCheck className="w-3 h-3" /> Copy previous
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex-1">
                  <span className="text-xs text-gray-400">Closed</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick presets */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium mb-2">
            QUICK PRESETS
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: "All days 9 AM \u2013 9 PM",
                action: () =>
                  setSchedulePreset(
                    ops.schedule.map((s) => ({
                      ...s,
                      isOpen: true,
                      openTime: "09:00",
                      closeTime: "21:00",
                    }))
                  ),
              },
              {
                label: "Weekdays only",
                action: () =>
                  setSchedulePreset(
                    ops.schedule.map((s, idx) => ({
                      ...s,
                      isOpen: idx < 5,
                      openTime: idx < 5 ? "09:00" : "",
                      closeTime: idx < 5 ? "21:00" : "",
                    }))
                  ),
              },
              {
                label: "Weekend off",
                action: () =>
                  setSchedulePreset(
                    ops.schedule.map((s, idx) => ({
                      ...s,
                      isOpen: idx < 5,
                      openTime: idx < 5 ? s.openTime || "09:00" : "",
                      closeTime: idx < 5 ? s.closeTime || "21:00" : "",
                    }))
                  ),
              },
              {
                label: "24/7",
                action: () =>
                  setSchedulePreset(
                    ops.schedule.map((s) => ({
                      ...s,
                      isOpen: true,
                      openTime: "00:00",
                      closeTime: "23:59",
                    }))
                  ),
              },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={preset.action}
                className="px-3 py-1.5 rounded-[10px] border border-gray-200 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Order Preparation */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#220E92]" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Order Preparation
          </h3>
        </div>

        <div className="space-y-3">
          <Label>Order Preparation Time *</Label>
          <div className="flex flex-wrap gap-3">
            {preparationOptions.map((option) => (
              <TimeChip
                key={option.id}
                label={option.label}
                selected={ops.preparationTime === option.id}
                onClick={() =>
                  updateStoreOperations({ preparationTime: option.id })
                }
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="packingTime">Average Packing Time (Optional)</Label>
          <div className="flex flex-wrap gap-3">
            {packingTimeOptions.map((option) => (
              <TimeChip
                key={option.id}
                label={option.label}
                selected={ops.packingTime === option.id}
                onClick={() =>
                  updateStoreOperations({ packingTime: ops.packingTime === option.id ? "" : option.id })
                }
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex-1">
            <Label htmlFor="ready30min" className="text-base font-medium">
              Ready for 30-min Delivery
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Enable fast delivery option for customers
            </p>
          </div>
          <Switch
            id="ready30min"
            checked={ops.readyFor30Min}
            onCheckedChange={(v) => updateStoreOperations({ readyFor30Min: v })}
          />
        </div>

        {/* Preferred Delivery Coverage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Preferred Delivery Coverage *</Label>
            <span className="text-sm font-semibold text-[#220E92]">
              {ops.deliveryCoverage} km
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={9}
            step={1}
            value={[1,5,10,15,20,25,30,35,40,45].indexOf(ops.deliveryCoverage)}
            onChange={(e) => {
              const steps = [1,5,10,15,20,25,30,35,40,45];
              updateStoreOperations({ deliveryCoverage: steps[Number(e.target.value)] });
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#220E92]"
            style={{
              background: `linear-gradient(to right, #220E92 ${([1,5,10,15,20,25,30,35,40,45].indexOf(ops.deliveryCoverage) / 9) * 100}%, #e5e7eb ${([1,5,10,15,20,25,30,35,40,45].indexOf(ops.deliveryCoverage) / 9) * 100}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km</span>
            <span>45 km</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={submitting}
          style={{ borderRadius: "12px" }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={submitting}
          style={{ backgroundColor: "#220E92", borderRadius: "12px" }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium shadow-lg shadow-[#220E92]/20 hover:shadow-xl hover:shadow-[#220E92]/25 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Continue to Product Categories"
          )}
        </Button>
      </div>
    </div>
  );
}
