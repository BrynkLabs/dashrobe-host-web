import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { Info, RefreshCw, Phone, Mail } from "lucide-react";

export function RefundsReturns() {
  const navigate = useNavigate();
  const { data, updateRefundsReturns } = useOnboarding();
  const rr = data.refundsReturns;

  const handleNext = () => navigate("/onboarding/offers");
  const handleBack = () => navigate("/onboarding/banking");

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Refund Policy</h2>
        <p className="text-sm md:text-base text-gray-600">Provide contact details for customer refund requests</p>
      </div>

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

      {/* Refund Contact Details */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#220E92]/8 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-[#220E92]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Refund Contact Details</h3>
        </div>

        <p className="text-sm text-gray-600">
          Customers will use these details to reach out for refund or return queries. Make sure the contact information is accurate and actively monitored.
        </p>

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
          style={{ borderRadius: '12px' }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          style={{ backgroundColor: '#220E92', borderRadius: '12px' }}
          className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium shadow-lg shadow-[#220E92]/20 hover:shadow-xl hover:shadow-[#220E92]/25 transition-all"
        >
          Continue to Offers & Promotions
        </Button>
      </div>
    </div>
  );
}