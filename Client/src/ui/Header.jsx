import logo from "/imgs/logo.svg";
import logoBlack from "/imgs/logoBlack.svg";
import { TbWorld } from "react-icons/tb";
import { CiDark, CiLogin } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../features/auth/useUser";
import { useTheme } from "../features/theme/useTheme";
import { useLogout } from "../features/auth/useLogout";
import { validateYupSchema } from "formik";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  console.log(theme);

  const { isPending: isLogout, logout } = useLogout();
  const { isLoading, error, user } = useUser();
  if (isLoading) return <h1>loading...</h1>;
  if (error) return <h1>error{error.message}</h1>;
  console.log(user);

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isVerifyPage = location.pathname === "/verifyOtp";
  const isAuthPage = isLoginPage || isSignupPage || isVerifyPage;
  return (
    // <header className="bg-blue-400">header</header>
    <header className=" flex justify-between items-center px-8 pt-8 pb-4 border-b-gray-300  border-b-2">
      <button onClick={() => navigate("/")} className="cursor-pointer w-48">
        <img
          src={theme === "light" ? logo : logoBlack}
          className="w-full"
          alt="Maskn Logo"
        />
      </button>
      <div className="flex gap-4 items-center">
        {!isAuthPage && (
          <>
            <input
              className="bg-gray-200 rounded-full py-2 px-4 focus:outline-0 focus:ring focus:ring-blue-300 focus:ring-offset-2 text-gray-700"
              type="search"
              placeholder="Search..."
            />
          </>
        )}
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
          {user && !isAuthPage && (
            <button
              disabled={isLogout}
              onClick={() => {
                navigate("/login");
                logout();
              }}
              className="size-8 rounded-full bg-gray-200 text-gray-600 flex justify-center items-center hover:cursor-pointer hover:bg-gray-300 transition-all "
            >
              <CiLogin />
            </button>
          )}
        </div>
        {isLoginPage && (
          <Link
            to="/signup"
            className="bg-primary-500 px-4 py-2 rounded-md bg-primary text-gray-100 hover:cursor-pointer transition-all hover:bg-primary-700"
          >
            signup
          </Link>
        )}
        {(isSignupPage || (!user && !isLoginPage)) && (
          <Link
            to="/login"
            className="bg-primary-500 px-4 py-2 rounded-md bg-primary text-gray-100  hover:cursor-pointer transition-all hover:bg-primary-700"
          >
            login
          </Link>
        )}
        {!isAuthPage && user && (
          <div className="size-12 flex items-center justify-center bg-secondary rounded-full overflow-hidden">
            <img className="w-3/4" src="./imgs/user.svg" alt="" />
          </div>
        )}
      </div>
    </header>
  );
}
