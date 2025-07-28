import React from "react";
import { useSelector } from "react-redux";
import { useUser } from "../features/auth/useUser";
import Hero from "../component/Hero";
import ListsContainer from "../component/ListsContainer";

export default function HomePage() {
  let { error, isLoading, user: curUser } = useUser();
  if (isLoading) return <h1>loading...</h1>;
  console.log(error);
  if (error) return <h2>error....{error.message}</h2>;
  console.log("here", curUser);
  curUser = curUser?.user;

  return (
    <div className="bg-gray-100">
      <Hero />
      <ListsContainer />
    </div>
  );
}
