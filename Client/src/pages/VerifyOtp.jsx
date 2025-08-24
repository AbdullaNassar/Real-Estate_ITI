import { useState } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

import OtpInput from "../ui/OtpInput";
import Header from "../ui/Header";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../services/axiosInstance";
import SEO from "../component/SEO";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { t, i18n } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { email, type } = state || {};

  const isForgetPassword = type === "forgot";

  const sendOtp = () => {
    if (otp.length !== 6) {
      return toast.error(t("verifyOtp.errors.invalidOtp"));
    }
    if (isForgetPassword) {
      if (!newPassword) {
        return toast.error(t("verifyOtp.errors.emptyPassword"));
      }
      axiosInstance
        .post("/users/reset-password", { email, otp, newPassword })
        .then(() => {
          toast.success(t("verifyOtp.success.reset"));
          navigate("/login");
        })
        .catch((err) => {
          const lang = i18n.language || "en";
          const msg =
            err.response?.data?.message?.[lang] ||
            t("verifyOtp.errors.verifyFailed");
          toast.error(msg);
        });
    } else {
      axiosInstance
        .post("/users/verify-otp", { email, otp })
        .then(() => {
          toast.success(t("verifyOtp.success.verify"));
          navigate("/");
        })
        .catch((err) => {
          const lang = i18n.language || "en";
          const msg =
            err.response?.data?.message?.[lang] ||
            t("verifyOtp.errors.verifyFailed");
          toast.error(msg);
        });
    }
  };

  const handleResendOtp = () => {
    axiosInstance
      .post("/users/request-password-reset", { email })
      .then(() => {
        toast.success(t("verifyOtp.success.resent"));
      })
      .catch(() => {
        toast.error(t("verifyOtp.errors.resentFailed"));
      });
  };

  return (
    <>
      <SEO
        title="Verify Your Account | Maskn"
        description="Enter the OTP sent to your email to verify your Maskn account and start booking homes in Egypt."
      />
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-gray-200 shadow-md rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
            {isForgetPassword
              ? t("verifyOtp.title.reset")
              : t("verifyOtp.title.verify")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
            {t("verifyOtp.subtitle")}
          </p>

          <OtpInput length={6} onChange={setOtp} />

          {isForgetPassword && (
            <div className="mt-4 space-y-4">
              <input
                type="password"
                placeholder={t("verifyOtp.placeholder.newPassword")}
                className="w-full px-4 py-2 border-0 rounded-lg bg-gray-300 text-gray-800"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={sendOtp}
              className="bg-primarry hover:bg-primarry-hover hover:cursor-pointer text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
            >
              {isForgetPassword
                ? t("verifyOtp.buttons.reset")
                : t("verifyOtp.buttons.verify")}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("verifyOtp.resend.prompt")}{" "}
              <button
                onClick={handleResendOtp}
                className="text-gray-800 underline  hover:cursor-pointer font-medium"
              >
                {t("verifyOtp.resend.button")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
