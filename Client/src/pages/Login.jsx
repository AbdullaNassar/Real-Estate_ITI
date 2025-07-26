import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as YUP from "yup";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import Header from "../ui/Header";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errMessage, SetErrMessage] = useState("");
  const [isLoading, SetIsLoading] = useState(false);

  function handleLogin(value) {
    SetIsLoading(true);
    console.log(value);
    axios
      .post("http://localhost:8000/api/v1/users/login", value)
      .then((res) => {
        console.log("login success", res);
        toast.success("login successful");
        navigate("/profile");
      })
      .catch((err) => {
        SetErrMessage(err.response.data.message);
        console.log(err.response.data.message);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        SetIsLoading(false);
      });
  }

  const handleForgotPassword = () => {
    const email = loginForm.values.email;
    if (!email) {
      toast.error("please enter your email");
      return;
    }

    axios
      .post("http://localhost:8000/api/v1/users/request-password-reset", {
        email,
      })
      .then(() => {
        toast.success("OTP Sent please Check Your Email");
        navigate("/verifyOtp", { state: { email, type: "forgot" } });
      });
  };

  const validationSchema = YUP.object().shape({
    email: YUP.string()
      .min(3, "Email must be at least 3 characters")
      .max(50, "Email must be less than 50 characters")
      .email("you enter invalid email ")
      .required("email is required"),
    password: YUP.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,100}$/,
        "password Must Contain At Least One Uppercase Letter, One Lowercase Letter, and One Number"
      )
      .required("password is required"),
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
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <form
          onSubmit={loginForm.handleSubmit}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-md bg-white shadow-2xl rounded-2xl p-8 sm:px-10 sm:py-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
            Log In
          </h2>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 text-base sm:text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <input
              name="email"
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              value={loginForm.values.email}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-2 text-gray-700 text-sm sm-text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {loginForm.errors.email && loginForm.touched.email ? (
            <p className="text-red-400 mb-2 text-sm sm:text-base">{loginForm.errors.email}</p>
          ) : (
            ""
          )}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block mb-1 text-base sm:text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <input
              name="password"
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              value={loginForm.values.password}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg px-4 py-2 text-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[45px] text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {loginForm.errors.password && loginForm.touched.password ? (
            <p className="text-red-400 mb-2 text-sm sm:text-base">{loginForm.errors.password}</p>
          ) : (
            ""
          )}
          <div className="text-right mb-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm sm:text-base  text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="flex justify-center w-full border-none">
            <button
              disabled={isLoading ? true : false}
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold px-6 py-2 sm:py-2.5  rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer text-base"
            >
              {isLoading ? (
                <FaSpinner className="mx-auto animate-spin" />
              ) : (
                "Log in"
              )}
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:underline font-medium"
              >
                SignUp
              </button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
