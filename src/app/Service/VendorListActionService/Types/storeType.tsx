export type StoreType = {
  vendorId: string;
  storeName: string;
  ownerName: string;
  location: string;
  revenue: number;
  orderCount: number;
  status: string;
  submittedAt: string;
};

export type StatusCountType = {
  DRAFT: number,
  SUBMITTED: number,
  APPROVED: number,
  REJECTED: number,
  SUSPENDED: number
}

export type StoresResponse = {
  success: boolean;
  message: string;
  data: {
    stores: StoreType[];
    statusCounts: StatusCountType;
    totalEntries: number;
    page: number;
    size: number;
    totalPages: number;
    last: boolean;
  };
};

export type VendorDetailData = {
  vendorId: string;
  status: string;
  currentStep: number;
  submittedAt: string | null;
  rejectionReason: string | null;
  basicDetails: {
    storeName: string;
    businessName: string;
    ownerName: string;
    legalEntityType: string;
    gstin: string;
    pan: string;
    businessAddress: string;
    contactPersonName: string;
    designation: string;
    phoneNumber: string;
    whatsappNumber: string;
    alternatePhone: string | null;
    email: string;
  } | null;
  storeOperations: {
    storeLocation: string;
    operatingHours: {
      day: string;
      isOpen: boolean;
      openTime: string;
      closeTime: string;
    }[];
    orderPreparationTime: string;
    averagePackingTime: string;
    readyFor30MinDelivery: boolean;
    packagingResponsibility: string;
    deliveryCoverageKm: number;
  } | null;
  productCategories: {
    selectedCategoryIds: number[];
    skuCountApprox: number;
    pricingType: string;
    averagePriceRange: string;
    customizationAvailable: boolean;
  } | null;
  bankSettlement: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    accountType: string;
    ifscCode: string;
    upiId: string | null;
    docGstCertificateS3Key: string | null;
    docBusinessPanS3Key: string | null;
    docOwnerPanS3Key: string | null;
    docBankProofS3Key: string | null;
  } | null;
  refundPolicy: {
    refundContactNumber: string;
    refundContactEmail: string;
  } | null;
  offersPromotions: {
    freeShippingEnabled: boolean;
    platformAdsOptedIn: boolean;
  } | null;
  declarationsAccepted: boolean;
};

export type VendorDetailResponse = {
  success: boolean;
  message: string;
  data: VendorDetailData;
};