import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as YUP from "yup";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

import Header from "../ui/Header";
import { axiosInstance } from "../services/axiosInstance";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import SEO from "../component/SEO";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errMessage, SetErrMessage] = useState("");
  const [isLoading, SetIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  function handleLogin(value) {
    SetIsLoading(true);
    axiosInstance
      .post("/users/login", value, {
        withCredentials: true,
      })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        const lang = i18n.language || "en";
        const msg = err.response?.data?.message?.[lang] || "An error occurred";
        SetErrMessage(msg);
        console.log(msg);
        toast.error(msg);
      })
      .finally(() => {
        SetIsLoading(false);
      });
  }

  const handleForgotPassword = () => {
    const email = loginForm.values.email;
    if (!email) {
      toast.error(t("login.errors.enterEmail"));
      return;
    }

    axios
      .post("http://localhost:8000/api/v1/users/request-password-reset", {
        email,
      })
      .then(() => {
        toast.success(t("login.errors.otpSent"));
        navigate("/verifyOtp", { state: { email, type: "forgot" } });
      });
  };

  const validationSchema = YUP.object().shape({
    email: YUP.string()
      .min(3, t("login.validation.emailMin"))
      .max(50, t("login.validation.emailMax"))
      .email(t("login.validation.emailInvalid"))
      .required(t("login.validation.emailRequired")),
    password: YUP.string()
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,100}$/,
      //   // "password Must Contain At Least One Uppercase Letter, One Lowercase Letter, and One Number"
      // )
      .required(t("login.validation.passwordRequired")),
  });

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: handleLogin,
    validationSchema,
  });

  return (
    <div className="bg-gray-100">
      <SEO
        title="Login | Maskn"
        description="Access your Maskn account to manage bookings, listings, and more."
      />
      <Header />
      <div className=" min-h-[85vh] flex justify-center items-center  p-4 bg-gray-100">
        <form
          onSubmit={loginForm.handleSubmit}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-md bg-gray-150 shadow-2xl rounded-2xl p-8 sm:px-10 sm:py-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
            {t("login.title")}
          </h2>
          <p className="mt-2 mb-6  text-gray-600 text-center">
            {t("login.subtitle")}{" "}
          </p>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 text-base sm:text-lg font-medium text-gray-700"
            >
              {t("login.email")}
            </label>
            <input
              name="email"
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              value={loginForm.values.email}
              type="email"
              id="email"
              placeholder={t("login.emailPlaceholder")}
              className="w-full border rounded-lg px-4 py-2 text-gray-700 text-sm sm-text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {loginForm.errors.email && loginForm.touched.email ? (
            <p className="text-red-400 mb-2 text-sm sm:text-base">
              {loginForm.errors.email}
            </p>
          ) : (
            ""
          )}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block mb-1 text-base sm:text-lg font-medium text-gray-700"
            >
              {t("login.password")}
            </label>
            <input
              name="password"
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              value={loginForm.values.password}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder={t("login.passwordPlaceholder")}
              className="w-full border rounded-lg px-4 py-2 text-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-[45px] text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {loginForm.errors.password && loginForm.touched.password ? (
            <p className="text-red-400 mb-2 text-sm sm:text-base">
              {loginForm.errors.password}
            </p>
          ) : (
            ""
          )}
          <div className="text-right mb-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm sm:text-base hover:cursor-pointer text-gray-900 hover:underline"
            >
              {t("login.forgotPassword")}
            </button>
          </div>
          <div className="flex justify-center w-full border-none">
            <button
              disabled={isLoading ? true : false}
              type="submit"
              className="w-full bg-primarry text-white font-semibold px-6 py-2 sm:py-2.5  rounded-lg hover:bg-primarry-hover transition duration-300 cursor-pointer text-base"
            >
              {isLoading ? (
                <FaSpinner className="mx-auto animate-spin" />
              ) : (
                t("login.loginButton")
              )}
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("login.noAccount")}{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-gray-600 hover:cursor-pointer hover:underline font-medium"
              >
                {t("login.signupButton")}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
