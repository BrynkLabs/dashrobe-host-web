import { useState, useRef } from "react";
import {
  Settings, Bell, Volume2, Vibrate, Smartphone, Zap, Store,
  Save, Globe, Clock, Copy, MapPin, Navigation, Upload, Image,
  Palette, Link2, Instagram, Facebook, Twitter, Youtube, Trash2,
  Plus, X,
} from "lucide-react";
import { Switch } from "../../components/ui/switch";

interface DaySchedule {
  day: string;
  shortDay: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const defaultSchedule: DaySchedule[] = [
  { day: "Monday", shortDay: "Mon", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Tuesday", shortDay: "Tue", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Wednesday", shortDay: "Wed", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Thursday", shortDay: "Thu", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Friday", shortDay: "Fri", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Saturday", shortDay: "Sat", isOpen: true, openTime: "10:00", closeTime: "20:00" },
  { day: "Sunday", shortDay: "Sun", isOpen: false, openTime: "", closeTime: "" },
];

const STORE_IMAGE = "https://images.unsplash.com/photo-1765009433753-c7462637d21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBjbG90aGluZyUyMHN0b3JlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyMTA3NDQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function VendorSettings() {
  const [shopOpen, setShopOpen] = useState(true);
  const [sirenOn, setSirenOn] = useState(true);
  const [vibrationOn, setVibrationOn] = useState(true);
  const [pushOn, setPushOn] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule);

  // Location state
  const [address, setAddress] = useState({
    line1: "42, MG Road, Indiranagar",
    line2: "Above Cafe Coffee Day, 2nd Floor",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    country: "India",
    landmark: "Near 100 Feet Road Signal",
    lat: "12.9716",
    lng: "77.5946",
  });
  const [deliveryRadius, setDeliveryRadius] = useState("15");
  const [storeType, setStoreType] = useState("physical");

