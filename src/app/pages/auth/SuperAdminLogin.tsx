import {
  generateOtp,
  loginUser,
  verifyOtp,
} from "@/app/Service/AuthService/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [tokenReferenceId, setTokenReferenceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [mobileError, setMobileError] = useState("");

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
    } catch (e) {
      console.error(e);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);

      const fullPhone = `91${phone}`;

      await verifyOtp(fullPhone, otp, tokenReferenceId);

      const loginData = await loginUser(`+91${phone}`);

      localStorage.setItem("token", loginData.token);

      navigate("/admin");
    } catch (e) {
      console.error(e);
      alert("OTP verification failed");
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
  }, [step]);

  return (
    <div className="flex h-screen p-5">
      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[#F3F4F6]">
        <img src="src/assets/login-logo.png" className="w-20 mb-6" />

        {step === "mobile" && (
          <>
            <h1 className="text-3xl font-semibold mb-2 text-[#101828]">
              Log in / Sign up
            </h1>
            <p className="text-gray-500 font-[400] mb-6">
              Enter your mobile number
            </p>

            <div>
            <input
              className={`border rounded-lg px-4 py-3 w-[390px] ${mobileError ? "mb-1" : "mb-4"}`}
              placeholder="Enter your mobile number"
              value={phone}
              maxLength={10}
              onChange={(e) => {
                setPhone(e.target.value.replace(/[^0-9]/g, ""))
                setMobileError("");
              }}
            />
            {mobileError && <p className="text-red-500 text-xs mb-4">{mobileError}</p>}
            </div>

            <button
              onClick={handleGenerateOtp}
              className="bg-[#220E92] text-white w-[390px] py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Continue with Mobile Number"}
            </button>

            <div className="mt-4 bg-[#F0FDF4] text-[#016630] p-2 rounded-lg w-[390px] text-[12px] flex items-center">
              <img src="src/assets/icons/chat-icon.png" className="w-4 mr-2" />
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

            <input
              className="border rounded-lg px-4 py-3 w-[390px] mb-4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtp}
              className="bg-[#2C1A9E] text-white w-[390px] py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="flex justify-between w-[320px] mt-4 text-sm">
              <button
                className="text-[#220E92] font-[500]"
                onClick={() => setStep("mobile")}
              >
                Edit Number
              </button>

              {!canResend ? (
                <p className="text-gray-500">Resend OTP in <span className="text-[#220E92] font-[500]">{timer}seconds</span></p>
              ) : (
                <button className="text-[#220E92]" onClick={handleGenerateOtp}>
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center">
        <img
          src="src/assets/login-banner.png"
          className="w-full h-full opacity-80"
        />
      </div>
    </div>
  );
}
