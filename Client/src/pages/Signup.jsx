import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as YUP from "yup";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

import Header from "../ui/Header";
import { axiosInstance } from "../services/axiosInstance";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errMessage, SetErrMessage] = useState("");
  const [isLoading, SetIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  function handleRegister(value) {
    SetIsLoading(true);
    const { terms, ...payload } = value;
    console.log(payload);
    axiosInstance
      .post("/users/signup", payload)
      .then((res) => {
        const lang = i18n.language || "en";
        const msg = res?.data?.message?.[lang] || "signup success";
        console.log(msg, res);
        toast.success(msg);
        navigate("/verifyOtp", { state: { email: payload.email } });
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

  const validationSchema = YUP.object().shape({
    userName: YUP.string()
      .min(3, t("signup.validation.userNameMin"))
      .max(50, t("signup.validation.userNameMax"))
      .required(t("signup.validation.userNameRequired")),
    email: YUP.string()
      .min(3, t("signup.validation.emailMin"))
      .max(50, t("signup.validation.emailMax"))
      .email(t("signup.validation.emailInvalid"))
      .required(t("signup.validation.emailRequired")),
    password: YUP.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,100}$/,
        t("signup.validation.passwordPattern")
      )
      .required(t("signup.validation.passwordRequired")),
    confirmPassword: YUP.string()
      .oneOf([YUP.ref("password"), t("signup.validation.confirmPasswordMatch")])
      .required(t("signup.validation.confirmPasswordRequired")),
    role: YUP.string()
      .oneOf(["guest", "host"], t("signup.validation.roleInvalid"))
      .required(t("signup.validation.roleRequired")),
    terms: YUP.boolean()
      .oneOf([true], t("signup.validation.termsRequired"))
      .required(t("signup.validation.termsRequired")),
  });

  const registerForm = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "guest",
      terms: false,
    },
    onSubmit: handleRegister,
    validationSchema,
  });

  return (
    <div className="bg-gray-100">
      <Header />
      <div className="flex justify-center items-center min-h-screen p-4 sm:px-6 lg:px-8 bg-gray-50">
        <form
          onSubmit={registerForm.handleSubmit}
          className="w-full sm:max-w-md max-w-md bg-gray-100 shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-12">
            {t("signup.title")}
          </h2>

          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block mb-1 text-lg font-medium text-gray-700"
            >
              {t("signup.fullName")}
            </label>
            <input
              name="userName"
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              value={registerForm.values.userName}
              type="text"
              id="userName"
              placeholder={t("signup.fullNamePlaceholder")}
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {registerForm.errors.userName && registerForm.touched.userName ? (
            <p className="text-red-400 mb-2">{registerForm.errors.userName}</p>
          ) : (
            ""
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 text-lg font-medium text-gray-700"
            >
              {t("signup.email")}
            </label>
            <input
              name="email"
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              value={registerForm.values.email}
              type="email"
              id="email"
              placeholder={t("signup.emailPlaceholder")}
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {registerForm.errors.email && registerForm.touched.email ? (
            <p className="text-red-400 mb-2">{registerForm.errors.email}</p>
          ) : (
            ""
          )}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block mb-1 text-lg font-medium text-gray-700"
            >
              {t("signup.password")}
            </label>
            <input
              name="password"
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              value={registerForm.values.password}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder={t("signup.passwordPlaceholder")}
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-[45px] text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {registerForm.errors.password && registerForm.touched.password ? (
            <p className="text-red-400 mb-2">{registerForm.errors.password}</p>
          ) : (
            ""
          )}
          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-lg font-medium text-gray-700"
            >
              {t("signup.confirmPassword")}
            </label>
            <input
              name="confirmPassword"
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              value={registerForm.values.confirmPassword}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder={t("signup.confirmPasswordPlaceholder")}
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute end-3 top-[45px] text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {registerForm.errors.confirmPassword &&
          registerForm.touched.confirmPassword ? (
            <p className="text-red-400 mb-2">
              {registerForm.errors.confirmPassword}
            </p>
          ) : (
            ""
          )}
          <div className="mb-4">
            <label className="block mb-1 text-lg font-medium text-gray-700">
              {t("signup.role")}
            </label>
            <div className="flex items-center space-x-6 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  onChange={registerForm.handleChange}
                  checked={registerForm.values.role === "guest"}
                  name="role"
                  value="guest"
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">{t("signup.guest")}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  onChange={registerForm.handleChange}
                  checked={registerForm.values.role === "host"}
                  value="host"
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">{t("signup.host")}</span>
              </label>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-6">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="mt-1"
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              checked={registerForm.values.terms}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              {t("signup.terms")}
            </label>
          </div>
          {registerForm.errors.terms && registerForm.touched.terms ? (
            <p className="text-red-400 mb-4">{registerForm.errors.terms}</p>
          ) : (
            ""
          )}

          <div className="flex justify-center w-full border-none">
            <button
              disabled={isLoading ? true : false}
              type="submit"
              className="w-full bg-primarry text-white font-semibold px-6 py-2 rounded-lg hover:bg-primarry-hover transition duration-300 cursor-pointer"
            >
              {isLoading ? (
                <FaSpinner className="mx-auto animate-spin" />
              ) : (
                t("signup.signupButton")
              )}
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("signup.alreadyAccount")}
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:cursor-pointer hover:underline font-medium"
              >
                {t("signup.loginButton")}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
