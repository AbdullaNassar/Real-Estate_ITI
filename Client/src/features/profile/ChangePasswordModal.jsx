import React, { useState } from "react";
import { useFormik } from "formik";
import { axiosInstance } from "../../services/axiosInstance";
import * as YUP from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ChangePasswordModal({ onClose, onSuccess }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errMessage, SetErrMessage] = useState("");
  const [isLoading, SetIsLoading] = useState(false);
  const queryClient = useQueryClient();

  function handleUpdatePassword(value) {
    SetIsLoading(true);
    console.log("changepaswword => changepassword", value);
    axiosInstance
      .patch("/users/change-password", value)
      .then((res) => {
        console.log("change password success", res);
        toast.success("password change");
        queryClient.invalidateQueries({ queryKey: ["user"] });

        if (onSuccess) onSuccess();
        onClose();
      })
      .catch((err) => {
        SetErrMessage(err?.response?.data?.message);
        console.log(err?.response?.data?.message);
        toast.error(
          err?.response?.data?.message || "Failed to change password"
        );
      })
      .finally(() => {
        SetIsLoading(false);
      });
  }

  const validationSchema = YUP.object().shape({
    currentPassword: YUP.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,100}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("Current Password is required"),

    newPassword: YUP.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,100}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("New Password is required"),

    confirmPassword: YUP.string()
      .oneOf([YUP.ref("newPassword")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: handleUpdatePassword,
    validationSchema,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-xs">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        {/* current password */}
        <div className="mb-4 relative">
          <label
            htmlFor="currentPassword"
            className="block mb-1 text-lg font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            name="currentPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.currentPassword}
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            placeholder="Enter your current password"
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-[45px] text-gray-500 cursor-pointer"
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {formik.errors.currentPassword && formik.touched.currentPassword && (
            <p className="text-red-400 mt-1">{formik.errors.currentPassword}</p>
          )}
        </div>

        {/* new password */}
        <div className="mb-4 relative">
          <label
            htmlFor="newPassword"
            className="block mb-1 text-lg font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            name="newPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            placeholder="Enter your new password"
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-[45px] text-gray-500 cursor-pointer"
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {formik.errors.newPassword && formik.touched.newPassword && (
            <p className="text-red-400 mt-1">{formik.errors.newPassword}</p>
          )}
        </div>

        {/* confirm password */}
        <div className="mb-4 relative">
          <label
            htmlFor="confirmPassword"
            className="block mb-1 text-lg font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm password"
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[45px] text-gray-500 cursor-pointer"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <p className="text-red-400 mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>

        {/* buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 border rounded-md transition disabled:opacity-50 bg-red-400 text-white hover:bg-red-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 border rounded-md transition disabled:opacity-50 flex items-center bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? (
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
