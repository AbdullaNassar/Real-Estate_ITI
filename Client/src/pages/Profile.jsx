import React, { useState } from "react";
import { useUser } from "../features/auth/useUser";
import EditProfileModal from "../component/EditProfileModal";
import toast from "react-hot-toast";
import ChangePasswordModal from "../component/ChangePasswordModal";

export default function Profile() {
  const { user, refetch } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [editPassword,setEditPassword] =useState(false)
  const curUser = user?.user;

  const handleEditSuccess = async () => {
    setIsRefetching(true);
    try {
      await refetch();
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to refetch user data:", err);
      toast.error(
        "Profile updated but failed to refresh. Please reload the page."
      );
      setShowEditModal(false);
    } finally {
      setIsRefetching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 overflow-x-hidden">
      {/* avatar part */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 w-full">
        <div className="flex flex-col sm:flex-row items-center gap-6 flex-wrap w-full min-w-0">
          <img
            src={curUser?.profilePic}
            alt="profile image"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border shadow-sm max-w-full"
          />
          <div className="text-center sm:text-left w-full sm:w-auto min-w-0">
            <h2 className="text-2xl font-bold break-words">
              {curUser?.userName}
            </h2>
            {/* <p className="text-gray-600">{curUser?.role}</p> */}
            <p className="text-gray-600">
              Joined in{" "}
              {curUser?.createdAt
                ? new Date(curUser.createdAt).getFullYear()
                : ""}
            </p>
            <div className="badge font-semibold badge-accent">
              {curUser.role}
            </div>
          </div>
        </div>

        {/*button*/}
        <div className="w-full sm:w-auto flex flex-col gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="sm:w-auto px-6 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
            disabled={isRefetching}
          >
            Edit Profile
          </button>

          <button 
          onClick={()=>setEditPassword(true)}
          className="sm:w-auto px-11 py-2 border rounded bg-blue-400 text-white hover:bg-blue-700 transition whitespace-nowrap cursor-pointer">
            Change Password
          </button>
        </div>
      </div>
        {/* editModal */}
      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* change password */}
      {editPassword && (
        <ChangePasswordModal
          onClose={() => setEditPassword(false)}
        />
      )}
      

      {/* tabs */}
      <div className="mt-6 flex flex-wrap border-b gap-2">
        <button className="px-4 py-2 font-semibold hover:border-b-2 hover:font-bold cursor-pointer">
          About
        </button>
        <button className="px-4 py-2 font-semibold hover:border-b-2 hover:font-bold cursor-pointer">
          {curUser?.role === "host" ? "Your Apartment" : "Your Booking"}
        </button>
      </div>

      {/* confirmed info */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Confirmed Information</h3>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-500">Email Address</p>
            <p className="break-words">{curUser?.email}</p>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-500">Phone Number</p>
            <p>{curUser?.phoneNumber || "not available yet"}</p>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-500">Is Verified</p>
            <p>{curUser?.isVerified ? "Verified" : "Not verified"}</p>
          </div>
        </div>
      </div>

      {/* about section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-500">Gender</p>
            <p>{curUser?.gender || "Not selected yet"}</p>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-500">Birth Date</p>
            <p className="text-gray-800 mt-1">
              {curUser?.dateOfBirth
                ? new Date(curUser.dateOfBirth).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Not selected yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
