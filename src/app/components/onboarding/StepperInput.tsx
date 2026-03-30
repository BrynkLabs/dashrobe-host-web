import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function StepperInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
}: StepperInputProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="rounded-lg h-10 w-10"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <div className="flex flex-col items-center min-w-20">
        <span className="text-2xl font-semibold text-[#220E92]">{value}</span>
        {label && <span className="text-xs text-gray-600">{label}</span>}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="rounded-lg h-10 w-10"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
