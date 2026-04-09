import { useState, useEffect, useCallback } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, CheckCircle2, MapPin } from "lucide-react";
import type { AddressData } from "./OnboardingContext";

async function lookupPincode(pincode: string): Promise<{ district: string; city: string; state: string } | null> {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
      const po = data[0].PostOffice[0];
      return { district: po.District, city: po.Block || po.District, state: po.State };
    }
    return null;
  } catch {
    return null;
  }
}

interface AddressFieldsProps {
  address: AddressData;
  onChange: (address: AddressData) => void;
  idPrefix: string;
}

export function AddressFields({ address, onChange, idPrefix }: AddressFieldsProps) {
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeLookedUp, setPincodeLookedUp] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  const updateField = useCallback(
    (field: keyof AddressData, value: string) => {
      onChange({ ...address, [field]: value });
    },
    [address, onChange]
  );

  // Auto-lookup pincode when 6 digits entered
  useEffect(() => {
    const pin = address.pincode.replace(/\s/g, "");
    if (pin.length === 6 && /^\d{6}$/.test(pin)) {
      setPincodeLoading(true);
      setPincodeError("");
      setPincodeLookedUp(false);
      lookupPincode(pin).then((result) => {
        setPincodeLoading(false);
        if (result) {
          onChange({
            ...address,
            district: result.district,
            city: result.city,
            state: result.state,
          });
          setPincodeLookedUp(true);
        } else {
          setPincodeError("Pincode not found. Please enter details manually.");
          setPincodeLookedUp(false);
        }
      });
    } else {
      // Clear auto-filled fields if pincode changes
      if (pincodeLookedUp) {
        setPincodeLookedUp(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.pincode]);

  return (
    <div className="space-y-4">
      {/* Row 1: Shop No + Street/Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-shopNo`}>
            Shop No / Door No *
          </Label>
          <Input
            id={`${idPrefix}-shopNo`}
            placeholder="e.g., Shop #12, Door No. 4/56"
            className="rounded-xl"
            value={address.shopNo}
            onChange={(e) => updateField("shopNo", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-street`}>
            Street / Area / Road *
          </Label>
          <Input
            id={`${idPrefix}-street`}
            placeholder="e.g., MG Road, Sector 5"
            className="rounded-xl"
            value={address.streetArea}
            onChange={(e) => updateField("streetArea", e.target.value)}
          />
        </div>
      </div>

      {/* Row 2: Landmark */}
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-landmark`}>
          Landmark / Building Name
        </Label>
        <Input
          id={`${idPrefix}-landmark`}
          placeholder="e.g., Near City Mall, Sunshine Apartments"
          className="rounded-xl"
          value={address.landmark}
          onChange={(e) => updateField("landmark", e.target.value)}
        />
      </div>

      {/* Row 3: Pincode with auto-lookup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-pincode`}>
            Pincode *
          </Label>
          <div className="relative">
            <Input
              id={`${idPrefix}-pincode`}
              placeholder="e.g., 110001"
              maxLength={6}
              className={`rounded-xl ${
                pincodeError
                  ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200"
                  : pincodeLookedUp
                  ? "border-emerald-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-200"
                  : ""
              }`}
              value={address.pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                updateField("pincode", val);
              }}
            />
            {pincodeLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-[#220E92]" />
              </div>
            )}
            {pincodeLookedUp && !pincodeLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            )}
          </div>
          {pincodeError && (
            <p className="text-xs text-red-500">{pincodeError}</p>
          )}
          {pincodeLookedUp && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/50">
              <MapPin className="w-3 h-3" />
              <span className="font-medium">Location auto-detected from pincode</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 4: District + City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-district`}>
            District *
          </Label>
          <Input
            id={`${idPrefix}-district`}
            placeholder="Will auto-fill from pincode"
            className={`rounded-xl ${pincodeLookedUp ? "bg-gray-50/80" : ""}`}
            value={address.district}
            onChange={(e) => updateField("district", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-city`}>
            City *
          </Label>
          <Input
            id={`${idPrefix}-city`}
            placeholder="Will auto-fill from pincode"
            className={`rounded-xl ${pincodeLookedUp ? "bg-gray-50/80" : ""}`}
            value={address.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
        </div>
      </div>

      {/* Row 5: State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-state`}>
            State *
          </Label>
          <Input
            id={`${idPrefix}-state`}
            placeholder="Will auto-fill from pincode"
            className={`rounded-xl ${pincodeLookedUp ? "bg-gray-50/80" : ""}`}
            value={address.state}
            onChange={(e) => updateField("state", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

/** Utility: format AddressData into a single-line display string */
export function formatAddress(addr: AddressData): string {
  const parts = [
    addr.shopNo,
    addr.streetArea,
    addr.landmark,
    addr.city,
    addr.district !== addr.city ? addr.district : "",
    addr.state,
    addr.pincode,
  ].filter(Boolean);
  return parts.join(", ") || "Not provided";
}