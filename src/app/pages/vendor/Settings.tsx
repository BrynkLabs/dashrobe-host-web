import { Eye } from "lucide-react";
import { ProductsTopbar } from "../../components/vendor/ProductsTopbar";

export function Settings() {
  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-white">
      {/* Topbar */}
      <ProductsTopbar title="Settings" />

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#edf1ff] px-[32px] py-[24px]">
          {/* Header */}
          <div className="mb-[24px]">
            <div className="flex items-center gap-[12px] mb-[2px]">
              <h1 className="text-[22px] font-bold text-[#1a1a2e] leading-[33px] font-['Geist']">
                Surat Textile Mart
              </h1>
              <span className="h-[26px] px-[20px] bg-[#d1fae5] text-[#059669] text-[12px] font-semibold rounded-full flex items-center font-['Geist']">
                Approved
              </span>
            </div>
            <p className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">
              Store ID: vs-10 · Applied 2025-02-15
            </p>
          </div>

          <div className="max-w-[800px]">
            {/* Vendor Basic Details */}
            <div className="bg-white rounded-[12px] overflow-hidden mb-[16px] border border-[rgba(0,0,0,0.08)]">
              <div className="bg-[rgba(34,14,146,0.05)] h-[53px] flex items-center px-[20px] border-b border-[rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-[8px]">
                  <div className="size-[24px] rounded-full bg-[#220e92] flex items-center justify-center">
                    <span className="text-[11px] font-bold text-white font-['Geist']">1</span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-[#1a1a2e] font-['Geist'] leading-[22.5px]">
                    Vendor Basic Details
                  </h2>
                </div>
              </div>

              <div className="p-[20px]">
                <div className="grid grid-cols-2 gap-x-[48px]">
                  {/* Left Column */}
                  <div className="space-y-0">
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Store Name</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">Lucknow Chikan Studio</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Business Name</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">FK Chikan Enterprises Pvt Ltd</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Owner</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">Fatima Khan</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Legal Entity</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">Private Limited</span>
                    </div>
                    <div className="flex justify-between items-start h-[37.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">GSTIN</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">09AABCL4321J1Z2</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] pt-[8px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">PAN</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">AABCL4321J</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-0">
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Contact Person</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">Fatima Khan (Director)</span>
                    </div>
                    <div className="flex justify-between items-start h-[37.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Phone</span>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px]">+91 43210 98765</span>
                        <div className="h-[20.5px] px-[8px] bg-[#d1fae5] rounded-full flex items-center gap-[4px]">
                          <svg className="size-[12px]" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" stroke="#059669" strokeWidth="1"/>
                            <path d="M4.5 6L5.5 7L7.5 5" stroke="#059669" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-[11px] font-semibold text-[#059669] font-['Geist'] leading-[16.5px]">verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start h-[37.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Alt. Phone</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">+91 43210 98766</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Email</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">fatima@chikanstudio.in</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Website</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">https://summerchikan.in</span>
                    </div>
                    <div className="flex justify-between items-start h-[37.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Social Media</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">@lucknowchikanstudio</span>
                    </div>
                  </div>
                </div>

                {/* Business Address - Full Width */}
                <div className="mt-[8px] pt-[8px] border-t border-[rgba(0,0,0,0.08)]">
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Business Address</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right max-w-[500px]">
                      42, Hazratganj Market, Near SRTC, Lucknow - 226001, Uttar Pradesh
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Operations */}
            <div className="bg-white rounded-[12px] overflow-hidden mb-[16px] border border-[rgba(0,0,0,0.08)]">
              <div className="bg-[rgba(34,14,146,0.05)] h-[53px] flex items-center px-[20px] border-b border-[rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-[8px]">
                  <div className="size-[24px] rounded-full bg-[#220e92] flex items-center justify-center">
                    <span className="text-[11px] font-bold text-white font-['Geist']">2</span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-[#1a1a2e] font-['Geist'] leading-[22.5px]">
                    Store Operations
                  </h2>
                </div>
              </div>

              <div className="p-[20px]">
                <div className="grid grid-cols-2 gap-x-[48px]">
                  {/* Left Column */}
                  <div className="space-y-0">
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Store Location</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">42, Hazratganj Market, Lucknow - 226001</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Opening Time</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">10:00</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Closing Time</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">21:00</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] pt-[8px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Weekly Off</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">None</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-0">
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Preparation Time</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">5-7 mins</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Packing Time</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">4 mins</span>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] border-b border-[rgba(0,0,0,0.08)] pt-[8px] pb-[1px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">30 min Delivery</span>
                      <div className="h-[20.5px] px-[8px] bg-[#fee2e2] rounded-full flex items-center">
                        <span className="text-[11px] font-semibold text-[#dc2626] font-['Geist']">Disabled</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start h-[36.5px] pt-[8px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Packaging</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">Vendor (Self)</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Coverage - Full Width */}
                <div className="mt-[8px] pt-[8px] border-t border-[rgba(0,0,0,0.08)]">
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Delivery Coverage</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">12 km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div className="bg-white rounded-[12px] overflow-hidden mb-[16px] border border-[rgba(0,0,0,0.08)]">
              <div className="bg-[rgba(34,14,146,0.05)] h-[53px] flex items-center px-[20px] border-b border-[rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-[8px]">
                  <div className="size-[24px] rounded-full bg-[#220e92] flex items-center justify-center">
                    <span className="text-[11px] font-bold text-white font-['Geist']">3</span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-[#1a1a2e] font-['Geist'] leading-[22.5px]">
                    Product Categories
                  </h2>
                </div>
              </div>

              <div className="p-[20px]">
                <div className="space-y-[12px]">
                  <div>
                    <p className="text-[11px] text-[#6b6b80] font-medium font-['Geist'] uppercase tracking-wider mb-[8px] leading-[16.5px]">
                      Selected Categories & Sub-Categories
                    </p>
                    <div className="flex flex-wrap gap-[8px] mb-[12px]">
                      <span className="h-[28px] px-[12px] bg-[#f0ebff] text-[#220e92] text-[12px] font-medium rounded-[6px] border border-[#e9d5ff] flex items-center font-['Geist']">
                        Women's Western Wear
                      </span>
                      <span className="h-[28px] px-[12px] bg-[#f9fafb] text-[#475467] text-[12px] font-medium rounded-[6px] border border-[#eef0f4] flex items-center font-['Geist']">
                        Tops
                      </span>
                      <span className="h-[28px] px-[12px] bg-[#f9fafb] text-[#475467] text-[12px] font-medium rounded-[6px] border border-[#eef0f4] flex items-center font-['Geist']">
                        T-shirts
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-[8px]">
                      <span className="h-[28px] px-[12px] bg-[#f0ebff] text-[#220e92] text-[12px] font-medium rounded-[6px] border border-[#e9d5ff] flex items-center font-['Geist']">
                        Kids' Wear
                      </span>
                      <span className="h-[28px] px-[12px] bg-[#f9fafb] text-[#475467] text-[12px] font-medium rounded-[6px] border border-[#eef0f4] flex items-center font-['Geist']">
                        Tops
                      </span>
                      <span className="h-[28px] px-[12px] bg-[#f9fafb] text-[#475467] text-[12px] font-medium rounded-[6px] border border-[#eef0f4] flex items-center font-['Geist']">
                        T-shirts
                      </span>
                    </div>
                  </div>

                  <div className="pt-[12px] border-t border-[rgba(0,0,0,0.08)] space-y-[8px]">
                    <div className="flex justify-between items-center h-[28px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Number of SKUs</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px]">100</span>
                    </div>
                    <div className="flex justify-between items-center h-[28px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Pricing Type</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px]">Value for money</span>
                    </div>
                    <div className="flex justify-between items-center h-[28px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Price Range</span>
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px]">₹1800 - ₹10,000</span>
                    </div>
                    <div className="flex justify-between items-center h-[28px]">
                      <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Customization Offered</span>
                      <div className="h-[20.5px] px-[8px] bg-[#d1fae5] rounded-full flex items-center">
                        <span className="text-[11px] font-semibold text-[#059669] font-['Geist']">Yes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank & Settlement Details */}
            <div className="bg-white rounded-[12px] overflow-hidden mb-[16px] border border-[rgba(0,0,0,0.08)]">
              <div className="bg-[rgba(34,14,146,0.05)] h-[53px] flex items-center px-[20px] border-b border-[rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-[8px]">
                  <div className="size-[24px] rounded-full bg-[#220e92] flex items-center justify-center">
                    <span className="text-[11px] font-bold text-white font-['Geist']">4</span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-[#1a1a2e] font-['Geist'] leading-[22.5px]">
                    Bank & Settlement Details
                  </h2>
                </div>
              </div>

              <div className="p-[20px]">
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Account Holder</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">FK Chikan Enterprises Pvt Ltd</span>
                  </div>
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Bank Name</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">State Bank of India</span>
                  </div>
                  <div className="flex justify-between items-center h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Account Number</span>
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px]">••••••6293</span>
                      <button className="p-[4px] hover:bg-[#f9fafb] rounded transition-colors">
                        <Eye className="size-[16px] text-[#6b6b80]" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Account Type</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">Current</span>
                  </div>
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">IFSC Code</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">SBIN0001234</span>
                  </div>
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">UPI ID</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">fkchikan@sbi</span>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="mt-[20px] pt-[20px] border-t border-[rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-[8px] mb-[12px]">
                    <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
                      <path d="M9.33594 1.3335V4.00016C9.33594 4.35378 9.47641 4.69292 9.72646 4.94297C9.97651 5.19302 10.3156 5.3335 10.6693 5.3335H13.3359" stroke="#220e92" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.9974 1.3335H3.9974C3.64377 1.3335 3.30464 1.47397 3.05459 1.72402C2.80454 1.97407 2.66406 2.31321 2.66406 2.66683V13.3335C2.66406 13.6871 2.80454 14.0263 3.05459 14.2763C3.30464 14.5264 3.64377 14.6668 3.9974 14.6668H11.9974C12.351 14.6668 12.6902 14.5264 12.9402 14.2763C13.1903 14.0263 13.3307 13.6871 13.3307 13.3335V4.66683L9.9974 1.3335Z" stroke="#220e92" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Documents & Certificates</span>
                  </div>

                  <div className="space-y-[8px]">
                    <div className="flex items-center justify-between p-[12px] bg-[#f9fafb] rounded-[8px] border border-[#eef0f4]">
                      <div className="flex items-center gap-[12px]">
                        <div className="size-[32px] rounded-[4px] bg-white border border-[#eef0f4] flex items-center justify-center">
                          <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
                            <path d="M9.33594 1.3335V4.00016C9.33594 4.35378 9.47641 4.69292 9.72646 4.94297C9.97651 5.19302 10.3156 5.3335 10.6693 5.3335H13.3359" stroke="#475467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.9974 1.3335H3.9974C3.64377 1.3335 3.30464 1.47397 3.05459 1.72402C2.80454 1.97407 2.66406 2.31321 2.66406 2.66683V13.3335C2.66406 13.6871 2.80454 14.0263 3.05459 14.2763C3.30464 14.5264 3.64377 14.6668 3.9974 14.6668H11.9974C12.351 14.6668 12.6902 14.5264 12.9402 14.2763C13.1903 14.0263 13.3307 13.6871 13.3307 13.3335V4.66683L9.9974 1.3335Z" stroke="#475467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-[12px] text-[#1a1a2e] font-medium font-['Geist'] leading-[18px]">Owner PAN Card</p>
                          <p className="text-[10px] text-[#6b6b80] font-normal font-['Geist'] leading-[15px]">PDF, 150 KB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <div className="h-[20.5px] px-[8px] bg-[#d1fae5] rounded-full flex items-center">
                          <span className="text-[11px] font-semibold text-[#059669] font-['Geist']">Uploaded</span>
                        </div>
                        <button className="p-[4px] hover:bg-white rounded transition-colors">
                          <Eye className="size-[16px] text-[#6b6b80]" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-[12px] bg-[#f9fafb] rounded-[8px] border border-[#eef0f4]">
                      <div className="flex items-center gap-[12px]">
                        <div className="size-[32px] rounded-[4px] bg-white border border-[#eef0f4] flex items-center justify-center">
                          <svg className="size-[16px]" viewBox="0 0 16 16" fill="none">
                            <path d="M9.33594 1.3335V4.00016C9.33594 4.35378 9.47641 4.69292 9.72646 4.94297C9.97651 5.19302 10.3156 5.3335 10.6693 5.3335H13.3359" stroke="#475467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.9974 1.3335H3.9974C3.64377 1.3335 3.30464 1.47397 3.05459 1.72402C2.80454 1.97407 2.66406 2.31321 2.66406 2.66683V13.3335C2.66406 13.6871 2.80454 14.0263 3.05459 14.2763C3.30464 14.5264 3.64377 14.6668 3.9974 14.6668H11.9974C12.351 14.6668 12.6902 14.5264 12.9402 14.2763C13.1903 14.0263 13.3307 13.6871 13.3307 13.3335V4.66683L9.9974 1.3335Z" stroke="#475467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-[12px] text-[#1a1a2e] font-medium font-['Geist'] leading-[18px]">MSME / Cancelled Cheque# / Cert. of Incor.</p>
                          <p className="text-[10px] text-[#6b6b80] font-normal font-['Geist'] leading-[15px]">PDF, 1.5 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <div className="h-[20.5px] px-[8px] bg-[#d1fae5] rounded-full flex items-center">
                          <span className="text-[11px] font-semibold text-[#059669] font-['Geist']">Uploaded</span>
                        </div>
                        <button className="p-[4px] hover:bg-white rounded transition-colors">
                          <Eye className="size-[16px] text-[#6b6b80]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refunds & Returns */}
            <div className="bg-white rounded-[12px] overflow-hidden mb-[16px] border border-[rgba(0,0,0,0.08)]">
              <div className="bg-[rgba(34,14,146,0.05)] h-[53px] flex items-center px-[20px] border-b border-[rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-[8px]">
                  <div className="size-[24px] rounded-full bg-[#220e92] flex items-center justify-center">
                    <span className="text-[11px] font-bold text-white font-['Geist']">5</span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-[#1a1a2e] font-['Geist'] leading-[22.5px]">
                    Refunds & Returns
                  </h2>
                </div>
              </div>

              <div className="p-[20px]">
                <div className="grid grid-cols-2 gap-x-[48px] gap-y-[8px]">
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Refund Window</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">No Refund</span>
                  </div>
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Exchange Policy</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">Same Day</span>
                  </div>
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Refund Mode</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">Bank</span>
                  </div>
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Refund Number</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">+91 9999 939 999</span>
                  </div>
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Refund Email</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">vendor@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review & Declaration */}
            <div className="bg-white rounded-[12px] overflow-hidden border border-[rgba(0,0,0,0.08)]">
              <div className="bg-[rgba(34,14,146,0.05)] h-[53px] flex items-center px-[20px] border-b border-[rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-[8px]">
                  <div className="size-[24px] rounded-full bg-[#220e92] flex items-center justify-center">
                    <span className="text-[11px] font-bold text-white font-['Geist']">6</span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-[#1a1a2e] font-['Geist'] leading-[22.5px]">
                    Review & Declaration
                  </h2>
                </div>
              </div>

              <div className="p-[20px]">
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Declaration Accepted</span>
                    <div className="h-[20.5px] px-[8px] bg-[#d1fae5] rounded-full flex items-center">
                      <span className="text-[11px] font-semibold text-[#059669] font-['Geist']">Accepted</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start h-[28px]">
                    <span className="text-[13px] text-[#6b6b80] font-normal font-['Geist'] leading-[19.5px]">Submitted At</span>
                    <span className="text-[13px] text-[#1a1a2e] font-medium font-['Geist'] leading-[19.5px] text-right">2025-02-20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}

export default Settings;