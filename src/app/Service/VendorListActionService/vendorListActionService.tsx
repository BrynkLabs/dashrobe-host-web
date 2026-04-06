import { StoreStatus } from "@/app/pages/admin/AdminStores";
import { axiosClient } from "../AxiosClient/axiosClient";
import { StoresResponse, StoreType } from "./Types/storeType";

export type FiltersType = {
  status?: StoreStatus;
  page?: number;
  size?: number;
  search?: string;
};

export const getAll = async (
    filters: FiltersType
): Promise<StoresResponse> => {
  const { status, page = 0, size = 10, search } = filters;
  try {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get<StoresResponse>(
      `/api/v1/superadmin/onboarding`,
      {
        params: { status, page, size, search },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to approve store");
    }
  } catch (error) {
    console.error("Error approving store:", error);
  }
};

export const approveStore = async (id: string) => {
  try {
    const response = await axiosClient.post(`/api/v1/superadmin/onboarding/${id}/approve`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    if (response.status === 200) {
      return response;
    } else {
      throw new Error("Failed to approve store");
    }
  } catch (error) {
    console.error("Error approving store:", error);
  }
};

export const rejectStore = async (id: string, rejectionReason: string) => {
  try {
    const response = await axiosClient.post(
      `/api/v1/superadmin/onboarding/${id}/reject`,
      {
        rejectionReason,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      return response;
    } else {
      throw new Error(
        `Failed to reject store: ${response?.data?.message || response.status}`
      );
    }
  } catch (error) {
    console.error("Error rejecting store:", error);
    throw error;
  }
};

export const suspendVendorStore = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axiosClient.post(
      `/api/v1/superadmin/onboarding/${id}/suspend`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response;
    } else {
      throw new Error(
        response?.data?.message || "Failed to suspend store"
      );
    }
  } catch (error) {
    console.error("Error suspending store:", error);
    throw error;
  }
};