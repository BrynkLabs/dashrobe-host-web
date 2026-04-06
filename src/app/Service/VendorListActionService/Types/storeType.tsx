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

export type StoresResponse = {
  success: boolean;
  message: string;
  data: {
    stores: StoreType[];
    totalEntries: number;
    page: number;
    size: number;
    totalPages: number;
    last: boolean;
  };
};