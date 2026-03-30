import { useState, useRef } from "react";
import { Plus, X, Upload, Tag } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

interface Brand {
  id: string;
  name: string;
  image: string;
}

const INITIAL_BRANDS: Brand[] = [
  { id: "b1", name: "Sabyasachi", image: "https://images.unsplash.com/photo-1769766408016-38b111720e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwYnJhbmQlMjBzdG9yZWZyb250fGVufDF8fHx8MTc3MzA1OTIzOXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b2", name: "Fabindia", image: "https://images.unsplash.com/photo-1763971922552-fa9cbe06db7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBldGhuaWMlMjBjbG90aGluZyUyMGJvdXRpcXVlfGVufDF8fHx8MTc3MzA1OTIzOXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b3", name: "Manyavar", image: "https://images.unsplash.com/photo-1747485012312-8de08a87205e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXJlZSUyMHNpbGslMjBmYWJyaWMlMjBjb2xsZWN0aW9uJTIwZGlzcGxheXxlbnwxfHx8fDE3NzMwNTQ5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b4", name: "Biba", image: "https://images.unsplash.com/photo-1760537826554-b8701b24ba30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwYnJhbmQlMjBtaW5pbWFsJTIwbG9nb3xlbnwxfHx8fDE3NzMwNTQ5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b5", name: "W for Woman", image: "https://images.unsplash.com/photo-1763971922539-7833df0b71c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBicmFuZCUyMHRleHRpbGUlMjBkaXNwbGF5fGVufDF8fHx8MTc3MzA1NDk3Mnww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b6", name: "Anita Dongre", image: "https://images.unsplash.com/photo-1769981281734-4d8cf9fe7b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGZhc2hpb24lMjBjb2xsZWN0aW9uJTIwZGlzcGxheXxlbnwxfHx8fDE3NzMwNTkyMzl8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b7", name: "Raymond", image: "https://images.unsplash.com/photo-1760287364328-e30221615f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhuaWMlMjBjbG90aGluZyUyMGJyYW5kJTIwYm91dGlxdWUlMjBkaXNwbGF5fGVufDF8fHx8MTc3MzA1NDk3MXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b8", name: "Kalyan Silks", image: "https://images.unsplash.com/photo-1767854808145-5adfb3866ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGJvdXRpcXVlJTIwZmFzaGlvbiUyMHN0b3JlJTIwZnJvbnR8ZW58MXx8fHwxNzczMDU0OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b9", name: "Nalli Silks", image: "https://images.unsplash.com/photo-1765009433753-c7462637d21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjByYWNrJTIwbW9kZXJuJTIwc3RvcmV8ZW58MXx8fHwxNzczMDU0OTc0fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b10", name: "Taneira", image: "https://images.unsplash.com/photo-1767334010488-83cdb8539273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBmYXNoaW9uJTIwYnJhbmQlMjBhcHBhcmVsJTIwZGlzcGxheXxlbnwxfHx8fDE3NzMwNTQ5NzR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b11", name: "Ritu Kumar", image: "https://images.unsplash.com/photo-1616756351484-798f37bdffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2FyZWUlMjBmYWJyaWMlMjBpbmRpYW58ZW58MXx8fHwxNzcyODAwMDMzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "b12", name: "Meena Bazaar", image: "https://images.unsplash.com/photo-1599584082894-52c6d8fc48c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZ28lMjBrdXJ0aSUyMGluZGlhbiUyMGZhc2hpb258ZW58MXx8fHwxNzcyODAwMDM5fDA&ixlib=rb-4.1.0&q=80&w=1080" },
];

const cardClass = "bg-card rounded-[12px] border border-border shadow-sm";
const inputClass = "w-full px-3 py-2.5 rounded-[10px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#220E92]/20 focus:border-[#220E92]";
const inputStyle = { fontSize: "13px" } as const;

export function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formImage, setFormImage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormName("");
    setFormImage("");
    setShowAddModal(false);
  };

  const handleAdd = () => {
    if (!formName.trim() || !formImage.trim()) return;
    const newBrand: Brand = {
      id: `b-${Date.now()}`,
      name: formName.trim(),
      image: formImage.trim(),
    };
    setBrands(prev => [newBrand, ...prev]);
    resetForm();
  };

  const handleFileToDataUrl = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) callback(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Brands</h1>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
            {brands.length} brands on the marketplace
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="inline-flex items-center gap-2 bg-[#220E92] text-white px-5 py-2.5 rounded-[10px] hover:bg-[#220E92]/90 transition-colors shadow-sm"
          style={{ fontSize: "14px", fontWeight: 500 }}
        >
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      {/* Brand Grid */}
      {brands.length === 0 ? (
        <div className={`${cardClass} p-16 text-center`}>
          <Tag className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p style={{ fontSize: "15px", fontWeight: 600 }}>No brands yet</p>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
            Add your first brand to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <div key={brand.id} className={`${cardClass} overflow-hidden group hover:shadow-md transition-shadow`}>
              <div className="aspect-square overflow-hidden bg-muted">
                <ImageWithFallback
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="px-3 py-3 text-center">
                <p className="truncate" style={{ fontSize: "14px", fontWeight: 600 }}>{brand.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={resetForm} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-[12px] border border-border shadow-2xl w-full max-w-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Add Brand</h2>
                <button onClick={resetForm} className="p-1.5 rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Image */}
                <div>
                  <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 600 }}>Brand Image *</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileToDataUrl(file, setFormImage);
                    }}
                  />
                  {!formImage ? (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full py-8 border-2 border-dashed border-border rounded-[10px] text-muted-foreground hover:border-[#220E92]/40 hover:text-foreground transition-colors flex flex-col items-center gap-2"
                      style={{ fontSize: "12px" }}
                    >
                      <Upload className="w-5 h-5" />
                      Click to upload brand image
                    </button>
                  ) : (
                    <div className="mt-2 w-24 h-24 rounded-[10px] overflow-hidden relative mx-auto">
                      <ImageWithFallback src={formImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setFormImage("")}
                        className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded-full hover:bg-black/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 600 }}>Brand Name *</label>
                  <input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sabyasachi"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="px-5 py-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-[10px] border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!formName.trim() || !formImage.trim()}
                  className="px-5 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  Add Brand
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}