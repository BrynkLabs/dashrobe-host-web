import { useState, useMemo, useRef } from "react";
import {
  Store, Package, Tag, Plus, X, Save, Eye,
  Trash2, Upload, Pencil,
  Percent, Sparkles, LayoutGrid, ChevronDown, Image,
  Star, MessageSquareQuote,
} from "lucide-react";

// ─── Mock data ──────────────────────────────────────
const MOCK_STORES = [
  { id: "s1", name: "Kanchipuram Weaves", city: "Chennai", category: "Sarees" },
  { id: "s2", name: "Priya Silks Emporium", city: "Varanasi", category: "Sarees" },
  { id: "s3", name: "Regal Ethnic Wear", city: "Jaipur", category: "Lehengas" },
  { id: "s4", name: "Bombay Fashion Hub", city: "Mumbai", category: "Western Wear" },
  { id: "s5", name: "Delhi Kurta House", city: "New Delhi", category: "Kurtas" },
  { id: "s6", name: "Lucknow Chikan Studio", city: "Lucknow", category: "Kurtis" },
  { id: "s7", name: "Mysore Silk Creations", city: "Mysuru", category: "Sarees" },
  { id: "s8", name: "Punjab Phulkari House", city: "Amritsar", category: "Dupattas" },
  { id: "s9", name: "Kolkata Handloom Co.", city: "Kolkata", category: "Sarees" },
  { id: "s10", name: "Hyderabad Pearl Fashions", city: "Hyderabad", category: "Accessories" },
];

const MOCK_BRANDS = [
  { id: "b1", name: "Sabyasachi", category: "Luxury Couture", logo: "S" },
  { id: "b2", name: "Fabindia", category: "Ethnic & Handloom", logo: "F" },
  { id: "b3", name: "Manyavar", category: "Men's Ethnic Wear", logo: "M" },
  { id: "b4", name: "Biba", category: "Women's Ethnic Wear", logo: "B" },
  { id: "b5", name: "W for Woman", category: "Women's Fashion", logo: "W" },
  { id: "b6", name: "Anita Dongre", category: "Designer Wear", logo: "A" },
  { id: "b7", name: "Raymond", category: "Men's Formal & Ethnic", logo: "R" },
  { id: "b8", name: "Kalyan Silks", category: "Silk Sarees", logo: "K" },
  { id: "b9", name: "Nalli Silks", category: "Traditional Sarees", logo: "N" },
  { id: "b10", name: "Taneira", category: "Handcrafted Sarees", logo: "T" },
  { id: "b11", name: "Ritu Kumar", category: "Designer Fashion", logo: "R" },
  { id: "b12", name: "Meena Bazaar", category: "Ethnic Collections", logo: "M" },
];

const MOCK_PRODUCTS: Record<string, { id: string; name: string; price: number }[]> = {
  s1: [
    { id: "p1", name: "Silk Saree", price: 12500 },
    { id: "p2", name: "Silk Saree Premium", price: 15800 },
    { id: "p3", name: "Silk Saree Classic", price: 11200 },
    { id: "p4", name: "Cotton Saree", price: 4500 },
  ],
  s2: [
    { id: "p5", name: "Banarasi Silk", price: 18900 },
    { id: "p6", name: "Banarasi Silk Heritage", price: 16500 },
    { id: "p7", name: "Organza Saree", price: 8200 },
  ],
  s3: [
    { id: "p8", name: "Bridal Lehenga Set", price: 45000 },
    { id: "p9", name: "Party Lehenga", price: 28000 },
    { id: "p10", name: "Festive Lehenga", price: 32000 },
  ],
  s4: [
    { id: "p11", name: "Formal Blazer", price: 6500 },
    { id: "p12", name: "Denim Jacket", price: 3200 },
  ],
  s5: [
    { id: "p13", name: "Chikankari Kurta", price: 3800 },
    { id: "p14", name: "Linen Kurta", price: 2900 },
    { id: "p15", name: "Silk Kurta", price: 5200 },
  ],
  s6: [{ id: "p16", name: "Chikan Kurti", price: 2800 }, { id: "p17", name: "Chikan Kurti Premium", price: 3100 }],
  s7: [{ id: "p18", name: "Mysore Silk", price: 9500 }, { id: "p19", name: "Mysore Silk Heritage", price: 11000 }],
  s8: [{ id: "p20", name: "Phulkari Dupatta", price: 1800 }],
  s9: [{ id: "p21", name: "Handloom Tant", price: 3200 }],
  s10: [{ id: "p22", name: "Pearl Necklace Set", price: 7500 }, { id: "p23", name: "Kundan Earrings", price: 4200 }],
};

