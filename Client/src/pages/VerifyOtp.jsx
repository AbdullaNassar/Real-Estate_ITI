import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import OtpInput from "../ui/OtpInput";
import Header from "../ui/Header";
import { useTranslation } from "react-i18next";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { t } = useTranslation();
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
      axios
        .post("http://localhost:8000/api/v1/users/reset-password", {
          email,
          otp,
          newPassword,
        })
        .then(() => {
          toast.success(t("verifyOtp.success.reset"));
          navigate("/login");
        })
        .catch(() => {
          toast.error(t("verifyOtp.errors.resetFailed"));
        });
    } else {
      axios
        .post("http://localhost:8000/api/v1/users/verify-otp", { email, otp })
        .then(() => {
          toast.success(t("verifyOtp.success.verify"));
          navigate("/");
        })
        .catch(() => {
          toast.error(t("verifyOtp.errors.verifyFailed"));
        });
    }
  };

  const handleResendOtp = () => {
    axios
      .post("http://localhost:8000/api/v1/users/resend-otp", { email })
      .then(() => {
        toast.success(t("verifyOtp.success.resent"));
      })
      .catch(() => {
        toast.error(t("verifyOtp.errors.resentFailed"));
      });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 sm:p-8">
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
                className="w-full px-4 py-2 border rounded-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={sendOtp}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
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
                className="text-blue-600 hover:underline font-medium"
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
