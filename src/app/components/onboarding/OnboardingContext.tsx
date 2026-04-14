import { createContext, useContext, useState, type ReactNode } from "react";

// ─── Types ─────────────────────────────────────────────────────
export interface AddressData {
  shopNo: string;
  streetArea: string;
  landmark: string;
  pincode: string;
  district: string;
  city: string;
  state: string;
}

export const defaultAddress: AddressData = {
  shopNo: "",
  streetArea: "",
  landmark: "",
  pincode: "",
  district: "",
  city: "",
  state: "",
};

export interface VendorBasicDetailsData {
  storeName: string;
  businessName: string;
  ownerName: string;
  legalEntity: string; // "sole" | "partnership" | "private" | "llp" | "others"
  gstin: string;
  gstVerified: boolean;
  pan: string;
  panVerified: boolean;
  address: AddressData;
  contactPerson: string;
  designation: string;
  phone: string;
  phoneVerified: boolean;
  altPhone: string;
  altPhoneVerified: boolean;
  email: string;
  contact2Name: string;
  contact2Designation: string;
  contact2Phone: string;
  contact2Email: string;
}

export interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface StoreOperationsData {
  storeLocation: string;
  storeAddress: AddressData;
  schedule: DaySchedule[];
  preparationTime: string;
  packingTime: string;
  readyFor30Min: boolean;
  packaging: string;
  deliveryCoverage: number;
}

export interface ProductCategoriesData {
  selectedCategories: string[];
  selectedSubCategories: Record<string, string[]>;
  numberOfSkus: string;
  pricingType: string;
  avgPriceRange: string;
  customizationAvailable: boolean;
  customCategoryText: string;
}

export interface BankSettlementData {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  ifscCode: string;
  bankVerified: boolean;
  upiId: string;
  gstCertificateUploaded: boolean;
  businessPANUploaded: boolean;
  ownerPANUploaded: boolean;
  bankProofUploaded: boolean;
}

export interface RefundsReturnsData {
  refundPhone: string;
  refundEmail: string;
}

export interface OffersPromotionsData {
  joinPlatformSalesAds: boolean;
}

export interface TechnologyInventoryData {
  uploadChoice: "now" | "later" | "";
  fileUploaded: boolean;
  needPhotography: boolean;
}

export interface OnboardingData {
  vendorBasicDetails: VendorBasicDetailsData;
  storeOperations: StoreOperationsData;
  productCategories: ProductCategoriesData;
  bankSettlement: BankSettlementData;
  refundsReturns: RefundsReturnsData;
  offersPromotions: OffersPromotionsData;
  technologyInventory: TechnologyInventoryData;
}

// ─── Defaults ──────────────────────────────────────────────────
const defaultSchedule: DaySchedule[] = [
  { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "21:00" },
  { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "22:00" },
  { day: "Sunday", isOpen: false, openTime: "", closeTime: "" },
];

const defaultOnboardingData: OnboardingData = {
  vendorBasicDetails: {
    storeName: "",
    businessName: "",
    ownerName: "",
    legalEntity: "",
    gstin: "",
    gstVerified: false,
    pan: "",
    panVerified: false,
    address: defaultAddress,
    contactPerson: "",
    designation: "",
    phone: "",
    phoneVerified: false,
    altPhone: "",
    altPhoneVerified: false,
    email: "",
    contact2Name: "",
    contact2Designation: "",
    contact2Phone: "",
    contact2Email: "",
  },
  storeOperations: {
    storeLocation: "",
    storeAddress: defaultAddress,
    schedule: defaultSchedule,
    preparationTime: "",
    packingTime: "",
    readyFor30Min: false,
    packaging: "",
    deliveryCoverage: 1,
  },
  productCategories: {
    selectedCategories: [],
    selectedSubCategories: {},
    numberOfSkus: "",
    pricingType: "",
    avgPriceRange: "",
    customizationAvailable: false,
    customCategoryText: "",
  },
  bankSettlement: {
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    accountType: "savings",
    ifscCode: "",
    bankVerified: false,
    upiId: "",
    gstCertificateUploaded: false,
    businessPANUploaded: false,
    ownerPANUploaded: false,
    bankProofUploaded: false,
  },
  refundsReturns: {
    refundPhone: "",
    refundEmail: "",
  },
  offersPromotions: {
    joinPlatformSalesAds: false,
  },
  technologyInventory: {
    uploadChoice: "",
    fileUploaded: false,
    needPhotography: false,
  },
};

// ─── Context ───────────────────────────────────────────────────
interface OnboardingContextType {
  data: OnboardingData;
  updateVendorBasicDetails: (d: Partial<VendorBasicDetailsData>) => void;
  updateStoreOperations: (d: Partial<StoreOperationsData>) => void;
  updateProductCategories: (d: Partial<ProductCategoriesData>) => void;
  updateBankSettlement: (d: Partial<BankSettlementData>) => void;
  updateRefundsReturns: (d: Partial<RefundsReturnsData>) => void;
  updateOffersPromotions: (d: Partial<OffersPromotionsData>) => void;
  updateTechnologyInventory: (d: Partial<TechnologyInventoryData>) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);

  const updateVendorBasicDetails = (d: Partial<VendorBasicDetailsData>) =>
    setData((prev) => ({ ...prev, vendorBasicDetails: { ...prev.vendorBasicDetails, ...d } }));

  const updateStoreOperations = (d: Partial<StoreOperationsData>) =>
    setData((prev) => ({ ...prev, storeOperations: { ...prev.storeOperations, ...d } }));

  const updateProductCategories = (d: Partial<ProductCategoriesData>) =>
    setData((prev) => ({ ...prev, productCategories: { ...prev.productCategories, ...d } }));

  const updateBankSettlement = (d: Partial<BankSettlementData>) =>
    setData((prev) => ({ ...prev, bankSettlement: { ...prev.bankSettlement, ...d } }));

  const updateRefundsReturns = (d: Partial<RefundsReturnsData>) =>
    setData((prev) => ({ ...prev, refundsReturns: { ...prev.refundsReturns, ...d } }));

  const updateOffersPromotions = (d: Partial<OffersPromotionsData>) =>
    setData((prev) => ({ ...prev, offersPromotions: { ...prev.offersPromotions, ...d } }));

  const updateTechnologyInventory = (d: Partial<TechnologyInventoryData>) =>
    setData((prev) => ({ ...prev, technologyInventory: { ...prev.technologyInventory, ...d } }));

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateVendorBasicDetails,
        updateStoreOperations,
        updateProductCategories,
        updateBankSettlement,
        updateRefundsReturns,
        updateOffersPromotions,
        updateTechnologyInventory,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}