const MOCK_CATEGORIES = [
  { id: "cat1", name: "Sarees", productCount: 4520 },
  { id: "cat2", name: "Kurta Sets", productCount: 2830 },
  { id: "cat3", name: "Lehengas", productCount: 1945 },
  { id: "cat4", name: "Kurtis", productCount: 3120 },
  { id: "cat5", name: "Dupattas", productCount: 1280 },
  { id: "cat6", name: "Sherwanis", productCount: 860 },
  { id: "cat7", name: "Blouses", productCount: 2150 },
  { id: "cat8", name: "Salwar Suits", productCount: 1740 },
  { id: "cat9", name: "Anarkalis", productCount: 1320 },
  { id: "cat10", name: "Palazzo Sets", productCount: 980 },
  { id: "cat11", name: "Gowns", productCount: 760 },
  { id: "cat12", name: "Accessories", productCount: 3450 },
  { id: "cat13", name: "Jewellery", productCount: 2680 },
  { id: "cat14", name: "Footwear", productCount: 1560 },
  { id: "cat15", name: "Fabric", productCount: 920 },
];

// ─── Types ──────────────────────────────────────
interface HeroBanner {
  id: string;
  rank: number;
  imageUrl: string;
}

interface StoreOffer {
  id: string;
  rank: number;
  title: string;
  flatOff: string; // e.g. "40% Off", "Flat ₹200 Off"
}

interface BrandYouLove {
  id: string;
  rank: number;
  brandId: string;
  brandName: string;
  brandLogo: string;
  offerUpTo: string; // e.g. "40%"
  image?: string; // 1:1 image
}

interface RankedItem {
  id: string;
  rank: number;
  label: string;
  sublabel?: string;
  storeId?: string;
  productId?: string;
}

interface Testimonial {
  id: string;
  rank: number;
  customerName: string;
  city: string;
  review: string;
  rating: number; // 1–5
  avatar?: string; // data URL from file upload
}

type SectionKey = "heroBanners" | "storeOffers" | "brandsYouLove" | "promotedStores" | "promotedProducts" | "topCategories" | "topStores" | "testimonials";

interface SectionHeading {
  heading: string;
  subheading: string;
}

const SECTION_CONFIG: Record<SectionKey, { title: string; description: string; icon: any; color: string; defaultHeading: string; defaultSubheading: string }> = {
  heroBanners: { title: "Hero Banners", description: "Full-width banner images shown at the top (16:9 ratio)", icon: Image, color: "#E11D48", defaultHeading: "Featured", defaultSubheading: "Discover the best in ethnic fashion" },
  storeOffers: { title: "Store Offers", description: "Flat offers displayed to customers", icon: Tag, color: "#D97706", defaultHeading: "Hot Deals", defaultSubheading: "Grab these amazing offers today" },
  brandsYouLove: { title: "Brands You'll Love", description: "Featured brands with offer percentage and promotional image", icon: Sparkles, color: "#8B5CF6", defaultHeading: "Brands You'll Love", defaultSubheading: "Shop from your favourite brands" },
  promotedStores: { title: "Promoted Stores", description: "Highlight specific stores for customer discovery", icon: Store, color: "#220E92", defaultHeading: "Featured Stores", defaultSubheading: "Handpicked stores just for you" },
  promotedProducts: { title: "Promoted Products", description: "Feature specific products from stores", icon: Package, color: "#7C3AED", defaultHeading: "Trending Products", defaultSubheading: "Top picks from our stores" },
  topCategories: { title: "Top Categories", description: "Showcase popular categories on the homepage", icon: LayoutGrid, color: "#0891B2", defaultHeading: "Shop by Category", defaultSubheading: "Explore our top categories" },
  topStores: { title: "Top Stores", description: "Showcase best-performing stores to customers", icon: Store, color: "#059669", defaultHeading: "Top Stores", defaultSubheading: "Stores customers love" },
  testimonials: { title: "Testimonials", description: "Customer reviews and ratings", icon: MessageSquareQuote, color: "#FBBF24", defaultHeading: "Customer Testimonials", defaultSubheading: "Hear what our customers have to say" },
};

const cardClass = "bg-card rounded-[12px] border border-border shadow-sm";
const inputClass = "px-3 py-2.5 rounded-[10px] border border-border bg-background";
const inputStyle = { fontSize: "13px" } as const;

const BRAND_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-cyan-100 text-cyan-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-orange-100 text-orange-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
];

