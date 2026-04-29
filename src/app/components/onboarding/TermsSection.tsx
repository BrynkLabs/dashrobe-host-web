import { Shield, CircleCheck } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import containerIcon from "@/assets/icons/Container.png";

const TERMS_ITEMS = [
  "All information provided in this application is accurate and up-to-date.",
  "I have the legal authority to represent and act on behalf of this business.",
  "All products listed comply with Indian laws, regulations, and quality standards.",
  "I accept Dashrobe's Vendor Terms & Conditions and Privacy Policy.",
  "I commit to maintaining product quality and accurate listings at all times.",
  "I authorize Dashrobe to verify all submitted documents and business credentials.",
  "I commit to accepting or rejecting orders within 5 minutes of receiving them.",
  "I commit to packing accepted orders within the preparation time specified during onboarding.",
  "I will keep inventory levels updated to avoid order cancellations due to stock-outs.",
  "I understand and accept the weekly settlement cycle (T+7 days from delivery).",
  "I acknowledge that Dashrobe handles all logistics and delivery operations.",
  "I agree to maintain responsive communication via the registered WhatsApp number.",
];

export function TermsSection({
  isSubmitted,
  submissionStatus,
  termsAccepted,
  onToggleTerms,
  tncOpen,
  onTncOpenChange,
}: {
  isSubmitted: boolean;
  submissionStatus: string;
  termsAccepted: boolean;
  onToggleTerms: (v: boolean) => void;
  tncOpen: boolean;
  onTncOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 lg:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#220E92]" />
          <h3 className="text-lg font-semibold text-gray-900">Commitments, Declarations & SLA</h3>
        </div>

        {isSubmitted ? (
          <div className="flex items-start gap-3 rounded-lg">
            <CircleCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-md text-gray-800 leading-relaxed">You have accepted this </p>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onTncOpenChange(true); }}
              className="text-[#220E92] font-medium underline hover:text-[#1a0a6e]"
            >
              Terms and Conditions
            </button>
            <p>
              {" "}and your application current status is{" "}
              <span className="font-semibold text-[#220E92]">{submissionStatus || "SUBMITTED"}</span>.
            </p>
          </div>
        ) : (
          <>
            <p className="text-md text-[#4A5565]">Please review and accept the following mandatory items to proceed.</p>
            <div className="flex items-center gap-3 rounded-lg transition-colors">
              <Checkbox
                id="accept-terms"
                checked={termsAccepted}
                onCheckedChange={(v) => onToggleTerms(!!v)}
                className="w-5 h-5"
              />
              <label
                htmlFor="accept-terms"
                className={`text-md leading-relaxed font-[400] cursor-pointer select-none ${termsAccepted ? "text-gray-900" : "text-gray-700"}`}
              >
                I have read and agree to the{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); onTncOpenChange(true); }}
                  className="text-[#220E92] font-medium underline hover:text-[#1a0a6e]"
                >
                  Terms and Conditions
                </button>
                . <span className="text-red-500">*</span>
              </label>
            </div>
          </>
        )}
      </div>

      <Dialog open={tncOpen} onOpenChange={onTncOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center">
            <img src={containerIcon} alt="Container Icon" className="w-[40px] h-[40px]" />
            <DialogTitle className="text-xl text-[#1A1A2E]">Terms & Conditions</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto pr-2 space-y-4 text-sm text-gray-700 leading-relaxed">
            {TERMS_ITEMS.map((item, i) => (
              <p key={i} className="font=[500] text-md text-[#364153]">{item}</p>
            ))}
          </div>

          {!isSubmitted && (
            <DialogFooter className="gap-2 pt-2">
              <Button
                onClick={() => { onToggleTerms(true); onTncOpenChange(false); }}
                style={{ backgroundColor: "#220E92", borderRadius: "10px" }}
              >
                I Agree
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
