interface TimeChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function TimeChip({ label, selected, onClick }: TimeChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border-2 transition-all text-xs md:text-sm ${
        selected
          ? 'border-[#220E92] bg-[#220E92] text-white shadow-[0_2px_8px_rgba(34,14,146,0.25)] font-semibold'
          : 'border-gray-200 bg-white text-gray-600 hover:border-[#220E92]/30 hover:text-gray-800 hover:shadow-sm font-medium'
      }`}
    >
      {label}
    </button>
  );
}
