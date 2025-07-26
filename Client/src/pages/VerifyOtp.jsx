import React, { useState} from "react";
import OtpInput from "../ui/OtpInput";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../ui/Header";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { email, type } = state || {};
  console.log(email);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const isForgetPassword = type === "forgot";

  const sendOtp = () => {
    if (otp.length !== 6) {
      return toast.error("Please enter a full 6-digit code.");
    }
    if (isForgetPassword) {
      if (!newPassword) {
        return toast.error("please full password");
      }
      axios
        .post("http://localhost:8000/api/v1/users/reset-password", {
          email,
          otp,
          newPassword,
        })
        .then(() => {
          toast.success("Password reset successful");
          navigate("/login");
        })
        .catch(() => {
          toast.error("Password reset failed");
        });
    } else {
      axios
        .post("http://localhost:8000/api/v1/users/verify-otp", { email, otp })
        .then((res) => {
          toast.success("Account verified");
          navigate("/");
        })
        .catch((err) => {
          toast.error("Verification failed");
        });
    }
  };
  const handleResendOtp = () => {
    axios
      .post("http://localhost:8000/api/v1/users/resend-otp", { email })
      .then(() => {
        toast.success("OTP resent successfully");
      })
      .catch(() => {
        toast.error("Failed to resend OTP");
      });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
            {isForgetPassword ? "Reset your password" : "Verify Your Email"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
            We've sent a 6-digit code to your email. Enter it below to continue.
          </p>

          <OtpInput length={6} onChange={setOtp} />
          {isForgetPassword && (
            <div className="mt-4 space-y-4">
              <input
                type="password"
                placeholder="New Password"
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
              {isForgetPassword ? "Reset Password" : "verify"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOtp}
                className="text-blue-600 hover:underline font-medium"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
