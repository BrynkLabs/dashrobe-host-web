import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";
import svgPaths from "../../../imports/VendorLayout/svg-nckogyqzr7";

export type HeaderState = "clean" | "unsaved" | "error" | "blocked";

interface AddProductHeaderProps {
  headerState: HeaderState;
  errorFields?: string[];
  onDiscard: () => void;
  onSave: () => void;
}

/* ─── Store icon SVG ─────────────────────────────────────────────── */
function StoreIcon() {
  return (
    <svg
      className="block size-full"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 16 16"
    >
      <g clipPath="url(#clip0_header_store)">
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
        <clipPath id="clip0_header_store">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ─── Center pill contents per state ────────────────────────────── */

function CleanContent({
  onDiscard,
  onSave,
}: {
  onDiscard: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="flex items-center gap-2 px-4 py-[7px] rounded-[12px] bg-[#f0fdf4] border border-[#bbf7d0]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="#16a34a" strokeWidth="1.5" />
          <path
            d="M4.5 7L6 8.5L9.5 5"
            stroke="#16a34a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="text-[12px] text-[#15803d] whitespace-nowrap"
          style={{ fontWeight: 500 }}
        >
          All changes saved
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onDiscard}
          className="bg-white h-8 rounded-[8px] px-4 text-[12px] text-[#98a2b3] border border-[#eaecf0] whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ fontWeight: 500 }}
        >
          Discard
        </button>
        <button
          className="bg-[#220e92]/50 h-8 rounded-[8px] px-4 text-[12px] text-white whitespace-nowrap cursor-not-allowed"
          style={{ fontWeight: 600 }}
          disabled
        >
          Save
        </button>
      </div>
    </div>
  );
}

function UnsavedContent({
  onDiscard,
  onSave,
}: {
  onDiscard: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="shrink-0 relative rounded-[12px] bg-[#edeaff]"
      style={{ minWidth: 300 }}
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#dfd9ff] border-solid inset-0 pointer-events-none rounded-[12px]"
      />
      <div className="flex items-center justify-between pl-4 pr-2 py-[7px] gap-4">
        <span
          className="text-[13px] text-[#220e92] whitespace-nowrap shrink-0"
          style={{ fontWeight: 500 }}
        >
          Unsaved changes
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onDiscard}
            className="bg-white h-8 rounded-[8px] px-4 text-[12px] text-[#1a1a1a] whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Discard
          </button>
          <button
            onClick={onSave}
            className="bg-[#220e92] h-8 rounded-[8px] px-4 text-[12px] text-white whitespace-nowrap cursor-pointer hover:bg-[#1a0a73] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorContent({ errorFields }: { errorFields: string[] }) {
  return (
    <div
      className="shrink-0 relative rounded-[12px] bg-[#fff1f1]"
      style={{ minWidth: 300 }}
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#fecaca] border-solid inset-0 pointer-events-none rounded-[12px]"
      />
      <div className="flex items-center pl-3 pr-4 py-[7px] gap-2.5">
        {/* Icon */}
        <AlertCircle className="size-[15px] text-[#dc2626] shrink-0" />
        {/* Label */}
        <span
          className="text-[12px] text-[#991b1b] whitespace-nowrap shrink-0"
          style={{ fontWeight: 600 }}
        >
          Can't publish — missing:
        </span>
        {/* Field chips */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {errorFields.map((f) => (
            <span
              key={f}
              className="bg-[#fecaca]/60 text-[#991b1b] text-[11px] px-2 py-0.5 rounded-[6px] whitespace-nowrap"
              style={{ fontWeight: 500 }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlockedContent({
  onDiscard,
  onSave,
}: {
  onDiscard: () => void;
  onSave: () => void;
}) {
  return (
    <div className="shrink-0 flex items-center gap-2.5">
      {/* Warning pill */}
      <div className="relative rounded-full bg-white flex items-center gap-2 px-4 py-[7px]">
        {/* Border overlay */}
        <div
          aria-hidden="true"
          className="absolute border border-[#f97066] border-solid inset-0 pointer-events-none rounded-full"
        />
        <AlertCircle className="size-[14px] text-[#d92d20] shrink-0" />
        <span
          className="text-[12px] text-[#d92d20] whitespace-nowrap"
          style={{ fontWeight: 500 }}
        >
          Unsaved changes — Save or Discard before leaving.
        </span>
      </div>
      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onDiscard}
          className="bg-white h-8 rounded-[8px] px-4 text-[12px] text-[#1a1a1a] border border-[#eaecf0] whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ fontWeight: 500 }}
        >
          Discard
        </button>
        <button
          onClick={onSave}
          className="bg-[#220e92] h-8 rounded-[8px] px-4 text-[12px] text-white whitespace-nowrap cursor-pointer hover:bg-[#1a0a73] transition-colors"
          style={{ fontWeight: 600 }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export function AddProductHeader({
  headerState,
  errorFields = [],
  onDiscard,
  onSave,
}: AddProductHeaderProps) {
  return (
    <div className="bg-white flex items-center justify-between pb-px px-8 h-[64px] relative shrink-0 sticky top-0 z-20">
      {/* Bottom border */}
      <div
        aria-hidden="true"
        className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none"
      />

      {/* Left — "Products" title */}
      <div className="shrink-0">
        <span
          className="text-[15px] text-[#1a1a1a] whitespace-nowrap"
          style={{ fontWeight: 600 }}
        >
          Products
        </span>
      </div>

      {/* Center — animated state pill */}
      <div
        className="shrink-0 flex items-center"
        style={{ perspective: "800px", perspectiveOrigin: "center center" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={headerState}
            initial={{ rotateX: -80, opacity: 0, y: -4 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            exit={{ rotateX: 80, opacity: 0, y: 4 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: "center center" }}
          >
            {headerState === "clean" && (
              <CleanContent onDiscard={onDiscard} onSave={onSave} />
            )}
            {headerState === "unsaved" && (
              <UnsavedContent onDiscard={onDiscard} onSave={onSave} />
            )}
            {headerState === "error" && (
              <ErrorContent errorFields={errorFields} />
            )}
            {headerState === "blocked" && (
              <BlockedContent onDiscard={onDiscard} onSave={onSave} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right — Store info */}
      <div className="shrink-0 flex items-center h-9 relative">
        <div
          aria-hidden="true"
          className="absolute border-l border-black/10 inset-0 pointer-events-none"
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