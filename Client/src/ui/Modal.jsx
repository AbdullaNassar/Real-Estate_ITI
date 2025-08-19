import ReactDOM from "react-dom";
import logo from "/imgs/logo.svg";
import logoBlack from "/imgs/logoBlack.svg";
import logoar from "/imgs/logoar.svg";
import logoardark from "/imgs/logoardark.svg";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTheme } from "../features/theme/useTheme";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { LuMessageSquareShare } from "react-icons/lu";
import { useUser } from "../features/auth/useUser";
import Spinner from "./Spinner";
import Error from "./Error";
import { CiLogout } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { useLogout } from "../features/auth/useLogout";
import { useTranslation } from "react-i18next";
export function SidebarModal({ isOpen, onCancel }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { theme } = useTheme();
  const { user, isLoading, error } = useUser();
  const { isPending: isLogout, logout } = useLogout();
  const navigate = useNavigate();
  if (!isOpen) {
    return null;
  }
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  console.log(user);

  function handleLog() {
    navigate("/login");
    if (!user) {
      onCancel();
    } else logout();
  }
  return ReactDOM.createPortal(
    <div className=" fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50  ">
      <div
        className={`bg-gray-100 rounded-md absolute top-0 h-full w-3/4 sm:w-1/2 text-stone-600
      transition-transform duration-300 ease-in-out
      ${lang === "ar" ? "tilt-in-right-1 right-0" : "tilt-in-left-1 left-0"}
      ${
        isOpen
          ? "translate-x-0"
          : lang === "ar"
          ? "translate-x-full"
          : "-translate-x-full"
      }
    `}
      >
        <div className="relative p-2 ">
          <button
            className="text-4xl absolute top-1 right-2"
            onClick={onCancel}
          >
            &times;
          </button>
          <div
            onClick={() => {
              navigate("/home");
              onCancel();
            }}
            role="button"
            className="mt-4 p-4 "
          >
            <img
              src={
                theme === "light"
                  ? i18n.language === "en"
                    ? logo
                    : logoar
                  : i18n.language === "en"
                  ? logoBlack
                  : logoardark
              }
              alt="Maskn Logo"
              className="w-36 mb-4"
            />
          </div>
          <ul className="text-gray-900 flex flex-col gap-6 pl-6 mb-8">
            <li>
              <NavLink
                onClick={onCancel}
                className={({ isActive }) =>
                  `text-gray-700 text-lg md:text-3xl flex gap-1 items-center ${
                    isActive
                      ? "text-stone-50 bg-primarry p-1 py-1.5 rounded-sm"
                      : ""
                  }
              }`
                }
                to="/home"
              >
                <span>
                  <MdOutlineDashboardCustomize />
                </span>
                {t("header.home")}
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onCancel}
                className={({ isActive }) =>
                  `text-gray-700 text-lg md:text-3xl flex gap-1 items-center ${
                    isActive
                      ? "text-stone-50 bg-primarry p-1 py-1.5 rounded-sm"
                      : ""
                  }
              }`
                }
                to="/listings"
              >
                <span>
                  <HiOutlineHomeModern />
                </span>
                {t("header.listings")}
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onCancel}
                className={({ isActive }) =>
                  `text-gray-700 text-lg md:text-3xl flex gap-1 items-center ${
                    isActive
                      ? "text-stone-50 bg-primarry p-1 py-1.5 rounded-sm"
                      : ""
                  }
              }`
                }
                to="/about"
              >
                <span>
                  <IoIosInformationCircleOutline />
                </span>
                {t("header.about")}
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onCancel}
                className={({ isActive }) =>
                  `text-gray-700 text-lg md:text-3xl flex gap-1 items-center ${
                    isActive
                      ? "text-stone-50 bg-primarry p-1 py-1.5 rounded-sm"
                      : ""
                  }
              }`
                }
                to="/Contact"
              >
                <span>
                  <LuMessageSquareShare />
                </span>
                {t("header.contact")}
              </NavLink>
            </li>
          </ul>
          <hr className="bg-gray-100" />

          <button
            onClick={handleLog}
            className="text-gray-700 text-lg md:text-3xl flex gap-1 items-center pl-6 mt-8"
          >
            {user ? (
              <>
                <span>
                  <CiLogout />
                </span>
                {t("header.logout")}
              </>
            ) : (
              <>
                <span>
                  <FiUser />
                </span>
                {t("header.hlogin")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ConfirmationModal({
  isOpen,
  onCancel,
  onConfirm,
  title,
  isPending = false,
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex text-stone-700 items-center justify-center animate-fade-in-bck z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] text-base relative">
        <div className="flex  gap-3 flex-col font-semibold mb-6">
          <RiDeleteBin6Line className="text-red-500 text-3xl" />
          <p className="text-lg">
            {t(
              "deleteModal.Are you sure you want to delete this {title} permanently? Thisaction cannot be undone."
            )}
          </p>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 hover:cursor-pointer hover:gray-500 text-gray-900 rounded shadow hover:shadow-md transition"
          >
            {t("deleteModal.No")}
          </button>
          <button
            disabled={isPending}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 hover:cursor-pointer transition"
          >
            {isPending ? t("deleteModal.deleting...") : t("deleteModal.Yes")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlay = true,
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isOpen ? "bg-opacity-60" : "bg-opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${
          sizeClasses[size]
        } bg-white rounded-2xl shadow-2xl transform transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-4">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-150"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`${title || showCloseButton ? "px-6 pb-6" : "p-6"}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
