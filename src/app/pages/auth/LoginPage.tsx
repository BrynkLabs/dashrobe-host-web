import {
  generateOtp,
  loginUser,
  verifyOtp,
  type LoginRole,
} from "@/app/Service/AuthService/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCookie, setCookie } from "@/app/utils/cookieUtils";
import loginLogo from "@/assets/login-logo.png";
import chatIcon from "@/assets/icons/chat-icon.png";
import loginBanner from "@/assets/login-banner.png";
import { set } from "date-fns";

const ROLE_REDIRECT: Record<string, string> = {
  SUPERADMIN: "/admin",
  VENDOR: "/onboarding",
};

interface LoginPageProps {
  role: LoginRole;
}

export default function LoginPage({ role }: LoginPageProps) {
  const navigate = useNavigate();

  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [tokenReferenceId, setTokenReferenceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendOtpTrigger, setResendOtpTrigger] = useState(0);

  useEffect(() => {
    const token = getCookie("token");
    const savedRole = localStorage.getItem("role");
    if (token && savedRole) {
      // Only auto-redirect if the logged-in role matches this login page's role
      const expectedRole = role === "superadmin" ? "SUPERADMIN" : "VENDOR";
      if (savedRole === expectedRole) {
        navigate(ROLE_REDIRECT[savedRole] || "/");
      }
    }
  }, []);

  const handleGenerateOtp = async () => {
    if (phone.length !== 10) {
      setMobileError("Enter valid mobile number");
      return;
    }

    try {
      setLoading(true);

      const fullPhone = `91${phone}`;

      const data = await generateOtp(fullPhone);

      setTokenReferenceId(data.token_reference_id);
      setStep("otp");
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.message || e?.message || "Failed to send OTP";
      setMobileError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4 || !/^\d+$/.test(otp)) {
      setOtpError("Enter valid OTP");
      return;
    }

    try {
      setLoading(true);

      const fullPhone = `91${phone}`;

      await verifyOtp(fullPhone, otp, tokenReferenceId);

      const loginData = await loginUser(`${phone}`, role);

      setCookie("token", loginData.token, 1);
      localStorage.setItem("userId", loginData.userId);
      localStorage.setItem("phoneNumber", loginData.phoneNumber);
      localStorage.setItem("userType", loginData.userType);
      localStorage.setItem("role", loginData.role);
      localStorage.setItem("newUser", String(loginData.newUser));

      const redirectPath = ROLE_REDIRECT[loginData.role] || "/";
      navigate(redirectPath);
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.data?.message || e?.response?.data?.message || e?.message || "OTP verification failed";
      setOtpError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step !== "otp") return;

    setTimer(60);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, resendOtpTrigger]);

  return (
    <div className="flex h-screen md:p-5">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#F3F4F6] px-5">
        <img src={loginLogo} className="w-20 mb-6" />

        {step === "mobile" && (
          <>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-[#101828]">
              Log in / Sign up
            </h1>
            <p className="text-gray-500 font-[400] mb-6 text-sm md:text-base">
              Enter your mobile number
            </p>

            <div className="w-full max-w-[390px]">
              <input
                className={`border rounded-lg px-4 py-3 w-full ${
                  mobileError ? "mb-1" : "mb-4"
                }`}
                placeholder="Enter your mobile number"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/[^0-9]/g, ""));
                  setMobileError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    e.preventDefault();
                    handleGenerateOtp();
                  }
                }}
              />
              {mobileError && (
                <p className="text-red-500 text-xs mb-4">{mobileError}</p>
              )}
            </div>

            <button
              onClick={handleGenerateOtp}
              className="bg-[#220E92] text-white w-full max-w-[390px] py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Continue with Mobile Number"}
            </button>

            <div className="mt-4 bg-[#F0FDF4] text-[#016630] p-2 rounded-lg w-full max-w-[390px] text-[12px] flex items-center">
              <img src={chatIcon} className="w-4 mr-2 shrink-0" />
              WhatsApp is mandatory on this number. All order updates and
              communication will be sent via WhatsApp.
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="text-2xl font-semibold mb-4">OTP</h1>

            <p className="text-gray-500 mb-6 text-sm">
              Enter OTP sent to your number on whatsapp
            </p>

            <div className="w-full max-w-[390px]">
              <input
                className={`border rounded-lg px-4 py-3 w-full ${
                  otpError ? "mb-1" : "mb-4"
                }`}
                placeholder="Enter OTP"
                value={otp}
                maxLength={4}
                inputMode="numeric"
                autoFocus
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^0-9]/g, ""));
                  setOtpError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    e.preventDefault();
                    handleVerifyOtp();
                  }
                }}
              />
              {otpError && (
                <p className="text-red-500 text-xs mb-4">{otpError}</p>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="bg-[#2C1A9E] text-white w-full max-w-[390px] py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="flex justify-between w-full max-w-[320px] mt-4 text-sm">
              <button
                className="text-[#220E92] font-[500]"
                onClick={() => {
                  setOtp("");
                  setStep("mobile");
                  setMobileError("");
                  setOtpError("");
                }}
              >
                Edit Number
              </button>

              {!canResend ? (
                <p className="text-gray-500">
                  Resend OTP in{" "}
                  <span className="text-[#220E92] font-[500]">
                    {timer}seconds
                  </span>
                </p>
              ) : (
                <button
                  className="text-[#220E92]"
                  onClick={() => {
                    setResendOtpTrigger((prev) => prev + 1);
                    setOtp("");
                    handleGenerateOtp();
                  }}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* RIGHT SIDE - hidden on mobile */}
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <img
          src={loginBanner}
          className="w-full h-full opacity-80"
        />
      </div>
    </div>
  );
}
