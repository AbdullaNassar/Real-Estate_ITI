import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as YUP from "yup";
import { useNavigate } from "react-router-dom";
import { FaSpinner,FaEye ,FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import Header from "../ui/Header";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [errMessage, SetErrMessage] = useState("");
  const [isLoading, SetIsLoading] = useState(false);
 

  function handleRegister(value) {
    SetIsLoading(true);
    const { terms, ...payload } = value;
    console.log(payload);
    axios
      .post("http://localhost:8000/api/v1/users/signup", payload)
      .then((res) => {
        console.log("signup success", res);
        toast.success("Signup successful");
        navigate("/verifyOtp",{ state: { email: payload.email } });
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

  const validationSchema = YUP.object().shape({
    userName: YUP.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Name is required"),
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
    confirmPassword: YUP.string()
      .oneOf([YUP.ref("password"), "Passwords must match"])
      .required("confirm password is required"),
    role: YUP.string()
      .oneOf(["guest", "host"], "Role must be either guest or host")
      .required("Role is required"),
    terms: YUP.boolean()
      .oneOf([true], "You must agree to the Terms & Conditions")
      .required("You must agree to the Terms & Conditions"),
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
    <>
    <Header/>
      <div className="flex justify-center items-center min-h-screen p-4 sm:px-6 lg:px-8 bg-gray-50">
        <form
          onSubmit={registerForm.handleSubmit}
          className="w-full sm:max-w-md max-w-md bg-white shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
            Sign Up
          </h2>

          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block mb-1 text-lg font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              name="userName"
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              value={registerForm.values.userName}
              type="text"
              id="userName"
              placeholder="Enter your full name"
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
              Email
            </label>
            <input
              name="email"
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              value={registerForm.values.email}
              type="email"
              id="email"
              placeholder="Enter your email"
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
              Password
            </label>
            <input
              name="password"
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              value={registerForm.values.password}
              type={showPassword?"text":"password"}
              id="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            <span
            onClick={()=>setShowPassword(!showPassword)}
            className="absolute right-3 top-[45px] text-gray-500 cursor-pointer" 
            >
              {showPassword?<FaEyeSlash /> : <FaEye />}
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
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              value={registerForm.values.confirmPassword}
              type={showConfirmPassword ?"text":"password"}
              id="confirmPassword"
              placeholder="Confirm password"
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
            onClick={()=>setShowConfirmPassword(!showConfirmPassword )}
            className="absolute right-3 top-[45px] text-gray-500 cursor-pointer" 
            >
              {showConfirmPassword ?<FaEyeSlash /> : <FaEye />}
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
              Role
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
                <span className="ml-2 text-gray-700">Guest</span>
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
                <span className="ml-2 text-gray-700">Host</span>
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
              I agree to the Terms & Conditions
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
              className="w-full bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
            >
              {isLoading ? (
                <FaSpinner className="mx-auto animate-spin" />
              ) : (
                "Signup"
              )}
            </button>
          </div>
          <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
           Already have an account ?{" "}
            <button onClick={()=>navigate("/login")} className="text-blue-600 hover:underline font-medium">
              Log In
            </button>
            
          </p>
        </div>
          
        </form>
      </div>
    </>
  );
}
