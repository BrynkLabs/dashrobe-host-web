import axios from "axios";
import { axiosClient } from "../AxiosClient/axiosClient";

const OTP_BASE = import.meta.env.VITE_OTP_API_BASE_URL;
const BACKEND = import.meta.env.VITE_API_BASE_URL;

export const generateOtp = async (phone: string) => {
  const res = await axios.post(`${OTP_BASE}/api/otp/generate`, {
    identifier_type: "MOBILE",
    identifier: phone,
    user_category: "HOST",
    purpose: "LOGIN",
    channel: ["WHATSAPP"],
    metadata: {},
  });

  return res.data.data;
};

export const verifyOtp = async (
  phone: string,
  otp: string,
  tokenReferenceId: string
) => {
  const res = await axios.post(`${OTP_BASE}/api/otp/verify`, {
    identifier: phone,
    user_category: "HOST",
    purpose: "LOGIN",
    channel: ["WHATSAPP"],
    tokenReferenceId,
    otp,
  });

  return res.data.data;
};

export type LoginRole = "superadmin" | "vendor";

export const loginUser = async (phone: string, role: LoginRole) => {
  const res = await axiosClient.post(`${BACKEND}/v1/auth/${role}/login`, {
    phoneNumber: phone,
  });

  return res.data.data;
};

export const logoutUser = async (token: string) => {
  const res = await axios.post(`${BACKEND}/v1/auth/logout`, "", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
