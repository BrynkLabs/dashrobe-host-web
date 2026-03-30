import { useState, useId, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import {
  Search, Filter, ChevronDown, Check, X, Eye,
  Store, ShoppingCart, TrendingUp, Package, Users,
  CircleCheck, CircleX, Clock, TriangleAlert,
  ExternalLink, Mail, Phone, MapPin, Calendar,
  IndianRupee, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, FileText, Ban, RotateCcw,
  Download, FileCheck, Shield, Truck, PackageCheck,
  CreditCard, ClipboardList, CheckCheck,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { Pagination } from "../../components/Pagination";

// ─── Types ───────────────────────────────────────────────────
type StoreStatus = "pending" | "approved" | "rejected" | "suspended";

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
  documents: { name: string; uploaded: boolean; url?: string; fileType?: string; fileSize?: string }[];
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
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  gstNumber: string;
  category: string;
  onboardingStep: number;
  onboardingComplete: boolean;
  status: StoreStatus;
  appliedAt: string;
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

// ─── Mock Data ───────────────────────────────────────────────
const initialStores: VendorStore[] = [
  {
    id: "vs-1", name: "Priya Silks Emporium", ownerName: "Priya Sharma", email: "priya@priyasilks.in", phone: "+91 98765 43210", city: "Varanasi", state: "Uttar Pradesh", gstNumber: "09AABCT1332L1ZV", category: "Sarees", onboardingStep: 8, onboardingComplete: true, status: "approved", appliedAt: "2025-01-05", approvedAt: "2025-01-08", revenue: 4850000, orders: 1842, products: 342, returnRate: 3.2, avgOrderValue: 2634, rating: 4.7, acceptedOrdersRatio: 94.2,
    monthlyRevenue: [{ month: "Sep", revenue: 520000 }, { month: "Oct", revenue: 610000 }, { month: "Nov", revenue: 780000 }, { month: "Dec", revenue: 920000 }, { month: "Jan", revenue: 850000 }, { month: "Feb", revenue: 670000 }],
    onboardingData: { storeName: "Priya Silks Emporium", businessName: "Priya Silk Traders Pvt Ltd", ownerName: "Priya Sharma", legalEntityType: "Private Limited", gstin: "09AABCT1332L1ZV", gstVerified: true, pan: "AABCT1332L", panVerified: true, businessAddress: "34, Vishwanath Gali, Varanasi - 221001", contactPerson: "Priya Sharma", designation: "Director", phone: "+91 98765 43210", phoneVerified: true, email: "priya@priyasilks.in", storeLocation: "34, Vishwanath Gali, Varanasi - 221001", openingTime: "10:00", closingTime: "21:00", weeklyOff: "None", prepTime: "5-7 mins", packingTime: "8", readyFor30Min: true, packagingResponsibility: "Vendor (Self)", deliveryCoverage: "10 km", selectedCategories: ["Women's Wear", "Handmade"], priceRange: "₹2,000 – ₹50,000", customization: true, accountHolder: "Priya Silk Traders Pvt Ltd", bankName: "ICICI Bank", accountNumber: "••••••••6789", accountType: "Current", ifscCode: "ICIC0001234", bankVerified: true, documents: [{ name: "GST Certificate", uploaded: true, url: "/mock/gst-cert-priya-silks.pdf", fileType: "PDF", fileSize: "1.3 MB" }, { name: "Business PAN Card", uploaded: true, url: "/mock/pan-business-priya-silks.pdf", fileType: "PDF", fileSize: "890 KB" }, { name: "Owner PAN Card", uploaded: true, url: "/mock/pan-owner-priya.pdf", fileType: "PDF", fileSize: "750 KB" }, { name: "Bank Proof (Cancelled Cheque)", uploaded: true, url: "/mock/cheque-priya-silks.jpg", fileType: "JPG", fileSize: "1.6 MB" }, { name: "FSSAI License", uploaded: true, url: "/mock/fssai-priya-silks.pdf", fileType: "PDF", fileSize: "540 KB" }], refundWindow: "7 Days", exchangePolicy: "7 Days", refundMode: "Original Payment Method", tryAndBuy: true, maxTryItems: 3, discountTypes: ["% Off", "Buy 1 Get 1"], maxDiscount: "25%", minimumOrderValue: "₹2,000", inventoryMethod: "Excel Upload", dailyUpdate: true, orderAcceptanceSLA: true, packingSLA: true, fillRate: "94%", needPhotography: false, declarationAccepted: true, submittedAt: "2025-01-05" },
  },
  {
    id: "vs-2", name: "Regal Ethnic Wear", ownerName: "Arjun Mehta", email: "arjun@regalethnic.com", phone: "+91 87654 32109", city: "Jaipur", state: "Rajasthan", gstNumber: "08AALCR5678F1Z8", category: "Lehengas", onboardingStep: 8, onboardingComplete: true, status: "approved", appliedAt: "2025-01-10", approvedAt: "2025-01-13", revenue: 3720000, orders: 1256, products: 218, returnRate: 2.8, avgOrderValue: 2962, rating: 4.5, acceptedOrdersRatio: 91.7,
    monthlyRevenue: [{ month: "Sep", revenue: 380000 }, { month: "Oct", revenue: 450000 }, { month: "Nov", revenue: 620000 }, { month: "Dec", revenue: 850000 }, { month: "Jan", revenue: 720000 }, { month: "Feb", revenue: 520000 }],
    onboardingData: { storeName: "Regal Ethnic Wear", businessName: "Mehta Fashion House", ownerName: "Arjun Mehta", legalEntityType: "Partnership", gstin: "08AALCR5678F1Z8", gstVerified: true, pan: "AALCR5678F", panVerified: true, businessAddress: "12, MI Road, Jaipur - 302001", contactPerson: "Arjun Mehta", designation: "Partner", phone: "+91 87654 32109", phoneVerified: true, email: "arjun@regalethnic.com", storeLocation: "12, MI Road, Jaipur - 302001", openingTime: "10:00", closingTime: "20:00", weeklyOff: "Sunday", prepTime: "7-9 mins", packingTime: "10", readyFor30Min: false, packagingResponsibility: "Vendor (Self)", deliveryCoverage: "8 km", selectedCategories: ["Women's Wear", "Bridal"], priceRange: "₹5,000 – ₹80,000", customization: true, accountHolder: "Mehta Fashion House", bankName: "Axis Bank", accountNumber: "••••••••5432", accountType: "Current", ifscCode: "UTIB0001234", bankVerified: true, documents: [{ name: "GST Certificate", uploaded: true, url: "/mock/gst-cert-regal-ethnic.pdf", fileType: "PDF", fileSize: "1.1 MB" }, { name: "Business PAN Card", uploaded: true, url: "/mock/pan-business-regal-ethnic.pdf", fileType: "PDF", fileSize: "820 KB" }, { name: "Owner PAN Card", uploaded: true, url: "/mock/pan-owner-arjun.pdf", fileType: "PDF", fileSize: "680 KB" }, { name: "Bank Proof (Cancelled Cheque)", uploaded: true, url: "/mock/cheque-regal-ethnic.jpg", fileType: "JPG", fileSize: "1.9 MB" }], refundWindow: "7 Days", exchangePolicy: "7 Days", refundMode: "Original Payment Method", tryAndBuy: false, discountTypes: ["% Off"], maxDiscount: "20%", minimumOrderValue: "₹5,000", inventoryMethod: "Excel Upload", dailyUpdate: true, orderAcceptanceSLA: true, packingSLA: true, fillRate: "91%", needPhotography: true, declarationAccepted: true, submittedAt: "2025-01-10" },
  },
  {
    id: "vs-3", name: "Bombay Fashion Hub", ownerName: "Sneha Patil", email: "sneha@bombayfashion.in", phone: "+91 76543 21098", city: "Mumbai", state: "Maharashtra", gstNumber: "27AADCB2230M1ZX", category: "Dresses", onboardingStep: 8, onboardingComplete: true, status: "approved", appliedAt: "2025-01-20", approvedAt: "2025-01-24", revenue: 2890000, orders: 983, products: 167, returnRate: 4.1, avgOrderValue: 2941, rating: 4.3, acceptedOrdersRatio: 88.5,
    monthlyRevenue: [{ month: "Sep", revenue: 310000 }, { month: "Oct", revenue: 360000 }, { month: "Nov", revenue: 490000 }, { month: "Dec", revenue: 680000 }, { month: "Jan", revenue: 580000 }, { month: "Feb", revenue: 470000 }],
    onboardingData: { storeName: "Bombay Fashion Hub", businessName: "SP Fashion Retail LLP", ownerName: "Sneha Patil", legalEntityType: "LLP", gstin: "27AADCB2230M1ZX", gstVerified: true, pan: "AADCB2230M", panVerified: true, businessAddress: "56, Linking Road, Bandra West, Mumbai - 400050", contactPerson: "Sneha Patil", designation: "Partner", phone: "+91 76543 21098", phoneVerified: true, email: "sneha@bombayfashion.in", storeLocation: "56, Linking Road, Mumbai - 400050", openingTime: "11:00", closingTime: "21:30", weeklyOff: "None", prepTime: "3-5 mins", packingTime: "6", readyFor30Min: true, packagingResponsibility: "Shared Responsibility", deliveryCoverage: "12 km", selectedCategories: ["Women's Wear", "Western Wear"], priceRange: "₹1,500 – ₹25,000", customization: false, accountHolder: "SP Fashion Retail LLP", bankName: "Kotak Mahindra Bank", accountNumber: "••••••••2345", accountType: "Current", ifscCode: "KKBK0001234", bankVerified: true, documents: [{ name: "GST Certificate", uploaded: true, url: "/mock/gst-cert-bombay-fashion.pdf", fileType: "PDF", fileSize: "1.0 MB" }, { name: "Business PAN Card", uploaded: true, url: "/mock/pan-business-bombay-fashion.pdf", fileType: "PDF", fileSize: "760 KB" }, { name: "Owner PAN Card", uploaded: true, url: "/mock/pan-owner-sneha.pdf", fileType: "PDF", fileSize: "640 KB" }, { name: "Bank Proof (Cancelled Cheque)", uploaded: true, url: "/mock/cheque-bombay-fashion.jpg", fileType: "JPG", fileSize: "1.4 MB" }], refundWindow: "7 Days", exchangePolicy: "7 Days", refundMode: "Original Payment Method", tryAndBuy: true, maxTryItems: 2, discountTypes: ["% Off", "Flat Off"], maxDiscount: "30%", minimumOrderValue: "₹1,500", inventoryMethod: "API", dailyUpdate: true, orderAcceptanceSLA: true, packingSLA: true, fillRate: "93%", needPhotography: false, declarationAccepted: true, submittedAt: "2025-01-20" },
  },
  {
    id: "vs-4", name: "Delhi Kurta House", ownerName: "Rahul Singh", email: "rahul@delhikurta.com", phone: "+91 65432 10987", city: "New Delhi", state: "Delhi", gstNumber: "07AAKCD9876K1Z6", category: "Kurta Sets", onboardingStep: 8, onboardingComplete: true, status: "approved", appliedAt: "2025-02-01", approvedAt: "2025-02-04", revenue: 1950000, orders: 756, products: 134, returnRate: 2.5, avgOrderValue: 2579, rating: 4.6, acceptedOrdersRatio: 96.1,
    monthlyRevenue: [{ month: "Sep", revenue: 210000 }, { month: "Oct", revenue: 280000 }, { month: "Nov", revenue: 340000 }, { month: "Dec", revenue: 480000 }, { month: "Jan", revenue: 390000 }, { month: "Feb", revenue: 250000 }],
    onboardingData: { storeName: "Delhi Kurta House", businessName: "RS Ethnic Wear Pvt Ltd", ownerName: "Rahul Singh", legalEntityType: "Private Limited", gstin: "07AAKCD9876K1Z6", gstVerified: true, pan: "AAKCD9876K", panVerified: true, businessAddress: "23, Chandni Chowk, New Delhi - 110006", contactPerson: "Rahul Singh", designation: "MD", phone: "+91 65432 10987", phoneVerified: true, email: "rahul@delhikurta.com", storeLocation: "23, Chandni Chowk, New Delhi - 110006", openingTime: "10:00", closingTime: "20:30", weeklyOff: "Sunday", prepTime: "5-7 mins", packingTime: "7", readyFor30Min: true, packagingResponsibility: "Vendor (Self)", deliveryCoverage: "15 km", selectedCategories: ["Men's Wear", "Women's Wear"], priceRange: "₹1,000 – ₹12,000", customization: true, accountHolder: "RS Ethnic Wear Pvt Ltd", bankName: "Punjab National Bank", accountNumber: "••••••••1234", accountType: "Current", ifscCode: "PUNB0001234", bankVerified: true, documents: [{ name: "GST Certificate", uploaded: true, url: "/mock/gst-cert-delhi-kurta.pdf", fileType: "PDF", fileSize: "950 KB" }, { name: "Business PAN Card", uploaded: true, url: "/mock/pan-business-delhi-kurta.pdf", fileType: "PDF", fileSize: "700 KB" }, { name: "Owner PAN Card", uploaded: true, url: "/mock/pan-owner-rahul.pdf", fileType: "PDF", fileSize: "620 KB" }, { name: "Bank Proof (Cancelled Cheque)", uploaded: true, url: "/mock/cheque-delhi-kurta.jpg", fileType: "JPG", fileSize: "1.7 MB" }], refundWindow: "7 Days", exchangePolicy: "7 Days", refundMode: "Original Payment Method", tryAndBuy: true, maxTryItems: 3, discountTypes: ["% Off", "Buy 1 Get 1"], maxDiscount: "35%", minimumOrderValue: "₹1,000", inventoryMethod: "Excel Upload", dailyUpdate: true, orderAcceptanceSLA: true, packingSLA: true, fillRate: "96%", needPhotography: false, declarationAccepted: true, submittedAt: "2025-02-01" },
  },
  {
    id: "vs-5", name: "Kanchipuram Weaves", ownerName: "Lakshmi Iyer", email: "lakshmi@kanchiweaves.in", phone: "+91 54321 09876", city: "Chennai", state: "Tamil Nadu", gstNumber: "33AABCK7654H1Z4", category: "Sarees", onboardingStep: 8, onboardingComplete: true, status: "approved", appliedAt: "2025-02-10", approvedAt: "2025-02-13", revenue: 5240000, orders: 2134, products: 278, returnRate: 1.9, avgOrderValue: 2456, rating: 4.8, acceptedOrdersRatio: 97.3,
    monthlyRevenue: [{ month: "Sep", revenue: 620000 }, { month: "Oct", revenue: 740000 }, { month: "Nov", revenue: 890000 }, { month: "Dec", revenue: 1050000 }, { month: "Jan", revenue: 960000 }, { month: "Feb", revenue: 780000 }],
    onboardingData: { storeName: "Kanchipuram Weaves", businessName: "LI Silk Traders", ownerName: "Lakshmi Iyer", legalEntityType: "Sole Proprietorship", gstin: "33AABCK7654H1Z4", gstVerified: true, pan: "AABCK7654H", panVerified: true, businessAddress: "88, Big Kanchipuram Road, Chennai - 600001", contactPerson: "Lakshmi Iyer", designation: "Owner", phone: "+91 54321 09876", phoneVerified: true, email: "lakshmi@kanchiweaves.in", storeLocation: "88, Big Kanchipuram Road, Chennai - 600001", openingTime: "09:00", closingTime: "20:00", weeklyOff: "None", prepTime: "7-9 mins", packingTime: "10", readyFor30Min: false, packagingResponsibility: "Vendor (Self)", deliveryCoverage: "10 km", selectedCategories: ["Women's Wear", "Handmade"], priceRange: "₹3,000 – ₹75,000", customization: true, accountHolder: "Lakshmi Iyer", bankName: "Indian Bank", accountNumber: "••••••••8765", accountType: "Savings", ifscCode: "IDIB0001234", bankVerified: true, documents: [{ name: "GST Certificate", uploaded: true, url: "/mock/gst-cert-kanchi-weaves.pdf", fileType: "PDF", fileSize: "1.2 MB" }, { name: "Business PAN Card", uploaded: true, url: "/mock/pan-business-kanchi-weaves.pdf", fileType: "PDF", fileSize: "850 KB" }, { name: "Owner PAN Card", uploaded: true, url: "/mock/pan-owner-lakshmi.pdf", fileType: "PDF", fileSize: "710 KB" }, { name: "Bank Proof (Cancelled Cheque)", uploaded: true, url: "/mock/cheque-kanchi-weaves.jpg", fileType: "JPG", fileSize: "1.5 MB" }, { name: "Silk Mark Certificate", uploaded: true, url: "/mock/silkmark-kanchi-weaves.pdf", fileType: "PDF", fileSize: "430 KB" }], refundWindow: "5 Days", exchangePolicy: "7 Days", refundMode: "Original Payment Method", tryAndBuy: false, discountTypes: ["% Off"], maxDiscount: "15%", minimumOrderValue: "₹3,000", inventoryMethod: "Excel Upload", dailyUpdate: true, orderAcceptanceSLA: true, packingSLA: true, fillRate: "97%", needPhotography: false, declarationAccepted: true, submittedAt: "2025-02-10" },
  },
  {
    id: "vs-6", name: "Lucknow Chikan Studio", ownerName: "Fatima Khan", email: "fatima@chikanstudio.in", phone: "+91 43210 98765", city: "Lucknow", state: "Uttar Pradesh", gstNumber: "09AABCL4321J1Z2", category: "Kurtis", onboardingStep: 8, onboardingComplete: true, status: "pending", appliedAt: "2025-02-20", revenue: 0, orders: 0, products: 89, returnRate: 0, avgOrderValue: 0, rating: 0, acceptedOrdersRatio: 0,
    monthlyRevenue: [],
    onboardingData: {
      storeName: "Lucknow Chikan Studio", businessName: "FK Chikan Enterprises Pvt Ltd", ownerName: "Fatima Khan", legalEntityType: "Private Limited", gstin: "09AABCL4321J1Z2", gstVerified: true, pan: "AABCL4321J", panVerified: true, businessAddress: "42, Hazratganj Market, Near GPO, Lucknow - 226001, Uttar Pradesh", contactPerson: "Fatima Khan", designation: "Director", phone: "+91 43210 98765", phoneVerified: true, altPhone: "+91 43210 98766", altPhoneVerified: true, email: "fatima@chikanstudio.in", website: "https://lucknowchikan.in", socialMedia: "@lucknowchikanstudio",
      storeLocation: "42, Hazratganj Market, Lucknow - 226001", openingTime: "10:00", closingTime: "21:00", weeklyOff: "None", prepTime: "5-7 mins", packingTime: "8", readyFor30Min: false, packagingResponsibility: "Vendor (Self)", deliveryCoverage: "12 km",
      selectedCategories: ["Women's Wear", "Kids Wear", "Handmade"], priceRange: "₹800 – ₹8,000", customization: true,
      accountHolder: "FK Chikan Enterprises Pvt Ltd", bankName: "State Bank of India", accountNumber: "••••••••4523", accountType: "Current", ifscCode: "SBIN0001234", bankVerified: true, upiId: "fkchikan@sbi", documents: [{ name: "GST Certificate", uploaded: true, url: "/mock/gst-cert-fk-chikan.pdf", fileType: "PDF", fileSize: "1.2 MB" }, { name: "Business PAN Card", uploaded: true, url: "/mock/pan-business-fk-chikan.pdf", fileType: "PDF", fileSize: "840 KB" }, { name: "Owner PAN Card", uploaded: true, url: "/mock/pan-owner-fatima-khan.pdf", fileType: "PDF", fileSize: "720 KB" }, { name: "Bank Proof (Cancelled Cheque)", uploaded: true, url: "/mock/cheque-fk-chikan.jpg", fileType: "JPG", fileSize: "1.8 MB" }],
      refundWindow: "7 Days", exchangePolicy: "7 Days", refundMode: "Original Payment Method", tryAndBuy: true, maxTryItems: 3, returnPolicy: "Items must be unworn with tags attached. Chikan embroidery items are non-refundable if customized.",
      discountTypes: ["% Off", "Buy 1 Get 1"], maxDiscount: "30%", minimumOrderValue: "₹1,500",
      inventoryMethod: "Excel Upload", dailyUpdate: true, orderAcceptanceSLA: true, packingSLA: true, fillRate: "95%", needPhotography: false,
      declarationAccepted: true, submittedAt: "2025-02-20",
    },
  },
  {
    id: "vs-7", name: "Mysore Silk Creations", ownerName: "Deepak Gowda", email: "deepak@mysoresilk.com", phone: "+91 32109 87654", city: "Mysuru", state: "Karnataka", gstNumber: "29AABCM2109G1Z0", category: "Sarees", onboardingStep: 8, onboardingComplete: true, status: "pending", appliedAt: "2025-02-22", revenue: 0, orders: 0, products: 56, returnRate: 0, avgOrderValue: 0, rating: 0, acceptedOrdersRatio: 0,
    monthlyRevenue: [],
    onboardingData: {
      storeName: "Mysore Silk Creations", businessName: "DG Silk Works", ownerName: "Deepak Gowda", legalEntityType: "Sole Proprietorship", gstin: "29AABCM2109G1Z0", gstVerified: true, pan: "AABCM2109G", panVerified: true, businessAddress: "88, Devaraja Market, Sayyaji Rao Road, Mysuru - 570001, Karnataka", contactPerson: "Deepak Gowda", designation: "Owner", phone: "+91 32109 87654", phoneVerified: true, email: "deepak@mysoresilk.com", website: "https://mysoresilkcreations.com", socialMedia: "@mysoresilkcreations",
      storeLocation: "88, Devaraja Market, Mysuru - 570001", openingTime: "09:30", closingTime: "20:30", weeklyOff: "Sunday", prepTime: "7-9 mins", packingTime: "10", readyFor30Min: false, packagingResponsibility: "Vendor (Self)", deliveryCoverage: "8 km",
      selectedCategories: ["Women's Wear"], priceRange: "₹3,000 – ₹50,000", customization: false,
      accountHolder: "Deepak Gowda", bankName: "Canara Bank", accountNumber: "••••••••7891", accountType: "Savings", ifscCode: "CNRB0002109", bankVerified: true, documents: [{ name: "GST Certificate", uploaded: true, url: "/mock/gst-cert-dg-silk.pdf", fileType: "PDF", fileSize: "980 KB" }, { name: "Business PAN Card", uploaded: true, url: "/mock/pan-business-dg-silk.pdf", fileType: "PDF", fileSize: "650 KB" }, { name: "Owner PAN Card", uploaded: true, url: "/mock/pan-owner-deepak.pdf", fileType: "PDF", fileSize: "710 KB" }, { name: "Bank Proof (Cancelled Cheque)", uploaded: true, url: "/mock/cheque-dg-silk.jpg", fileType: "JPG", fileSize: "2.1 MB" }],
      refundWindow: "3 Days", exchangePolicy: "7 Days", refundMode: "Store Credit", tryAndBuy: false, returnPolicy: "Silk sarees may be returned within 3 days if unused. Custom blouse stitching is non-refundable.",
      discountTypes: ["% Off"], maxDiscount: "15%", minimumOrderValue: "₹5,000",
      inventoryMethod: "Excel Upload", dailyUpdate: false, orderAcceptanceSLA: true, packingSLA: true, fillRate: "90%", needPhotography: true,
      declarationAccepted: true, submittedAt: "2025-02-22",
    },
  },
  {
    id: "vs-8", name: "Kolkata Handloom Co.", ownerName: "Ananya Das", email: "ananya@kolkatahandloom.in", phone: "+91 21098 76543", city: "Kolkata", state: "West Bengal", gstNumber: "19AABCK0987F1ZX", category: "Sarees", onboardingStep: 8, onboardingComplete: true, status: "pending", appliedAt: "2025-02-24", revenue: 0, orders: 0, products: 124, returnRate: 0, avgOrderValue: 0, rating: 0, acceptedOrdersRatio: 0,
    monthlyRevenue: [],
    onboardingData: {
      storeName: "Kolkata Handloom Co.", businessName: "Ananya Das Textiles", ownerName: "Ananya Das", legalEntityType: "Partnership", gstin: "19AABCK0987F1ZX", gstVerified: true, pan: "AABCK0987F", panVerified: true, businessAddress: "15, Gariahat Road, Ballygunge, Kolkata - 700019, West Bengal", contactPerson: "Ananya Das", designation: "Managing Partner", phone: "+91 21098 76543", phoneVerified: true, altPhone: "+91 21098 76544", altPhoneVerified: true, email: "ananya@kolkatahandloom.in", socialMedia: "@kolkatahandloom",
      storeLocation: "15, Gariahat Road, Kolkata - 700019", openingTime: "10:30", closingTime: "21:30", weeklyOff: "None", prepTime: "5-7 mins", packingTime: "7", readyFor30Min: true, packagingResponsibility: "Shared Responsibility", deliveryCoverage: "15 km",
      selectedCategories: ["Women's Wear", "Men's Wear"], priceRange: "₹1,200 – ₹25,000", customization: true,
      accountHolder: "Ananya Das Textiles", bankName: "HDFC Bank", accountNumber: "••••••••3456", accountType: "Current", ifscCode: "HDFC0001987", bankVerified: true, upiId: "kolkatahandloom@hdfc", documents: [{ name: "GST Certificate", uploaded: true, url: "/mock/gst-cert-ad-textiles.pdf", fileType: "PDF", fileSize: "1.1 MB" }, { name: "Business PAN Card", uploaded: true, url: "/mock/pan-business-ad-textiles.pdf", fileType: "PDF", fileSize: "780 KB" }, { name: "Owner PAN Card", uploaded: true, url: "/mock/pan-owner-ananya.pdf", fileType: "PDF", fileSize: "690 KB" }, { name: "Bank Proof (Cancelled Cheque)", uploaded: true, url: "/mock/cheque-ad-textiles.jpg", fileType: "JPG", fileSize: "1.5 MB" }],
      refundWindow: "7 Days", exchangePolicy: "7 Days", refundMode: "Original Payment Method", tryAndBuy: true, maxTryItems: 2, returnPolicy: "Full refund within 7 days for unused items with original tags. Handwoven items require careful handling.",
      discountTypes: ["% Off", "Buy 1 Get 1"], maxDiscount: "25%", minimumOrderValue: "₹2,000",
      inventoryMethod: "Excel Upload", dailyUpdate: true, orderAcceptanceSLA: true, packingSLA: true, fillRate: "92%", needPhotography: false,
      declarationAccepted: true, submittedAt: "2025-02-24",
    },
  },
  {
    id: "vs-9", name: "Hyderabad Pearl Fashions", ownerName: "Syed Ahmed", email: "syed@pearlfashions.in", phone: "+91 10987 65432", city: "Hyderabad", state: "Telangana", gstNumber: "36AABCH8765E1ZV", category: "Accessories", onboardingStep: 8, onboardingComplete: true, status: "pending", appliedAt: "2025-02-25", revenue: 0, orders: 0, products: 0, returnRate: 0, avgOrderValue: 0, rating: 0, acceptedOrdersRatio: 0,
    monthlyRevenue: [],
    onboardingData: {
      storeName: "Hyderabad Pearl Fashions", businessName: "SA Pearl Trading Co.", ownerName: "Syed Ahmed", legalEntityType: "Sole Proprietorship", gstin: "36AABCH8765E1ZV", gstVerified: true, pan: "AABCH8765E", panVerified: true, businessAddress: "23, Laad Bazaar, Charminar, Hyderabad - 500002, Telangana", contactPerson: "Syed Ahmed", designation: "Owner", phone: "+91 10987 65432", phoneVerified: true, email: "syed@pearlfashions.in",
      storeLocation: "23, Laad Bazaar, Hyderabad - 500002", openingTime: "10:00", closingTime: "20:00", weeklyOff: "Friday", prepTime: "3-5 mins", packingTime: "5", readyFor30Min: true, packagingResponsibility: "Vendor (Self)", deliveryCoverage: "10 km",
      selectedCategories: ["Accessories", "Eyewear"], priceRange: "₹500 – ₹15,000", customization: false,
      accountHolder: "Syed Ahmed", bankName: "Bank of Baroda", accountNumber: "••••••••8901", accountType: "Savings", ifscCode: "BARB0HYDERA", bankVerified: true, documents: [{ name: "GST Certificate", uploaded: true, url: "/mock/gst-cert-sa-pearl.pdf", fileType: "PDF", fileSize: "920 KB" }, { name: "Business PAN Card", uploaded: true, url: "/mock/pan-business-sa-pearl.pdf", fileType: "PDF", fileSize: "610 KB" }, { name: "Owner PAN Card", uploaded: true, url: "/mock/pan-owner-syed.pdf", fileType: "PDF", fileSize: "580 KB" }, { name: "Bank Proof (Cancelled Cheque)", uploaded: false }],
      refundWindow: "24 Hours", exchangePolicy: "3 Days", refundMode: "Store Credit", tryAndBuy: false,
      discountTypes: [], maxDiscount: "", minimumOrderValue: "",
      inventoryMethod: "", dailyUpdate: false, orderAcceptanceSLA: false, packingSLA: false, fillRate: "", needPhotography: false,
      declarationAccepted: false, submittedAt: "",
    },
  },
  {
    id: "vs-10", name: "Surat Textile Mart", ownerName: "Vikram Patel", email: "vikram@surattextile.com", phone: "+91 09876 54321", city: "Surat", state: "Gujarat", gstNumber: "24AABCS6543D1ZT", category: "Dupattas", onboardingStep: 8, onboardingComplete: true, status: "rejected", appliedAt: "2025-02-15", revenue: 0, orders: 0, products: 45, returnRate: 0, avgOrderValue: 0, rating: 0, acceptedOrdersRatio: 0,
    monthlyRevenue: [],
  },
  {
    id: "vs-11", name: "Punjab Phulkari House", ownerName: "Harpreet Kaur", email: "harpreet@phulkari.in", phone: "+91 98712 34567", city: "Amritsar", state: "Punjab", gstNumber: "03AABCP1234C1ZR", category: "Dupattas", onboardingStep: 8, onboardingComplete: true, status: "suspended", appliedAt: "2025-01-25", approvedAt: "2025-01-28", revenue: 890000, orders: 342, products: 78, returnRate: 8.7, avgOrderValue: 2602, rating: 3.2, acceptedOrdersRatio: 72.4,
    monthlyRevenue: [{ month: "Sep", revenue: 120000 }, { month: "Oct", revenue: 150000 }, { month: "Nov", revenue: 180000 }, { month: "Dec", revenue: 210000 }, { month: "Jan", revenue: 140000 }, { month: "Feb", revenue: 90000 }],
  },
  {
    id: "vs-12", name: "Banaras Zari Works", ownerName: "Mohammad Rafi", email: "rafi@banaras-zari.in", phone: "+91 87612 34567", city: "Varanasi", state: "Uttar Pradesh", gstNumber: "09AABCB8761Z1ZP", category: "Sarees", onboardingStep: 8, onboardingComplete: true, status: "pending", appliedAt: "2025-02-26", revenue: 0, orders: 0, products: 0, returnRate: 0, avgOrderValue: 0, rating: 0, acceptedOrdersRatio: 0,
    monthlyRevenue: [],
    onboardingData: {
      storeName: "Banaras Zari Works", businessName: "Rafi Zari Udyog", ownerName: "Mohammad Rafi", legalEntityType: "Sole Proprietorship", gstin: "09AABCB8761Z1ZP", gstVerified: true, pan: "AABCB8761Z", panVerified: true, businessAddress: "67, Chowk, Varanasi - 221001, Uttar Pradesh", contactPerson: "Mohammad Rafi", designation: "Owner", phone: "+91 87612 34567", phoneVerified: true, email: "rafi@banaras-zari.in",
      storeLocation: "67, Chowk, Varanasi - 221001", openingTime: "09:00", closingTime: "20:00", weeklyOff: "None", prepTime: "7-9 mins", packingTime: "10", readyFor30Min: false, packagingResponsibility: "Vendor (Self)", deliveryCoverage: "6 km",
      selectedCategories: ["Women's Wear"], priceRange: "₹2,000 – ₹80,000", customization: true,
      accountHolder: "", bankName: "", accountNumber: "", accountType: "", ifscCode: "", bankVerified: false, documents: [{ name: "GST Certificate", uploaded: false }, { name: "Business PAN Card", uploaded: false }, { name: "Owner PAN Card", uploaded: false }, { name: "Bank Proof (Cancelled Cheque)", uploaded: false }],
      refundWindow: "", exchangePolicy: "", refundMode: "", tryAndBuy: false,
      discountTypes: [], maxDiscount: "", minimumOrderValue: "",
      inventoryMethod: "", dailyUpdate: false, orderAcceptanceSLA: false, packingSLA: false, fillRate: "", needPhotography: false,
      declarationAccepted: false, submittedAt: "",
    },
  },
];

// ─── Order Types & Mock Data ─────────────────────────────────
type OrderStatus = "vendor_approved" | "payment_pending" | "confirmed" | "packed" | "dispatched" | "delivered";

interface StoreOrder {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: OrderStatus;
  placedAt: string;   // time string e.g. "10:12 AM"
  date: string;
  rider?: string;
  eta?: string;       // e.g. "32 mins"
}

const orderStatusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof CircleCheck }> = {
  vendor_approved: { label: "Vendor Approved", color: "#2563EB", bg: "#DBEAFE", icon: CircleCheck },
  payment_pending: { label: "Payment Pending", color: "#D97706", bg: "#FEF3C7", icon: CreditCard },
  confirmed: { label: "Confirmed", color: "#7C3AED", bg: "#EDE9FE", icon: ClipboardList },
  packed: { label: "Packed", color: "#0891B2", bg: "#CFFAFE", icon: PackageCheck },
  dispatched: { label: "Dispatched", color: "#EA580C", bg: "#FFEDD5", icon: Truck },
  delivered: { label: "Delivered", color: "#059669", bg: "#D1FAE5", icon: CircleCheck },
};

const storeOrders: Record<string, StoreOrder[]> = {
  "vs-1": [
    { id: "ORD-4201", customer: "Meera Reddy", items: ["Banarasi Silk Saree", "Cotton Dupatta"], total: 8450, status: "delivered", placedAt: "10:12 AM", date: "2026-02-20", rider: "Rajesh K.", eta: "32 mins" },
    { id: "ORD-4202", customer: "Anita Joshi", items: ["Kanjivaram Saree"], total: 12800, status: "delivered", placedAt: "10:28 AM", date: "2026-02-20", rider: "Suresh M.", eta: "28 mins" },
    { id: "ORD-4203", customer: "Kavitha S.", items: ["Chanderi Saree", "Silk Blouse Piece"], total: 5650, status: "dispatched", placedAt: "10:35 AM", date: "2026-02-20", rider: "Amit D.", eta: "18 mins" },
    { id: "ORD-4204", customer: "Deepa Nair", items: ["Tussar Silk Saree"], total: 7200, status: "packed", placedAt: "10:42 AM", date: "2026-02-20" },
    { id: "ORD-4205", customer: "Pooja Verma", items: ["Organza Saree", "Matching Blouse"], total: 9500, status: "confirmed", placedAt: "10:48 AM", date: "2026-02-20" },
  ],
  "vs-2": [
    { id: "ORD-4301", customer: "Simran Kaur", items: ["Bridal Lehenga Set"], total: 45000, status: "delivered", placedAt: "10:05 AM", date: "2026-02-20", rider: "Vikram P.", eta: "38 mins" },
    { id: "ORD-4302", customer: "Riya Sharma", items: ["Designer Lehenga"], total: 28500, status: "dispatched", placedAt: "10:20 AM", date: "2026-02-20", rider: "Karan S.", eta: "22 mins" },
    { id: "ORD-4303", customer: "Neha Gupta", items: ["Party Wear Lehenga", "Dupatta Set"], total: 18200, status: "packed", placedAt: "10:30 AM", date: "2026-02-20" },
    { id: "ORD-4304", customer: "Priyanka M.", items: ["Ghagra Choli"], total: 15600, status: "confirmed", placedAt: "10:40 AM", date: "2026-02-20" },
  ],
  "vs-3": [
    { id: "ORD-4401", customer: "Sneha K.", items: ["Maxi Dress", "Scarf"], total: 3450, status: "delivered", placedAt: "11:02 AM", date: "2026-02-20", rider: "Rohit G.", eta: "25 mins" },
    { id: "ORD-4402", customer: "Aditi Rao", items: ["Cocktail Dress"], total: 5800, status: "delivered", placedAt: "11:15 AM", date: "2026-02-20", rider: "Ajay V.", eta: "30 mins" },
    { id: "ORD-4403", customer: "Tanya B.", items: ["Midi Dress", "Belt"], total: 4200, status: "dispatched", placedAt: "11:22 AM", date: "2026-02-20", rider: "Deepak L.", eta: "15 mins" },
    { id: "ORD-4404", customer: "Swati P.", items: ["Evening Gown"], total: 8900, status: "payment_pending", placedAt: "11:35 AM", date: "2026-02-20" },
    { id: "ORD-4405", customer: "Divya R.", items: ["Summer Dress", "Earrings"], total: 2850, status: "vendor_approved", placedAt: "11:42 AM", date: "2026-02-20" },
  ],
  "vs-4": [
    { id: "ORD-4501", customer: "Arjun M.", items: ["Silk Kurta Set"], total: 4800, status: "delivered", placedAt: "10:08 AM", date: "2026-02-20", rider: "Ravi S.", eta: "26 mins" },
    { id: "ORD-4502", customer: "Sanjay K.", items: ["Cotton Kurta", "Pyjama Set"], total: 3200, status: "delivered", placedAt: "10:18 AM", date: "2026-02-20", rider: "Manish T.", eta: "30 mins" },
    { id: "ORD-4503", customer: "Rohit B.", items: ["Nehru Jacket", "Kurta"], total: 6500, status: "packed", placedAt: "10:32 AM", date: "2026-02-20" },
    { id: "ORD-4504", customer: "Vikram S.", items: ["Festive Kurta Set"], total: 5100, status: "confirmed", placedAt: "10:45 AM", date: "2026-02-20" },
  ],
  "vs-5": [
    { id: "ORD-4601", customer: "Lakshmi P.", items: ["Pure Silk Saree"], total: 22000, status: "delivered", placedAt: "09:30 AM", date: "2026-02-20", rider: "Kumar R.", eta: "35 mins" },
    { id: "ORD-4602", customer: "Gayatri N.", items: ["Kanchipuram Saree", "Blouse Piece"], total: 35800, status: "delivered", placedAt: "09:45 AM", date: "2026-02-20", rider: "Senthil M.", eta: "28 mins" },
    { id: "ORD-4603", customer: "Saraswati D.", items: ["Wedding Saree Set"], total: 48500, status: "dispatched", placedAt: "10:00 AM", date: "2026-02-20", rider: "Ramesh V.", eta: "20 mins" },
    { id: "ORD-4604", customer: "Padmini R.", items: ["Temple Saree"], total: 18200, status: "packed", placedAt: "10:12 AM", date: "2026-02-20" },
    { id: "ORD-4605", customer: "Uma S.", items: ["Pattu Saree", "Matching Blouse"], total: 27600, status: "confirmed", placedAt: "10:25 AM", date: "2026-02-20" },
    { id: "ORD-4606", customer: "Revathi K.", items: ["Silk Cotton Saree"], total: 8900, status: "vendor_approved", placedAt: "10:38 AM", date: "2026-02-20" },
  ],
  "vs-11": [
    { id: "ORD-4701", customer: "Gurpreet K.", items: ["Phulkari Dupatta"], total: 2800, status: "delivered", placedAt: "10:15 AM", date: "2026-02-20", rider: "Jaskaran S.", eta: "22 mins" },
    { id: "ORD-4702", customer: "Manpreet S.", items: ["Phulkari Suit Set"], total: 4500, status: "delivered", placedAt: "10:30 AM", date: "2026-02-20", rider: "Harjit K.", eta: "30 mins" },
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
  const idx = orderFullSteps.findIndex(s => s.key === status);
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
  address: { line1: string; line2?: string; city: string; state: string; zip: string };
  paymentMethod: string;
  paymentStatus: "paid" | "pending";
  subtotal: number;
  shipping: number;
  commission: number;
}

const orderDetailExtras: Record<string, OrderDetailExtra> = {
  "ORD-4201": { email: "meera@email.com", phone: "+91 98123 45678", address: { line1: "42, Jubilee Hills", city: "Hyderabad", state: "TS", zip: "500033" }, paymentMethod: "UPI", paymentStatus: "paid", subtotal: 8450, shipping: 0, commission: 845 },
  "ORD-4202": { email: "anita.j@email.com", phone: "+91 87654 32109", address: { line1: "15, Koramangala 5th Block", city: "Bangalore", state: "KA", zip: "560034" }, paymentMethod: "Visa ending 4242", paymentStatus: "paid", subtotal: 12800, shipping: 0, commission: 1280 },
  "ORD-4203": { email: "kavitha@email.com", phone: "+91 76543 21098", address: { line1: "303, Lake View Apts", city: "Chennai", state: "TN", zip: "600028" }, paymentMethod: "UPI", paymentStatus: "paid", subtotal: 5650, shipping: 0, commission: 565 },
  "ORD-4204": { email: "deepa.n@email.com", phone: "+91 65432 10987", address: { line1: "8, Anna Nagar East", city: "Chennai", state: "TN", zip: "600102" }, paymentMethod: "Dashrobe Wallet", paymentStatus: "paid", subtotal: 7200, shipping: 0, commission: 720 },
  "ORD-4205": { email: "pooja.v@email.com", phone: "+91 99876 54321", address: { line1: "12, Besant Nagar", city: "Chennai", state: "TN", zip: "600090" }, paymentMethod: "Online Payment", paymentStatus: "paid", subtotal: 9500, shipping: 0, commission: 950 },
  "ORD-4301": { email: "simran@email.com", phone: "+91 98765 11223", address: { line1: "Villa 7, DLF Phase 2", city: "Gurgaon", state: "HR", zip: "122002" }, paymentMethod: "Card ending 8821", paymentStatus: "paid", subtotal: 45000, shipping: 0, commission: 4500 },
  "ORD-4302": { email: "riya.s@email.com", phone: "+91 88765 22334", address: { line1: "A-301, Hiranandani Gardens", city: "Mumbai", state: "MH", zip: "400076" }, paymentMethod: "UPI", paymentStatus: "paid", subtotal: 28500, shipping: 0, commission: 2850 },
  "ORD-4303": { email: "neha.g@email.com", phone: "+91 88234 56789", address: { line1: "F-42, Green Park Extension", city: "New Delhi", state: "DL", zip: "110016" }, paymentMethod: "Online Payment", paymentStatus: "paid", subtotal: 18200, shipping: 0, commission: 1820 },
  "ORD-4304": { email: "priyanka@email.com", phone: "+91 77123 44556", address: { line1: "25, Bandra West", city: "Mumbai", state: "MH", zip: "400050" }, paymentMethod: "Dashrobe Wallet", paymentStatus: "paid", subtotal: 15600, shipping: 0, commission: 1560 },
  "ORD-4401": { email: "sneha.k@email.com", phone: "+91 99887 11223", address: { line1: "18, Indiranagar", city: "Bangalore", state: "KA", zip: "560038" }, paymentMethod: "UPI", paymentStatus: "paid", subtotal: 3450, shipping: 0, commission: 345 },
  "ORD-4402": { email: "aditi.r@email.com", phone: "+91 88776 22334", address: { line1: "501, Prestige Meridian", city: "Bangalore", state: "KA", zip: "560001" }, paymentMethod: "Card ending 1156", paymentStatus: "paid", subtotal: 5800, shipping: 0, commission: 580 },
  "ORD-4403": { email: "tanya.b@email.com", phone: "+91 77665 33445", address: { line1: "D-12, Whitefield", city: "Bangalore", state: "KA", zip: "560066" }, paymentMethod: "UPI", paymentStatus: "paid", subtotal: 4200, shipping: 0, commission: 420 },
  "ORD-4404": { email: "swati.p@email.com", phone: "+91 66554 44556", address: { line1: "9, HSR Layout", city: "Bangalore", state: "KA", zip: "560102" }, paymentMethod: "Pending", paymentStatus: "pending", subtotal: 8900, shipping: 0, commission: 890 },
  "ORD-4405": { email: "divya.r@email.com", phone: "+91 55443 55667", address: { line1: "B-7, JP Nagar", city: "Bangalore", state: "KA", zip: "560078" }, paymentMethod: "Pending", paymentStatus: "pending", subtotal: 2850, shipping: 0, commission: 285 },
  "ORD-4501": { email: "arjun.m@email.com", phone: "+91 98123 67890", address: { line1: "22, Civil Lines", city: "Jaipur", state: "RJ", zip: "302006" }, paymentMethod: "UPI", paymentStatus: "paid", subtotal: 4800, shipping: 0, commission: 480 },
  "ORD-4502": { email: "sanjay.k@email.com", phone: "+91 87654 78901", address: { line1: "45, Malviya Nagar", city: "Jaipur", state: "RJ", zip: "302017" }, paymentMethod: "Online Payment", paymentStatus: "paid", subtotal: 3200, shipping: 0, commission: 320 },
  "ORD-4503": { email: "rohit.b@email.com", phone: "+91 76543 89012", address: { line1: "8, C Scheme", city: "Jaipur", state: "RJ", zip: "302001" }, paymentMethod: "Card ending 5567", paymentStatus: "paid", subtotal: 6500, shipping: 0, commission: 650 },
  "ORD-4504": { email: "vikram.s@email.com", phone: "+91 65432 90123", address: { line1: "11, Vaishali Nagar", city: "Jaipur", state: "RJ", zip: "302021" }, paymentMethod: "Dashrobe Wallet", paymentStatus: "paid", subtotal: 5100, shipping: 0, commission: 510 },
  "ORD-4601": { email: "lakshmi.p@email.com", phone: "+91 98765 12345", address: { line1: "3, T Nagar", city: "Chennai", state: "TN", zip: "600017" }, paymentMethod: "UPI", paymentStatus: "paid", subtotal: 22000, shipping: 0, commission: 2200 },
  "ORD-4602": { email: "gayatri.n@email.com", phone: "+91 87654 23456", address: { line1: "14, Mylapore", city: "Chennai", state: "TN", zip: "600004" }, paymentMethod: "Card ending 3389", paymentStatus: "paid", subtotal: 35800, shipping: 0, commission: 3580 },
  "ORD-4603": { email: "saraswati@email.com", phone: "+91 76543 34567", address: { line1: "22, Adyar", city: "Chennai", state: "TN", zip: "600020" }, paymentMethod: "UPI", paymentStatus: "paid", subtotal: 48500, shipping: 0, commission: 4850 },
  "ORD-4604": { email: "padmini.r@email.com", phone: "+91 65432 45678", address: { line1: "B-9, Velachery", city: "Chennai", state: "TN", zip: "600042" }, paymentMethod: "Online Payment", paymentStatus: "paid", subtotal: 18200, shipping: 0, commission: 1820 },
  "ORD-4605": { email: "uma.s@email.com", phone: "+91 99876 56789", address: { line1: "5, Porur", city: "Chennai", state: "TN", zip: "600116" }, paymentMethod: "Dashrobe Wallet", paymentStatus: "paid", subtotal: 27600, shipping: 0, commission: 2760 },
  "ORD-4606": { email: "revathi.k@email.com", phone: "+91 88765 67890", address: { line1: "17, Tambaram", city: "Chennai", state: "TN", zip: "600045" }, paymentMethod: "Pending", paymentStatus: "pending", subtotal: 8900, shipping: 0, commission: 890 },
  "ORD-4701": { email: "gurpreet@email.com", phone: "+91 98123 78901", address: { line1: "15, Model Town", city: "Ludhiana", state: "PB", zip: "141002" }, paymentMethod: "UPI", paymentStatus: "paid", subtotal: 2800, shipping: 0, commission: 280 },
  "ORD-4702": { email: "manpreet@email.com", phone: "+91 87654 89012", address: { line1: "8, Sarabha Nagar", city: "Ludhiana", state: "PB", zip: "141001" }, paymentMethod: "Card ending 7721", paymentStatus: "paid", subtotal: 4500, shipping: 0, commission: 450 },
};

function formatCurrencyFull(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

const statusConfig: Record<StoreStatus, { label: string; color: string; bg: string; icon: typeof CircleCheck }> = {
  pending: { label: "Pending", color: "#D97706", bg: "#FEF3C7", icon: Clock },
  approved: { label: "Approved", color: "#059669", bg: "#D1FAE5", icon: CircleCheck },
  rejected: { label: "Rejected", color: "#DC2626", bg: "#FEE2E2", icon: CircleX },
  suspended: { label: "Suspended", color: "#7C3AED", bg: "#EDE9FE", icon: Ban },
};

const CHART_COLORS = ["#220E92", "#FFC100", "#10b981", "#3B82F6", "#F59E0B"];

// ═══════════════════════════════════════════════════════════════
export function AdminStores() {
  const location = useLocation();
  const [stores, setStores] = useState<VendorStore[]>(initialStores);
  const [activeTab, setActiveTab] = useState<"all" | StoreStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState<VendorStore | null>(null);
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const chartId = useId();
  const areaGradientId = `storeAreaGrad-${chartId.replace(/:/g, "")}`;
  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string; fileType: string } | null>(null);
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");
  const [selectedStoreOrder, setSelectedStoreOrder] = useState<StoreOrder | null>(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const TABLE_ROWS = 5;

  // Auto-select store from navigation state (e.g. from Dashboard "View" button)
  useEffect(() => {
    const state = location.state as { storeId?: string } | null;
    if (state?.storeId) {
      const found = stores.find(s => s.id === state.storeId);
      if (found) {
        setSelectedStore(found);
        setOrderFilter("all");
      }
      // Clear the state so refreshing doesn't re-trigger
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleDownload = (doc: { name: string; url?: string; fileType?: string }) => {
    if (!doc.url) return;
    // In production this would trigger a real download; here we simulate it
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = `${doc.name.replace(/\s+/g, "_")}.${(doc.fileType || "pdf").toLowerCase()}`;
    link.target = "_blank";
    link.click();
  };

  // Stats
  const totalStores = stores.length;
  const pendingStores = stores.filter(s => s.status === "pending").length;
  const approvedStores = stores.filter(s => s.status === "approved").length;
  const rejectedStores = stores.filter(s => s.status === "rejected").length;
  const suspendedStores = stores.filter(s => s.status === "suspended").length;
  const totalRevenue = stores.reduce((sum, s) => sum + s.revenue, 0);
  const totalOrders = stores.reduce((sum, s) => sum + s.orders, 0);

  // Filters
  const statusOrder: Record<StoreStatus, number> = { pending: 0, approved: 1, rejected: 2, suspended: 3 };
  const filteredStores = stores.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "all" || s.status === activeTab;
    return matchSearch && matchTab;
  }).sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  const totalTablePages = Math.max(1, Math.ceil(filteredStores.length / TABLE_ROWS));
  const paginatedStores = filteredStores.slice((tablePage - 1) * TABLE_ROWS, tablePage * TABLE_ROWS);

  // Actions
  const approveStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: "approved" as StoreStatus, approvedAt: new Date().toISOString().split("T")[0] } : s));
    setShowApproveModal(null);
    setSelectedStore(prev => prev?.id === id ? { ...prev, status: "approved", approvedAt: new Date().toISOString().split("T")[0] } : prev);
  };

  const rejectStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: "rejected" as StoreStatus } : s));
    setShowRejectModal(null);
    setRejectReason("");
    setSelectedStore(prev => prev?.id === id ? { ...prev, status: "rejected" } : prev);
  };

  const suspendStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: "suspended" as StoreStatus } : s));
    setActionMenuId(null);
    setSelectedStore(prev => prev?.id === id ? { ...prev, status: "suspended" } : prev);
  };

  const reactivateStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: "approved" as StoreStatus } : s));
    setActionMenuId(null);
    setSelectedStore(prev => prev?.id === id ? { ...prev, status: "approved" } : prev);
  };

  const formatCurrency = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v}`;
  };

  // Pie data for status distribution
  const pieData = [
    { name: "Approved", value: approvedStores, color: "#059669" },
    { name: "Pending", value: pendingStores, color: "#D97706" },
    { name: "Rejected", value: rejectedStores, color: "#DC2626" },
    { name: "Suspended", value: suspendedStores, color: "#7C3AED" },
  ].filter(d => d.value > 0);

  // ─── Helper: Verified/Boolean badge ────────────────────────
  const VBadge = ({ ok, yes = "Yes", no = "No" }: { ok: boolean; yes?: string; no?: string }) => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600, backgroundColor: ok ? "#D1FAE5" : "#FEE2E2", color: ok ? "#059669" : "#DC2626" }}>
      {ok ? <CircleCheck className="w-3 h-3" /> : <CircleX className="w-3 h-3" />}
      {ok ? yes : no}
    </span>
  );

  // ─── Helper: Detail field row ────────────────────────────
  const DField = ({ label, value, badge }: { label: string; value?: string; badge?: ReactNode }) => (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground shrink-0" style={{ fontSize: "13px" }}>{label}</span>
      <div className="text-right flex items-center gap-2">
        {value && <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>}
        {badge}
      </div>
    </div>
  );

  // ─── Detail Panel ──────────────────────────────────────────
  if (selectedStore) {
    const s = selectedStore;
    const stCfg = statusConfig[s.status];
    const ob = s.onboardingData;
    const isPending = s.status === "pending";

    return (
      <div className="space-y-6">
        {/* Back + Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedStore(null); setSelectedStoreOrder(null); setShowStoreDetails(false); }} className="p-2 rounded-[10px] hover:bg-muted border border-border transition-colors" style={{ fontSize: "13px" }}>
              ← Back
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 style={{ fontSize: "22px", fontWeight: 700 }}>{s.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600, color: stCfg.color, backgroundColor: stCfg.bg }}>
                  <stCfg.icon className="w-3.5 h-3.5" />
                  {stCfg.label}
                </span>
              </div>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>Store ID: {s.id} · Applied {s.appliedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {s.status === "pending" && (
              <>
                <button onClick={() => setShowRejectModal(s.id)} className="px-4 py-2.5 rounded-[10px] border border-red-200 text-red-600 hover:bg-red-50 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                  <span className="flex items-center gap-2"><CircleX className="w-4 h-4" /> Reject</span>
                </button>
                <button
                  onClick={() => s.onboardingComplete && setShowApproveModal(s.id)}
                  disabled={!s.onboardingComplete}
                  className={`px-4 py-2.5 rounded-[10px] transition-colors ${
                    s.onboardingComplete
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-muted text-muted-foreground/50 cursor-not-allowed"
                  }`}
                  style={{ fontSize: "14px", fontWeight: 500 }}
                  title={s.onboardingComplete ? "Approve this store" : `Onboarding incomplete (Step ${s.onboardingStep}/8)`}
                >
                  <span className="flex items-center gap-2"><CircleCheck className="w-4 h-4" /> Approve</span>
                </button>
              </>
            )}
            {s.status === "approved" && (
              <button onClick={() => suspendStore(s.id)} className="px-4 py-2.5 rounded-[10px] border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                <span className="flex items-center gap-2"><Ban className="w-4 h-4" /> Suspend</span>
              </button>
            )}
            {(s.status === "suspended" || s.status === "rejected") && (
              <button onClick={() => reactivateStore(s.id)} className="px-4 py-2.5 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>
                <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reactivate</span>
              </button>
            )}
          </div>
        </div>

        {/* Onboarding Progress Banner (pending) */}
        {isPending && (
          <div className={`rounded-[12px] border p-4 ${s.onboardingComplete ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: "14px", fontWeight: 600 }}>Onboarding Progress</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: s.onboardingComplete ? "#059669" : "#D97706" }}>
                {s.onboardingComplete ? "All 8 steps complete" : `Step ${s.onboardingStep} of 8`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-border">
              <div className="h-full rounded-full transition-all" style={{ width: `${(s.onboardingStep / 8) * 100}%`, backgroundColor: s.onboardingComplete ? "#059669" : "#D97706" }} />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {["Basic Details", "Operations", "Categories", "Banking", "Returns", "Offers", "Technology", "Review"].map((step, i) => (
                <span key={step} className="px-2.5 py-1 rounded-lg" style={{ fontSize: "11px", fontWeight: 600, backgroundColor: i < s.onboardingStep ? "#D1FAE5" : "#F3F4F6", color: i < s.onboardingStep ? "#059669" : "#9CA3AF" }}>
                  {i < s.onboardingStep ? "✓ " : ""}{step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ───── PENDING: Full Onboarding Review ───── */}
        {isPending && ob ? (
          <div className="space-y-5">
            {/* Step 1: Basic Details */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>1</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Vendor Basic Details</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <div>
                    <DField label="Store Name" value={ob.storeName} />
                    <DField label="Business Name" value={ob.businessName} />
                    <DField label="Owner" value={ob.ownerName} />
                    <DField label="Legal Entity" value={ob.legalEntityType} />
                    <DField label="GSTIN" value={ob.gstin} badge={<VBadge ok={ob.gstVerified} yes="Verified" no="Unverified" />} />
                    <DField label="PAN" value={ob.pan} badge={<VBadge ok={ob.panVerified} yes="Verified" no="Unverified" />} />
                  </div>
                  <div>
                    <DField label="Contact Person" value={`${ob.contactPerson} (${ob.designation})`} />
                    <DField label="Phone" value={ob.phone} badge={<VBadge ok={ob.phoneVerified} yes="Verified" no="Unverified" />} />
                    {ob.altPhone && <DField label="Alt. Phone" value={ob.altPhone} badge={<VBadge ok={!!ob.altPhoneVerified} yes="Verified" no="Unverified" />} />}
                    <DField label="Email" value={ob.email} />
                    {ob.website && <DField label="Website" value={ob.website} />}
                    {ob.socialMedia && <DField label="Social Media" value={ob.socialMedia} />}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Business Address</p>
                  <p style={{ fontSize: "13px", fontWeight: 500 }} className="mt-1">{ob.businessAddress}</p>
                </div>
              </div>
            </div>

            {/* Step 2: Store Operations */}
            {s.onboardingStep >= 2 && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>2</span>
                  <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Store Operations</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                    <div>
                      <DField label="Store Location" value={ob.storeLocation} />
                      <DField label="Opening Time" value={ob.openingTime} />
                      <DField label="Closing Time" value={ob.closingTime} />
                      <DField label="Weekly Off" value={ob.weeklyOff || "None"} />
                    </div>
                    <div>
                      <DField label="Preparation Time" value={ob.prepTime} />
                      <DField label="Packing Time" value={`${ob.packingTime} mins`} />
                      <DField label="30-min Delivery" badge={<VBadge ok={ob.readyFor30Min} yes="Enabled" no="Disabled" />} />
                      <DField label="Packaging" value={ob.packagingResponsibility} />
                      <DField label="Delivery Coverage" value={ob.deliveryCoverage} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Product Categories */}
            {s.onboardingStep >= 3 && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>3</span>
                  <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Product Categories</h3>
                </div>
                <div className="p-5">
                  <div className="mb-3">
                    <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Selected Categories</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ob.selectedCategories.map((cat) => (
                        <span key={cat} className="bg-[#220E92]/8 text-[#220E92] px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{cat}</span>
                      ))}
                    </div>
                  </div>
                  <DField label="Price Range" value={ob.priceRange} />
                  <DField label="Customization Offered" badge={<VBadge ok={ob.customization} yes="Yes" no="No" />} />
                </div>
              </div>
            )}

            {/* Step 4: Bank & Settlement */}
            {s.onboardingStep >= 4 && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>4</span>
                  <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Bank & Settlement Details</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                    <div>
                      <DField label="Account Holder" value={ob.accountHolder || "—"} />
                      <DField label="Bank Name" value={ob.bankName || "—"} badge={ob.bankVerified ? <VBadge ok={true} yes="Verified" /> : undefined} />
                      <DField label="Account Number" value={ob.accountNumber || "—"} />
                      <DField label="Account Type" value={ob.accountType || "—"} />
                      <DField label="IFSC Code" value={ob.ifscCode || "—"} />
                      {ob.upiId && <DField label="UPI ID" value={ob.upiId} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-[#220E92]" />
                        <p style={{ fontSize: "13px", fontWeight: 600 }}>Documents & Certificates</p>
                      </div>
                      <div className="space-y-2">
                        {ob.documents.map((doc) => (
                          <div key={doc.name} className="flex items-center justify-between py-2.5 px-3.5 rounded-[10px] bg-muted/40 border border-border/60 group hover:bg-muted/60 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${doc.uploaded ? "bg-emerald-100" : "bg-red-100"}`}>
                                {doc.uploaded ? <FileCheck className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-red-500" />}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{doc.name}</p>
                                {doc.uploaded && doc.fileType && (
                                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
                                    {doc.fileType} · {doc.fileSize || "—"}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <VBadge ok={doc.uploaded} yes="Uploaded" no="Missing" />
                              {doc.uploaded && doc.url && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setPreviewDoc({ name: doc.name, url: doc.url!, fileType: doc.fileType || "PDF" })}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#220E92]/10 text-[#220E92] transition-colors"
                                    title="Preview document"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDownload(doc)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#220E92]/10 text-[#220E92] transition-colors"
                                    title="Download document"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Refunds & Returns */}
            {s.onboardingStep >= 5 && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>5</span>
                  <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Refunds & Returns</h3>
                </div>
                <div className="p-5">
                  <DField label="Refund Window" value={ob.refundWindow || "—"} />
                  <DField label="Exchange Policy" value={ob.exchangePolicy || "—"} />
                  <DField label="Refund Mode" value={ob.refundMode || "—"} />
                  <DField label="Try & Buy" badge={<VBadge ok={ob.tryAndBuy} yes={`Enabled (max ${ob.maxTryItems || 0} items)`} no="Disabled" />} />
                  {ob.returnPolicy && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Return Policy</p>
                      <p className="mt-1 text-muted-foreground bg-muted/30 rounded-lg p-3" style={{ fontSize: "13px" }}>{ob.returnPolicy}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Offers & Promotions */}
            {s.onboardingStep >= 6 && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>6</span>
                  <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Offers & Promotions</h3>
                </div>
                <div className="p-5">
                  <div className="mb-3">
                    <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Discount Types</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ob.discountTypes.length > 0 ? ob.discountTypes.map((dt) => (
                        <span key={dt} className="bg-[#FFC100]/15 text-[#220E92] px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{dt}</span>
                      )) : <span className="text-muted-foreground" style={{ fontSize: "13px" }}>No discount types configured</span>}
                    </div>
                  </div>
                  {ob.maxDiscount && <DField label="Max Discount" value={ob.maxDiscount} />}
                  {ob.minimumOrderValue && <DField label="Min Order Value" value={ob.minimumOrderValue} />}
                </div>
              </div>
            )}

            {/* Step 7: Technology & Inventory */}
            {s.onboardingStep >= 7 && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>7</span>
                  <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Technology & Inventory</h3>
                </div>
                <div className="p-5">
                  <DField label="Inventory Method" value={ob.inventoryMethod || "—"} />
                  <DField label="Daily Inventory Update" badge={<VBadge ok={ob.dailyUpdate} yes="Committed" no="No" />} />
                  <DField label="Order Acceptance SLA" badge={<VBadge ok={ob.orderAcceptanceSLA} yes="Agreed" no="No" />} />
                  <DField label="Packing SLA" badge={<VBadge ok={ob.packingSLA} yes="Agreed" no="No" />} />
                  <DField label="Fill Rate Target" value={ob.fillRate || "—"} />
                  <DField label="Photography Needed" badge={<VBadge ok={ob.needPhotography} yes="Yes, Requested" no="No" />} />
                </div>
              </div>
            )}

            {/* Step 8: Review & Declaration */}
            {s.onboardingStep >= 8 && (
              <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>8</span>
                  <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Review & Declaration</h3>
                </div>
                <div className="p-5">
                  <DField label="Declaration Accepted" badge={<VBadge ok={ob.declarationAccepted} yes="Accepted" no="Not accepted" />} />
                  <DField label="Submitted At" value={ob.submittedAt || "—"} />
                </div>
              </div>
            )}

            {/* Incomplete notice */}
            {!s.onboardingComplete && (
              <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4 flex items-start gap-3">
                <TriangleAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#92400E" }}>Onboarding Incomplete</p>
                  <p style={{ fontSize: "13px", color: "#92400E" }} className="mt-0.5">
                    This vendor has completed {s.onboardingStep} of 8 onboarding steps. Steps {s.onboardingStep + 1}–8 have not been filled yet. The store cannot be approved until all steps are complete.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : showStoreDetails && ob ? (
          /* ───── STORE DETAILS VIEW (Onboarding Data) ───── */
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Store Onboarding Details</h3>
              <button onClick={() => setShowStoreDetails(false)} className="px-4 py-2 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
                ← Back to Store
              </button>
            </div>

            {/* Step 1: Basic Details */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>1</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Vendor Basic Details</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <div>
                    <DField label="Store Name" value={ob.storeName} />
                    <DField label="Business Name" value={ob.businessName} />
                    <DField label="Owner" value={ob.ownerName} />
                    <DField label="Legal Entity" value={ob.legalEntityType} />
                    <DField label="GSTIN" value={ob.gstin} badge={<VBadge ok={ob.gstVerified} yes="Verified" no="Unverified" />} />
                    <DField label="PAN" value={ob.pan} badge={<VBadge ok={ob.panVerified} yes="Verified" no="Unverified" />} />
                  </div>
                  <div>
                    <DField label="Contact Person" value={`${ob.contactPerson} (${ob.designation})`} />
                    <DField label="Phone" value={ob.phone} badge={<VBadge ok={ob.phoneVerified} yes="Verified" no="Unverified" />} />
                    {ob.altPhone && <DField label="Alt. Phone" value={ob.altPhone} badge={<VBadge ok={!!ob.altPhoneVerified} yes="Verified" no="Unverified" />} />}
                    <DField label="Email" value={ob.email} />
                    {ob.website && <DField label="Website" value={ob.website} />}
                    {ob.socialMedia && <DField label="Social Media" value={ob.socialMedia} />}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Business Address</p>
                  <p style={{ fontSize: "13px", fontWeight: 500 }} className="mt-1">{ob.businessAddress}</p>
                </div>
              </div>
            </div>

            {/* Step 2: Store Operations */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>2</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Store Operations</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <div>
                    <DField label="Store Location" value={ob.storeLocation} />
                    <DField label="Opening Time" value={ob.openingTime} />
                    <DField label="Closing Time" value={ob.closingTime} />
                    <DField label="Weekly Off" value={ob.weeklyOff || "None"} />
                  </div>
                  <div>
                    <DField label="Preparation Time" value={ob.prepTime} />
                    <DField label="Packing Time" value={`${ob.packingTime} mins`} />
                    <DField label="30-min Delivery" badge={<VBadge ok={ob.readyFor30Min} yes="Enabled" no="Disabled" />} />
                    <DField label="Packaging" value={ob.packagingResponsibility} />
                    <DField label="Delivery Coverage" value={ob.deliveryCoverage} />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Product Categories */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>3</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Product Categories</h3>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Selected Categories</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ob.selectedCategories.map((cat) => (
                      <span key={cat} className="bg-[#220E92]/8 text-[#220E92] px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{cat}</span>
                    ))}
                  </div>
                </div>
                <DField label="Price Range" value={ob.priceRange} />
                <DField label="Customization Offered" badge={<VBadge ok={ob.customization} yes="Yes" no="No" />} />
              </div>
            </div>

            {/* Step 4: Bank & Settlement + Documents */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>4</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Bank & Settlement Details</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <div>
                    <DField label="Account Holder" value={ob.accountHolder || "—"} />
                    <DField label="Bank Name" value={ob.bankName || "—"} badge={ob.bankVerified ? <VBadge ok={true} yes="Verified" /> : undefined} />
                    <DField label="Account Number" value={ob.accountNumber || "—"} />
                    <DField label="Account Type" value={ob.accountType || "—"} />
                    <DField label="IFSC Code" value={ob.ifscCode || "—"} />
                    {ob.upiId && <DField label="UPI ID" value={ob.upiId} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-[#220E92]" />
                      <p style={{ fontSize: "13px", fontWeight: 600 }}>Documents & Certificates</p>
                    </div>
                    <div className="space-y-2">
                      {ob.documents.map((doc) => (
                        <div key={doc.name} className="flex items-center justify-between py-2.5 px-3.5 rounded-[10px] bg-muted/40 border border-border/60 group hover:bg-muted/60 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${doc.uploaded ? "bg-emerald-100" : "bg-red-100"}`}>
                              {doc.uploaded ? <FileCheck className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-red-500" />}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{doc.name}</p>
                              {doc.uploaded && doc.fileType && (
                                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
                                  {doc.fileType} · {doc.fileSize || "—"}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <VBadge ok={doc.uploaded} yes="Uploaded" no="Missing" />
                            {doc.uploaded && doc.url && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setPreviewDoc({ name: doc.name, url: doc.url!, fileType: doc.fileType || "PDF" })}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#220E92]/10 text-[#220E92] transition-colors"
                                  title="Preview document"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDownload(doc)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#220E92]/10 text-[#220E92] transition-colors"
                                  title="Download document"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Refunds & Returns */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>5</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Refunds & Returns</h3>
              </div>
              <div className="p-5">
                <DField label="Refund Window" value={ob.refundWindow || "—"} />
                <DField label="Exchange Policy" value={ob.exchangePolicy || "—"} />
                <DField label="Refund Mode" value={ob.refundMode || "—"} />
                <DField label="Try & Buy" badge={<VBadge ok={ob.tryAndBuy} yes={`Enabled (max ${ob.maxTryItems || 0} items)`} no="Disabled" />} />
                {ob.returnPolicy && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Return Policy</p>
                    <p className="mt-1 text-muted-foreground bg-muted/30 rounded-lg p-3" style={{ fontSize: "13px" }}>{ob.returnPolicy}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 6: Offers & Promotions */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>6</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Offers & Promotions</h3>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <p className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Discount Types</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ob.discountTypes.length > 0 ? ob.discountTypes.map((dt) => (
                      <span key={dt} className="bg-[#FFC100]/15 text-[#220E92] px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>{dt}</span>
                    )) : <span className="text-muted-foreground" style={{ fontSize: "13px" }}>No discount types configured</span>}
                  </div>
                </div>
                {ob.maxDiscount && <DField label="Max Discount" value={ob.maxDiscount} />}
                {ob.minimumOrderValue && <DField label="Min Order Value" value={ob.minimumOrderValue} />}
              </div>
            </div>

            {/* Step 7: Technology & Inventory */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>7</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Technology & Inventory</h3>
              </div>
              <div className="p-5">
                <DField label="Inventory Method" value={ob.inventoryMethod || "—"} />
                <DField label="Daily Inventory Update" badge={<VBadge ok={ob.dailyUpdate} yes="Committed" no="No" />} />
                <DField label="Order Acceptance SLA" badge={<VBadge ok={ob.orderAcceptanceSLA} yes="Agreed" no="No" />} />
                <DField label="Packing SLA" badge={<VBadge ok={ob.packingSLA} yes="Agreed" no="No" />} />
                <DField label="Fill Rate Target" value={ob.fillRate || "—"} />
                <DField label="Photography Needed" badge={<VBadge ok={ob.needPhotography} yes="Yes, Requested" no="No" />} />
              </div>
            </div>

            {/* Step 8: Review & Declaration */}
            <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#220E92]/5 border-b border-border flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#220E92] text-white flex items-center justify-center shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>8</span>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Review & Declaration</h3>
              </div>
              <div className="p-5">
                <DField label="Declaration Accepted" badge={<VBadge ok={ob.declarationAccepted} yes="Accepted" no="Not accepted" />} />
                <DField label="Submitted At" value={ob.submittedAt || "—"} />
              </div>
            </div>
          </div>
        ) : (
          /* ───── NON-PENDING: Original Store Detail View ───── */
          <>
            {/* KPI Cards - Analytics on top */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Revenue", value: formatCurrency(s.revenue), icon: IndianRupee, color: "#220E92" },
                { label: "Total Orders", value: s.orders.toLocaleString(), icon: ShoppingCart, color: "#3B82F6" },
                { label: "Accepted Ratio", value: s.acceptedOrdersRatio ? `${s.acceptedOrdersRatio}%` : "—", icon: CheckCheck, color: s.acceptedOrdersRatio >= 90 ? "#059669" : s.acceptedOrdersRatio >= 80 ? "#D97706" : "#DC2626" },
                { label: "Products", value: s.products.toString(), icon: Package, color: "#10b981" },
                { label: "Avg Order Value", value: s.avgOrderValue ? formatCurrency(s.avgOrderValue) : "—", icon: TrendingUp, color: "#FFC100" },
                { label: "Return Rate", value: s.returnRate ? `${s.returnRate}%` : "—", icon: ArrowDownRight, color: s.returnRate > 5 ? "#DC2626" : "#059669" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-[12px] border border-border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{stat.label}</span>
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p style={{ fontSize: "24px", fontWeight: 700 }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Store Info */}
              <div className="bg-card rounded-[12px] border border-border shadow-sm p-5">
                <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Store Information</h3>
                <div className="space-y-4">
                  {[
                    { icon: Users, label: "Owner", value: s.ownerName },
                    { icon: Mail, label: "Email", value: s.email },
                    { icon: Phone, label: "Phone", value: s.phone },
                    { icon: MapPin, label: "Location", value: `${s.city}, ${s.state}` },
                    { icon: FileText, label: "GST Number", value: s.gstNumber },
                    { icon: Calendar, label: "Applied On", value: s.appliedAt },
                    ...(s.approvedAt ? [{ icon: CircleCheck, label: "Approved On", value: s.approvedAt }] : []),
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

                {/* View Store Details Button */}
                {ob && (
                  <div className="mt-5 pt-5 border-t border-border">
                    <button
                      onClick={() => setShowStoreDetails(true)}
                      className="w-full px-4 py-3 rounded-[10px] bg-[#220E92] text-white hover:bg-[#220E92]/90 transition-colors shadow-sm flex items-center justify-center gap-2"
                      style={{ fontSize: "14px", fontWeight: 600 }}
                    >
                      <Eye className="w-4 h-4" /> View Store Details
                    </button>
                  </div>
                )}
              </div>

              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-[#220E92]/8">
                      <TrendingUp className="w-4 h-4 text-[#220E92]" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Revenue Trend</h3>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Monthly revenue performance</p>
                    </div>
                  </div>
                  {s.monthlyRevenue.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Peak Month</p>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#220E92" }}>
                          {(() => {
                            const peak = s.monthlyRevenue.reduce((max, m) => m.revenue > max.revenue ? m : max, s.monthlyRevenue[0]);
                            return `₹${(peak.revenue / 100000).toFixed(1)}L`;
                          })()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Total</p>
                        <p style={{ fontSize: "14px", fontWeight: 700 }}>
                          {`₹${(s.monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / 100000).toFixed(1)}L`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {s.monthlyRevenue.length > 0 ? (
                    <>
                    <svg width={0} height={0} style={{ position: "absolute" }}>
                      <defs>
                        <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#220E92" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#220E92" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={s.monthlyRevenue} id={`storeArea-${chartId.replace(/:/g, "")}`}>
                        <defs>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <XAxis key="xaxis" dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} dy={8} />
                        <YAxis key="yaxis" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} width={55} />
                        <Tooltip
                          key="tooltip"
                          formatter={(v: number) => [`₹${(v / 1000).toFixed(0)}K`, "Revenue"]}
                          contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "13px" }}
                          labelStyle={{ fontWeight: 600, marginBottom: "4px" }}
                        />
                        <Area key="area" type="monotone" dataKey="revenue" stroke="#220E92" fill={`url(#${areaGradientId})`} strokeWidth={2.5} dot={{ fill: "#220E92", strokeWidth: 2, stroke: "#fff", r: 4 }} activeDot={{ fill: "#220E92", strokeWidth: 3, stroke: "#fff", r: 6 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[260px] text-muted-foreground">
                      <TrendingUp className="w-10 h-10 opacity-20 mb-3" />
                      <p style={{ fontSize: "14px", fontWeight: 500 }}>No revenue data yet</p>
                      <p style={{ fontSize: "12px" }}>Revenue data will appear once the store is active</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Store Orders (table at bottom) ─── */}
            {(() => {
              const orders = storeOrders[s.id] || [];
              if (orders.length === 0) return null;
              const filtered = orderFilter === "all" ? orders : orders.filter(o => o.status === orderFilter);
              const counts: Record<string, number> = { all: orders.length };
              orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
              return (
                <div className="bg-card rounded-[12px] border border-border shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-[#220E92]/8">
                        <ShoppingCart className="w-4 h-4 text-[#220E92]" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Store Orders</h3>
                        <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{orders.length} orders · Feb 20, 2026</p>
                      </div>
                    </div>
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Showing {filtered.length} of {orders.length}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          {["Order ID", "Customer", "Items", "Total", "Time"].map(h => (
                            <th key={h} className="px-4 py-2.5 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(order => {
                          return (
                            <tr key={order.id} className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedStoreOrder(order)}>
                              <td className="px-4 py-3">
                                <span className="text-[#220E92]" style={{ fontSize: "13px", fontWeight: 600 }}>{order.id}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span style={{ fontSize: "13px", fontWeight: 500 }}>{order.customer}</span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="max-w-[220px]">
                                  <span className="text-muted-foreground truncate block" style={{ fontSize: "12px" }}>
                                    {order.items.join(", ")}
                                  </span>
                                  <span className="text-muted-foreground/60" style={{ fontSize: "11px" }}>{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span style={{ fontSize: "13px", fontWeight: 600 }}>₹{order.total.toLocaleString()}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{order.placedAt}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filtered.length === 0 && (
                    <div className="py-10 text-center">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground/25 mx-auto mb-2" />
                      <p className="text-muted-foreground" style={{ fontSize: "13px" }}>No orders match this filter</p>
                    </div>
                  )}

                  {/* Order Summary Footer */}
                  <div className="px-5 py-3 bg-muted/20 border-t border-border flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Total Revenue:</span>
                      <span style={{ fontSize: "13px", fontWeight: 700 }}>₹{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Avg Order:</span>
                      <span style={{ fontSize: "13px", fontWeight: 700 }}>₹{Math.round(orders.reduce((acc, o) => acc + o.total, 0) / orders.length).toLocaleString()}</span>
                    </div>

                  </div>
                </div>
              );
            })()}

          </>
        )}

        {/* ─── Store Order Detail Slide-Over ─── */}
        {selectedStoreOrder && (() => {
          const ord = selectedStoreOrder;
          const extra = orderDetailExtras[ord.id];
          const isPaid = extra?.paymentStatus === "paid";

          return (
            <>
              <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelectedStoreOrder(null)} />
              <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[680px] bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-card">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 style={{ fontSize: "18px", fontWeight: 700 }}>{ord.id}</h2>
                      {isPaid && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1" style={{ fontSize: "11px", fontWeight: 600 }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Paid
                        </span>
                      )}
                      {!isPaid && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1" style={{ fontSize: "11px", fontWeight: 600 }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Unpaid
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
                      Feb 20, 2026 at {ord.placedAt} · Dashrobe
                    </p>
                  </div>
                  <button onClick={() => setSelectedStoreOrder(null)} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Body — two column */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* LEFT COLUMN (3 cols) */}
                    <div className="lg:col-span-3 space-y-5">
                      {/* Order Items */}
                      <div className="bg-white rounded-[12px] border border-border shadow-sm">
                        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span style={{ fontSize: "14px", fontWeight: 600 }}>
                            Order Items ({ord.items.length})
                          </span>
                        </div>
                        <div className="divide-y divide-border">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 px-5 py-3.5">
                              <div className="w-10 h-10 rounded-lg bg-[#220E92]/8 flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-[#220E92]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p style={{ fontSize: "14px", fontWeight: 500 }}>{item}</p>
                                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>SKU-{ord.id.replace("ORD-", "")}-{idx + 1}</p>
                              </div>
                              <div className="text-right whitespace-nowrap" style={{ fontSize: "14px" }}>
                                <span style={{ fontWeight: 500 }}>{formatCurrencyFull(Math.round(ord.total / ord.items.length))}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Summary */}
                      {extra && (
                        <div className="bg-white rounded-[12px] border border-border shadow-sm">
                          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border">
                            {isPaid ? <CircleCheck className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
                            <span style={{ fontSize: "14px", fontWeight: 600 }}>{isPaid ? "Paid" : "Payment Pending"}</span>
                          </div>
                          <div className="px-5 py-4 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Subtotal</span>
                              <div className="flex items-center gap-8">
                                <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{ord.items.length} item{ord.items.length > 1 ? "s" : ""}</span>
                                <span style={{ fontSize: "14px" }}>{formatCurrencyFull(extra.subtotal)}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Shipping</span>
                              <span style={{ fontSize: "14px" }}>{formatCurrencyFull(extra.shipping)}</span>
                            </div>
                            <div className="border-t border-border pt-2.5">
                              <div className="flex items-center justify-between">
                                <span style={{ fontSize: "14px", fontWeight: 600 }}>Total</span>
                                <span style={{ fontSize: "16px", fontWeight: 700 }}>{formatCurrencyFull(ord.total)}</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{isPaid ? "Paid by customer" : "Awaiting payment"}</span>
                                <span style={{ fontSize: "14px", fontWeight: 500 }}>{isPaid ? formatCurrencyFull(ord.total) : "—"}</span>
                              </div>
                            </div>
                            <div className="border-t border-dashed border-border pt-2.5 flex items-center justify-between">
                              <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Platform Commission (10%)</span>
                              <span className="text-[#220E92]" style={{ fontSize: "14px", fontWeight: 600 }}>{formatCurrencyFull(extra.commission)}</span>
                            </div>
                          </div>
                        </div>
                      )}


                    </div>

                    {/* RIGHT COLUMN (2 cols) */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Store */}
                      {s && (
                        <div className="bg-white rounded-[12px] border border-border shadow-sm p-4">
                          <h4 style={{ fontSize: "13px", fontWeight: 600 }} className="mb-3">Store</h4>
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-[#220E92]" />
                            <span style={{ fontSize: "14px", fontWeight: 500 }}>{s.name}</span>
                          </div>
                          <p className="text-muted-foreground mt-1" style={{ fontSize: "12px" }}>{s.city}, {s.state}</p>
                        </div>
                      )}

                      {/* Customer */}
                      <div className="bg-white rounded-[12px] border border-border shadow-sm p-4">
                        <h4 style={{ fontSize: "13px", fontWeight: 600 }} className="mb-3">Customer</h4>
                        <p style={{ fontSize: "14px", fontWeight: 500 }}>{ord.customer}</p>
                        {extra && (
                          <div className="mt-2.5 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground truncate" style={{ fontSize: "12px" }}>{extra.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{extra.phone}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Shipping Address */}
                      {extra && (
                        <div className="bg-white rounded-[12px] border border-border shadow-sm p-4">
                          <h4 style={{ fontSize: "13px", fontWeight: 600 }} className="mb-3">Shipping Address</h4>
                          <div className="space-y-0.5">
                            <p style={{ fontSize: "13px", fontWeight: 500 }}>{ord.customer}</p>
                            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{extra.address.line1}</p>
                            {extra.address.line2 && <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{extra.address.line2}</p>}
                            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{extra.address.zip} {extra.address.city} {extra.address.state}</p>
                            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>India</p>
                            <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>{extra.phone}</p>
                          </div>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(`${extra.address.line1}, ${extra.address.city}, ${extra.address.state}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-[#220E92] hover:underline"
                            style={{ fontSize: "12px", fontWeight: 500 }}
                          >
                            <MapPin className="w-3 h-3" /> View on map <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {/* Payment Method */}
                      {extra && (
                        <div className="bg-white rounded-[12px] border border-border shadow-sm p-4">
                          <h4 style={{ fontSize: "13px", fontWeight: 600 }} className="mb-3">Payment Method</h4>
                          <div className="flex items-center gap-2.5">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span style={{ fontSize: "13px" }}>{extra.paymentMethod}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600" style={{ fontSize: "12px", fontWeight: 500 }}>
                                <CircleCheck className="w-3.5 h-3.5" /> Payment verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600" style={{ fontSize: "12px", fontWeight: 500 }}>
                                <Clock className="w-3.5 h-3.5" /> Awaiting payment
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="bg-white rounded-[12px] border border-border shadow-sm p-4">
                        <h4 style={{ fontSize: "13px", fontWeight: 600 }} className="mb-3">Order Summary</h4>
                        <div className="space-y-2">
                          {[
                            { label: "Items", value: String(ord.items.length) },
                            { label: "Order Amount", value: formatCurrencyFull(ord.total) },
                            { label: "Commission (10%)", value: extra ? formatCurrencyFull(extra.commission) : "—" },
                            { label: "Payment", value: isPaid ? (extra?.paymentMethod || "Paid") : "Pending" },
                          ].map((r) => (
                            <div key={r.label} className="flex items-center justify-between">
                              <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{r.label}</span>
                              <span style={{ fontSize: "13px", fontWeight: 500 }}>{r.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-border mt-3 pt-3 flex items-center justify-between">
                          <span style={{ fontSize: "13px", fontWeight: 600 }}>Vendor Earnings</span>
                          <span className="text-[#220E92]" style={{ fontSize: "16px", fontWeight: 700 }}>
                            {formatCurrencyFull(ord.total - (extra?.commission || 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* Document Preview Modal (in detail view) */}
        {previewDoc && (
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
                      {previewDoc.name.includes("GST") && ob && (
                        <>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>GSTIN</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.gstin}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Legal Name</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.businessName}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Trade Name</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.storeName}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Address</span><span className="text-right max-w-[250px]" style={{ fontSize: "13px", fontWeight: 600 }}>{ob.businessAddress}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Status</span><VBadge ok={ob.gstVerified} yes="Active" no="Inactive" /></div>
                        </>
                      )}
                      {previewDoc.name.includes("PAN") && ob && (
                        <>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>PAN Number</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.pan}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Name</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{previewDoc.name.includes("Business") ? ob.businessName : ob.ownerName}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Entity Type</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.legalEntityType}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Status</span><VBadge ok={ob.panVerified} yes="Verified" no="Unverified" /></div>
                        </>
                      )}
                      {previewDoc.name.includes("Bank") && ob && (
                        <>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Account Holder</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.accountHolder}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Bank Name</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.bankName}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Account Number</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.accountNumber}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>IFSC Code</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.ifscCode}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Verified</span><VBadge ok={ob.bankVerified} yes="Verified" no="Unverified" /></div>
                        </>
                      )}
                      {!previewDoc.name.includes("GST") && !previewDoc.name.includes("PAN") && !previewDoc.name.includes("Bank") && ob && (
                        <>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Document</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{previewDoc.name}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Issued To</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{ob.businessName}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "13px" }}>Status</span><VBadge ok={true} yes="Valid" /></div>
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
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>
          Manage vendor applications, approvals, and monitor store performance
        </p>
      </div>

      {/* KPI Cards - Analytics on top */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
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
      </div>

      {/* Status Distribution + Top Stores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      </div>

      {/* Tab Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-muted rounded-[12px] p-1.5">
          {([
            { key: "all", label: "All Stores", count: totalStores },
            { key: "pending", label: "Pending", count: pendingStores },
            { key: "approved", label: "Approved", count: approvedStores },
            { key: "rejected", label: "Rejected", count: rejectedStores },
            { key: "suspended", label: "Suspended", count: suspendedStores },
          ] as { key: "all" | StoreStatus; label: string; count: number }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setTablePage(1); }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] transition-all ${
                activeTab === tab.key
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
                {tab.count}
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
            onChange={(e) => { setSearch(e.target.value); setTablePage(1); }}
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
                {["Store", "Owner", "Location", "Revenue", "Orders", "Status", "Applied", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedStores.map((store) => {
                const stCfg = statusConfig[store.status];
                return (
                  <tr key={store.id} className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => { setSelectedStore(store); setOrderFilter("all"); setShowStoreDetails(false); }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "#220E9212" }}>
                          <Store className="w-4 h-4" style={{ color: "#220E92" }} />
                        </div>
                        <span className="hover:text-[#220E92] transition-colors" style={{ fontSize: "14px", fontWeight: 600 }}>{store.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>{store.ownerName}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{store.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{store.city}, {store.state}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{store.revenue > 0 ? formatCurrency(store.revenue) : "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{store.orders > 0 ? store.orders.toLocaleString() : "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 600, color: stCfg.color, backgroundColor: stCfg.bg }}>
                        <stCfg.icon className="w-3.5 h-3.5" />
                        {stCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{store.appliedAt}</span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative flex items-center gap-1">
                        {/* Pending actions */}
                        {store.status === "pending" && (
                          <button
                            onClick={() => store.onboardingComplete && setShowApproveModal(store.id)}
                            disabled={!store.onboardingComplete}
                            className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-colors ${
                              store.onboardingComplete
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300"
                                : "bg-muted/50 text-muted-foreground/50 border-border cursor-not-allowed"
                            }`}
                            style={{ fontSize: "11px", fontWeight: 600 }}
                            title={store.onboardingComplete ? "Approve" : `Onboarding incomplete (Step ${store.onboardingStep}/8)`}
                          >
                            <CircleCheck className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        {store.status === "pending" && (
                          <button onClick={() => setShowRejectModal(store.id)} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors" style={{ fontSize: "11px", fontWeight: 600 }} title="Reject">
                            <CircleX className="w-3.5 h-3.5" /> Reject
                          </button>
                        )}
                        {/* Approved actions */}
                        {store.status === "approved" && (
                          <button onClick={() => suspendStore(store.id)} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 transition-colors" style={{ fontSize: "11px", fontWeight: 600 }} title="Suspend">
                            <Ban className="w-3.5 h-3.5" /> Suspend
                          </button>
                        )}
                        {/* Rejected actions */}
                        {store.status === "rejected" && (
                          <button onClick={() => reactivateStore(store.id)} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors" style={{ fontSize: "11px", fontWeight: 600 }} title="Reactivate">
                            <RotateCcw className="w-3.5 h-3.5" /> Reactivate
                          </button>
                        )}
                        {/* Suspended actions */}
                        {store.status === "suspended" && (
                          <button onClick={() => reactivateStore(store.id)} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors" style={{ fontSize: "11px", fontWeight: 600 }} title="Reactivate">
                            <RotateCcw className="w-3.5 h-3.5" /> Reactivate
                          </button>
                        )}
                        {/* View button for all */}
                        <button onClick={() => { setSelectedStore(store); setOrderFilter("all"); setShowStoreDetails(false); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredStores.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p style={{ fontSize: "15px", fontWeight: 600 }}>No stores found</p>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {filteredStores.length > 0 && (
          <Pagination
            currentPage={tablePage}
            totalPages={totalTablePages}
            totalItems={filteredStores.length}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowApproveModal(null)}>
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
              Are you sure you want to approve <strong>{stores.find(s => s.id === showApproveModal)?.name}</strong>? The vendor will be able to list products and receive orders.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowApproveModal(null)} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
              <button onClick={() => approveStore(showApproveModal)} className="flex-1 px-4 py-2.5 rounded-[10px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* REJECT MODAL                                           */}
      {/* ═══════════════════════════════════════════════��═══════ */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowRejectModal(null); setRejectReason(""); }}>
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
              Rejecting <strong>{stores.find(s => s.id === showRejectModal)?.name}</strong>'s application.
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
              <button onClick={() => { setShowRejectModal(null); setRejectReason(""); }} className="flex-1 px-4 py-2.5 rounded-[10px] border border-border hover:bg-muted transition-colors" style={{ fontSize: "14px", fontWeight: 500 }}>Cancel</button>
              <button onClick={() => rejectStore(showRejectModal)} disabled={!rejectReason.trim()} className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50" style={{ fontSize: "14px", fontWeight: 500 }}>Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DOCUMENT PREVIEW MODAL                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-card rounded-[12px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
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

            {/* Preview Body */}
            <div className="flex-1 overflow-auto p-6 bg-muted/20">
              {/* Mock document preview */}
              <div className="bg-white rounded-[12px] border border-border shadow-sm p-8 min-h-[400px] flex flex-col items-center">
                {/* Simulated certificate header */}
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
      )}
    </div>
  );
}