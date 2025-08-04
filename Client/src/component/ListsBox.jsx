import React from "react";
import ListItemCard from "./ListItemCard";

export default function ListsBox({ govern, heading }) {
  return (
    <div className="">
      <div className="my-4  bg-gray-100  sm:w-full">
        <h2 className="text-2xl font-semibold mb-4">
          {heading}
          {govern._id}
        </h2>
        <div className="grid sm:grid-cols-2 gap-2 md:grid-cols-4">
          {govern?.listings?.map((list) => {
            return <ListItemCard list={list} />;
          })}
          {/* <ListItemCard />
          <ListItemCard />
          <ListItemCard />
          <ListItemCard /> */}
        </div>
      </div>
    </div>
  );
}
