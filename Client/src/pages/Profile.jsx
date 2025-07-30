import React, { useState } from "react";
import { useFormik } from "formik";
import { useUser } from "../features/auth/useUser";
import avatar from "/imgs/download.jpg";
import axios from "axios";

export default function Profile() {
  let { user: curUser } = useUser();
  curUser = curUser?.user;
  console.log(curUser);
  const [isEditing, setIsEditing] = useState(false);
  const [previewimg, setPreviewimg] = useState(null);
  const [isLoading, SetIsLoading] = useState(false);

  const handleUpdate = (value)=>{
    SetIsLoading(true);
    console.log(value)


  }

  const updateFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: curUser?.userName,
      phoneNumber: curUser?.phoneNumber,
      gender: curUser?.gender,
      dateOfBirth: curUser?.dateOfBirth,
      profilePic: null,
    },
  });

  const handleFileChange = (e) => {
    const file = e.currentTarget.file[0];
    updateFormik.setFieldValue("profilePic", file);
    if (file) {
      setPreviewimg(URL.createObjectURL(file));
    }
  };

  return (
    <div className=" mx-auto p-4 md:p-8">
      {/* avatar part */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 ">
          <img
            src={curUser?.profilePic ? curUser.profilePic : avatar}
            alt="profile image"
            className="w-40 h-40 rounded-full object-cover"
          />
          {isEditing && (
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleFileChange}
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{curUser?.userName}</h2>
            <p>Joined in </p>
          </div>
        </div>
        <button className="mt-4 md:mt-0 px-28 py-2 border rounded text-gray-700 ">
          {isEditing ? "save" : "update profile"}
        </button>
      </div>
      {/* for tabs */}
      <div className="mt-6 flex">
        <button className=" px-4 py-2 hover:border-b-2 font-semibold hover:font-bold cursor-pointer">
          About
        </button>
        <button className=" px-4 py-2 hover:border-b-2 font-semibold hover:font-bold cursor-pointer">
          {curUser?.role === "host" ? "your apartment" : "your booking"}
        </button>
      </div>
      {/* confirmed info */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Confirmed information</h3>
        <div className="p-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-gray-500">Email address</p>
            <p>{curUser?.email}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-500">Phone number</p>
            {isEditing ? (
              <input
                type="text"
                name="phoneNumber"
                onChange={updateFormik.handleChange}
                value={updateFormik.values.phoneNumber}
                className="w-full border px-3 py-2 rounded"
              />
            ) : (
              <p>{curUser?.phoneNumber || "01*********"}</p>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-500">Government ID</p>
            <p>{curUser?.isVerified === true ? "Verified" : ""}</p>
          </div>
        </div>
      </div>
      {/* about */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <div className="p-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-gray-500">Gender</p>
            {isEditing ? (
              <select
                name="gender"
                onChange={updateFormik.handleChange}
                value={updateFormik.values.gender}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">select gender</option>
                <option value="male">male</option>
                <option value="female">female</option>
              </select>
            ) : (
              <p>{curUser?.gender || "Not selected yet"}</p>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-500">Birth Date</p>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                onChange={updateFormik.handleChange}
                value={updateFormik.values.dateOfBirth}
                className="w-full border px-3 py-2 rounded"
              />
            ) : (
              <p>{curUser?.dateOfBirth || "**/**/****"}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
