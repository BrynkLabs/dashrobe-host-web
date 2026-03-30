import { useState, useEffect, useCallback } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, CheckCircle2, MapPin } from "lucide-react";
import type { AddressData } from "./OnboardingContext";

// ─── Mock pincode database (Indian pincodes) ──────────────────
const pincodeDatabase: Record<string, { district: string; city: string; state: string }> = {
  "110001": { district: "Central Delhi", city: "New Delhi", state: "Delhi" },
  "110002": { district: "Central Delhi", city: "New Delhi", state: "Delhi" },
  "110003": { district: "Central Delhi", city: "New Delhi", state: "Delhi" },
  "110005": { district: "New Delhi", city: "New Delhi", state: "Delhi" },
  "110016": { district: "South Delhi", city: "New Delhi", state: "Delhi" },
  "110017": { district: "South Delhi", city: "New Delhi", state: "Delhi" },
  "110019": { district: "South Delhi", city: "New Delhi", state: "Delhi" },
  "110020": { district: "South Delhi", city: "New Delhi", state: "Delhi" },
  "110025": { district: "South Delhi", city: "New Delhi", state: "Delhi" },
  "110044": { district: "South East Delhi", city: "New Delhi", state: "Delhi" },
  "110048": { district: "South West Delhi", city: "New Delhi", state: "Delhi" },
  "110065": { district: "South Delhi", city: "New Delhi", state: "Delhi" },
  "110070": { district: "South West Delhi", city: "New Delhi", state: "Delhi" },
  "110085": { district: "North East Delhi", city: "New Delhi", state: "Delhi" },
  "110091": { district: "East Delhi", city: "New Delhi", state: "Delhi" },
  "110092": { district: "Shahdara", city: "New Delhi", state: "Delhi" },
  "120001": { district: "Ghaziabad", city: "Ghaziabad", state: "Uttar Pradesh" },
  "121001": { district: "Faridabad", city: "Faridabad", state: "Haryana" },
  "122001": { district: "Gurugram", city: "Gurugram", state: "Haryana" },
  "122002": { district: "Gurugram", city: "Gurugram", state: "Haryana" },
  "122003": { district: "Gurugram", city: "Gurugram", state: "Haryana" },
  "122018": { district: "Gurugram", city: "Gurugram", state: "Haryana" },
  "201001": { district: "Ghaziabad", city: "Ghaziabad", state: "Uttar Pradesh" },
  "201301": { district: "Gautam Buddha Nagar", city: "Noida", state: "Uttar Pradesh" },
  "201304": { district: "Gautam Buddha Nagar", city: "Greater Noida", state: "Uttar Pradesh" },
  "201306": { district: "Gautam Buddha Nagar", city: "Noida", state: "Uttar Pradesh" },
  "400001": { district: "Mumbai City", city: "Mumbai", state: "Maharashtra" },
  "400002": { district: "Mumbai City", city: "Mumbai", state: "Maharashtra" },
  "400050": { district: "Mumbai Suburban", city: "Mumbai", state: "Maharashtra" },
  "400053": { district: "Mumbai Suburban", city: "Mumbai", state: "Maharashtra" },
  "400069": { district: "Mumbai Suburban", city: "Mumbai", state: "Maharashtra" },
  "400076": { district: "Mumbai Suburban", city: "Mumbai", state: "Maharashtra" },
  "400601": { district: "Thane", city: "Thane", state: "Maharashtra" },
  "410210": { district: "Raigad", city: "Navi Mumbai", state: "Maharashtra" },
  "411001": { district: "Pune", city: "Pune", state: "Maharashtra" },
  "411014": { district: "Pune", city: "Pune", state: "Maharashtra" },
  "411057": { district: "Pune", city: "Pune", state: "Maharashtra" },
  "500001": { district: "Hyderabad", city: "Hyderabad", state: "Telangana" },
  "500003": { district: "Hyderabad", city: "Hyderabad", state: "Telangana" },
  "500034": { district: "Hyderabad", city: "Hyderabad", state: "Telangana" },
  "500081": { district: "Hyderabad", city: "Hyderabad", state: "Telangana" },
  "500084": { district: "Rangareddy", city: "Hyderabad", state: "Telangana" },
  "560001": { district: "Bengaluru Urban", city: "Bengaluru", state: "Karnataka" },
  "560002": { district: "Bengaluru Urban", city: "Bengaluru", state: "Karnataka" },
  "560034": { district: "Bengaluru Urban", city: "Bengaluru", state: "Karnataka" },
  "560037": { district: "Bengaluru Urban", city: "Bengaluru", state: "Karnataka" },
  "560066": { district: "Bengaluru Urban", city: "Bengaluru", state: "Karnataka" },
  "560076": { district: "Bengaluru Urban", city: "Bengaluru", state: "Karnataka" },
  "560100": { district: "Bengaluru Urban", city: "Bengaluru", state: "Karnataka" },
  "600001": { district: "Chennai", city: "Chennai", state: "Tamil Nadu" },
  "600002": { district: "Chennai", city: "Chennai", state: "Tamil Nadu" },
  "600017": { district: "Chennai", city: "Chennai", state: "Tamil Nadu" },
  "600028": { district: "Chennai", city: "Chennai", state: "Tamil Nadu" },
  "600040": { district: "Chennai", city: "Chennai", state: "Tamil Nadu" },
  "600096": { district: "Kancheepuram", city: "Chennai", state: "Tamil Nadu" },
  "700001": { district: "Kolkata", city: "Kolkata", state: "West Bengal" },
  "700020": { district: "Kolkata", city: "Kolkata", state: "West Bengal" },
  "700091": { district: "Kolkata", city: "Kolkata", state: "West Bengal" },
  "380001": { district: "Ahmedabad", city: "Ahmedabad", state: "Gujarat" },
  "380015": { district: "Ahmedabad", city: "Ahmedabad", state: "Gujarat" },
  "380054": { district: "Ahmedabad", city: "Ahmedabad", state: "Gujarat" },
  "302001": { district: "Jaipur", city: "Jaipur", state: "Rajasthan" },
  "302015": { district: "Jaipur", city: "Jaipur", state: "Rajasthan" },
  "302020": { district: "Jaipur", city: "Jaipur", state: "Rajasthan" },
  "226001": { district: "Lucknow", city: "Lucknow", state: "Uttar Pradesh" },
  "226010": { district: "Lucknow", city: "Lucknow", state: "Uttar Pradesh" },
  "226024": { district: "Lucknow", city: "Lucknow", state: "Uttar Pradesh" },
  "160001": { district: "Chandigarh", city: "Chandigarh", state: "Chandigarh" },
  "160017": { district: "Chandigarh", city: "Chandigarh", state: "Chandigarh" },
  "462001": { district: "Bhopal", city: "Bhopal", state: "Madhya Pradesh" },
  "440001": { district: "Nagpur", city: "Nagpur", state: "Maharashtra" },
  "452001": { district: "Indore", city: "Indore", state: "Madhya Pradesh" },
  "682001": { district: "Ernakulam", city: "Kochi", state: "Kerala" },
  "682016": { district: "Ernakulam", city: "Kochi", state: "Kerala" },
  "682024": { district: "Ernakulam", city: "Kochi", state: "Kerala" },
  "695001": { district: "Thiruvananthapuram", city: "Thiruvananthapuram", state: "Kerala" },
  "751001": { district: "Khordha", city: "Bhubaneswar", state: "Odisha" },
  "800001": { district: "Patna", city: "Patna", state: "Bihar" },
  "831001": { district: "East Singhbhum", city: "Jamshedpur", state: "Jharkhand" },
  "834001": { district: "Ranchi", city: "Ranchi", state: "Jharkhand" },
  "360001": { district: "Rajkot", city: "Rajkot", state: "Gujarat" },
  "395001": { district: "Surat", city: "Surat", state: "Gujarat" },
  "395007": { district: "Surat", city: "Surat", state: "Gujarat" },
  "390001": { district: "Vadodara", city: "Vadodara", state: "Gujarat" },
};

function lookupPincode(pincode: string): Promise<{ district: string; city: string; state: string } | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = pincodeDatabase[pincode] ?? null;
      resolve(result);
    }, 600);
  });
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