import { Check } from "lucide-react";

interface CategoryCardProps {
  title: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function CategoryCard({ title, icon, selected, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-4 md:p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md ${
        selected
          ? 'border-[#220E92] bg-[#220E92]/[0.04] shadow-[0_2px_12px_rgba(34,14,146,0.1)]'
          : 'border-gray-200 bg-white hover:border-[#220E92]/30 hover:-translate-y-0.5'
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#220E92] flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" strokeWidth={3} />
        </div>
      )}
      {icon && <div className="mb-2 md:mb-3 opacity-80 group-hover:opacity-100 transition-opacity">{icon}</div>}
      <h4 className={`text-sm md:text-[14.5px] font-medium ${selected ? 'text-[#220E92]' : 'text-gray-800'}`}>
        {title}
      </h4>
    </button>
  );
}
