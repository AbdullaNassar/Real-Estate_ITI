import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useUser } from "../features/auth/useUser";
import EditProfileModal from "../features/profile/EditProfileModal";
import ChangePasswordModal from "../features/profile/ChangePasswordModal";
import GuestBooking from "../features/profile/GuestBooking";
import HostApartment from "../features/profile/HostApartment";
import Spinner from "../ui/Spinner";
import Error from "../ui/Error";

export default function Profile() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();

  const { user, refetch, isLoading: loadingUser, error: errorUser } = useUser();

  if (loadingUser) return <Spinner />;
  if (errorUser) return <Error message={errorUser?.message} />;

  const curUser = user?.user;
  const handleEditSuccess = async () => {
    setIsRefetching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await refetch();
      setShowEditModal(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to refetch user data:", err);
      toast.error(
        "profile updated but failed to refresh please reload the page."
      );
      setShowEditModal(false);
    } finally {
      setIsRefetching(false);
    }
  };

  const handlePasswordChangeSuccess = async () => {
    setEditPassword(false);

    try {
      await refetch();
    } catch (error) {
      console.error(
        "Failed to refetch user data after password change:",
        error
      );
      toast.error("password changed but failed to refresh user data.");
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
                ? new Date(curUser?.createdAt).getFullYear()
                : ""}
            </p>
            <div className="badge font-semibold badge-accent">
              {curUser?.role}
            </div>
          </div>
        </div>

        {/*button*/}
        <div className="w-full sm:w-auto flex flex-col gap-2">
          {curUser.role == "host" && (
            <button
              onClick={() => navigate("/addList")}
              className="sm:w-auto px-6 py-2 border rounded bg-primarry text-stone-100 hover:bg-primarry-hover transition cursor-pointer"
            >
              Add New List
            </button>
          )}
          <button
            onClick={() => setShowEditModal(true)}
            className="sm:w-auto px-6 py-2 border rounded bg-gray-400 text-gray-100 hover:bg-gray-500 transition cursor-pointer"
            disabled={isRefetching}
          >
            Edit Profile
          </button>

          <button
            onClick={() => setEditPassword(true)}
            className="sm:w-auto px-11 py-2 border rounded bg-gray-400 text-gray-100 hover:bg-gray-500 transition whitespace-nowrap cursor-pointer"
          >
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
          onSuccess={handlePasswordChangeSuccess}
        />
      )}

      {/* tabs */}
      <div className="mt-6 flex flex-wrap  gap-2">
        <button
          className={` cursor-pointer px-4 py-2 font-semibold text-2xl ${
            activeTab === "about"
              ? "border-b-3 border-b-primarry"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
        <button
          className={` cursor-pointer text-2xl px-4 py-2 font-semibold ${
            activeTab === "booking"
              ? " border-b-3 border-b-primarry"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("booking")}
        >
          {curUser?.role === "host" ? "Your Apartments" : "Your Bookings"}
        </button>
      </div>

      {activeTab === "about" && (
        <>
          {/* confirmed info */}
          <div className="mt-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-gray-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-gray-900">
                Confirmed Information
              </h3>
            </div>
            <div className="bg-gray-200 rounded-xl p-6 border border-blue-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Email Address
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium break-words bg-gray-50 px-3 py-2 rounded-lg border border-blue-200 group-hover:shadow-sm transition-shadow">
                    {curUser?.email}
                  </p>
                </div>

                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Phone Number
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-blue-200 group-hover:shadow-sm transition-shadow">
                    {curUser?.phoneNumber || (
                      <span className="text-gray-500 italic">
                        Not available yet
                      </span>
                    )}
                  </p>
                </div>

                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Verification Status
                    </p>
                  </div>
                  <div className="bg-gray-50 px-3 py-2 rounded-lg border border-blue-200 group-hover:shadow-sm transition-shadow">
                    {curUser?.isVerified ? (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-700 font-semibold">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                        <span className="text-amber-700 font-semibold">
                          Not verified
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* about section */}
          <div className="mt-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-gray-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="bg-gray-200 rounded-xl p-6 border border-purple-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Gender
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-purple-200 group-hover:shadow-sm transition-shadow">
                    {curUser?.gender || (
                      <span className="text-gray-500 italic">
                        Not selected yet
                      </span>
                    )}
                  </p>
                </div>

                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Date of Birth
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-purple-200 group-hover:shadow-sm transition-shadow">
                    {curUser?.dateOfBirth ? (
                      new Date(curUser.dateOfBirth).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    ) : (
                      <span className="text-gray-500 italic">
                        Not selected yet
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "booking" && (
        <div className="mt-4">
          {curUser?.role === "guest" ? <GuestBooking /> : <HostApartment />}
        </div>
      )}
    </div>
  );
}
