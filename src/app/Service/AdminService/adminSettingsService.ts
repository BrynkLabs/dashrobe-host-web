import { axiosClient } from "../AxiosClient/axiosClient";
import { getCookie } from "../../utils/cookieUtils";

const BASE = "/api/v1/superadmin/settings/platform";

export interface PlatformSettings {
  name: string;
  supportEmail: string;
  phone: string;
}

export const getPlatformSettings = async (): Promise<PlatformSettings> => {
  const res = await axiosClient.get(BASE, {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  return res.data.data;
};

export const updatePlatformSettings = async (
  data: PlatformSettings
): Promise<void> => {
  await axiosClient.put(BASE, data, {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
};
