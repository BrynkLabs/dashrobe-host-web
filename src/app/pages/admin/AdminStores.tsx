import { useState, useId, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import {
  Search,
  Filter,
  ChevronDown,
  Check,
  X,
  Eye,
  Store,
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  CircleCheck,
  CircleX,
  Clock,
  TriangleAlert,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  FileText,
  Ban,
  RotateCcw,
  Download,
  FileCheck,
  Shield,
  Truck,
  PackageCheck,
  CreditCard,
  ClipboardList,
  CheckCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Pagination } from "../../components/Pagination";
import {
  approveStore,
  getAll,
  getVendorDetail,
  reactivateVendorStore,
  rejectStore,
  suspendVendorStore,
} from "@/app/Service/VendorListActionService/vendorListActionService";
import { StatusCountType, StoreType, VendorDetailData } from "@/app/Service/VendorListActionService/Types/storeType";

// ─── Types ───────────────────────────────────────────────────
export type StoreStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

interface OnboardingData {
  // Step 1: Basic Details
  storeName: string;
  businessName: string;
  ownerName: string;
  legalEntityType: string;
  gstin: string;
  gstVerified: boolean;
  pan: string;
  panVerified: boolean;
  businessAddress: string;
  contactPerson: string;
  designation: string;
  phone: string;
  phoneVerified: boolean;
  altPhone?: string;
  altPhoneVerified?: boolean;
  email: string;
  website?: string;
  socialMedia?: string;
  // Step 2: Store Operations
  storeLocation: string;
  openingTime: string;
  closingTime: string;
  weeklyOff: string;
  prepTime: string;
  packingTime: string;
  readyFor30Min: boolean;
  packagingResponsibility: string;
  deliveryCoverage: string;
  // Step 3: Product Categories
  selectedCategories: string[];
  priceRange: string;
  customization: boolean;
  // Step 4: Bank & Settlement
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  ifscCode: string;
  bankVerified: boolean;
  upiId?: string;
  documents: {
    name: string;
    uploaded: boolean;
    url?: string;
    fileType?: string;
    fileSize?: string;
  }[];
  // Step 5: Refunds & Returns
  refundWindow: string;
  exchangePolicy: string;
  refundMode: string;
  tryAndBuy: boolean;
  maxTryItems?: number;
  returnPolicy?: string;
  // Step 6: Offers & Promotions
  discountTypes: string[];
  maxDiscount?: string;
  minimumOrderValue?: string;
  // Step 7: Technology & Inventory
  inventoryMethod: string;
  dailyUpdate: boolean;
  orderAcceptanceSLA: boolean;
  packingSLA: boolean;
  fillRate: string;
  needPhotography: boolean;
  // Step 8: Review & Declaration
  declarationAccepted: boolean;
  submittedAt: string;
}

interface VendorStore {
  vendorId: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  gstNumber: string;
  category: string;
  onboardingStep: number;
  onboardingComplete: boolean;
  status: StoreStatus;
  submittedAt: string;
  approvedAt?: string;
  revenue: number;
  orders: number;
  products: number;
  returnRate: number;
  avgOrderValue: number;
  rating: number;
  acceptedOrdersRatio: number;
  monthlyRevenue: { month: string; revenue: number }[];
  onboardingData?: OnboardingData;
}

// ─── Order Types & Mock Data ─────────────────────────────────
type OrderStatus =
  | "vendor_approved"
  | "payment_pending"
  | "confirmed"
  | "packed"
  | "dispatched"
  | "delivered";

interface StoreOrder {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: OrderStatus;
  placedAt: string; // time string e.g. "10:12 AM"
  date: string;
  rider?: string;
  eta?: string; // e.g. "32 mins"
}

const orderStatusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: typeof CircleCheck }
> = {
  vendor_approved: {
    label: "Vendor Approved",
    color: "#2563EB",
    bg: "#DBEAFE",
    icon: CircleCheck,
  },
  payment_pending: {
    label: "Payment Pending",
    color: "#D97706",
    bg: "#FEF3C7",
    icon: CreditCard,
  },
  confirmed: {
    label: "Confirmed",
    color: "#7C3AED",
    bg: "#EDE9FE",
    icon: ClipboardList,
  },
  packed: {
    label: "Packed",
    color: "#0891B2",
    bg: "#CFFAFE",
    icon: PackageCheck,
  },
  dispatched: {
    label: "Dispatched",
    color: "#EA580C",
    bg: "#FFEDD5",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "#059669",
    bg: "#D1FAE5",
    icon: CircleCheck,
  },
};

