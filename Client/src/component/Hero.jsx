import React from "react";
import hero from "/imgs/hero.jpg";
export default function Hero() {
  return (
    <div className="shadow-2xl relative bg-[url('imgs/hero.jpg')] bg-center bg-cover min-h-[80vh] w-full text-center">
      <div className="absolute inset-0 bg-black/50 bg-opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center z-10 flex-col gap-6 md:p-8  p-4 lg:p-36">
        <h1 className="text-stone-100 text-2xl md:text-4xl lg:text-5xl font-bold">
          Find your perfect rental in Egypt
        </h1>

        <h2 className="text-stone-300 text-lg  md:text-xl lg:text-2xl ">
          Explore a wide range of rental properties across Egypt, from cozy
          apartments to luxurious villas. Discover your ideal stay with our
          easy-to-use search tools.
        </h2>

        <div className="flex w-full flex-col sm:flex-row max-w-md gap-1  ">
          <input
            type="text"
            placeholder="Where to?"
            className="flex-1 px-4 py-2 rounded-l-md border bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primarry"
          />
          <button className="bg-primarry self-center sm:self-auto text-white px-4 py-2 rounded-sm sm:rounded-r-md hover:bg-primarry-hover hover:cursor-pointer transition-all">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
