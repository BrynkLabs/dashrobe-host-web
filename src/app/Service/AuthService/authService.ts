import axios from "axios";

const OTP_BASE = "https://api.notification.dashrobe.brynklabs.in/api/otp";
const BACKEND = "http://localhost:8080";

export const generateOtp = async (phone: string) => {
  const res = await axios.post(`${OTP_BASE}/generate`, {
    identifier_type: "MOBILE",
    identifier: phone,
    user_category: "SUPERADMIN",
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
  const res = await axios.post(`${OTP_BASE}/verify`, {
    identifier: phone,
    user_category: "SUPERADMIN",
    purpose: "LOGIN",
    channel: ["WHATSAPP"],
    tokenReferenceId,
    otp,
  });

  return res.data.data;
};

export const loginUser = async (phone: string) => {
  const res = await axios.post(`${BACKEND}/v1/auth/login`, {
    phoneNumber: phone,
  });

  return res.data.data;
};
