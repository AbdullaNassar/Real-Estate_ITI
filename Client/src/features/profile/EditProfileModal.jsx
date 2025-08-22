import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";

import { axiosInstance } from "../../services/axiosInstance";
import { useUser } from "../auth/useUser";
import { useTranslation } from "react-i18next";

export default function EditProfileModal({ onClose, onSuccess }) {
  const { t } = useTranslation();
  const { user } = useUser();
  const curUser = user?.user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const handleProfileUpdate = async (values) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "profilePic" && values[key]) {
          formData.append("profilePic", values.profilePic);
        } else if (
          values[key] !== undefined &&
          values[key] !== null &&
          values[key] !== ""
        ) {
          formData.append(key, values[key]);
        }
      });

      await axiosInstance.patch("/users", formData);
      toast.success("Profile updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: curUser?.userName || "",
      email: curUser?.email || "",
      phoneNumber: curUser?.phoneNumber || "",
      dateOfBirth: curUser?.dateOfBirth || "",
      gender: curUser?.gender || "",
      profilePic: null,
    },
    onSubmit: handleProfileUpdate,
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    formik.setFieldValue("profilePic", file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-gray-50/30 backdrop-blur-xs">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-lg bg-gray-50 shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          {t("editProfileModal.Edit Profile")}
        </h2>

        <div className="flex justify-center mb-4">
          <img
            src={preview || curUser?.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>

        <input
          type="file"
          name="profilePic"
          accept="image/*"
          onChange={handleImage}
          disabled={isSubmitting}
          className="w-full mb-4 text-sm file:mr-4 file:py-1 file:px-3 file:border file:rounded-md file:text-sm file:font-semibold file:bg-transparent hover:file:bg-gray-100"
        />

        {/* Username */}
        <div className="mb-4">
          <label htmlFor="userName" className="block mb-1 text-sm font-medium">
            {t("editProfileModal.Username")}
          </label>
          <input
            id="userName"
            name="userName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.userName}
            disabled={isSubmitting}
            placeholder={t("editProfileModal.Enter your username")}
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            {t("editProfileModal.Email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            disabled={isSubmitting}
            placeholder={t("editProfileModal.Enter your email")}
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block mb-1 text-sm font-medium"
          >
            {t("editProfileModal.Phone Number")}
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
            disabled={isSubmitting}
            placeholder={t("editProfileModal.Enter your phone number")}
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label
            htmlFor="dateOfBirth"
            className="block mb-1 text-sm font-medium"
          >
            {t("editProfileModal.Date of Birth")}
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            onChange={formik.handleChange}
            value={formik.values.dateOfBirth}
            disabled={isSubmitting}
            max={new Date().toISOString().split("T")[0]}
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label htmlFor="gender" className="block mb-1 text-sm font-medium">
            {t("editProfileModal.Gender")}
          </label>
          <select
            id="gender"
            name="gender"
            onChange={formik.handleChange}
            value={formik.values.gender}
            disabled={isSubmitting}
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:outline-none"
          >
            <option value="">{t("editProfileModal.Select gender")}</option>
            <option value="male">{t("editProfileModal.Male")}</option>
            <option value="female">{t("editProfileModal.Female")}</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-transparent border-gray-700 border hover:bg-gray-500 hover:cursor-pointer transition hover:text-gray-50 text-gray-800 px-4 py-2 rounded-md"
          >
            {t("editProfileModal.Cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primarry hover:bg-primarry-hover hover:cursor-pointer transition text-white px-4 py-2 rounded-md"
          >
            {isSubmitting ? (
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
            ) : (
              t("editProfileModal.Save")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
