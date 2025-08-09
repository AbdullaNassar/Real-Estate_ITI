import ReactDOM from "react-dom";
import logoBlack from "/imgs/logoBlack.svg";
import logo from "/imgs/logo.svg";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTheme } from "../features/theme/useTheme";
import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
export function SidebarModal({ isOpen, onCancel }) {
  const { theme } = useTheme();
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className=" fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50  ">
      <div className="bg-gray-100 rounded-md absolute top-0 left-0 h-full w-3/4 sm:w-1/2 text-stone-600 ">
        <div className="relative p-2 ">
          <button
            className="text-4xl absolute top-1 right-2"
            onClick={onCancel}
          >
            &times;
          </button>
          <div className="mt-4 p-4 ">
            <img
              src={theme === "light" ? logo : logoBlack}
              alt="Maskn Logo"
              className="w-36 mb-4"
            />
          </div>
          <ul className="text-gray-900 flex flex-col gap-4 pl-6 font-semibold">
            <li>
              <NavLink
                onClick={onCancel}
                className={({ isActive }) =>
                  `text-gray-700 text-2xl md:text-3xl ${
                    isActive ? "text-primarry" : ""
                  }
              }`
                }
                to="/home"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onCancel}
                className={({ isActive }) =>
                  `text-gray-700 text-2xl md:text-3xl ${
                    isActive ? "text-primarry" : ""
                  }
              }`
                }
                to="/listings"
              >
                Listings
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onCancel}
                className={({ isActive }) =>
                  `text-gray-700 text-2xl md:text-3xl ${
                    isActive ? "text-primarry" : ""
                  }
              }`
                }
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onCancel}
                className={({ isActive }) =>
                  `text-gray-700 text-2xl md:text-3xl ${
                    isActive ? "text-primarry" : ""
                  }
              }`
                }
                to="/Contact"
              >
                Contact us
              </NavLink>
            </li>
          </ul>
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
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex text-stone-700 items-center justify-center animate-fade-in-bck z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] text-base relative">
        <div className="flex  gap-3 flex-col font-semibold mb-6">
          <RiDeleteBin6Line className="text-red-500 text-3xl" />
          <p className="text-lg">
            Are you sure you want to delete this {title} permanently? This
            action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 hover:cursor-pointer hover:gray-500 text-gray-700 rounded shadow hover:shadow-md transition"
          >
            No
          </button>
          <button
            disabled={isPending}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 hover:cursor-pointer transition"
          >
            Yes
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