  // Brand state
  const [brandLogo, setBrandLogo] = useState<string | null>(null);
  const [storefrontImages, setStorefrontImages] = useState<(string | null)[]>([null, null, null]);
  const [brandName, setBrandName] = useState("StyleCraft India");
  const [tagline, setTagline] = useState("Crafting elegance for the modern Indian woman");
  const [brandDescription, setBrandDescription] = useState("Premium ethnic and contemporary fashion brand crafting elegance for the modern Indian woman. We blend traditional craftsmanship with modern design sensibilities.");
  const [deliveryTimeMin, setDeliveryTimeMin] = useState("30");
  const [deliveryTimeMax, setDeliveryTimeMax] = useState("45");
  const [deliveryTimeUnit, setDeliveryTimeUnit] = useState("minutes");
  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/stylecraftindia",
    facebook: "https://facebook.com/stylecraftindia",
    twitter: "",
    youtube: "",
    website: "https://stylecraftindia.com",
  });
  const [returnPolicy, setReturnPolicy] = useState("7-day easy returns on all products. Items must be in original condition with tags intact.");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const storefrontInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const tabs = [
    { id: "general", label: "General" },
    { id: "location", label: "Location" },
    { id: "brand", label: "Brand" },
    { id: "alerts", label: "Order Alerts" },
    { id: "store", label: "Store Status" },
  ];

  const updateSchedule = (index: number, field: keyof DaySchedule, value: string | boolean) => {
    setSchedule((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const applyToAll = (index: number) => {
    const source = schedule[index];
    setSchedule((prev) =>
      prev.map((s) =>
        s.isOpen
          ? { ...s, openTime: source.openTime, closeTime: source.closeTime }
          : s
      )
    );
  };

  const openDaysCount = schedule.filter((s) => s.isOpen).length;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleStorefrontUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStorefrontImages(prev => prev.map((img, i) => i === index ? reader.result as string : img));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeStorefrontImage = (index: number) => {
    setStorefrontImages(prev => prev.map((img, i) => i === index ? null : img));
  };

  const labelClass = "block text-muted-foreground mb-1.5";
  const labelStyle = { fontSize: "13px", fontWeight: 500 } as const;
  const inputClass = "w-full px-3 py-2.5 rounded-[10px] border border-border bg-background";
  const inputStyle = { fontSize: "14px" } as const;
  const cardClass = "bg-card rounded-[12px] border border-border shadow-sm p-6 space-y-5";
  const saveClass = "inline-flex items-center gap-2 bg-[#220E92] text-white px-5 py-2.5 rounded-[10px] hover:bg-[#220E92]/90 transition-colors shadow-sm";
  const saveStyle = { fontSize: "14px", fontWeight: 500 } as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Settings</h1>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
          Manage store settings, location, branding, and notifications
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-[10px] p-1 w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === t.id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════ GENERAL TAB ═══════════════ */}
      {activeTab === "general" && (
        <div className={cardClass}>
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={labelStyle}>Store Name</label>
              <input type="text" defaultValue="StyleCraft India" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Contact Email</label>
              <input type="email" defaultValue="vendor@stylecraft.in" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Phone</label>
              <input type="tel" defaultValue="+91 98765 43210" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Timezone</label>
              <select className={`${inputClass} appearance-none`} style={inputStyle}>
                <option>Asia/Kolkata (IST)</option>
                <option>America/New_York (EST)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} style={labelStyle}>Store Description</label>
              <textarea rows={3} defaultValue="Premium ethnic and contemporary fashion for the modern Indian woman." className={`${inputClass} resize-none`} style={inputStyle} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button className={saveClass} style={saveStyle}>
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ LOCATION TAB ═══════════════ */}
      {activeTab === "location" && (
        <div className="space-y-5">
          {/* Store Type */}
          <div className={cardClass}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-[#220E92]" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Store Type</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>How do you operate your store?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "physical", label: "Physical Store", desc: "Brick & mortar location" },
                { id: "online", label: "Online Only", desc: "No physical storefront" },
                { id: "hybrid", label: "Hybrid", desc: "Both physical & online" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setStoreType(t.id)}
                  className={`p-4 rounded-[10px] border-2 text-left transition-all ${
                    storeType === t.id
                      ? "border-[#220E92] bg-[#220E92]/5"
                      : "border-border hover:border-[#220E92]/30"
                  }`}
                >
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>{t.label}</p>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className={cardClass}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#220E92]" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Store Address</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Your store's physical location details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass} style={labelStyle}>Address Line 1</label>
                <input
                  type="text"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Street address, shop number"
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass} style={labelStyle}>Address Line 2</label>
                <input
                  type="text"
                  value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Floor, building, complex name"
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>State / Province</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Pincode / ZIP</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Country</label>
                <select
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className={`${inputClass} appearance-none`}
                  style={inputStyle}
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass} style={labelStyle}>Landmark</label>
                <input
                  type="text"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Nearby landmark for easy navigation"
                />
              </div>
            </div>
          </div>

          {/* Map Preview + Coordinates */}
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/10 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-[#220E92]" />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Map Location</h3>
                  <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Pin your exact store location on the map</p>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" style={{ fontSize: "13px" }}>
                <Navigation className="w-3.5 h-3.5" /> Auto-detect
              </button>
            </div>

            {/* Map placeholder */}
            <div className="rounded-[10px] border border-border overflow-hidden bg-muted relative" style={{ height: "220px" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#220E92]/10 flex items-center justify-center mx-auto mb-2">
                    <MapPin className="w-6 h-6 text-[#220E92]" />
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 500 }}>Map Preview</p>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>
                    {address.lat}°N, {address.lng}°E
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
                    {address.line1}, {address.city}
                  </p>
                </div>
              </div>
              {/* Simulated map grid */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: "linear-gradient(#220E92 1px, transparent 1px), linear-gradient(90deg, #220E92 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Latitude</label>
                <input
                  type="text"
                  value={address.lat}
                  onChange={(e) => setAddress({ ...address, lat: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. 12.9716"
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Longitude</label>
                <input
                  type="text"
                  value={address.lng}
                  onChange={(e) => setAddress({ ...address, lng: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. 77.5946"
                />
              </div>
            </div>
          </div>

          {/* Delivery Zone */}
          <div className={cardClass}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#FFC100]/15 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#FFC100]" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Delivery Zone</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Set your serviceable delivery area</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Delivery Radius (km)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={deliveryRadius}
                    onChange={(e) => setDeliveryRadius(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    min="1"
                    max="100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "13px" }}>km</span>
                </div>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Serviceable Pincodes</label>
                <input
                  type="text"
                  defaultValue="560001 – 560100"
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Range or comma-separated"
                />
              </div>
            </div>

            {/* Radius visualization */}
            <div className="bg-muted/50 rounded-[10px] p-4">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 shrink-0">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#220E92]/20" />
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#220E92]/30" />
                  <div className="absolute inset-4 rounded-full bg-[#220E92]/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#220E92]" />
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>
                    {deliveryRadius} km radius from store
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                    Covers approximately {Math.round(Math.PI * Number(deliveryRadius) * Number(deliveryRadius))} sq. km area around {address.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button className={saveClass} style={saveStyle}>
                <Save className="w-4 h-4" /> Save Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ BRAND TAB ═══════════════ */}
      {activeTab === "brand" && (
        <div className="space-y-5">
          {/* Logo & Visual Identity */}
          <div className={cardClass}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/10 flex items-center justify-center">
                <Image className="w-5 h-5 text-[#220E92]" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Visual Identity</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Upload your brand logo and storefront images</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Brand Logo */}
              <div>
                <label className={labelClass} style={labelStyle}>Store Logo</label>
                <div
                  className="relative group border-2 border-dashed border-border rounded-[10px] overflow-hidden cursor-pointer hover:border-[#220E92]/40 transition-colors"
                  style={{ height: "140px" }}
                  onClick={() => logoInputRef.current?.click()}
                >
                  {brandLogo ? (
                    <>
                      <img src={brandLogo} alt="Logo" className="w-full h-full object-contain p-4" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white" style={{ fontSize: "12px", fontWeight: 500 }}>Change Logo</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setBrandLogo(null); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Upload Logo</p>
                      <p className="text-muted-foreground/60" style={{ fontSize: "10px" }}>PNG, SVG · 512×512px</p>
                    </div>
                  )}
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setBrandLogo)} />
                </div>
              </div>

            </div>

            {/* Storefront Images */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className={labelClass} style={{ ...labelStyle, marginBottom: 0 }}>Store Front Images</label>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Upload up to 3 images showcasing your storefront. These appear on your public store page.</p>
                </div>
                <span className="text-muted-foreground shrink-0" style={{ fontSize: "12px", fontWeight: 500 }}>
                  {storefrontImages.filter(Boolean).length} / 3
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {storefrontImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group border-2 border-dashed border-border rounded-[10px] overflow-hidden cursor-pointer hover:border-[#220E92]/40 transition-colors"
                    style={{ height: "160px" }}
                    onClick={() => storefrontInputRefs[idx]?.current?.click()}
                  >
                    {img ? (
                      <>
                        <img src={img} alt={`Storefront ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white" style={{ fontSize: "12px", fontWeight: 500 }}>Change Image</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeStorefrontImage(idx); }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white" style={{ fontSize: "10px", fontWeight: 500 }}>
                          Image {idx + 1}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#220E92]/8 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-[#220E92]" />
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Upload Image {idx + 1}</p>
                        <p className="text-muted-foreground/60" style={{ fontSize: "10px" }}>JPG, PNG · 800×600px</p>
                      </div>
                    )}
                    <input
                      ref={storefrontInputRefs[idx]}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleStorefrontUpload(e, idx)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Details */}
          <div className={cardClass}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-[#220E92]" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Brand Details</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Customize your store's brand appearance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} style={labelStyle}>Brand / Display Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Tagline / Slogan</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="A short line describing your brand"
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass} style={labelStyle}>Brand Description</label>
                <textarea
                  rows={4}
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                  placeholder="Describe your brand, what you sell, and what makes you unique..."
                />
                <p className="text-muted-foreground mt-1.5" style={{ fontSize: "11px" }}>
                  {brandDescription.length} / 500 characters
                </p>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Store Category</label>
                <select className={`${inputClass} appearance-none`} style={inputStyle}>
                  <option>Fashion & Apparel</option>
                  <option>Electronics</option>
                  <option>Home & Living</option>
                  <option>Beauty & Health</option>
                  <option>Food & Beverages</option>
                  <option>Sports & Outdoors</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className={cardClass}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-[#220E92]" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Social Links & Web</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Connect your brand's social profiles</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "website", icon: Globe, label: "Website", placeholder: "https://yourbrand.com" },
                { key: "instagram", icon: Instagram, label: "Instagram", placeholder: "https://instagram.com/..." },
                { key: "facebook", icon: Facebook, label: "Facebook", placeholder: "https://facebook.com/..." },
                { key: "twitter", icon: Twitter, label: "X (Twitter)", placeholder: "https://x.com/..." },
                { key: "youtube", icon: Youtube, label: "YouTube", placeholder: "https://youtube.com/@..." },
              ].map((s) => (
                <div key={s.key} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-muted flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      value={(socialLinks as any)[s.key]}
                      onChange={(e) => setSocialLinks({ ...socialLinks, [s.key]: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      placeholder={s.placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Time */}
          <div className={cardClass}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#FFC100]/15 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FFC100]" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Store Delivery Time</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Set the estimated delivery time shown to customers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Minimum Time</label>
                <input
                  type="number"
                  value={deliveryTimeMin}
                  onChange={(e) => setDeliveryTimeMin(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  min="1"
                  placeholder="e.g. 30"
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Maximum Time</label>
                <input
                  type="number"
                  value={deliveryTimeMax}
                  onChange={(e) => setDeliveryTimeMax(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  min="1"
                  placeholder="e.g. 45"
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Unit</label>
                <select
                  value={deliveryTimeUnit}
                  onChange={(e) => setDeliveryTimeUnit(e.target.value)}
                  className={`${inputClass} appearance-none`}
                  style={inputStyle}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>

            {/* Delivery Time Preview */}
            <div className="bg-muted/50 rounded-[10px] p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#220E92]/8 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#220E92]" />
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>CUSTOMER SEES</p>
                  <p style={{ fontSize: "15px", fontWeight: 600 }}>
                    Estimated Delivery: {deliveryTimeMin}–{deliveryTimeMax} {deliveryTimeUnit}
                  </p>
                </div>
              </div>
            </div>

            {Number(deliveryTimeMin) >= Number(deliveryTimeMax) && deliveryTimeMin && deliveryTimeMax && (
              <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-3 flex items-center gap-2">
                <span className="text-amber-600" style={{ fontSize: "13px", fontWeight: 500 }}>
                  ⚠ Minimum time should be less than maximum time
                </span>
              </div>
            )}
          </div>

          {/* Policies */}
          <div className={cardClass}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-[#220E92]" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Store Policies</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Define your store's return policy</p>
              </div>
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>Return Policy</label>
              <textarea
                rows={3}
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button className={saveClass} style={saveStyle}>
                <Save className="w-4 h-4" /> Save Brand Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ ALERTS TAB ═══════════════ */}
      {activeTab === "alerts" && (
        <div className={cardClass}>
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Order Alert Settings</h3>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
            Configure how you receive new order notifications
          </p>
          <div className="space-y-4">
            {[
              { label: "Siren Alert", desc: "Play a loud siren sound for new orders", icon: Volume2, value: sirenOn, setter: setSirenOn },
              { label: "Vibration", desc: "Vibrate device on new orders", icon: Vibrate, value: vibrationOn, setter: setVibrationOn },
              { label: "Push Notifications", desc: "Receive push notifications for new orders", icon: Smartphone, value: pushOn, setter: setPushOn },
              { label: "Auto-Accept Orders", desc: "Automatically accept all incoming orders", icon: Zap, value: autoAccept, setter: setAutoAccept },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between p-4 rounded-[10px] border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[10px] bg-muted flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500 }}>{s.label}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{s.desc}</p>
                  </div>
                </div>
                <Switch checked={s.value} onCheckedChange={s.setter} />
              </div>
            ))}
          </div>
          {autoAccept && (
            <div className="bg-[#FFC100]/10 rounded-[10px] p-4">
              <p style={{ fontSize: "13px", fontWeight: 500 }} className="text-[#220E92]">
                Auto-accept is enabled. All incoming orders will be automatically accepted without manual review.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ STORE STATUS TAB ═══════════════ */}
      {activeTab === "store" && (
        <div className="space-y-5">
          {/* Shop status banner */}
          <div
            className={`rounded-[12px] p-6 border shadow-sm ${
              shopOpen ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
                  shopOpen ? "bg-emerald-100" : "bg-red-100"
                }`}>
                  <Store className={`w-6 h-6 ${shopOpen ? "text-emerald-700" : "text-red-600"}`} />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
                    Store is {shopOpen ? "Open" : "Closed"}
                  </h3>
                  <p
                    className={shopOpen ? "text-emerald-700" : "text-red-600"}
                    style={{ fontSize: "13px" }}
                  >
                    {shopOpen
                      ? "Your store is accepting new orders"
                      : "Your store is offline. No new orders will be accepted."}
                  </p>
                </div>
              </div>
              <Switch checked={shopOpen} onCheckedChange={setShopOpen} />
            </div>
          </div>

          {/* Operating Hours - 7 days */}
          <div className="bg-card rounded-[12px] border border-border shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Operating Hours</h3>
                <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
                  Configure timings for each day of the week · {openDaysCount} days open
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground" style={{ fontSize: "13px" }}>
                  {openDaysCount === 7 ? "Open all week" : `${openDaysCount} of 7 days`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {schedule.map((s, i) => (
                <div
                  key={s.day}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-[10px] border transition-colors ${
                    s.isOpen ? "border-border bg-background" : "border-border/50 bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-3 w-full sm:w-40 shrink-0">
                    <Switch
                      checked={s.isOpen}
                      onCheckedChange={(val) => updateSchedule(i, "isOpen", val)}
                    />
                    <span
                      style={{ fontSize: "14px", fontWeight: s.isOpen ? 600 : 400 }}
                      className={!s.isOpen ? "text-muted-foreground" : ""}
                    >
                      {s.day}
                    </span>
                  </div>
                  {s.isOpen ? (
                    <div className="flex flex-1 items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={s.openTime}
                          onChange={(e) => updateSchedule(i, "openTime", e.target.value)}
                          className="px-2.5 py-2 rounded-lg border border-border bg-card"
                          style={{ fontSize: "14px" }}
                        />
                        <span className="text-muted-foreground" style={{ fontSize: "13px" }}>to</span>
                        <input
                          type="time"
                          value={s.closeTime}
                          onChange={(e) => updateSchedule(i, "closeTime", e.target.value)}
                          className="px-2.5 py-2 rounded-lg border border-border bg-card"
                          style={{ fontSize: "14px" }}
                        />
                      </div>
                      <button
                        onClick={() => applyToAll(i)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[#220E92] hover:bg-[#220E92]/5 transition-colors"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        title="Apply this timing to all open days"
                      >
                        <Copy className="w-3 h-3" /> Apply to all
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Closed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick presets */}
            <div className="pt-3 border-t border-border">
              <p className="text-muted-foreground mb-2" style={{ fontSize: "12px", fontWeight: 500 }}>QUICK PRESETS</p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: "All days 9 AM – 9 PM",
                    action: () => setSchedule((prev) =>
                      prev.map((s) => ({ ...s, isOpen: true, openTime: "09:00", closeTime: "21:00" }))
                    ),
                  },
                  {
                    label: "Weekdays only",
                    action: () => setSchedule((prev) =>
                      prev.map((s, i) => ({
                        ...s,
                        isOpen: i < 5,
                        openTime: i < 5 ? "09:00" : "",
                        closeTime: i < 5 ? "21:00" : "",
                      }))
                    ),
                  },
                  {
                    label: "Weekend off",
                    action: () => setSchedule((prev) =>
                      prev.map((s, i) => ({
                        ...s,
                        isOpen: i < 5,
                        openTime: i < 5 ? (s.openTime || "09:00") : "",
                        closeTime: i < 5 ? (s.closeTime || "21:00") : "",
                      }))
                    ),
                  },
                  {
                    label: "24/7",
                    action: () => setSchedule((prev) =>
                      prev.map((s) => ({ ...s, isOpen: true, openTime: "00:00", closeTime: "23:59" }))
                    ),
                  },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={preset.action}
                    className="px-3 py-1.5 rounded-[10px] border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    style={{ fontSize: "13px" }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button className={saveClass} style={saveStyle}>
                <Save className="w-4 h-4" /> Save Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}