export function AdminCustomerHome() {
  const [activeSection, setActiveSection] = useState<SectionKey>("heroBanners");

  // Section headings
  const [sectionHeadings, setSectionHeadings] = useState<Record<SectionKey, SectionHeading>>(() => {
    const h: Record<string, SectionHeading> = {};
    for (const k of Object.keys(SECTION_CONFIG) as SectionKey[]) {
      h[k] = { heading: SECTION_CONFIG[k].defaultHeading, subheading: SECTION_CONFIG[k].defaultSubheading };
    }
    return h as Record<SectionKey, SectionHeading>;
  });

  const [editingHeading, setEditingHeading] = useState(false);
  const [tempHeading, setTempHeading] = useState("");
  const [tempSubheading, setTempSubheading] = useState("");

  // ─── Hero Banners ─────────────────────────────────
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([
    { id: "hb1", rank: 1, imageUrl: "https://images.unsplash.com/photo-1574705477102-1ff256153d63?w=1200&h=675&fit=crop" },
    { id: "hb2", rank: 2, imageUrl: "https://images.unsplash.com/photo-1768033976288-9300f5d6f296?w=1200&h=675&fit=crop" },
    { id: "hb3", rank: 3, imageUrl: "https://images.unsplash.com/photo-1685967413455-62f8cab87410?w=1200&h=675&fit=crop" },
  ]);

  // ─── Store Offers ─────────────────────────────────
  const [storeOffers, setStoreOffers] = useState<StoreOffer[]>([
    { id: "so1", rank: 1, title: "Flat 40% Off on Silk Sarees", flatOff: "40% Off" },
    { id: "so2", rank: 2, title: "Flat ₹500 Off on First Order", flatOff: "₹500 Off" },
    { id: "so3", rank: 3, title: "Flat 30% Off Festival Collection", flatOff: "30% Off" },
  ]);

  // ─── Brands You'll Love ───────────────────────────
  const [brandsYouLove, setBrandsYouLove] = useState<BrandYouLove[]>([
    { id: "byl1", rank: 1, brandId: "b1", brandName: "Sabyasachi", brandLogo: "S", offerUpTo: "25%" },
    { id: "byl2", rank: 2, brandId: "b2", brandName: "Fabindia", brandLogo: "F", offerUpTo: "40%" },
    { id: "byl3", rank: 3, brandId: "b4", brandName: "Biba", brandLogo: "B", offerUpTo: "50%" },
  ]);

  // ─── Promoted Stores ──────────────────────────────
  const [promotedStores, setPromotedStores] = useState<RankedItem[]>([
    { id: "ps1", rank: 1, label: "Kanchipuram Weaves", sublabel: "Chennai · Sarees", storeId: "s1" },
    { id: "ps2", rank: 2, label: "Priya Silks Emporium", sublabel: "Varanasi · Sarees", storeId: "s2" },
    { id: "ps3", rank: 3, label: "Regal Ethnic Wear", sublabel: "Jaipur · Lehengas", storeId: "s3" },
  ]);

  // ─── Promoted Products ────────────────────────────
  const [promotedProducts, setPromotedProducts] = useState<RankedItem[]>([
    { id: "pp1", rank: 1, label: "Silk Saree", sublabel: "Kanchipuram Weaves · ₹12,500", storeId: "s1", productId: "p1" },
    { id: "pp2", rank: 2, label: "Bridal Lehenga Set", sublabel: "Regal Ethnic Wear · ₹45,000", storeId: "s3", productId: "p8" },
  ]);

  // ─── Top Categories ───────────────────────────────
  const [topCategories, setTopCategories] = useState<RankedItem[]>([
    { id: "tc1", rank: 1, label: "Sarees", sublabel: "4,520 products" },
    { id: "tc2", rank: 2, label: "Kurta Sets", sublabel: "2,830 products" },
    { id: "tc3", rank: 3, label: "Lehengas", sublabel: "1,945 products" },
  ]);

  // ─── Top Stores ───────────────────────────────────
  const [topStores, setTopStores] = useState<RankedItem[]>([
    { id: "ts1", rank: 1, label: "Kanchipuram Weaves", sublabel: "Chennai · 2,134 orders", storeId: "s1" },
    { id: "ts2", rank: 2, label: "Priya Silks Emporium", sublabel: "Varanasi · 1,842 orders", storeId: "s2" },
    { id: "ts3", rank: 3, label: "Bombay Fashion Hub", sublabel: "Mumbai · 983 orders", storeId: "s4" },
  ]);

  // ─── Testimonials ───────────────────────────────
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: "t1", rank: 1, customerName: "Rajesh", city: "Delhi", review: "Absolutely loved the silk saree! The quality is amazing and the design is unique.", rating: 5, avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop" },
    { id: "t2", rank: 2, customerName: "Neha", city: "Mumbai", review: "The chikan kurti is so elegant and comfortable. Highly recommend!", rating: 4, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
    { id: "t3", rank: 3, customerName: "Suresh", city: "Chennai", review: "The bridal lehenga set is perfect for my wedding. Thank you!", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  ]);

  // ─── Modal state ──────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [addBannerUrl, setAddBannerUrl] = useState("");
  const [addOfferTitle, setAddOfferTitle] = useState("");
  const [addFlatOff, setAddFlatOff] = useState("");
  const [addBrandId, setAddBrandId] = useState("");
  const [addOfferUpTo, setAddOfferUpTo] = useState("");
  const [addBrandImage, setAddBrandImage] = useState("");
  const [addStoreId, setAddStoreId] = useState("");
  const [addProductId, setAddProductId] = useState("");
  const [addCategoryId, setAddCategoryId] = useState("");
  const [saveToast, setSaveToast] = useState(false);
  const brandImageRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  // Testimonial modal state
  const [addTestimonialName, setAddTestimonialName] = useState("");
  const [addTestimonialCity, setAddTestimonialCity] = useState("");
  const [addTestimonialReview, setAddTestimonialReview] = useState("");
  const [addTestimonialRating, setAddTestimonialRating] = useState(5);
  const [addTestimonialAvatar, setAddTestimonialAvatar] = useState("");
  const testimonialAvatarRef = useRef<HTMLInputElement>(null);

  // Preview
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  const config = SECTION_CONFIG[activeSection];

  const availableProducts = useMemo(() => {
    if (!addStoreId) return [];
    return MOCK_PRODUCTS[addStoreId] || [];
  }, [addStoreId]);

  const availableBrandsForLove = useMemo(() => {
    const usedIds = new Set(brandsYouLove.map(b => b.brandId));
    return MOCK_BRANDS.filter(b => !usedIds.has(b.id));
  }, [brandsYouLove]);

  const getItemCount = () => {
    switch (activeSection) {
      case "heroBanners": return heroBanners.length;
      case "storeOffers": return storeOffers.length;
      case "brandsYouLove": return brandsYouLove.length;
      case "promotedStores": return promotedStores.length;
      case "promotedProducts": return promotedProducts.length;
      case "topCategories": return topCategories.length;
      case "topStores": return topStores.length;
      case "testimonials": return testimonials.length;
    }
  };

  const handleFileToDataUrl = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) callback(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ─── Change rank via dropdown ─────────────────────
  const changeRank = (items: any[], setter: (items: any[]) => void, itemId: string, newRank: number) => {
    const sorted = [...items];
    const currentIndex = sorted.findIndex(i => i.id === itemId);
    if (currentIndex === -1) return;
    const [item] = sorted.splice(currentIndex, 1);
    sorted.splice(newRank - 1, 0, item);
    sorted.forEach((it, i) => it.rank = i + 1);
    setter(sorted);
  };

  // ─── Remove ───────────────────────────────────────
  const removeFrom = (items: any[], setter: (items: any[]) => void, id: string) => {
    const filtered = items.filter(i => i.id !== id);
    filtered.forEach((it, i) => it.rank = i + 1);
    setter(filtered);
  };

  const resetAdd = () => {
    setShowAddModal(false);
    setAddBannerUrl("");
    setAddOfferTitle("");
    setAddFlatOff("");
    setAddBrandId("");
    setAddOfferUpTo("");
    setAddBrandImage("");
    setAddStoreId("");
    setAddProductId("");
    setAddCategoryId("");
    setAddTestimonialName("");
    setAddTestimonialCity("");
    setAddTestimonialReview("");
    setAddTestimonialRating(5);
    setAddTestimonialAvatar("");
  };

  const handleAdd = () => {
    switch (activeSection) {
      case "heroBanners":
        if (!addBannerUrl.trim()) return;
        setHeroBanners(prev => [...prev, { id: `hb-${Date.now()}`, rank: prev.length + 1, imageUrl: addBannerUrl.trim() }]);
        break;
      case "storeOffers":
        if (!addOfferTitle.trim() || !addFlatOff.trim()) return;
        setStoreOffers(prev => [...prev, { id: `so-${Date.now()}`, rank: prev.length + 1, title: addOfferTitle.trim(), flatOff: addFlatOff.trim() }]);
        break;
      case "brandsYouLove": {
        if (!addBrandId || !addOfferUpTo.trim()) return;
        const brand = MOCK_BRANDS.find(b => b.id === addBrandId);
        if (!brand) return;
        setBrandsYouLove(prev => [...prev, {
          id: `byl-${Date.now()}`, rank: prev.length + 1,
          brandId: brand.id, brandName: brand.name, brandLogo: brand.logo,
          offerUpTo: addOfferUpTo.trim(), image: addBrandImage || undefined,
        }]);
        break;
      }
      case "promotedStores":
      case "topStores": {
        if (!addStoreId) return;
        const store = MOCK_STORES.find(s => s.id === addStoreId);
        if (!store) return;
        const item: RankedItem = { id: `item-${Date.now()}`, rank: 0, label: store.name, sublabel: `${store.city} · ${store.category}`, storeId: addStoreId };
        if (activeSection === "promotedStores") {
          item.rank = promotedStores.length + 1;
          setPromotedStores(prev => [...prev, item]);
        } else {
          item.rank = topStores.length + 1;
          setTopStores(prev => [...prev, item]);
        }
        break;
      }
      case "promotedProducts": {
        if (!addStoreId || !addProductId) return;
        const store = MOCK_STORES.find(s => s.id === addStoreId);
        const product = (MOCK_PRODUCTS[addStoreId] || []).find(p => p.id === addProductId);
        if (!store || !product) return;
        setPromotedProducts(prev => [...prev, {
          id: `pp-${Date.now()}`, rank: prev.length + 1,
          label: product.name, sublabel: `${store.name} · ₹${product.price.toLocaleString()}`,
          storeId: addStoreId, productId: addProductId,
        }]);
        break;
      }
      case "topCategories": {
        if (!addCategoryId) return;
        const cat = MOCK_CATEGORIES.find(c => c.id === addCategoryId);
        if (!cat) return;
        setTopCategories(prev => [...prev, {
          id: `tc-${Date.now()}`, rank: prev.length + 1,
          label: cat.name, sublabel: `${cat.productCount.toLocaleString()} products`,
        }]);
        break;
      }
      case "testimonials": {
        if (!addTestimonialName || !addTestimonialCity || !addTestimonialReview || !addTestimonialRating) return;
        setTestimonials(prev => [...prev, {
          id: `t-${Date.now()}`, rank: prev.length + 1,
          customerName: addTestimonialName.trim(),
          city: addTestimonialCity.trim(),
          review: addTestimonialReview.trim(),
          rating: addTestimonialRating,
          avatar: addTestimonialAvatar || undefined,
        }]);
        resetAdd();
        break;
      }
    }
    resetAdd();
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const startEditHeading = () => {
    setTempHeading(sectionHeadings[activeSection].heading);
    setTempSubheading(sectionHeadings[activeSection].subheading);
    setEditingHeading(true);
  };

  const saveHeading = () => {
    setSectionHeadings(prev => ({
      ...prev,
      [activeSection]: { heading: tempHeading.trim() || config.defaultHeading, subheading: tempSubheading.trim() || config.defaultSubheading },
    }));
    setEditingHeading(false);
  };

  // ─── Render rank dropdown ─────────────────────────
  const RankDropdown = ({ rank, total, id, items, setter }: { rank: number; total: number; id: string; items: any[]; setter: (i: any[]) => void }) => (
    <select
      value={rank}
      onChange={(e) => changeRank(items, setter, id, Number(e.target.value))}
      className="w-14 h-8 rounded-lg border border-border bg-background text-center cursor-pointer hover:border-[#220E92]/40 transition-colors"
      style={{ fontSize: "12px", fontWeight: 700 }}
    >
      {Array.from({ length: total }, (_, i) => i + 1).map(r => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  );

  // Helper to get items/setter for each section
  const getSectionItems = (): { items: any[]; setter: (items: any[]) => void } | null => {
    switch (activeSection) {
      case "heroBanners": return { items: heroBanners, setter: setHeroBanners as any };
      case "storeOffers": return { items: storeOffers, setter: setStoreOffers as any };
      case "brandsYouLove": return { items: brandsYouLove, setter: setBrandsYouLove as any };
      case "promotedStores": return { items: promotedStores, setter: setPromotedStores as any };
      case "promotedProducts": return { items: promotedProducts, setter: setPromotedProducts as any };
      case "topCategories": return { items: topCategories, setter: setTopCategories as any };
      case "topStores": return { items: topStores, setter: setTopStores as any };
      case "testimonials": return { items: testimonials, setter: setTestimonials as any };
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Customer Home Page</h1>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
            Configure what customers see on the homepage
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-[#220E92] text-white px-5 py-2.5 rounded-[10px] hover:bg-[#220E92]/90 transition-colors shadow-sm"
          style={{ fontSize: "14px", fontWeight: 500 }}
        >
          <Save className="w-4 h-4" /> Publish Changes
        </button>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-[10px] shadow-lg flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 500 }}>
          <Save className="w-4 h-4" /> Changes published successfully!
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(SECTION_CONFIG) as SectionKey[]).map(key => {
          const cfg = SECTION_CONFIG[key];
          const active = activeSection === key;
          let count = 0;
          switch (key) {
            case "heroBanners": count = heroBanners.length; break;
            case "storeOffers": count = storeOffers.length; break;
            case "brandsYouLove": count = brandsYouLove.length; break;
            case "promotedStores": count = promotedStores.length; break;
            case "promotedProducts": count = promotedProducts.length; break;
            case "topCategories": count = topCategories.length; break;
            case "topStores": count = topStores.length; break;
            case "testimonials": count = testimonials.length; break;
          }
          return (
            <button
              key={key}
              onClick={() => { setActiveSection(key); setEditingHeading(false); }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] whitespace-nowrap transition-colors ${
                active ? "bg-[#220E92] text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              <cfg.icon className="w-4 h-4" />
              {cfg.title}
              <span
                className={`px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-muted"}`}
                style={{ fontSize: "11px", fontWeight: 700 }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section Heading Configuration */}
      <div className={`${cardClass} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Section Heading & Subheading</p>
            {!editingHeading ? (
              <div className="mt-1.5">
                <p style={{ fontSize: "16px", fontWeight: 700 }}>{sectionHeadings[activeSection].heading}</p>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{sectionHeadings[activeSection].subheading}</p>
              </div>
            ) : (
              <div className="mt-2 space-y-2 max-w-md">
                <input
                  type="text"
                  value={tempHeading}
                  onChange={e => setTempHeading(e.target.value)}
                  className={`w-full ${inputClass}`}
                  style={inputStyle}
                  placeholder="Section heading"
                />
                <input
                  type="text"
                  value={tempSubheading}
                  onChange={e => setTempSubheading(e.target.value)}
                  className={`w-full ${inputClass}`}
                  style={inputStyle}
                  placeholder="Section subheading"
                />
              </div>
            )}
          </div>
          {!editingHeading ? (
            <button onClick={startEditHeading} className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingHeading(false)} className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>Cancel</button>
              <button onClick={saveHeading} className="px-3 py-1.5 rounded-lg bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>Save</button>
            </div>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
              <config.icon className="w-4 h-4" style={{ color: config.color }} />
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>{config.title}</h3>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{config.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>
              {getItemCount()} item{getItemCount() !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#220E92] text-white px-3.5 py-2 rounded-[10px] hover:bg-[#220E92]/90 transition-colors"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-border">
          {/* Hero Banners */}
          {activeSection === "heroBanners" && heroBanners.map((banner) => (
            <div key={banner.id} className="flex items-center gap-4 px-5 py-4 group hover:bg-muted/30 transition-colors">
              <RankDropdown rank={banner.rank} total={heroBanners.length} id={banner.id} items={heroBanners} setter={setHeroBanners} />
              <button onClick={() => setPreviewBanner(banner.imageUrl)} className="w-32 h-[72px] rounded-lg overflow-hidden border border-border hover:border-[#220E92]/40 transition-colors shrink-0 relative">
                <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <p className="truncate text-muted-foreground" style={{ fontSize: "12px" }}>16:9 Banner Image</p>
                <p className="truncate text-muted-foreground/60" style={{ fontSize: "11px" }}>{banner.imageUrl.substring(0, 60)}...</p>
              </div>
              <button onClick={() => removeFrom(heroBanners, setHeroBanners, banner.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Store Offers */}
          {activeSection === "storeOffers" && storeOffers.map((offer) => (
            <div key={offer.id} className="flex items-center gap-4 px-5 py-4 group hover:bg-muted/30 transition-colors">
              <RankDropdown rank={offer.rank} total={storeOffers.length} id={offer.id} items={storeOffers} setter={setStoreOffers} />
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{offer.title}</p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-[10px] flex items-center gap-1.5 shadow-sm shrink-0">
                <Tag className="w-3.5 h-3.5" />
                <span style={{ fontSize: "13px", fontWeight: 700 }}>{offer.flatOff}</span>
              </div>
              <button onClick={() => removeFrom(storeOffers, setStoreOffers, offer.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Brands You'll Love */}
          {activeSection === "brandsYouLove" && brandsYouLove.map((brand, index) => {
            const colorClass = BRAND_COLORS[index % BRAND_COLORS.length];
            const [bgClass, textClass] = colorClass.split(" ");
            return (
              <div key={brand.id} className="flex items-center gap-4 px-5 py-4 group hover:bg-muted/30 transition-colors">
                <RankDropdown rank={brand.rank} total={brandsYouLove.length} id={brand.id} items={brandsYouLove} setter={setBrandsYouLove} />
                <div className={`w-10 h-10 rounded-[10px] ${bgClass} flex items-center justify-center shrink-0`}>
                  <span style={{ fontSize: "16px", fontWeight: 700 }} className={textClass}>{brand.brandLogo}</span>
                </div>
                {brand.image && (
                  <div className="w-10 h-10 rounded-[8px] overflow-hidden border border-border shrink-0">
                    <img src={brand.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: "14px", fontWeight: 600 }}>{brand.brandName}</p>
                  <p className="text-muted-foreground truncate" style={{ fontSize: "12px" }}>Up to {brand.offerUpTo} Off</p>
                </div>
                <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white px-3 py-1.5 rounded-[10px] flex items-center gap-1.5 shadow-sm shrink-0">
                  <Percent className="w-3.5 h-3.5" />
                  <span style={{ fontSize: "13px", fontWeight: 700 }}>Up to {brand.offerUpTo}</span>
                </div>
                <button onClick={() => removeFrom(brandsYouLove, setBrandsYouLove, brand.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* Promoted Stores / Top Stores / Top Categories / Promoted Products */}
          {(activeSection === "promotedStores" || activeSection === "topStores" || activeSection === "topCategories" || activeSection === "promotedProducts") && (() => {
            const data = getSectionItems();
            if (!data) return null;
            return data.items.map((item: RankedItem) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 group hover:bg-muted/30 transition-colors">
                <RankDropdown rank={item.rank} total={data.items.length} id={item.id} items={data.items} setter={data.setter} />
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{item.label}</p>
                  {item.sublabel && <p className="text-muted-foreground truncate" style={{ fontSize: "12px" }}>{item.sublabel}</p>}
                </div>
                <button onClick={() => removeFrom(data.items, data.setter, item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ));
          })()}

          {/* Testimonials */}
          {activeSection === "testimonials" && testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex items-center gap-4 px-5 py-4 group hover:bg-muted/30 transition-colors">
              <RankDropdown rank={testimonial.rank} total={testimonials.length} id={testimonial.id} items={testimonials} setter={setTestimonials} />
              <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                    <span style={{ fontSize: "14px", fontWeight: 700 }} className="text-amber-600">
                      {testimonial.customerName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{testimonial.customerName}</p>
                  <span className="text-muted-foreground shrink-0" style={{ fontSize: "11px" }}>{testimonial.city}</span>
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3 h-3 ${s <= testimonial.rating ? "text-amber-400 fill-amber-400" : "text-border"}`} />
                  ))}
                </div>
                <p className="text-muted-foreground truncate mt-0.5" style={{ fontSize: "12px" }}>{testimonial.review}</p>
              </div>
              <button onClick={() => removeFrom(testimonials, setTestimonials, testimonial.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {getItemCount() === 0 && (
          <div className="py-16 text-center">
            <config.icon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground" style={{ fontSize: "14px" }}>No items configured yet</p>
            <p className="text-muted-foreground/60 mt-1" style={{ fontSize: "12px" }}>Click "Add" to start configuring this section</p>
          </div>
        )}

        {getItemCount()! > 0 && (
          <div className="px-5 py-3 border-t border-border bg-muted/20">
            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
              {getItemCount()} item{getItemCount() !== 1 ? "s" : ""} configured
            </span>
          </div>
        )}
      </div>

      {/* ─── Add Modal ────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={resetAdd}>
          <div className="bg-card rounded-[12px] border border-border shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add to {config.title}</h3>
              <button onClick={resetAdd} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Hero Banners */}
              {activeSection === "heroBanners" && (
                <>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Banner Image (16:9 ratio)</label>
                    <input
                      ref={bannerFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileToDataUrl(file, setAddBannerUrl);
                      }}
                    />
                    {!addBannerUrl ? (
                      <button
                        onClick={() => bannerFileRef.current?.click()}
                        className="w-full py-8 rounded-[10px] border-2 border-dashed border-border hover:border-[#220E92]/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      >
                        <Upload className="w-5 h-5" /> Click to upload banner image
                      </button>
                    ) : (
                      <div className="rounded-lg overflow-hidden border border-border aspect-video relative">
                        <img src={addBannerUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setAddBannerUrl("")}
                          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Store Offers */}
              {activeSection === "storeOffers" && (
                <>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Offer Title</label>
                    <input
                      type="text"
                      value={addOfferTitle}
                      onChange={e => setAddOfferTitle(e.target.value)}
                      className={`w-full ${inputClass}`}
                      style={inputStyle}
                      placeholder="e.g. Flat 40% Off on Silk Sarees"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Flat Offer</label>
                    <input
                      type="text"
                      value={addFlatOff}
                      onChange={e => setAddFlatOff(e.target.value)}
                      className={`w-full ${inputClass}`}
                      style={inputStyle}
                      placeholder="e.g. 40% Off, ₹500 Off"
                    />
                  </div>
                </>
              )}

              {/* Brands You'll Love */}
              {activeSection === "brandsYouLove" && (
                <>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Select Brand</label>
                    <div className="relative">
                      <select
                        value={addBrandId}
                        onChange={e => setAddBrandId(e.target.value)}
                        className={`w-full ${inputClass} appearance-none pr-10`}
                        style={inputStyle}
                      >
                        <option value="">Choose a brand...</option>
                        {availableBrandsForLove.map(b => (
                          <option key={b.id} value={b.id}>{b.name} — {b.category}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Offer Up To</label>
                    <input
                      type="text"
                      value={addOfferUpTo}
                      onChange={e => setAddOfferUpTo(e.target.value)}
                      className={`w-full ${inputClass}`}
                      style={inputStyle}
                      placeholder="e.g. 40%"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>
                      Promotional Image (1:1 ratio) <span className="text-muted-foreground/60">(optional)</span>
                    </label>
                    <input
                      ref={brandImageRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileToDataUrl(file, setAddBrandImage);
                      }}
                    />
                    {!addBrandImage ? (
                      <button
                        onClick={() => brandImageRef.current?.click()}
                        className="w-full py-6 rounded-[10px] border-2 border-dashed border-border hover:border-[#220E92]/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        <Upload className="w-4 h-4" /> Click to upload 1:1 image
                      </button>
                    ) : (
                      <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-border relative">
                        <img src={addBrandImage} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setAddBrandImage("")}
                          className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded-full hover:bg-black/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Promoted Stores / Top Stores */}
              {(activeSection === "promotedStores" || activeSection === "topStores") && (
                <div>
                  <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Select Store</label>
                  <div className="relative">
                    <select
                      value={addStoreId}
                      onChange={e => setAddStoreId(e.target.value)}
                      className={`w-full ${inputClass} appearance-none pr-10`}
                      style={inputStyle}
                    >
                      <option value="">Choose a store...</option>
                      {MOCK_STORES.map(s => (
                        <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Promoted Products */}
              {activeSection === "promotedProducts" && (
                <>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Select Store</label>
                    <div className="relative">
                      <select
                        value={addStoreId}
                        onChange={e => { setAddStoreId(e.target.value); setAddProductId(""); }}
                        className={`w-full ${inputClass} appearance-none pr-10`}
                        style={inputStyle}
                      >
                        <option value="">Choose a store...</option>
                        {MOCK_STORES.map(s => (
                          <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  {addStoreId && (
                    <div>
                      <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Select Product</label>
                      <div className="relative">
                        <select
                          value={addProductId}
                          onChange={e => setAddProductId(e.target.value)}
                          className={`w-full ${inputClass} appearance-none pr-10`}
                          style={inputStyle}
                        >
                          <option value="">Choose a product...</option>
                          {availableProducts.map(p => (
                            <option key={p.id} value={p.id}>{p.name} — ₹{p.price.toLocaleString()}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Top Categories */}
              {activeSection === "topCategories" && (
                <div>
                  <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Select Category</label>
                  <div className="relative">
                    <select
                      value={addCategoryId}
                      onChange={e => setAddCategoryId(e.target.value)}
                      className={`w-full ${inputClass} appearance-none pr-10`}
                      style={inputStyle}
                    >
                      <option value="">Choose a category...</option>
                      {MOCK_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name} — {c.productCount.toLocaleString()} products</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {activeSection === "testimonials" && (
                <>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Customer Name *</label>
                    <input
                      type="text"
                      value={addTestimonialName}
                      onChange={e => setAddTestimonialName(e.target.value)}
                      className={`w-full ${inputClass}`}
                      style={inputStyle}
                      placeholder="e.g. Priya Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>City *</label>
                    <input
                      type="text"
                      value={addTestimonialCity}
                      onChange={e => setAddTestimonialCity(e.target.value)}
                      className={`w-full ${inputClass}`}
                      style={inputStyle}
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Review *</label>
                    <textarea
                      value={addTestimonialReview}
                      onChange={e => setAddTestimonialReview(e.target.value)}
                      className={`w-full ${inputClass} resize-none`}
                      style={{ ...inputStyle, minHeight: "80px" }}
                      placeholder="Write customer review..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Rating *</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setAddTestimonialRating(star)}
                          className="p-0.5 transition-colors"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${star <= addTestimonialRating ? "text-amber-400 fill-amber-400" : "text-border"}`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>
                        {addTestimonialRating}/5
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>
                      Customer Avatar <span className="text-muted-foreground/60">(optional)</span>
                    </label>
                    <input
                      ref={testimonialAvatarRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileToDataUrl(file, setAddTestimonialAvatar);
                      }}
                    />
                    {!addTestimonialAvatar ? (
                      <button
                        onClick={() => testimonialAvatarRef.current?.click()}
                        className="w-full py-6 rounded-[10px] border-2 border-dashed border-border hover:border-[#220E92]/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        <Upload className="w-4 h-4" /> Click to upload avatar photo
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-border relative">
                          <img src={addTestimonialAvatar} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setAddTestimonialAvatar("")}
                            className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-full hover:bg-black/70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Avatar uploaded</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="px-5 pb-5 flex gap-3">
              <button onClick={resetAdd} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Preview Modal */}
      {previewBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewBanner(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewBanner(null)}
              className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <img src={previewBanner} alt="Preview" className="w-full rounded-[12px] shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}