import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface Color {
  name: string;
  hex: string;
  secondaryName?: string;
  secondaryHex?: string;
}

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (color: Color) => void;
  currentColor?: string;
}

const PREDEFINED_COLORS: Color[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Grey", hex: "#9E9E9E" },
  { name: "Red", hex: "#F44336" },
  { name: "Orange", hex: "#FF9800" },
  { name: "Yellow", hex: "#FFEB3B" },
  { name: "Green", hex: "#4CAF50" },
  { name: "Blue", hex: "#2196F3" },
  { name: "Purple", hex: "#9C27B0" },
  { name: "Pink", hex: "#E91E63" },
  { name: "Brown", hex: "#795548" },
];

export function ColorPickerModal({
  isOpen,
  onClose,
  onSave,
  currentColor,
}: ColorPickerModalProps) {
  const [mode, setMode] = useState<"predefined" | "custom">("predefined");
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#000000");
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [hasSecondaryColor, setHasSecondaryColor] = useState(false);
  const [secondaryColorName, setSecondaryColorName] = useState("");
  const [secondaryColorHex, setSecondaryColorHex] = useState("#FFFFFF");

  if (!isOpen) return null;

  const handleSave = () => {
    if (mode === "predefined" && selectedColor) {
      onSave(selectedColor);
      onClose();
    } else if (mode === "custom" && customColorName.trim()) {
      const colorData: Color = {
        name: customColorName.trim(),
        hex: customColorHex,
      };

      if (hasSecondaryColor && secondaryColorName.trim()) {
        colorData.secondaryName = secondaryColorName.trim();
        colorData.secondaryHex = secondaryColorHex;
      }

      onSave(colorData);
      onClose();
      setCustomColorName("");
      setCustomColorHex("#000000");
      setHasSecondaryColor(false);
      setSecondaryColorName("");
      setSecondaryColorHex("#FFFFFF");
    }
  };

  const handleClose = () => {
    setMode("predefined");
    setSelectedColor(null);
    setCustomColorName("");
    setCustomColorHex("#000000");
    setHasSecondaryColor(false);
    setSecondaryColorName("");
    setSecondaryColorHex("#FFFFFF");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-lg w-[420px] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-semibold text-[#1a1a2e]">
            {mode === "predefined" ? "Add Predefined Color" : "Add Custom Color"}
          </h2>
          <button
            onClick={handleClose}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            <X className="size-4 text-[#667085]" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("predefined")}
            className={`flex-1 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              mode === "predefined"
                ? "bg-[#220e92] text-white"
                : "bg-[#f9fafb] text-[#475467] hover:bg-[#f2f4f7]"
            }`}
          >
            Predefined Colors
          </button>
          <button
            onClick={() => setMode("custom")}
            className={`flex-1 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              mode === "custom"
                ? "bg-[#220e92] text-white"
                : "bg-[#f9fafb] text-[#475467] hover:bg-[#f2f4f7]"
            }`}
          >
            Custom Color
          </button>
        </div>

        {/* Content */}
        {mode === "predefined" ? (
          <div className="space-y-4">
            <Label className="text-[13px] text-[#475467]">
              Select a color
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    selectedColor?.name === color.name
                      ? "border-[#220e92] bg-[#f9f5ff]"
                      : "border-[#eef0f4] hover:border-[#d0d5dd]"
                  }`}
                >
                  <div
                    className="size-8 rounded-full"
                    style={{
                      backgroundColor: color.hex,
                      border: color.hex === "#FFFFFF" ? "1px solid #e0e0e0" : "none",
                    }}
                  />
                  <span className="text-[11px] text-[#475467] text-center">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-[13px] text-[#475467] mb-1.5 block">
                Primary Color Name
              </Label>
              <Input
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
                placeholder="e.g., Navy Blue, Maroon"
                className="h-10 rounded-lg border-[#d0d5dd] text-[13px]"
              />
            </div>
            <div>
              <Label className="text-[13px] text-[#475467] mb-1.5 block">
                Primary Color Preview
              </Label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="size-12 rounded-lg border-2 border-[#d0d5dd] cursor-pointer"
                />
                <Input
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  placeholder="#000000"
                  className="h-10 flex-1 rounded-lg border-[#d0d5dd] text-[13px] font-mono"
                />
              </div>
            </div>

            {/* Secondary color toggle */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#eef0f4]">
              <input
                type="checkbox"
                id="hasSecondaryColor"
                checked={hasSecondaryColor}
                onChange={(e) => setHasSecondaryColor(e.target.checked)}
                className="size-4 rounded border-[#d0d5dd] text-[#220e92] focus:ring-[#220e92] cursor-pointer"
              />
              <label
                htmlFor="hasSecondaryColor"
                className="text-[13px] text-[#475467] cursor-pointer"
              >
                Add secondary color
              </label>
            </div>

            {/* Secondary color fields */}
            {hasSecondaryColor && (
              <>
                <div>
                  <Label className="text-[13px] text-[#475467] mb-1.5 block">
                    Secondary Color Name
                  </Label>
                  <Input
                    value={secondaryColorName}
                    onChange={(e) => setSecondaryColorName(e.target.value)}
                    placeholder="e.g., White, Gold"
                    className="h-10 rounded-lg border-[#d0d5dd] text-[13px]"
                  />
                </div>
                <div>
                  <Label className="text-[13px] text-[#475467] mb-1.5 block">
                    Secondary Color Preview
                  </Label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={secondaryColorHex}
                      onChange={(e) => setSecondaryColorHex(e.target.value)}
                      className="size-12 rounded-lg border-2 border-[#d0d5dd] cursor-pointer"
                    />
                    <Input
                      value={secondaryColorHex}
                      onChange={(e) => setSecondaryColorHex(e.target.value)}
                      placeholder="#FFFFFF"
                      className="h-10 flex-1 rounded-lg border-[#d0d5dd] text-[13px] font-mono"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end mt-6">
          <Button
            onClick={handleClose}
            variant="outline"
            className="h-10 px-4 rounded-lg border-[#d0d5dd] text-[13px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              mode === "predefined"
                ? !selectedColor
                : !customColorName.trim()
            }
            className="h-10 px-4 rounded-lg bg-[#220e92] hover:bg-[#1a0a73] text-white text-[13px]"
          >
            Add Color
          </Button>
        </div>
      </div>
    </div>
  );
}
