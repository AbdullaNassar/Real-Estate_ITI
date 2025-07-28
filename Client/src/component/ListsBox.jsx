import React from "react";
import ListItem from "./ListItem";

export default function ListsBox() {
  return (
    <div className="">
      <div className="my-4  bg-gray-100  sm:w-full">
        <h2 className="text-2xl font-semibold mb-4">Cairo Rentals</h2>
        <div className="grid sm:grid-cols-2 gap-2 md:grid-cols-4">
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
        </div>
      </div>
    </div>
  );
}
