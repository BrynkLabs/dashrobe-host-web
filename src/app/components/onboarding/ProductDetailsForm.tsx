import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Hash, IndianRupee, Tag, Paintbrush } from "lucide-react";

const MAX_NUMERIC_VALUE = 1999999999;

function sanitizeNumericInput(raw: string, previous: string = ""): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const trimmed = digits.replace(/^0+/, "");
  if (!trimmed) return "";
  const num = Number(trimmed);
  if (num > MAX_NUMERIC_VALUE) return previous;
  return trimmed;
}

function blockNonNumericKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
    e.preventDefault();
  }
}

// Allows "1000", "1000-2000" style range inputs.
function sanitizePriceRange(raw: string): string {
  // Only allow digits and a single hyphen
  const cleaned = raw.replace(/[^0-9-]/g, "");
  // Split on hyphen, take at most 2 parts
  const parts = cleaned.split("-");
  const sanitized = parts
    .slice(0, 2)
    .map((p) => p.replace(/^0+(\d)/, "$1")) // strip leading zeros
    .join("-");
  return sanitized;
}

function blockNonPriceRangeKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  if (["e", "E", "+", ".", ","].includes(e.key)) {
    e.preventDefault();
  }
}

export function ProductDetailsForm({
  numberOfSkus,
  pricingType,
  avgPriceRange,
  customizationAvailable,
  onSkusChange,
  onPricingTypeChange,
  onAvgPriceChange,
  onCustomizationChange,
}: {
  numberOfSkus: string;
  pricingType: string;
  avgPriceRange: string;
  customizationAvailable: boolean;
  onSkusChange: (v: string) => void;
  onPricingTypeChange: (v: string) => void;
  onAvgPriceChange: (v: string) => void;
  onCustomizationChange: (v: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Product Details</h3>
        <p className="text-sm text-gray-600 mt-1">Tell us more about your product catalog</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="numberOfSkus" className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#220E92]" />
            Number of SKU(s) (Approx) *
          </Label>
          <Input
            id="numberOfSkus"
            type="text"
            inputMode="numeric"
            placeholder="e.g., 150"
            className="rounded-lg"
            value={numberOfSkus}
            onKeyDown={blockNonNumericKeys}
            onPaste={(e) => {
              e.preventDefault();
              onSkusChange(sanitizeNumericInput(e.clipboardData.getData("text"), numberOfSkus));
            }}
            onChange={(e) => onSkusChange(sanitizeNumericInput(e.target.value, numberOfSkus))}
          />
          <p className="text-xs text-gray-500">Total number of unique products you plan to list</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricingType" className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#220E92]" />
            Pricing Type *
          </Label>
          <Select value={pricingType || undefined} onValueChange={onPricingTypeChange}>
            <SelectTrigger id="pricingType" className="rounded-lg">
              <SelectValue placeholder="Select pricing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PREMIUM">Premium</SelectItem>
              <SelectItem value="VALUE_FOR_MONEY">Value for money</SelectItem>
              <SelectItem value="ECONOMICAL">Economical</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">The pricing segment your products fall under</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="avgPriceRange" className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#220E92]" />
            Average Price Range *
          </Label>
          <Input
            id="avgPriceRange"
            type="text"
            inputMode="numeric"
            placeholder="e.g., 750 or 500-1500"
            className="rounded-lg"
            value={avgPriceRange}
            onKeyDown={blockNonPriceRangeKeys}
            onPaste={(e) => {
              e.preventDefault();
              onAvgPriceChange(sanitizePriceRange(e.clipboardData.getData("text")));
            }}
            onChange={(e) => onAvgPriceChange(sanitizePriceRange(e.target.value))}
          />
          <p className="text-xs text-gray-500">Typical price range of your products (e.g., 1000-2000)</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-[#220E92]" />
            Customization Available
          </Label>
          <div
            className={`flex items-center justify-between p-3.5 rounded-lg border-2 transition-all ${
              customizationAvailable
                ? "border-[#220E92] bg-[#220E92]/[0.03]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${customizationAvailable ? "text-[#220E92]" : "text-gray-700"}`}>
                {customizationAvailable ? "Yes — Customization offered" : "No — Standard products only"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">For boutiques and home tailors</p>
            </div>
            <Switch checked={customizationAvailable} onCheckedChange={onCustomizationChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
