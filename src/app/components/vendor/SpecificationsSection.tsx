import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "../ui/input";

export interface Specification {
  id: string;
  title: string;
  details: string;
}

interface SpecificationsSectionProps {
  specifications: Specification[];
  onSpecificationsChange: (specifications: Specification[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SpecificationsSection({
  specifications,
  onSpecificationsChange,
  isOpen,
  onToggle,
}: SpecificationsSectionProps) {
  const addSpecification = () => {
    const newSpec: Specification = {
      id: `${Date.now()}-${Math.random()}`,
      title: "",
      details: "",
    };
    onSpecificationsChange([...specifications, newSpec]);
  };

  const updateSpecification = (
    id: string,
    field: keyof Specification,
    value: string
  ) => {
    const updatedSpecs = specifications.map((spec) =>
      spec.id === id ? { ...spec, [field]: value } : spec
    );
    onSpecificationsChange(updatedSpecs);
  };

  const removeSpecification = (id: string) => {
    onSpecificationsChange(specifications.filter((spec) => spec.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-[#eef0f4] p-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full group"
      >
        <h2 className="text-[15px] font-semibold text-[#1a1a2e]">
          Clothing Specifications
        </h2>
        <div className="text-[#475467] group-hover:text-[#220e92] transition-colors">
          {isOpen ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {specifications.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[13px] text-[#98a2b3] mb-3">
                No specifications added yet
              </p>
              <button
                onClick={addSpecification}
                className="text-[#220e92] text-[12px] font-medium flex items-center gap-1 mx-auto hover:text-[#1a0a73] transition-colors"
              >
                <Plus className="size-3" />
                Add specification
              </button>
            </div>
          ) : (
            <>
              {specifications.map((spec, index) => (
                <div
                  key={spec.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start p-3 bg-[#f9fafb] rounded-lg border border-[#eef0f4]"
                >
                  <Input
                    value={spec.title}
                    onChange={(e) =>
                      updateSpecification(spec.id, "title", e.target.value)
                    }
                    placeholder="Title (e.g., Fabric)"
                    className="h-10 rounded-lg border-[#d0d5dd] text-[13px] bg-white"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={spec.details}
                      onChange={(e) =>
                        updateSpecification(spec.id, "details", e.target.value)
                      }
                      placeholder="Details (e.g., 100% Cotton)"
                      className="h-10 flex-1 rounded-lg border-[#d0d5dd] text-[13px] bg-white"
                    />
                    <button
                      onClick={() => removeSpecification(spec.id)}
                      className="size-10 flex items-center justify-center text-[#667085] hover:text-red-600 transition-colors"
                      title="Remove specification"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addSpecification}
                className="text-[#220e92] text-[12px] font-medium flex items-center gap-1 hover:text-[#1a0a73] transition-colors"
              >
                <Plus className="size-3" />
                Add more specifications
              </button>
            </>
          )}

          {/* Suggested specifications */}
          {specifications.length === 0 && (
            <div className="mt-4 pt-4 border-t border-[#eef0f4]">
              <p className="text-[11px] text-[#98a2b3] mb-2">
                Suggested specifications:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Fabric",
                  "Care Instructions",
                  "Country of Origin",
                  "Pattern",
                  "Sleeve Length",
                  "Neck Type",
                  "Fit",
                  "Occasion",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      const newSpec: Specification = {
                        id: `${Date.now()}-${Math.random()}`,
                        title: suggestion,
                        details: "",
                      };
                      onSpecificationsChange([...specifications, newSpec]);
                    }}
                    className="px-2 py-1 rounded text-[11px] bg-[#f9fafb] text-[#475467] hover:bg-[#220e92] hover:text-white transition-colors border border-[#eef0f4]"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
