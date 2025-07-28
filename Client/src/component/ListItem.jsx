import React from "react";

export default function ListItem() {
  return (
    <div className=" border rounded-md border-primary shadow-xl">
      <img src="./imgs/list1.jpg" alt="list" className="h-48 w-full" />
      <div className="p-2 space-y-2">
        <h3>Stylish Apartment in Downtown Cairo</h3>
        <div className=" text-gray-400 flex justify-between">
          <h4 className="">100 EGP/night</h4>
          <button className="border px-2 py-1 hover:bg-primary hover:cursor-pointer hover:text-gray-100 transition-all">
            Show Details
          </button>
        </div>
      </div>
    </div>
  );
}
