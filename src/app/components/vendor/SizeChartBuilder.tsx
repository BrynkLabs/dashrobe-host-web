import { useState, useImperativeHandle, forwardRef } from "react";
import { Plus, X, Lock } from "lucide-react";
import { Input } from "../ui/input";

export interface SizeChartRow {
  id: string;
  size: string;
  chest: string;
  length: string;
  shoulder: string;
  sleeve: string;
  collar: string;
}

export interface SavedSizeChart {
  id: string;
  name: string;
  unit: "cm" | "inch";
  rows: SizeChartRow[];
}

interface SizeChartBuilderProps {
  isEnabled: boolean;
  savedCharts: SavedSizeChart[];
  selectedChartId: string | null;
  onSelectChart: (chartId: string | null) => void;
  onSaveChart: (chart: SavedSizeChart) => void;
}

const COLS: { key: keyof Omit<SizeChartRow, "id">; label: string }[] = [
  { key: "size", label: "Size" },
  { key: "chest", label: "Chest" },
  { key: "length", label: "Length" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve", label: "Sleeve" },
  { key: "collar", label: "Collar" },
];

export interface SizeChartBuilderRef {
  save: () => void;
}

export const SizeChartBuilder = forwardRef<SizeChartBuilderRef, SizeChartBuilderProps>(function SizeChartBuilder({
  isEnabled,
  savedCharts,
  selectedChartId,
  onSelectChart,
  onSaveChart,
}, ref) {
  const [chartName, setChartName] = useState("");
  const [unit, setUnit] = useState<"cm" | "inch">("cm");
  const [rows, setRows] = useState<SizeChartRow[]>([makeRow()]);
  const [nameError, setNameError] = useState("");

  useImperativeHandle(ref, () => ({ save: saveChart }));

  function makeRow(): SizeChartRow {
    return {
      id: `${Date.now()}-${Math.random()}`,
      size: "", chest: "", length: "", shoulder: "", sleeve: "", collar: "",
    };
  }

  const addRow = () => {
    if (rows.length >= 12) return;
    setRows([...rows, makeRow()]);
  };

  const updateRow = (id: string, field: keyof SizeChartRow, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const removeRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const saveChart = () => {
    const name = chartName.trim();
    if (!name) {
      setNameError("Chart name is required");
      return;
    }
    if (savedCharts.find((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setNameError("A chart with this name already exists");
      return;
    }
    const chart: SavedSizeChart = {
      id: `${Date.now()}-${Math.random()}`,
      name, unit, rows,
    };
    onSaveChart(chart);
    onSelectChart(chart.id);
    setChartName("");
    setRows([makeRow()]);
    setNameError("");
  };

  const unitSuffix = unit === "cm" ? "CM" : "IN";

  if (!isEnabled) {
    return (
      <div className="flex items-start gap-3 p-4 bg-[#f9fafb] border border-dashed border-[#d0d5dd] rounded-xl">
        <div className="size-8 rounded-lg bg-[#f2f4f7] flex items-center justify-center shrink-0 mt-0.5">
          <Lock className="size-4 text-[#98a2b3]" />
        </div>
        <div>
          <p className="text-[13px] text-[#344054]" style={{ fontWeight: 500 }}>Size chart locked</p>
          <p className="text-[12px] text-[#98a2b3] mt-0.5">Select gender, category and subcategory to unlock size charts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Chart name + Unit toggle row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-[400px]">
          <Input
            value={chartName}
            onChange={(e) => { setChartName(e.target.value); setNameError(""); }}
            placeholder="Enter chart name"
            className={`h-11 rounded-xl bg-[#f2f4f7] border-0 text-[13px] placeholder:text-[#98a2b3] ${nameError ? "ring-1 ring-red-400" : ""}`}
          />
          {nameError && <p className="text-[12px] text-red-500 mt-1">{nameError}</p>}
        </div>
        <div className="flex rounded-xl border border-[#d0d5dd] overflow-hidden shrink-0">
          {(["cm", "inch"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`px-5 py-2.5 text-[13px] transition-colors ${
                unit === u
                  ? "bg-white text-[#1a1a2e] shadow-sm"
                  : "bg-[#f9fafb] text-[#98a2b3] hover:text-[#475467]"
              }`}
              style={{ fontWeight: unit === u ? 600 : 400 }}
            >
              {u === "cm" ? "CM" : "Inch"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#eef0f4]">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#f2f4f7]">
              {COLS.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-3 px-4 whitespace-nowrap text-[#475467]"
                  style={{ fontWeight: 600, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}
                >
                  {col.key === "size" ? "SIZE" : `${col.label.toUpperCase()} (${unitSuffix})`}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#eef0f4] hover:bg-[#fafafa] transition-colors">
                {COLS.map((col) => (
                  <td key={col.key} className="py-2.5 px-4">
                    <input
                      value={row[col.key]}
                      onChange={(e) => updateRow(row.id, col.key, e.target.value)}
                      placeholder="–"
                      className="w-full bg-transparent text-[13px] text-[#1a1a2e] placeholder:text-[#d0d5dd] outline-none"
                    />
                  </td>
                ))}
                <td className="py-2.5 px-2">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="size-7 flex items-center justify-center rounded-md text-[#d0d5dd] hover:text-[#98a2b3] transition-colors"
                    title="Remove row"
                  >
                    <X className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[13px] text-[#98a2b3]">
                  No rows yet — click below to add your first size.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add size row */}
      {rows.length < 12 && (
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-[#220e92] text-[13px] hover:text-[#1a0a73] transition-colors"
          style={{ fontWeight: 600 }}
        >
          <Plus className="size-4" />
          Add size row
        </button>
      )}
    </div>
  );
});
