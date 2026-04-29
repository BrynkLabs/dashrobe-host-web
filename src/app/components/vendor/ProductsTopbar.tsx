import svgPaths from "../../../imports/VendorLayout/svg-nckogyqzr7";

interface ProductsTopbarProps {
  title?: string;
}

function StoreIcon() {
  return (
    <svg
      className="block size-full"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 16 16"
    >
      <g clipPath="url(#clip0_topbar_store)">
        <path
          d={svgPaths.p3b86ab80}
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.33333"
        />
        <path
          d={svgPaths.p248a000}
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.33333"
        />
        <path
          d={svgPaths.p20b4ecc0}
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.33333"
        />
        <path
          d="M1.33398 4.66669H14.6673"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.33333"
        />
        <path
          d={svgPaths.p145a2b50}
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.33333"
        />
      </g>
      <defs>
        <clipPath id="clip0_topbar_store">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function ProductsTopbar({ title = "Products" }: ProductsTopbarProps) {
  return (
    <div className="bg-white flex items-center justify-between pb-px px-8 h-[48px] relative shrink-0 sticky top-0 z-20">
      {/* Bottom border overlay */}
      <div
        aria-hidden="true"
        className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none"
      />

      {/* Left — page title */}
      <span
        className="text-[15px] text-[#1a1a1a] whitespace-nowrap"
        style={{ fontWeight: 600 }}
      >
        {title}
      </span>

      {/* Right — store info */}
      <div className="shrink-0 flex items-center h-9 relative">
        {/* Left divider */}
        <div
          aria-hidden="true"
          className="absolute border-l border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none"
        />
        <div className="flex items-center gap-2 pl-3">
          <div className="size-8 rounded-full bg-[#220e92] flex items-center justify-center shrink-0">
            <div className="size-4">
              <StoreIcon />
            </div>
          </div>
          <span
            className="text-[13px] text-[#1a1a1a] whitespace-nowrap"
            style={{ fontWeight: 600 }}
          >
            StyleCraft India
          </span>
        </div>
      </div>
    </div>
  );
}