const storeOrders: Record<string, StoreOrder[]> = {
  "vs-1": [
    {
      id: "ORD-4201",
      customer: "Meera Reddy",
      items: ["Banarasi Silk Saree", "Cotton Dupatta"],
      total: 8450,
      status: "delivered",
      placedAt: "10:12 AM",
      date: "2026-02-20",
      rider: "Rajesh K.",
      eta: "32 mins",
    },
    {
      id: "ORD-4202",
      customer: "Anita Joshi",
      items: ["Kanjivaram Saree"],
      total: 12800,
      status: "delivered",
      placedAt: "10:28 AM",
      date: "2026-02-20",
      rider: "Suresh M.",
      eta: "28 mins",
    },
    {
      id: "ORD-4203",
      customer: "Kavitha S.",
      items: ["Chanderi Saree", "Silk Blouse Piece"],
      total: 5650,
      status: "dispatched",
      placedAt: "10:35 AM",
      date: "2026-02-20",
      rider: "Amit D.",
      eta: "18 mins",
    },
    {
      id: "ORD-4204",
      customer: "Deepa Nair",
      items: ["Tussar Silk Saree"],
      total: 7200,
      status: "packed",
      placedAt: "10:42 AM",
      date: "2026-02-20",
    },
    {
      id: "ORD-4205",
      customer: "Pooja Verma",
      items: ["Organza Saree", "Matching Blouse"],
      total: 9500,
      status: "confirmed",
      placedAt: "10:48 AM",
      date: "2026-02-20",
    },
  ],
  "vs-2": [
    {
      id: "ORD-4301",
      customer: "Simran Kaur",
      items: ["Bridal Lehenga Set"],
      total: 45000,
      status: "delivered",
      placedAt: "10:05 AM",
      date: "2026-02-20",
      rider: "Vikram P.",
      eta: "38 mins",
    },
    {
      id: "ORD-4302",
      customer: "Riya Sharma",
      items: ["Designer Lehenga"],
      total: 28500,
      status: "dispatched",
      placedAt: "10:20 AM",
      date: "2026-02-20",
      rider: "Karan S.",
      eta: "22 mins",
    },
    {
      id: "ORD-4303",
      customer: "Neha Gupta",
      items: ["Party Wear Lehenga", "Dupatta Set"],
      total: 18200,
      status: "packed",
      placedAt: "10:30 AM",
      date: "2026-02-20",
    },
    {
      id: "ORD-4304",
      customer: "Priyanka M.",
      items: ["Ghagra Choli"],
      total: 15600,
      status: "confirmed",
      placedAt: "10:40 AM",
      date: "2026-02-20",
    },
  ],
  "vs-3": [
    {
      id: "ORD-4401",
      customer: "Sneha K.",
      items: ["Maxi Dress", "Scarf"],
      total: 3450,
      status: "delivered",
      placedAt: "11:02 AM",
      date: "2026-02-20",
      rider: "Rohit G.",
      eta: "25 mins",
    },
    {
      id: "ORD-4402",
      customer: "Aditi Rao",
      items: ["Cocktail Dress"],
      total: 5800,
      status: "delivered",
      placedAt: "11:15 AM",
      date: "2026-02-20",
      rider: "Ajay V.",
      eta: "30 mins",
    },
    {
      id: "ORD-4403",
      customer: "Tanya B.",
      items: ["Midi Dress", "Belt"],
      total: 4200,
      status: "dispatched",
      placedAt: "11:22 AM",
      date: "2026-02-20",
      rider: "Deepak L.",
      eta: "15 mins",
    },
    {
      id: "ORD-4404",
      customer: "Swati P.",
      items: ["Evening Gown"],
      total: 8900,
      status: "payment_pending",
      placedAt: "11:35 AM",
      date: "2026-02-20",
    },
    {
      id: "ORD-4405",
      customer: "Divya R.",
      items: ["Summer Dress", "Earrings"],
      total: 2850,
      status: "vendor_approved",
      placedAt: "11:42 AM",
      date: "2026-02-20",
    },
  ],
  "vs-4": [
    {
      id: "ORD-4501",
      customer: "Arjun M.",
      items: ["Silk Kurta Set"],
      total: 4800,
      status: "delivered",
      placedAt: "10:08 AM",
      date: "2026-02-20",
      rider: "Ravi S.",
      eta: "26 mins",
    },
    {
      id: "ORD-4502",
      customer: "Sanjay K.",
      items: ["Cotton Kurta", "Pyjama Set"],
      total: 3200,
      status: "delivered",
      placedAt: "10:18 AM",
      date: "2026-02-20",
      rider: "Manish T.",
      eta: "30 mins",
    },
    {
      id: "ORD-4503",
      customer: "Rohit B.",
      items: ["Nehru Jacket", "Kurta"],
      total: 6500,
      status: "packed",
      placedAt: "10:32 AM",
      date: "2026-02-20",
    },
    {
      id: "ORD-4504",
      customer: "Vikram S.",
      items: ["Festive Kurta Set"],
      total: 5100,
      status: "confirmed",
      placedAt: "10:45 AM",
      date: "2026-02-20",
    },
  ],
  "vs-5": [
    {
      id: "ORD-4601",
      customer: "Lakshmi P.",
      items: ["Pure Silk Saree"],
      total: 22000,
      status: "delivered",
      placedAt: "09:30 AM",
      date: "2026-02-20",
      rider: "Kumar R.",
      eta: "35 mins",
    },
    {
      id: "ORD-4602",
      customer: "Gayatri N.",
      items: ["Kanchipuram Saree", "Blouse Piece"],
      total: 35800,
      status: "delivered",
      placedAt: "09:45 AM",
      date: "2026-02-20",
      rider: "Senthil M.",
      eta: "28 mins",
    },
    {
      id: "ORD-4603",
      customer: "Saraswati D.",
      items: ["Wedding Saree Set"],
      total: 48500,
      status: "dispatched",
      placedAt: "10:00 AM",
      date: "2026-02-20",
      rider: "Ramesh V.",
      eta: "20 mins",
    },
    {
      id: "ORD-4604",
      customer: "Padmini R.",
      items: ["Temple Saree"],
      total: 18200,
      status: "packed",
      placedAt: "10:12 AM",
      date: "2026-02-20",
    },
    {
      id: "ORD-4605",
      customer: "Uma S.",
      items: ["Pattu Saree", "Matching Blouse"],
      total: 27600,
      status: "confirmed",
      placedAt: "10:25 AM",
      date: "2026-02-20",
    },
    {
      id: "ORD-4606",
      customer: "Revathi K.",
      items: ["Silk Cotton Saree"],
      total: 8900,
      status: "vendor_approved",
      placedAt: "10:38 AM",
      date: "2026-02-20",
    },
  ],
  "vs-11": [
    {
      id: "ORD-4701",
      customer: "Gurpreet K.",
      items: ["Phulkari Dupatta"],
      total: 2800,
      status: "delivered",
      placedAt: "10:15 AM",
      date: "2026-02-20",
      rider: "Jaskaran S.",
      eta: "22 mins",
    },
    {
      id: "ORD-4702",
      customer: "Manpreet S.",
      items: ["Phulkari Suit Set"],
      total: 4500,
      status: "delivered",
      placedAt: "10:30 AM",
      date: "2026-02-20",
      rider: "Harjit K.",
      eta: "30 mins",
    },
  ],
};

