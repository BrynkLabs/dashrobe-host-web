import { useState } from "react";
import { Plus, Trash2, ChevronDown, Ruler, Lock } from "lucide-react";
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

const COLS = [
  { key: "size" as const, label: "Size", width: "w-16" },
  { key: "chest" as const, label: "Chest", width: "w-20" },
  { key: "length" as const, label: "Length", width: "w-20" },
  { key: "shoulder" as const, label: "Shoulder", width: "w-20" },
  { key: "sleeve" as const, label: "Sleeve", width: "w-20" },
  { key: "collar" as const, label: "Collar", width: "w-20" },
];

export function SizeChartBuilder({
  isEnabled,
  savedCharts,
  selectedChartId,
  onSelectChart,
  onSaveChart,
}: SizeChartBuilderProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [chartName, setChartName] = useState("");
  const [unit, setUnit] = useState<"cm" | "inch">("inch");
  const [rows, setRows] = useState<SizeChartRow[]>([]);
  const [nameError, setNameError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedChart = savedCharts.find((c) => c.id === selectedChartId);

  // ── helpers ────────────────────────────────────────────────────────────────
  const startCreating = () => {
    setIsCreating(true);
    setChartName("");
    setUnit("inch");
    setRows([makeRow()]);
    setNameError("");
    onSelectChart(null);
    setIsDropdownOpen(false);
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setChartName("");
    setRows([]);
    setNameError("");
    // restore previous selection if any
    if (savedCharts.length > 0) {
      onSelectChart(savedCharts[savedCharts.length - 1].id);
    }
  };

  const makeRow = (): SizeChartRow => ({
    id: `${Date.now()}-${Math.random()}`,
    size: "",
    chest: "",
    length: "",
    shoulder: "",
    sleeve: "",
    collar: "",
  });

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
    const duplicate = savedCharts.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      setNameError("A chart with this name already exists");
      return;
    }

    const chart: SavedSizeChart = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      unit,
      rows,
    };
    onSaveChart(chart);
    onSelectChart(chart.id);
    setIsCreating(false);
    setChartName("");
    setRows([]);
    setNameError("");
  };

  const unitLabel = (u: "cm" | "inch") => (u === "cm" ? "CM" : "IN");
  const displayUnit = isCreating ? unit : selectedChart?.unit ?? "inch";
  const displayRows = isCreating ? rows : selectedChart?.rows ?? [];

  // ── render ─────────────────────────────────────────────────────────────────

  // 1. Disabled state
  if (!isEnabled) {
    return (
      <div className="flex items-start gap-3 p-4 bg-[#f9fafb] border border-dashed border-[#d0d5dd] rounded-xl">
        <div className="size-8 rounded-lg bg-[#f2f4f7] flex items-center justify-center shrink-0 mt-0.5">
          <Lock className="size-4 text-[#98a2b3]" />
        </div>
        <div>
          <p className="text-[13px] text-[#344054]" style={{ fontWeight: 500 }}>
            Size chart locked
          </p>
          <p className="text-[12px] text-[#98a2b3] mt-0.5">
            Select gender, category and subcategory to unlock size charts.
          </p>
        </div>
      </div>
    );
  }

  // 2. Enabled — empty, nothing selected, not creating
  if (savedCharts.length === 0 && !isCreating) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 px-6 border-2 border-dashed border-[#e4e7ec] rounded-xl text-center">
        <div className="size-10 rounded-full bg-[#f2f4f7] flex items-center justify-center">
          <Ruler className="size-5 text-[#98a2b3]" />
        </div>
        <div>
          <p className="text-[14px] text-[#344054]" style={{ fontWeight: 500 }}>
            No size chart yet
          </p>
          <p className="text-[12px] text-[#98a2b3] mt-0.5">
            Add a size chart to help buyers pick the right size.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreating}
          className="mt-1 flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#220e92] text-white text-[13px] hover:bg-[#1a0a73] transition-colors"
          style={{ fontWeight: 500 }}
        >
          <Plus className="size-4" />
          Add size chart
        </button>
      </div>
    );
  }

  // 3. Has saved charts, not creating — chart selector + read-only table
  if (savedCharts.length > 0 && !isCreating) {
    return (
      <div className="space-y-4">
        {/* Chart selector row */}
        <div className="flex items-center gap-3">
          {/* Dropdown */}
          <div className="relative flex-1 max-w-[280px]">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="w-full h-10 px-3 rounded-lg border border-[#d0d5dd] bg-white text-[13px] flex items-center justify-between hover:border-[#220e92] transition-colors"
            >
              <span className="text-[#1a1a2e]" style={{ fontWeight: 500 }}>
                {selectedChart?.name ?? "Select a chart"}
              </span>
              <ChevronDown
                className={`size-4 text-[#667085] transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg border border-[#d0d5dd] shadow-lg z-20 overflow-hidden">
                {savedCharts.map((chart) => (
                  <button
                    key={chart.id}
                    type="button"
                    onClick={() => {
                      onSelectChart(chart.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 text-[13px] text-left flex items-center justify-between hover:bg-[#f9fafb] transition-colors ${
                      selectedChart?.id === chart.id
                        ? "bg-[#f0ebff] text-[#220e92]"
                        : "text-[#1a1a2e]"
                    }`}
                  >
                    <span>{chart.name}</span>
                    <span className="text-[11px] text-[#98a2b3] uppercase">
                      {unitLabel(chart.unit)}
                    </span>
                  </button>
                ))}
                <div className="border-t border-[#eef0f4]">
                  <button
                    type="button"
                    onClick={startCreating}
                    className="w-full px-3 py-2.5 text-[13px] text-[#220e92] text-left flex items-center gap-1.5 hover:bg-[#f9fafb] transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <Plus className="size-3.5" />
                    Create new chart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Unit badge */}
          {selectedChart && (
            <span className="px-2.5 py-1 rounded-md bg-[#f0ebff] text-[#220e92] text-[12px] border border-[#e9d5ff]" style={{ fontWeight: 500 }}>
              {unitLabel(selectedChart.unit)}
            </span>
          )}
        </div>

        {/* Read-only table */}
        {selectedChart && selectedChart.rows.length > 0 && (
          <SizeTable
            rows={selectedChart.rows}
            unit={selectedChart.unit}
            readonly
          />
        )}

        {selectedChart && selectedChart.rows.length === 0 && (
          <p className="text-[13px] text-[#98a2b3] italic py-4">
            This chart has no size rows.
          </p>
        )}
      </div>
    );
  }

  // 4. Creating
  return (
    <div className="space-y-5">
      {/* Form header */}
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-full bg-[#220e92] flex items-center justify-center shrink-0">
          <Ruler className="size-3.5 text-white" />
        </div>
        <span className="text-[14px] text-[#1a1a2e]" style={{ fontWeight: 600 }}>
          Create size chart
        </span>
      </div>

      {/* Chart name */}
      <div className="space-y-1.5">
        <label className="text-[12px] text-[#475467]" style={{ fontWeight: 500 }}>
          Chart name <span className="text-red-500">*</span>
        </label>
        <Input
          value={chartName}
          onChange={(e) => {
            setChartName(e.target.value);
            setNameError("");
          }}
          placeholder="e.g. Men S–XXL, Kids 2–12 yrs"
          className={`h-10 rounded-lg text-[13px] ${
            nameError ? "border-red-400 focus-visible:ring-red-300" : "border-[#d0d5dd]"
          }`}
        />
        {nameError && (
          <p className="text-[12px] text-red-500">{nameError}</p>
        )}
      </div>

      {/* Measurement unit */}
      <div className="space-y-2">
        <label className="text-[12px] text-[#475467]" style={{ fontWeight: 500 }}>
          Measurement unit
        </label>
        <div className="flex gap-2">
          {(["cm", "inch"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`px-5 py-2 rounded-lg text-[13px] transition-colors border ${
                unit === u
                  ? "bg-[#220e92] text-white border-[#220e92]"
                  : "bg-white text-[#475467] border-[#d0d5dd] hover:border-[#220e92] hover:text-[#220e92]"
              }`}
              style={{ fontWeight: 500 }}
            >
              {u === "cm" ? "CM" : "Inch"}
            </button>
          ))}
        </div>
      </div>

      {/* Size rows table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[12px] text-[#475467]" style={{ fontWeight: 500 }}>
            Size rows
            <span className="ml-1.5 text-[#98a2b3]">
              ({rows.length}/12)
            </span>
          </label>
        </div>

        {rows.length === 0 ? (
          <div className="border-2 border-dashed border-[#e4e7ec] rounded-xl p-8 text-center">
            <p className="text-[13px] text-[#98a2b3] mb-3">
              No rows yet — click below to add your first size.
            </p>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1.5 px-4 h-8 rounded-lg border border-[#d0d5dd] text-[12px] text-[#475467] hover:border-[#220e92] hover:text-[#220e92] transition-colors"
              style={{ fontWeight: 500 }}
            >
              <Plus className="size-3.5" />
              Add first row
            </button>
          </div>
        ) : (
          <SizeTable
            rows={rows}
            unit={unit}
            readonly={false}
            onUpdate={updateRow}
            onRemove={removeRow}
          />
        )}

        {rows.length > 0 && rows.length < 12 && (
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1.5 text-[#220e92] text-[12px] hover:text-[#1a0a73] transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Plus className="size-3.5" />
            Add row{rows.length >= 12 ? " (max 12)" : ""}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#eef0f4]" />

      {/* Bottom actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={cancelCreating}
          className="px-5 h-9 rounded-lg border border-[#d0d5dd] text-[13px] text-[#475467] hover:bg-[#f9fafb] transition-colors"
          style={{ fontWeight: 500 }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={saveChart}
          className="px-5 h-9 rounded-lg bg-[#220e92] text-white text-[13px] hover:bg-[#1a0a73] transition-colors"
          style={{ fontWeight: 600 }}
        >
          Save chart
        </button>
      </div>
    </div>
  );
}

// ── Shared table component (readonly + editable) ────────────────────────────
function SizeTable({
  rows,
  unit,
  readonly,
  onUpdate,
  onRemove,
}: {
  rows: SizeChartRow[];
  unit: "cm" | "inch";
  readonly: boolean;
  onUpdate?: (id: string, field: keyof SizeChartRow, value: string) => void;
  onRemove?: (id: string) => void;
}) {
  const u = unit === "cm" ? "CM" : "IN";

  return (
    <div className="overflow-x-auto rounded-xl border border-[#eef0f4]">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="bg-[#f9fafb] border-b border-[#eef0f4]">
            {COLS.map((col) => (
              <th
                key={col.key}
                className="text-left py-2.5 px-3 whitespace-nowrap text-[#667085]"
                style={{ fontWeight: 500, fontSize: 11, letterSpacing: "0.04em" }}
              >
                {col.key === "size"
                  ? "SIZE"
                  : `${col.label.toUpperCase()} (${u})`}
              </th>
            ))}
            {!readonly && <th className="w-8" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[#eef0f4] last:border-0 hover:bg-[#fafafa] transition-colors"
            >
              {COLS.map((col) => (
                <td key={col.key} className="py-2 px-2.5">
                  {readonly ? (
                    <span className="text-[#1a1a2e] px-1">
                      {row[col.key] || <span className="text-[#d0d5dd]">—</span>}
                    </span>
                  ) : (
                    <Input
                      value={row[col.key]}
                      onChange={(e) =>
                        onUpdate?.(row.id, col.key, e.target.value)
                      }
                      placeholder="—"
                      type={col.key === "size" ? "text" : "number"}
                      step="0.1"
                      className={`h-8 text-[11px] rounded-md border-[#d0d5dd] ${col.width}`}
                    />
                  )}
                </td>
              ))}
              {!readonly && (
                <td className="py-2 px-1.5">
                  <button
                    type="button"
                    onClick={() => onRemove?.(row.id)}
                    className="size-7 flex items-center justify-center rounded-md text-[#98a2b3] hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Remove row"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
