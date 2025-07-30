import React from "react";
import { useSelector } from "react-redux";
import { useUser } from "../features/auth/useUser";
import Hero from "../component/Hero";
import ListsContainer from "../component/ListsContainer";
import { MdKeyboardArrowRight } from "react-icons/md";
import { HiArrowSmRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  let { error, isLoading, user: curUser } = useUser();
  const navigate = useNavigate();
  if (isLoading) return <h1>loading...</h1>;
  console.log(error);
  if (error) return <h2>error....{error.message}</h2>;
  console.log("here", curUser);
  curUser = curUser?.user;

  return (
    <div className="bg-gray-100 flex flex-col">
      <Hero />
      <ListsContainer />
      <button
        onClick={() => navigate("/listings")}
        className="border border-primary px-4 py-2 self-center flex items-center gap-1 text-xl my-4 font-semibold hover:bg-primary justify-center hover:cursor-pointer transition-all text-gray-800 hover:text-stone-200"
      >
        <span>Show All Listings</span>
        <span className="text-2xl">
          <HiArrowSmRight />
        </span>
      </button>
    </div>
  );
}