/* ─── Enriched order detail data (keyed by order ID) ─── */
const orderFullSteps: { key: OrderStatus; label: string }[] = [
  { key: "vendor_approved", label: "Vendor Approved" },
  { key: "payment_pending", label: "Payment Pending" },
  { key: "confirmed", label: "Order Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "dispatched", label: "Dispatched" },
  { key: "delivered", label: "Delivered" },
];

function buildOrderTimeline(status: OrderStatus, placedAt: string) {
  const idx = orderFullSteps.findIndex((s) => s.key === status);
  return [
    { label: "Order Placed", time: placedAt, done: true, active: false },
    ...orderFullSteps.map((s, i) => ({
      label: s.label,
      time: i <= idx ? "" : "",
      done: i <= idx,
      active: i === idx + 1,
    })),
  ];
}

interface OrderDetailExtra {
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
  paymentStatus: "paid" | "pending";
  subtotal: number;
  shipping: number;
  commission: number;
}

const orderDetailExtras: Record<string, OrderDetailExtra> = {
  "ORD-4201": {
    email: "meera@email.com",
    phone: "+91 98123 45678",
    address: {
      line1: "42, Jubilee Hills",
      city: "Hyderabad",
      state: "TS",
      zip: "500033",
    },
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 8450,
    shipping: 0,
    commission: 845,
  },
  "ORD-4202": {
    email: "anita.j@email.com",
    phone: "+91 87654 32109",
    address: {
      line1: "15, Koramangala 5th Block",
      city: "Bangalore",
      state: "KA",
      zip: "560034",
    },
    paymentMethod: "Visa ending 4242",
    paymentStatus: "paid",
    subtotal: 12800,
    shipping: 0,
    commission: 1280,
  },
  "ORD-4203": {
    email: "kavitha@email.com",
    phone: "+91 76543 21098",
    address: {
      line1: "303, Lake View Apts",
      city: "Chennai",
      state: "TN",
      zip: "600028",
    },
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 5650,
    shipping: 0,
    commission: 565,
  },
  "ORD-4204": {
    email: "deepa.n@email.com",
    phone: "+91 65432 10987",
    address: {
      line1: "8, Anna Nagar East",
      city: "Chennai",
      state: "TN",
      zip: "600102",
    },
    paymentMethod: "Dashrobe Wallet",
    paymentStatus: "paid",
    subtotal: 7200,
    shipping: 0,
    commission: 720,
  },
  "ORD-4205": {
    email: "pooja.v@email.com",
    phone: "+91 99876 54321",
    address: {
      line1: "12, Besant Nagar",
      city: "Chennai",
      state: "TN",
      zip: "600090",
    },
    paymentMethod: "Online Payment",
    paymentStatus: "paid",
    subtotal: 9500,
    shipping: 0,
    commission: 950,
  },
  "ORD-4301": {
    email: "simran@email.com",
    phone: "+91 98765 11223",
    address: {
      line1: "Villa 7, DLF Phase 2",
      city: "Gurgaon",
      state: "HR",
      zip: "122002",
    },
    paymentMethod: "Card ending 8821",
    paymentStatus: "paid",
    subtotal: 45000,
    shipping: 0,
    commission: 4500,
  },
  "ORD-4302": {
    email: "riya.s@email.com",
    phone: "+91 88765 22334",
    address: {
      line1: "A-301, Hiranandani Gardens",
      city: "Mumbai",
      state: "MH",
      zip: "400076",
    },
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 28500,
    shipping: 0,
    commission: 2850,
  },
  "ORD-4303": {
    email: "neha.g@email.com",
    phone: "+91 88234 56789",
    address: {
      line1: "F-42, Green Park Extension",
      city: "New Delhi",
      state: "DL",
      zip: "110016",
    },
    paymentMethod: "Online Payment",
    paymentStatus: "paid",
    subtotal: 18200,
    shipping: 0,
    commission: 1820,
  },
  "ORD-4304": {
    email: "priyanka@email.com",
    phone: "+91 77123 44556",
    address: {
      line1: "25, Bandra West",
      city: "Mumbai",
      state: "MH",
      zip: "400050",
    },
    paymentMethod: "Dashrobe Wallet",
    paymentStatus: "paid",
    subtotal: 15600,
    shipping: 0,
    commission: 1560,
  },
  "ORD-4401": {
    email: "sneha.k@email.com",
    phone: "+91 99887 11223",
    address: {
      line1: "18, Indiranagar",
      city: "Bangalore",
      state: "KA",
      zip: "560038",
    },
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 3450,
    shipping: 0,
    commission: 345,
  },
  "ORD-4402": {
    email: "aditi.r@email.com",
    phone: "+91 88776 22334",
    address: {
      line1: "501, Prestige Meridian",
      city: "Bangalore",
      state: "KA",
      zip: "560001",
    },
    paymentMethod: "Card ending 1156",
    paymentStatus: "paid",
    subtotal: 5800,
    shipping: 0,
    commission: 580,
  },
  "ORD-4403": {
    email: "tanya.b@email.com",
    phone: "+91 77665 33445",
    address: {
      line1: "D-12, Whitefield",
      city: "Bangalore",
      state: "KA",
      zip: "560066",
    },
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 4200,
    shipping: 0,
    commission: 420,
  },
  "ORD-4404": {
    email: "swati.p@email.com",
    phone: "+91 66554 44556",
    address: {
      line1: "9, HSR Layout",
      city: "Bangalore",
      state: "KA",
      zip: "560102",
    },
    paymentMethod: "Pending",
    paymentStatus: "pending",
    subtotal: 8900,
    shipping: 0,
    commission: 890,
  },
  "ORD-4405": {
    email: "divya.r@email.com",
    phone: "+91 55443 55667",
    address: {
      line1: "B-7, JP Nagar",
      city: "Bangalore",
      state: "KA",
      zip: "560078",
    },
    paymentMethod: "Pending",
    paymentStatus: "pending",
    subtotal: 2850,
    shipping: 0,
    commission: 285,
  },
  "ORD-4501": {
    email: "arjun.m@email.com",
    phone: "+91 98123 67890",
    address: {
      line1: "22, Civil Lines",
      city: "Jaipur",
      state: "RJ",
      zip: "302006",
    },
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 4800,
    shipping: 0,
    commission: 480,
  },
  "ORD-4502": {
    email: "sanjay.k@email.com",
    phone: "+91 87654 78901",
    address: {
      line1: "45, Malviya Nagar",
      city: "Jaipur",
      state: "RJ",
      zip: "302017",
    },
    paymentMethod: "Online Payment",
    paymentStatus: "paid",
    subtotal: 3200,
    shipping: 0,
    commission: 320,
  },
  "ORD-4503": {
    email: "rohit.b@email.com",
    phone: "+91 76543 89012",
    address: {
      line1: "8, C Scheme",
      city: "Jaipur",
      state: "RJ",
      zip: "302001",
    },
    paymentMethod: "Card ending 5567",
    paymentStatus: "paid",
    subtotal: 6500,
    shipping: 0,
    commission: 650,
  },
  "ORD-4504": {
    email: "vikram.s@email.com",
    phone: "+91 65432 90123",
    address: {
      line1: "11, Vaishali Nagar",
      city: "Jaipur",
      state: "RJ",
      zip: "302021",
    },
    paymentMethod: "Dashrobe Wallet",
    paymentStatus: "paid",
    subtotal: 5100,
    shipping: 0,
    commission: 510,
  },
  "ORD-4601": {
    email: "lakshmi.p@email.com",
    phone: "+91 98765 12345",
    address: {
      line1: "3, T Nagar",
      city: "Chennai",
      state: "TN",
      zip: "600017",
    },
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 22000,
    shipping: 0,
    commission: 2200,
  },
  "ORD-4602": {
    email: "gayatri.n@email.com",
    phone: "+91 87654 23456",
    address: {
      line1: "14, Mylapore",
      city: "Chennai",
      state: "TN",
      zip: "600004",
    },
    paymentMethod: "Card ending 3389",
    paymentStatus: "paid",
    subtotal: 35800,
    shipping: 0,
    commission: 3580,
  },
  "ORD-4603": {
    email: "saraswati@email.com",
    phone: "+91 76543 34567",
    address: {
      line1: "22, Adyar",
      city: "Chennai",
      state: "TN",
      zip: "600020",
    },
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 48500,
    shipping: 0,
    commission: 4850,
  },
  "ORD-4604": {
    email: "padmini.r@email.com",
    phone: "+91 65432 45678",
    address: {
      line1: "B-9, Velachery",
      city: "Chennai",
      state: "TN",
      zip: "600042",
    },
    paymentMethod: "Online Payment",
    paymentStatus: "paid",
    subtotal: 18200,
    shipping: 0,
    commission: 1820,
  },
  "ORD-4605": {
    email: "uma.s@email.com",
    phone: "+91 99876 56789",
    address: { line1: "5, Porur", city: "Chennai", state: "TN", zip: "600116" },
    paymentMethod: "Dashrobe Wallet",
    paymentStatus: "paid",
    subtotal: 27600,
    shipping: 0,
    commission: 2760,
  },
  "ORD-4606": {
    email: "revathi.k@email.com",
    phone: "+91 88765 67890",
    address: {
      line1: "17, Tambaram",
      city: "Chennai",
      state: "TN",
      zip: "600045",
    },
    paymentMethod: "Pending",
    paymentStatus: "pending",
    subtotal: 8900,
    shipping: 0,
    commission: 890,
  },
  "ORD-4701": {
    email: "gurpreet@email.com",
    phone: "+91 98123 78901",
    address: {
      line1: "15, Model Town",
      city: "Ludhiana",
      state: "PB",
      zip: "141002",
    },
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 2800,
    shipping: 0,
    commission: 280,
  },
  "ORD-4702": {
    email: "manpreet@email.com",
    phone: "+91 87654 89012",
    address: {
      line1: "8, Sarabha Nagar",
      city: "Ludhiana",
      state: "PB",
      zip: "141001",
    },
    paymentMethod: "Card ending 7721",
    paymentStatus: "paid",
    subtotal: 4500,
    shipping: 0,
    commission: 450,
  },
};

function formatCurrencyFull(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

const statusConfig: Record<
  StoreStatus,
  { label: string; color: string; bg: string; icon: typeof CircleCheck }
> = {
  DRAFT: {
    label: "Draft",
    color: "#6B7280",
    bg: "#F3F4F6",
    icon: Clock,
  },
  SUBMITTED: {
    label: "Pending",
    color: "#D97706",
    bg: "#FEF3C7",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    color: "#059669",
    bg: "#D1FAE5",
    icon: CircleCheck,
  },
  REJECTED: {
    label: "Rejected",
    color: "#DC2626",
    bg: "#FEE2E2",
    icon: CircleX,
  },
  SUSPENDED: {
    label: "Suspended",
    color: "#7C3AED",
    bg: "#EDE9FE",
    icon: Ban,
  },
};

const CHART_COLORS = ["#220E92", "#FFC100", "#10b981", "#3B82F6", "#F59E0B"];

// ═══════════════════════════════════════════════════════════════
export function AdminStores() {
  const location = useLocation();
  const [stores, setStores] = useState<StoreType[]>([]);
  const [statusCount, setStatusCount] = useState<StatusCountType>({
    DRAFT: 0,
    SUBMITTED: 0,
    APPROVED: 0,
    REJECTED: 0,
    SUSPENDED: 0
  });
  const [activeTab, setActiveTab] = useState<"all" | StoreStatus>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const chartId = useId();
  const areaGradientId = `storeAreaGrad-${chartId.replace(/:/g, "")}`;
  const [previewDoc, setPreviewDoc] = useState<{
    name: string;
    url: string;
    fileType: string;
  } | null>(null);
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");
  const [selectedStoreOrder, setSelectedStoreOrder] =
    useState<StoreOrder | null>(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [approveError, setApproveError] = useState<string>("");
  const [rejectError, setRejectError] = useState("");
  const [vendorDetail, setVendorDetail] = useState<VendorDetailData | null>(null);
  const [vendorDetailLoading, setVendorDetailLoading] = useState(false);
  const TABLE_ROWS = 5;

  // Auto-select store from navigation state (e.g. from Dashboard "View" button)
  useEffect(() => {
    const state = location.state as { store?: StoreType } | null;
    if (state?.store) {
      handleViewVendorDetail(state.store);
      // Clear the state so refreshing doesn't re-trigger
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleDownload = (doc: {
    name: string;
    url?: string;
    fileType?: string;
  }) => {
    if (!doc.url) return;
    // In production this would trigger a real download; here we simulate it
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = `${doc.name.replace(/\s+/g, "_")}.${(
      doc.fileType || "pdf"
    ).toLowerCase()}`;
    link.target = "_blank";
    link.click();
  };

  const fetchStores = async () => {
    try {
      const response = await getAll({
        status: activeTab === "all" ? undefined : activeTab,
        page: tablePage - 1,
        size: TABLE_ROWS,
        search: debouncedSearch || undefined,
      });

      setStores(response.data.stores);
      setStatusCount(response.data.statusCounts);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalEntries);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchStores();
  }, [activeTab, debouncedSearch, tablePage, showRejectModal, showApproveModal]);

  // Stats
  // const totalStores = stores.length;
  // const pendingStores = stores.filter(s => s.status === "pending").length;
  // const approvedStores = stores.filter(s => s.status === "approved").length;
  // const rejectedStores = stores.filter(s => s.status === "rejected").length;
  // const suspendedStores = stores.filter(s => s.status === "suspended").length;
  // const totalRevenue = stores.reduce((sum, s) => sum + s.revenue, 0);
  // const totalOrders = stores.reduce((sum, s) => sum + s.orders, 0);

  // Filters
  // const statusOrder: Record<StoreStatus, number> = { pending: 0, approved: 1, rejected: 2, suspended: 3 };

  // Actions
  const handleApprove = async (id: string) => {
    try {
      setApproveError("");
      const response = await approveStore(id);
      if (response?.status === 200) {
        setShowApproveModal(null);
        setStores((prev) => prev.map((s) => s.vendorId === id ? { ...s, status: "APPROVED" } : s));
        setSelectedStore((prev) => prev?.vendorId === id ? { ...prev, status: "APPROVED" } : prev);
        setVendorDetail((prev) => prev?.vendorId === id ? { ...prev, status: "APPROVED" } : prev);
      } else {
        throw new Error(
          response?.data?.message + response?.status ||
            "Failed to approve store"
        );
      }
    } catch (e) {
      console.error("Error approving store:", e);
      setApproveError(
        e instanceof Error ? e.message.slice(0, 40) : "Unknown error"
      );
      return;
    }
  };

  const handleReject = async (id: string) => {
    try {
      setRejectError("");

      const response = await rejectStore(id, rejectReason);

      if (response?.status === 200) {
        setShowRejectModal(null);
        setRejectReason("");
        setStores((prev) => prev.map((s) => s.vendorId === id ? { ...s, status: "REJECTED" } : s));
        setSelectedStore((prev) => prev?.vendorId === id ? { ...prev, status: "REJECTED" } : prev);
        setVendorDetail((prev) => prev?.vendorId === id ? { ...prev, status: "REJECTED" } : prev);
      } else {
        throw new Error(
          response?.data?.message + response?.status || "Failed to reject store"
        );
      }
    } catch (e) {
      console.error("Error rejecting store:", e);
      setRejectError(
        e instanceof Error ? e.message.slice(0, 40) : "Unknown error"
      );
    }
  };

  const suspendStore = async (id: string) => {
    try {
      const response = await suspendVendorStore(id);

      if (response?.status === 200) {
        setStores((prev) =>
          prev.map((s) =>
            s.vendorId === id ? { ...s, status: "SUSPENDED" } : s
          )
        );
        setSelectedStore((prev) => prev?.vendorId === id ? { ...prev, status: "SUSPENDED" } : prev);
        setVendorDetail((prev) => prev?.vendorId === id ? { ...prev, status: "SUSPENDED" } : prev);
      } else {
        throw new Error("Failed to suspend store");
      }
    } catch (e) {
      console.error("Error suspending store:", e);
    }
  };

  const reactivateStore = async (id: string) => {
    try {
      await reactivateVendorStore(id);
      setStores((prev) =>
        prev.map((s) =>
          s.vendorId === id ? { ...s, status: "APPROVED" } : s
        )
      );
      setActionMenuId(null);
      setSelectedStore((prev) =>
        prev?.vendorId === id ? { ...prev, status: "APPROVED" } : prev
      );
      setVendorDetail((prev) =>
        prev?.vendorId === id ? { ...prev, status: "APPROVED" } : prev
      );
    } catch (e) {
      console.error("Error reactivating store:", e);
    }
  };

  const handleViewVendorDetail = async (store: StoreType) => {
    setSelectedStore(store);
    setVendorDetailLoading(true);
    setVendorDetail(null);
    try {
      const response = await getVendorDetail(store.vendorId);
      if (response.success) {
        setVendorDetail(response.data);
      }
    } catch (error) {
      console.error("Error fetching vendor detail:", error);
    } finally {
      setVendorDetailLoading(false);
    }
  };

  const formatCurrency = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v}`;
  };

  // Pie data for status distribution
  // const pieData = [
  //   { name: "Approved", value: approvedStores, color: "#059669" },
  //   { name: "Pending", value: pendingStores, color: "#D97706" },
  //   { name: "Rejected", value: rejectedStores, color: "#DC2626" },
  //   { name: "Suspended", value: suspendedStores, color: "#7C3AED" },
  // ].filter(d => d.value > 0);

  // ─── Helper: Verified/Boolean badge ────────────────────────
  const VBadge = ({
    ok,
    yes = "Yes",
    no = "No",
  }: {
    ok: boolean;
    yes?: string;
    no?: string;
  }) => (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
      style={{
        fontSize: "11px",
        fontWeight: 600,
        backgroundColor: ok ? "#D1FAE5" : "#FEE2E2",
        color: ok ? "#059669" : "#DC2626",
      }}
    >
      {ok ? (
        <CircleCheck className="w-3 h-3" />
      ) : (
        <CircleX className="w-3 h-3" />
      )}
      {ok ? yes : no}
    </span>
  );

  // ─── Helper: Detail field row ────────────────────────────
  const DField = ({
    label,
    value,
    badge,
  }: {
    label: string;
    value?: string;
    badge?: ReactNode;
  }) => (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
      <span
        className="text-muted-foreground shrink-0"
        style={{ fontSize: "13px" }}
      >
        {label}
      </span>
      <div className="text-right flex items-center gap-2">
        {value && (
          <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>
        )}
        {badge}
      </div>
    </div>
  );

  // ─── Loading State ──────────────────────────────────────────
  if (vendorDetailLoading && selectedStore) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedStore(null); setVendorDetailLoading(false); }} className="p-2 rounded-[10px] hover:bg-muted border border-border transition-colors" style={{ fontSize: "13px" }}>
            ← Back
          </button>
          <h1 style={{ fontSize: "22px", fontWeight: 700 }}>{selectedStore.storeName}</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#220E92] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Loading vendor details...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Detail Panel ──────────────────────────────────────────
  if (vendorDetail && selectedStore) {
    const s = selectedStore;
    const vd = vendorDetail;
    const stCfg = statusConfig[vd.status as StoreStatus] || statusConfig["SUBMITTED"];

    return (
      <div className="space-y-6">
        {/* Back + Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedStore(null); setSelectedStoreOrder(null); setShowStoreDetails(false); setVendorDetail(null); }} className="p-2 rounded-[10px] hover:bg-muted border border-border transition-colors" style={{ fontSize: "13px" }}>
              ← Back
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 style={{ fontSize: "22px", fontWeight: 700 }}>{vd.basicDetails?.storeName || s.storeName}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600, color: stCfg.color, backgroundColor: stCfg.bg }}>
                  <stCfg.icon className="w-3.5 h-3.5" />
                  {stCfg.label}
                </span>
              </div>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>Store ID: {s.vendorId} · Applied {vd.submittedAt?.split("T")[0] || s.submittedAt?.split("T")[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {vd.status === "SUBMITTED" && (
              <>
                <button onClick={() => setShowRejectModal(s.vendorId)} className="px-4 py-2.5 rounded-[10px] border border-red-200 text-red-600 hover:bg-red-50 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                  <span className="flex items-center gap-2"><CircleX className="w-4 h-4" /> Reject</span>
                </button>
                <button
                  onClick={() => vd.currentStep >= 7 && setShowApproveModal(s.vendorId)}
                  disabled={vd.currentStep < 7}
                  className={`px-4 py-2.5 rounded-[10px] transition-colors ${
                    vd.currentStep >= 7
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-muted text-muted-foreground/50 cursor-not-allowed"
                  }`}
                  style={{ fontSize: "14px", fontWeight: 500 }}
                  title={vd.currentStep >= 7 ? "Approve this store" : `Onboarding incomplete (Step ${vd.currentStep}/7)`}
                >
                  <span className="flex items-center gap-2"><CircleCheck className="w-4 h-4" /> Approve</span>
                </button>
              </>
            )}
            {vd.status === "APPROVED" && (
              <button onClick={() => suspendStore(s.vendorId)} className="px-4 py-2.5 rounded-[10px] border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                <span className="flex items-center gap-2"><Ban className="w-4 h-4" /> Suspend</span>
              </button>
            )}
            {(vd.status === "SUSPENDED" || vd.status === "REJECTED") && (
              <button onClick={() => reactivateStore(s.vendorId)} className="px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reactivate</span>
              </button>
            )}
          </div>
        </div>

        {/* Rejection Reason Banner */}
        {vd.rejectionReason && vd.status === "REJECTED" && (
          <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 flex items-start gap-3">
            <TriangleAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#DC2626" }}>Rejection Reason</p>
              <p style={{ fontSize: "13px", color: "#991B1B" }} className="mt-0.5">{vd.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Onboarding Progress Banner */}
        <div className={`rounded-[12px] border p-4 ${vd.currentStep >= 7 ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"}`}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: "14px", fontWeight: 600 }}>Onboarding Progress</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: vd.currentStep >= 8 ? "#059669" : "#D97706" }}>
              {vd.currentStep >= 7 ? "All 7 steps complete" : `Step ${vd.currentStep} of 7`}
            </span>
          </div>
          <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-border">
            <div className="h-full rounded-full transition-all" style={{ width: `${(vd.currentStep / 7) * 100}%`, backgroundColor: vd.currentStep >= 7 ? "#059669" : "#D97706" }} />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {["Basic Details", "Operations", "Categories", "Banking", "Returns", "Offers", "Review"].map((step, i) => (
              <span key={step} className="px-2.5 py-1 rounded-lg" style={{ fontSize: "11px", fontWeight: 600, backgroundColor: i < vd.currentStep ? "#D1FAE5" : "#F3F4F6", color: i < vd.currentStep ? "#059669" : "#9CA3AF" }}>
                {i < vd.currentStep ? "✓ " : ""}{step}
              </span>
            ))}
          </div>
        </div>

        {/* ───── Onboarding Details ───── */}
        <div className="space-y-5">
          {/* Step 1: Basic Details */}
          {vd.basicDetails && (
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>1</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Vendor Basic Details</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <div>
                    <DField label="Store Name" value={vd.basicDetails.storeName} />
                    <DField label="Business Name" value={vd.basicDetails.businessName} />
                    <DField label="Owner" value={vd.basicDetails.ownerName} />
                    <DField label="Legal Entity" value={vd.basicDetails.legalEntityType} />
                    <DField label="GSTIN" value={vd.basicDetails.gstin} />
                    <DField label="PAN" value={vd.basicDetails.pan} />
                  </div>
                  <div>
                    <DField label="Contact Person" value={`${vd.basicDetails.contactPersonName} (${vd.basicDetails.designation})`} />
                    <DField label="Phone" value={vd.basicDetails.phoneNumber} />
                    <DField label="WhatsApp" value={vd.basicDetails.whatsappNumber} />
                    {vd.basicDetails.alternatePhone && <DField label="Alt. Phone" value={vd.basicDetails.alternatePhone} />}
                    <DField label="Email" value={vd.basicDetails.email} />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Business Address</p>
                  <p style={{ fontSize: "13px", fontWeight: 500 }} className="mt-1">{vd.basicDetails.businessAddress}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Store Operations */}
          {vd.currentStep >= 2 && vd.storeOperations && (
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>2</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Store Operations</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <div>
                    <DField label="Store Location" value={vd.storeOperations.storeLocation} />
                    <DField label="Preparation Time" value={`${vd.storeOperations.orderPreparationTime} mins`} />
                    <DField label="Packing Time" value={`${vd.storeOperations.averagePackingTime} mins`} />
                  </div>
                  <div>
                    <DField label="30-min Delivery" badge={<VBadge ok={vd.storeOperations.readyFor30MinDelivery} yes="Enabled" no="Disabled" />} />
                    <DField label="Packaging" value={vd.storeOperations.packagingResponsibility} />
                    <DField label="Delivery Coverage" value={vd.storeOperations.deliveryCoverageKm != null ? `${vd.storeOperations.deliveryCoverageKm} km` : "NA"} />
                  </div>
                </div>
                {vd.storeOperations.operatingHours.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-muted-foreground mb-2" style={{ fontSize: "12px", fontWeight: 500 }}>Operating Hours</p>
                    <div className="flex flex-wrap gap-2">
                      {vd.storeOperations.operatingHours.map((oh) => (
                        <span key={oh.day} className={`px-3 py-1 rounded-full ${oh.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                          {oh.day}: {oh.isOpen ? `${oh.openTime}–${oh.closeTime}` : "Closed"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Product Categories */}
          {vd.currentStep >= 3 && vd.productCategories && (
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>3</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Product Categories</h3>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Selected Categories</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vd.productCategories.selectedCategories.map((cat) => (
                      <span key={cat.id} className="bg-[#220E92]/8 text-[#220E92] px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{cat.name}</span>
                    ))}
                  </div>
                </div>
                {/* <DField label="SKU Count (Approx)" value={String(vd.productCategories.skuCountApprox)} />
                <DField label="Pricing Type" value={vd.productCategories.pricingType} /> */}
                <DField label="Price Range" value={vd.productCategories.averagePriceRange} />
                <DField label="Customization Offered" badge={<VBadge ok={vd.productCategories.customizationAvailable} yes="Available" no="Not Available" />} />
              </div>
            </div>
          )}

          {/* Step 4: Bank & Settlement */}
          {vd.currentStep >= 4 && vd.bankSettlement && (
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>4</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Bank & Settlement Details</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <div>
                    <DField label="Account Holder" value={vd.bankSettlement.accountHolderName || "—"} />
                    <DField label="Bank Name" value={vd.bankSettlement.bankName || "—"} />
                    <DField label="Account Number" value={vd.bankSettlement.accountNumber || "—"} />
                    <DField label="Account Type" value={vd.bankSettlement.accountType || "—"} />
                    <DField label="IFSC Code" value={vd.bankSettlement.ifscCode || "—"} />
                    {vd.bankSettlement.upiId && <DField label="UPI ID" value={vd.bankSettlement.upiId} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-[#220E92]" />
                      <p style={{ fontSize: "13px", fontWeight: 600 }}>Documents & Certificates</p>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: "GST Certificate", uploaded: !!vd.bankSettlement.docGstCertificateS3Key },
                        { name: "Business PAN", uploaded: !!vd.bankSettlement.docBusinessPanS3Key },
                        { name: "Owner PAN", uploaded: !!vd.bankSettlement.docOwnerPanS3Key },
                        { name: "Bank Proof", uploaded: !!vd.bankSettlement.docBankProofS3Key },
                      ].map((doc) => (
                        <div key={doc.name} className="flex items-center justify-between py-2.5 px-3.5 rounded-[10px] bg-muted/40 border border-border/60">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${doc.uploaded ? "bg-emerald-100" : "bg-red-100"}`}>
                              {doc.uploaded ? <FileCheck className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-red-500" />}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{doc.name}</p>
                            </div>
                          </div>
                          <VBadge ok={doc.uploaded} yes="Uploaded" no="Missing" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Refund Policy */}
          {vd.currentStep >= 5 && vd.refundPolicy && (
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>5</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Refund Policy</h3>
              </div>
              <div className="p-5">
                <DField label="Contact Number" value={vd.refundPolicy.refundContactNumber} />
                <DField label="Contact Email" value={vd.refundPolicy.refundContactEmail} />
              </div>
            </div>
          )}

          {/* Step 6: Offers & Promotions */}
          {vd.currentStep >= 6 && vd.offersPromotions && (
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>6</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Offers & Promotions</h3>
              </div>
              <div className="p-5">
                <DField label="Free Shipping" badge={<VBadge ok={vd.offersPromotions.freeShippingEnabled} yes="Enabled" no="Disabled" />} />
                <DField label="Platform Ads" badge={<VBadge ok={vd.offersPromotions.platformAdsOptedIn} yes="Opted In" no="Not Opted In" />} />
              </div>
            </div>
          )}

          {/* Step 8: Review & Declaration */}
          {vd.currentStep >= 7 && (
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>7</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Review & Declaration</h3>
              </div>
              <div className="p-5">
                <DField label="Declaration Accepted" badge={<VBadge ok={vd.declarationsAccepted} yes="Accepted" no="Not accepted" />} />
                <DField label="Submitted At" value={vd.submittedAt?.split("T")[0] || "—"} />
              </div>
            </div>
          )}

          {/* Incomplete notice */}
          {vd.currentStep < 7 && (
            <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4 flex items-start gap-3">
              <TriangleAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#92400E" }}>Onboarding Incomplete</p>
                <p style={{ fontSize: "13px", color: "#92400E" }} className="mt-0.5">
                  This vendor has completed {vd.currentStep} of 7 onboarding steps. Steps {vd.currentStep + 1}–7 have not been filled yet. The store cannot be approved until all steps are complete.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Store Info Card */}
        <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Store Information</h3>
          <div className="space-y-4">
            {[
              { icon: Users, label: "Owner", value: vd.basicDetails?.ownerName || s.ownerName },
              { icon: Mail, label: "Email", value: vd.basicDetails?.email || "—" },
              { icon: Phone, label: "Phone", value: vd.basicDetails?.phoneNumber || "—" },
              { icon: MapPin, label: "Location", value: s.location || vd.storeOperations?.storeLocation || "—" },
              { icon: FileText, label: "GSTIN", value: vd.basicDetails?.gstin || "—" },
              { icon: Calendar, label: "Submitted At", value: vd.submittedAt?.split("T")[0] || s.submittedAt?.split("T")[0] || "—" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{item.label}</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approve Modal (in detail view) */}
        {showApproveModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowApproveModal(null); setApproveError(""); }}
          >
            <div className="bg-card rounded-[12px] p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CircleCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Approve Store</h3>
                  <p className="text-muted-foreground" style={{ fontSize: "13px" }}>This will activate the vendor's store</p>
                </div>
              </div>
              <p style={{ fontSize: "14px" }} className="mb-5">
                Are you sure you want to approve <strong>{vd.basicDetails?.storeName || s.storeName}</strong>? The vendor will be able to list products and receive orders.
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setShowApproveModal(null); setApproveError(""); }} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                  Cancel
                </button>
                <button onClick={() => handleApprove(showApproveModal)} className="flex-1 px-4 py-2.5 rounded-[10px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                  Approve
                </button>
              </div>
              {approveError && <p className="text-xs text-red-500 mt-2">{approveError}</p>}
            </div>
          </div>
        )}

        {/* Reject Modal (in detail view) */}
        {showRejectModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowRejectModal(null); setRejectReason(""); setRejectError(""); }}
          >
            <div className="bg-card rounded-[12px] p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <CircleX className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Reject Store Application</h3>
                  <p className="text-muted-foreground" style={{ fontSize: "13px" }}>The vendor will be notified</p>
                </div>
              </div>
              <p style={{ fontSize: "14px" }} className="mb-4">
                Rejecting <strong>{vd.basicDetails?.storeName || s.storeName}</strong>'s application.
              </p>
              <div className="mb-5">
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>Reason for rejection *</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., Incomplete documentation, invalid GST number..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background resize-none"
                  style={{ fontSize: "14px" }}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowRejectModal(null); setRejectReason(""); setRejectError(""); }} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                  Cancel
                </button>
                <button onClick={() => handleReject(showRejectModal)} disabled={!rejectReason.trim()} className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50" style={{ fontSize: "14px", fontWeight: 500 }}>
                  Reject
                </button>
              </div>
              {rejectError && <p className="text-xs text-red-500 mt-2">{rejectError}</p>}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Main List View ────────────────────────────────────────
  return (
    <div className="space-y-6" onClick={() => setActionMenuId(null)}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Vendor Stores</h1>
        <p
          className="text-muted-foreground mt-0.5"
          style={{ fontSize: "13px" }}
        >
          Manage vendor applications, approvals, and monitor store performance
        </p>
      </div>

      {/* KPI Cards - Analytics on top */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Stores", value: totalStores, icon: Store, color: "#220E92" },
          { label: "Pending Review", value: pendingStores, icon: Clock, color: "#D97706" },
          { label: "Approved", value: approvedStores, icon: CircleCheck, color: "#059669" },
          { label: "Rejected", value: rejectedStores, icon: CircleX, color: "#DC2626" },
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: IndianRupee, color: "#FFC100" },
          { label: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingCart, color: "#3B82F6" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-[12px] border border-border shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{stat.label}</span>
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p style={{ fontSize: "22px", fontWeight: 700 }}>{stat.value}</p>
          </div>
        ))}
      </div> */}

      {/* Status Distribution + Top Stores */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart id={`storePie-${chartId.replace(/:/g, "")}`}>
              <Pie key="pie" data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key="tooltip" />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-card rounded-[12px] border border-border shadow-sm p-5">
          <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Top Stores by Revenue</h3>
          <div className="space-y-3">
            {stores
              .filter(s => s.status === "approved" && s.revenue > 0)
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((s, i) => {
                const maxRev = Math.max(...stores.filter(st => st.revenue > 0).map(st => st.revenue));
                return (
                  <div key={s.id} className="flex items-center gap-3 group cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedStore(s); }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: i < 3 ? "#FFC10020" : "#F3F4F6", fontSize: "11px", fontWeight: 700, color: i < 3 ? "#220E92" : "#6B7280" }}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="truncate group-hover:text-[#220E92] transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>{s.name}</span>
                        <span style={{ fontSize: "14px", fontWeight: 700 }}>{formatCurrency(s.revenue)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(s.revenue / maxRev) * 100}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{s.orders.toLocaleString()} orders</span>
                        <span className="text-muted-foreground" style={{ fontSize: "11px" }}>★ {s.rating}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                );
              })}
          </div>
        </div>
      </div> */}

      {/* Tab Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-muted rounded-[12px] p-1.5">
          {(
            [
              { key: "all", label: "All Stores", value: "all" },
              { key: "pending", label: "Pending", value: "SUBMITTED" },
              { key: "approved", label: "Approved", value: "APPROVED" },
              { key: "rejected", label: "Rejected", value: "REJECTED" },
              { key: "suspended", label: "Suspended", value: "SUSPENDED" },
            ] as { key: string; label: string; value: "all" | StoreStatus }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.value);
                setTablePage(1);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] transition-all ${
                activeTab === tab.value
                  ? "bg-[#220E92] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-md ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-border text-muted-foreground"
                }`}
                style={{ fontSize: "11px", fontWeight: 700 }}
              >
                {tab.key === "all" ? (statusCount.APPROVED + statusCount.DRAFT + statusCount.REJECTED + statusCount.SUBMITTED + statusCount.SUSPENDED) : tab.key === "pending" ? statusCount.SUBMITTED : tab.key === "approved" ? statusCount.APPROVED : tab.key === "rejected" ? statusCount.REJECTED : tab.key === "suspended" ? statusCount.SUSPENDED : 0}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stores, owners, cities..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setTablePage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-border bg-card"
            style={{ fontSize: "14px" }}
          />
        </div>
      </div>

      {/* Store Table */}
      <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {[
                  "Store",
                  "Owner",
                  "Location",
                  "Revenue",
                  "Orders",
                  "Status",
                  "Applied",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => {
                const stCfg = statusConfig[store.status];
                return (
                  <tr
                    key={store.vendorId}
                    className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedStore(store);
                      setOrderFilter("all");
                      setShowStoreDetails(false);
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#220E9212" }}
                        >
                          <Store
                            className="w-4 h-4"
                            style={{ color: "#220E92" }}
                          />
                        </div>
                        <span
                          className="hover:text-[#220E92] transition-colors"
                          style={{ fontSize: "14px", fontWeight: 600 }}
                        >
                          {store.storeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>
                          {store.ownerName}
                        </p>
                        {/* <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{store.email}</p> */}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "13px" }}
                      >
                        {store.location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>
                        {store.revenue > 0
                          ? formatCurrency(store.revenue)
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>
                        {store.orderCount > 0
                          ? store.orderCount.toLocaleString()
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: stCfg.color,
                          backgroundColor: stCfg.bg,
                        }}
                      >
                        <stCfg.icon className="w-3.5 h-3.5" />
                        {stCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "12px" }}
                      >
                        {store.submittedAt?.split("T")[0] || "—"}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative flex items-center gap-1">
                        {/* Pending actions */}
                        {store.status === "SUBMITTED" && (
                          <button
                            onClick={() =>
                              store.status === "SUBMITTED" &&
                              setShowApproveModal(store.vendorId)
                            }
                            disabled={store.status !== "SUBMITTED"}
                            className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-colors ${
                              store.status === "SUBMITTED"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300"
                                : "bg-muted/50 text-muted-foreground/50 border-border cursor-not-allowed"
                            }`}
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title={
                              store.status === "SUBMITTED"
                                ? "Approve"
                                : `Cannot approve a ${store.status} store`
                            }
                          >
                            <CircleCheck className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        {store.status === "SUBMITTED" && (
                          <button
                            onClick={() => setShowRejectModal(store.vendorId)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title="Reject"
                          >
                            <CircleX className="w-3.5 h-3.5" /> Reject
                          </button>
                        )}
                        {/* Approved actions */}
                        {store.status === "APPROVED" && (
                          <button
                            onClick={() => suspendStore(store.vendorId)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title="Suspend"
                          >
                            <Ban className="w-3.5 h-3.5" /> Suspend
                          </button>
                        )}
                        {/* Rejected actions */}
                        {store.status === "REJECTED" && (
                          <button
                            onClick={() => reactivateStore(store.vendorId)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title="Reactivate"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reactivate
                          </button>
                        )}
                        {/* Suspended actions */}
                        {store.status === "SUSPENDED" && (
                          <button
                            onClick={() => reactivateStore(store.vendorId)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title="Reactivate"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reactivate
                          </button>
                        )}
                        {/* View button for all */}
                        <button
                          onClick={() => handleViewVendorDetail(store)}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p style={{ fontSize: "15px", fontWeight: 600 }}>
                      No stores found
                    </p>
                    <p
                      className="text-muted-foreground mt-1"
                      style={{ fontSize: "13px" }}
                    >
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {stores.length > 0 && (
          <Pagination
            currentPage={tablePage}
            totalPages={totalPages}
            totalItems={totalElements}
            itemsPerPage={TABLE_ROWS}
            onPageChange={setTablePage}
            itemLabel="stores"
          />
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* APPROVE MODAL                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showApproveModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowApproveModal(null);
            setApproveError("");
          }}
        >
          <div
            className="bg-card rounded-[12px] p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <CircleCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
                  Approve Store
                </h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "13px" }}
                >
                  This will activate the vendor's store
                </p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-5">
              Are you sure you want to approve{" "}
              <strong>
                {stores.find((s) => s.vendorId === showApproveModal)?.storeName}
              </strong>
              ? The vendor will be able to list products and receive orders.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApproveModal(null);
                  setApproveError("");
                }}
                className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(showApproveModal)}
                className="flex-1 px-4 py-2.5 rounded-[10px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Approve
              </button>
            </div>
            {approveError && (
              <p className="text-xs text-red-500">{approveError}</p>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* REJECT MODAL                                           */}
      {/* ═══════════════════════════════════════════════��═══════ */}
      {showRejectModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowRejectModal(null);
            setRejectReason("");
            setRejectError("");
          }}
        >
          <div
            className="bg-card rounded-[12px] p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <CircleX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
                  Reject Store Application
                </h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "13px" }}
                >
                  The vendor will be notified
                </p>
              </div>
            </div>
            <p style={{ fontSize: "14px" }} className="mb-4">
              Rejecting{" "}
              <strong>
                {stores.find((s) => s.vendorId === showRejectModal)?.storeName}
              </strong>
              's application.
            </p>
            <div className="mb-5">
              <label
                className="block text-muted-foreground mb-1.5"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Reason for rejection *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Incomplete documentation, invalid GST number..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-[10px] border border-border bg-background resize-none"
                style={{ fontSize: "14px" }}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                  setRejectError("");
                }}
                className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Reject
              </button>
            </div>
            {rejectError && (
              <p className="text-xs text-red-500">{rejectError}</p>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DOCUMENT PREVIEW MODAL                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      {/* {previewDoc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-card rounded-[12px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-[10px] bg-[#220E92]/8 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5 text-[#220E92]" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate" style={{ fontSize: "16px", fontWeight: 600 }}>{previewDoc.name}</h3>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{previewDoc.fileType} Document</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-muted/20">
              <div className="bg-white rounded-[12px] border border-border shadow-sm p-8 min-h-[400px] flex flex-col items-center">
                <div className="w-full max-w-md text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#220E92]/8 flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-[#220E92]" />
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Government of India</p>
                    <h4 className="mt-1" style={{ fontSize: "20px", fontWeight: 700 }}>{previewDoc.name}</h4>
                  </div>

                  <div className="border-t border-b border-border py-4 space-y-3 text-left">
                    {previewDoc.name.includes("GST") && selectedStore?.onboardingData && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>GSTIN</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.gstin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Legal Name</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Trade Name</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.storeName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Address</span>
                          <span className="text-right max-w-[250px]" style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.businessAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Status</span>
                          <VBadge ok={selectedStore.onboardingData.gstVerified} yes="Active" no="Inactive" />
                        </div>
                      </>
                    )}
                    {previewDoc.name.includes("PAN") && selectedStore?.onboardingData && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>PAN Number</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.pan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Name</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>
                            {previewDoc.name.includes("Business") ? selectedStore.onboardingData.businessName : selectedStore.onboardingData.ownerName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Entity Type</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.legalEntityType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Status</span>
                          <VBadge ok={selectedStore.onboardingData.panVerified} yes="Verified" no="Unverified" />
                        </div>
                      </>
                    )}
                    {previewDoc.name.includes("Bank") && selectedStore?.onboardingData && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Account Holder</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.accountHolder}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Bank Name</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Account Number</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>IFSC Code</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.ifscCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Verified</span>
                          <VBadge ok={selectedStore.onboardingData.bankVerified} yes="Verified" no="Unverified" />
                        </div>
                      </>
                    )}
                    {!previewDoc.name.includes("GST") && !previewDoc.name.includes("PAN") && !previewDoc.name.includes("Bank") && selectedStore?.onboardingData && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Document</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{previewDoc.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Issued To</span>
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStore.onboardingData.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Status</span>
                          <VBadge ok={true} yes="Valid" />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-2">
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
                      This is a preview of the uploaded document. Click "Download" to get the original file.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
