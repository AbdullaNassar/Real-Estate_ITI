import { useState } from "react";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as YUP from "yup";

import { axiosInstance } from "../../services/axiosInstance";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

export default function ChangePasswordModal({ onClose, onSuccess }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errMessage, SetErrMessage] = useState("");
  const [isLoading, SetIsLoading] = useState(false);
  const queryClient = useQueryClient();
  function handleUpdatePassword(value) {
    SetIsLoading(true);
    axiosInstance
      .patch("/users/change-password", value)
      .then((res) => {
        const msg = res?.data?.message?.[lang] || t("changePassword.success");
        toast.success(msg);
        queryClient.invalidateQueries({ queryKey: ["user"] });

        if (onSuccess) onSuccess();
        onClose();
        navigate("/login");
      })
      .catch((err) => {
        // SetErrMessage(err?.response?.data?.message);
        const msg =
          err?.response?.data?.message?.[lang] || t("changePassword.error");
        console.log("changePasswordModal => err response msg :", msg);
        toast.error(msg);
      })
      .finally(() => {
        SetIsLoading(false);
      });
  }

  const validationSchema = YUP.object().shape({
    currentPassword: YUP.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,100}$/,
        t("changePasswordModal.passwordRules")
      )
      .required(t("changePasswordModal.currentRequired")),

    newPassword: YUP.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,100}$/,
        t("changePasswordModal.passwordRules")
      )
      .required(t("changePasswordModal.newRequired")),

    confirmPassword: YUP.string()
      .oneOf([YUP.ref("newPassword")], t("changePasswordModal.passwordMatch"))
      .required(t("changePasswordModal.confirmRequired")),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-6 lg:px-8 bg-gray-50/30 backdrop-blur-xs">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-gray-50 shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          {t("changePasswordModal.title")}
        </h2>

        {/* current password */}
        <div className="mb-4 relative">
          <label
            htmlFor="currentPassword"
            className="block mb-1 text-lg font-medium text-gray-700"
          >
            {t("changePasswordModal.currentPassword")}
          </label>
          <input
            name="currentPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.currentPassword}
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            placeholder={t("changePasswordModal.currentPasswordPlaceholder")}
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute end-3 top-[45px] text-gray-500 cursor-pointer"
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
            {t("changePasswordModal.newPassword")}
          </label>
          <input
            name="newPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            placeholder={t("changePasswordModal.newPasswordPlaceholder")}
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute end-3 top-[45px] text-gray-500 cursor-pointer"
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
            {t("changePasswordModal.confirmPassword")}
          </label>
          <input
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder={t("changePasswordModal.confirmPasswordPlaceholder")}
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute end-3 top-[45px] text-gray-500 cursor-pointer"
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
            className="bg-transparent border-gray-700 border hover:bg-gray-500 hover:cursor-pointer transition hover:text-gray-50 text-gray-800 px-4 py-2 rounded-md"
          >
            {t("changePasswordModal.cancel")}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primarry hover:bg-primarry-hover hover:cursor-pointer transition text-white px-4 py-2 rounded-md"
          >
            {isLoading ? (
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
            ) : (
              t("changePasswordModal.save")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
