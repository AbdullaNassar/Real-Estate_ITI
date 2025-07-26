import React, { useState } from "react";
import logo from "/imgs/logo.svg";
import { TbWorld } from "react-icons/tb";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { useTheme } from "../contexts/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  function handleToggleTheme() {
    setTheme((prev) => !prev);
  }

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isVerifyPage = location.pathname === "/verifyOtp";
  const isAuthPage = isLoginPage || isSignupPage || isVerifyPage;
  return (
    // <header className="bg-blue-400">header</header>
    <header className=" flex justify-between items-center px-8 pt-8 pb-4 border-b-stone-300  border-b-2">
      <button onClick={() => navigate("/")} className="cursor-pointer">
        <img src={logo} alt="Maskn Logo" />
      </button>
      <div className="flex gap-4 items-center">
        {!isAuthPage && (
          <>
            <input
              className="bg-stone-200 rounded-full py-2 px-4 focus:outline-0 focus:ring focus:ring-blue-300 focus:ring-offset-2 text-stone-700"
              type="search"
              placeholder="Search..."
            />
          </>
        )}
        <div className="flex gap-2">
          <button className="size-8 rounded-full bg-stone-200 flex justify-center items-center hover:cursor-pointer hover:bg-stone-300 transition-all ">
            <TbWorld />
          </button>
          <button
            className="size-8 rounded-full bg-stone-200 flex justify-center items-center hover:cursor-pointer hover:bg-stone-300 transition-all "
            onClick={handleToggleTheme}
          >
            {theme ? <CiDark /> : <CiLight />}
          </button>
        </div>
        {isLoginPage && (
          <Link
            to="/signup"
            className="bg-primary-500 px-4 py-2 rounded-md text-white hover:cursor-pointer transition-all hover:bg-primary-700"
          >
            signup
          </Link>
        )}
        {isSignupPage && (
          <Link
            to="/login"
            className="bg-primary-500 px-4 py-2 rounded-md text-white hover:cursor-pointer transition-all hover:bg-primary-700"
          >
            login
          </Link>
        )}
       
      </div>
    </header>
  );
}
