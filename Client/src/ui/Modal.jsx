import ReactDOM from "react-dom";
import logoBlack from "/imgs/logoBlack.svg";
import logo from "/imgs/logo.svg";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTheme } from "../features/theme/useTheme";
import { NavLink } from "react-router-dom";
export function SidebarModal({ isOpen, onCancel }) {
  const { theme } = useTheme();
  console.log(theme);
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

export function ConfirmationModal({ isOpen, onCancel, onConfirm, title }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex text-stone-700 items-center justify-center animate-fade-in-bck z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] text-base relative">
        <div className="flex items-center gap-3 font-semibold mb-6">
          <RiDeleteBin6Line className="text-red-500 text-3xl" />
          <p className="text-lg"> {title}</p>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 hover:cursor-pointer hover:gray-500 text-gray-700 rounded shadow hover:shadow-md transition"
          >
            No
          </button>
          <button
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
