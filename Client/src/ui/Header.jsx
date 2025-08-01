import logo from "/imgs/logo.svg";
import logoBlack from "/imgs/logoBlack.svg";
import { TbWorld } from "react-icons/tb";
import { CiDark, CiLogin } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../features/auth/useUser";
import { useTheme } from "../features/theme/useTheme";
import { useLogout } from "../features/auth/useLogout";
import { HiMenuAlt1 } from "react-icons/hi";
import { useState } from "react";
import { SidebarModal } from "./Modal";

export default function Header() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const { isPending: isLogout, logout } = useLogout();
  const { isLoading, error, user } = useUser();
  if (isLoading) return <h1>loading...</h1>;
  if (error) return <h1>error{error.message}</h1>;

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isVerifyPage = location.pathname === "/verifyOtp";
  const isAuthPage = isLoginPage || isSignupPage || isVerifyPage;
  return (
    // <header className="bg-blue-400">header</header>
    <header className=" flex justify-between items-center px-8 pt-8 pb-4 border-b-gray-300  border-b-2">
      <button
        onClick={() => navigate("/")}
        className="cursor-pointer hidden md:block md:w-48 "
      >
        <img
          src={theme === "light" ? logo : logoBlack}
          className="w-full"
          alt="Maskn Logo"
        />
      </button>

      {/* Mobile menu */}
      <button
        onClick={() => setIsOpenSidebar(true)}
        className="md:hidden text-3xl text-gray-800"
      >
        <HiMenuAlt1 />
      </button>

      <SidebarModal
        isOpen={isOpenSidebar}
        onCancel={() => setIsOpenSidebar(false)}
      />

      <ul className="space-x-4 lg:space-x-6 md:flex hidden">
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `linkSide ${isActive ? "linkSide-active" : ""}
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/listings"
            className={({ isActive }) =>
              `linkSide ${isActive ? "linkSide-active" : ""}
              }`
            }
          >
            Listings
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `linkSide ${isActive ? "linkSide-active" : ""}
              }`
            }
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `linkSide ${isActive ? "linkSide-active" : ""}
              }`
            }
          >
            Contact us
          </NavLink>
        </li>
      </ul>
      <div className="flex gap-2 md:gap-4 items-center">
        <div className="flex gap-2">
          <button className="size-8 rounded-full text-gray-600 bg-gray-200 flex justify-center items-center hover:cursor-pointer hover:bg-gray-300 transition-all ">
            <TbWorld />
          </button>
          <button
            onClick={toggleTheme}
            className="size-8 rounded-full bg-gray-200 text-gray-600  flex justify-center items-center hover:cursor-pointer hover:bg-gray-300 transition-all "
          >
            {theme == "light" ? <CiDark /> : <CiLight />}
          </button>
        </div>
        {isLoginPage && (
          <Link
            to="/signup"
            className="bg-primarry-500 px-4 py-2 rounded-md bg-primarry text-stone-100 hover:cursor-pointer transition-all hover:bg-primarry-700"
          >
            signup
          </Link>
        )}
        {(isSignupPage || (!user && !isLoginPage)) && (
          <Link
            to="/login"
            className="bg-primarry-500 px-4 py-2 rounded-md bg-primarry text-stone-100  hover:cursor-pointer transition-all hover:bg-primarry-700"
          >
            login
          </Link>
        )}
        {!isAuthPage && user && (
          <>
            {/* <div className="size-12 flex items-center justify-center bg-secondary rounded-full overflow-hidden">
              <img className="w-3/4" src="/imgs/user.svg" alt="" />
            </div> */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="user Pic" src={user?.user?.profilePic} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content text-stone-100 bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li onClick={logout}>
                  <Link to="/login">Logout</Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
