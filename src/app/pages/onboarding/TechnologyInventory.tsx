import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { useOnboarding } from "../../components/onboarding/OnboardingContext";
import { Database, Upload, Download, Clock, Camera, Info, FileSpreadsheet, CircleCheck } from "lucide-react";

export function TechnologyInventory() {
  const navigate = useNavigate();
  const { data, updateTechnologyInventory } = useOnboarding();
  const tech = data.technologyInventory;

  const handleNext = () => navigate("/onboarding/review");
  const handleBack = () => navigate("/onboarding/offers");

  const handleFileUpload = () => {
    setTimeout(() => updateTechnologyInventory({ fileUploaded: true }), 800);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#220E92] mb-2">Inventory & Photography</h2>
        <p className="text-sm md:text-base text-gray-600">Upload your product inventory and configure photography needs</p>
      </div>

      {/* Inventory Upload */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#220E92]/8 flex items-center justify-center">
            <Database className="w-5 h-5 text-[#220E92]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Inventory Upload</h3>
        </div>

        <div>
          <Label className="text-base">When would you like to upload your product catalog?</Label>
          <p className="text-sm text-gray-600 mt-1 mb-4">You can upload now or do it later from your dashboard</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Upload Now */}
          <button
            type="button"
            onClick={() => updateTechnologyInventory({ uploadChoice: "now", fileUploaded: false })}
            className={`flex flex-col items-center text-center p-5 rounded-xl border-2 transition-all min-h-[120px] justify-center ${
              tech.uploadChoice === "now"
                ? "border-[#220E92] bg-[#220E92]/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
              tech.uploadChoice === "now" ? "bg-[#220E92] text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <Upload className="w-5 h-5" />
            </div>
            <p className={`text-sm font-semibold ${tech.uploadChoice === "now" ? "text-[#220E92]" : "text-gray-900"}`}>Upload Now</p>
            <p className="text-xs text-gray-500 mt-1">Upload your product catalog via Excel</p>
          </button>

          {/* Upload Later */}
          <button
            type="button"
            onClick={() => updateTechnologyInventory({ uploadChoice: "later", fileUploaded: false })}
            className={`flex flex-col items-center text-center p-5 rounded-xl border-2 transition-all min-h-[120px] justify-center ${
              tech.uploadChoice === "later"
                ? "border-[#220E92] bg-[#220E92]/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
              tech.uploadChoice === "later" ? "bg-[#220E92] text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <p className={`text-sm font-semibold ${tech.uploadChoice === "later" ? "text-[#220E92]" : "text-gray-900"}`}>Upload Later</p>
            <p className="text-xs text-gray-500 mt-1">I'll do it after onboarding</p>
          </button>
        </div>

        {/* Upload Now — actions */}
        {tech.uploadChoice === "now" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
              <div className="flex items-center gap-3 mb-1">
                <FileSpreadsheet className="w-5 h-5 text-[#220E92]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Product Catalog Excel</p>
                  <p className="text-xs text-gray-500">Download our sample format, fill in your products, and upload</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  style={{ borderRadius: '10px' }}
                  className="flex items-center gap-2 text-sm border-[#220E92] text-[#220E92] hover:bg-[#220E92]/5"
                  onClick={() => alert("Downloading sample format...")}
                >
                  <Download className="w-4 h-4" />
                  Download Sample Format
                </Button>

                {!tech.fileUploaded ? (
                  <Button
                    type="button"
                    style={{ backgroundColor: '#220E92', borderRadius: '10px' }}
                    className="flex items-center gap-2 text-sm"
                    onClick={handleFileUpload}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Excel File
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-[10px]">
                    <CircleCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-800 font-medium">product_catalog.xlsx uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upload Later — messaging */}
        {tech.uploadChoice === "later" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">No problem!</p>
                <p className="text-xs text-blue-700 mt-1">
                  You can upload your product catalog anytime from the <span className="font-semibold">Products</span> section
                  in your Vendor Dashboard after onboarding is complete. Your store will go live once products are added.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Photography Services */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#220E92]/8 flex items-center justify-center">
            <Camera className="w-5 h-5 text-[#220E92]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Product Photography</h3>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex-1">
            <Label htmlFor="photography" className="text-base font-medium">Need Product Photography Services</Label>
            <p className="text-sm text-gray-600 mt-1">
              Dashrobe can provide professional photography (charges applicable)
            </p>
          </div>
          <Switch
            id="photography"
            checked={tech.needPhotography}
            onCheckedChange={(v) => updateTechnologyInventory({ needPhotography: v })}
          />
        </div>

        {tech.needPhotography && (
          <div className="pl-4 border-l-2 border-[#FFC100] space-y-2">
            <div className="bg-[#220E92]/5 rounded-lg p-4">
              <h4 className="font-medium text-[#220E92] mb-2">Photography Pricing</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Basic: \u20B950 per product (white background)</li>
                <li>• Standard: \u20B9100 per product (styled)</li>
                <li>• Premium: \u20B9200 per product (lifestyle shots)</li>
              </ul>
            </div>
          </div>
        )}
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
          Continue to Review & Submit
        </Button>
      </div>
    </div>
  );
}