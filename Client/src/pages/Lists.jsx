import React from "react";
import { RiStarSFill } from "react-icons/ri";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
export default function Lists() {
  const navigate = useNavigate();
  return (
    <div className="md:flex gap-6 my-6">
      <div className=" w-72">sidebar</div>
      <div className=" grow space-y-6 flex flex-col">
        <h2 className="text-xl font-bold">20+ Results</h2>
        <hr />
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <div className="space-y-1">
            <h3 className="text-gray-500">Apatment - cairo</h3>
            <h3 className="font-semibold">Cozy Apartment in Downtown Cairo</h3>
            <h3 className="text-gray-500">
              2 guests · 1 bedroom · 1 bed · 1 bath
            </h3>
            <h3 className="flex gap-4 mt-4">
              <span className="flex items-center gap-1">
                3.6 <RiStarSFill />
              </span>
              <span className="p-1 rounded-sm bg-gray-200">$50/night</span>
              <button
                onClick={() => navigate("/listDetails/23")}
                className="bg-primary text-stone-100 p-1 hover:bg-primary-hover rounded-sm hover:cursor-pointer transition-all"
              >
                Show Details
              </button>
            </h3>
          </div>
          <div>
            <img src="/imgs/list1.jpg" className="w-54 rounded-md" alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <div className="space-y-1">
            <h3 className="text-gray-500">Apatment - cairo</h3>
            <h3 className="font-semibold">Cozy Apartment in Downtown Cairo</h3>
            <h3 className="text-gray-500">
              2 guests · 1 bedroom · 1 bed · 1 bath
            </h3>
            <h3 className="flex gap-4 mt-4">
              <span className="flex items-center gap-1">
                3.6 <RiStarSFill />
              </span>
              <span className="p-1 rounded-sm bg-gray-200">$50/night</span>
              <button
                onClick={() => navigate("/listDetails/23")}
                className="bg-primary text-stone-100 p-1 hover:bg-primary-hover rounded-sm hover:cursor-pointer transition-all"
              >
                Show Details
              </button>
            </h3>
          </div>
          <div>
            <img src="/imgs/list1.jpg" className="w-54 rounded-md" alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <div className="space-y-1">
            <h3 className="text-gray-500">Apatment - cairo</h3>
            <h3 className="font-semibold">Cozy Apartment in Downtown Cairo</h3>
            <h3 className="text-gray-500">
              2 guests · 1 bedroom · 1 bed · 1 bath
            </h3>
            <h3 className="flex gap-4 mt-4">
              <span className="flex items-center gap-1">
                3.6 <RiStarSFill />
              </span>
              <span className="p-1 rounded-sm bg-gray-200">$50/night</span>
              <button
                onClick={() => navigate("/listDetails/23")}
                className="bg-primary text-stone-100 p-1 hover:bg-primary-hover rounded-sm hover:cursor-pointer transition-all"
              >
                Show Details
              </button>
            </h3>
          </div>
          <div>
            <img src="/imgs/list1.jpg" className="w-54 rounded-md" alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <div className="space-y-1">
            <h3 className="text-gray-500">Apatment - cairo</h3>
            <h3 className="font-semibold">Cozy Apartment in Downtown Cairo</h3>
            <h3 className="text-gray-500">
              2 guests · 1 bedroom · 1 bed · 1 bath
            </h3>
            <h3 className="flex gap-4 mt-4">
              <span className="flex items-center gap-1">
                3.6 <RiStarSFill />
              </span>
              <span className="p-1 rounded-sm bg-gray-200">$50/night</span>
              <button
                onClick={() => navigate("/listDetails/23")}
                className="bg-primary text-stone-100 p-1 hover:bg-primary-hover rounded-sm hover:cursor-pointer transition-all"
              >
                Show Details
              </button>
            </h3>
          </div>
          <div>
            <img src="/imgs/list1.jpg" className="w-54 rounded-md" alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <div className="space-y-1">
            <h3 className="text-gray-500">Apatment - cairo</h3>
            <h3 className="font-semibold">Cozy Apartment in Downtown Cairo</h3>
            <h3 className="text-gray-500">
              2 guests · 1 bedroom · 1 bed · 1 bath
            </h3>
            <h3 className="flex gap-4 mt-4">
              <span className="flex items-center gap-1">
                3.6 <RiStarSFill />
              </span>
              <span className="p-1 rounded-sm bg-gray-200">$50/night</span>
              <button
                onClick={() => navigate("/listDetails/23")}
                className="bg-primary text-stone-100 p-1 hover:bg-primary-hover rounded-sm hover:cursor-pointer transition-all"
              >
                Show Details
              </button>
            </h3>
          </div>
          <div>
            <img src="/imgs/list1.jpg" className="w-54 rounded-md" alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center pb-4 ">
          <div className="space-y-1">
            <h3 className="text-gray-500">Apatment - cairo</h3>
            <h3 className="font-semibold">Cozy Apartment in Downtown Cairo</h3>
            <h3 className="text-gray-500">
              2 guests · 1 bedroom · 1 bed · 1 bath
            </h3>
            <h3 className="flex gap-4 mt-4">
              <span className="flex items-center gap-1">
                3.6 <RiStarSFill />
              </span>
              <span className="p-1 rounded-sm bg-gray-200">$50/night</span>
              <button
                onClick={() => navigate("/listDetails/23")}
                className="bg-primary text-stone-100 p-1 hover:bg-primary-hover rounded-sm hover:cursor-pointer transition-all"
              >
                Show Details
              </button>
            </h3>
          </div>
          <div>
            <img src="/imgs/list1.jpg" className="w-54 rounded-md" alt="" />
          </div>
        </div>

        {/* pagination */}
        <div className="flex gap-4 self-center mt-8">
          <button className="flex  items-center transition gap-.5 hover:bg-gray-300 bg-gray-200 p-2 font-semibold hover:cursor-pointer">
            <span>
              <GrFormPrevious />
            </span>
            <span>Prev</span>
          </button>
          <button className="flex  items-center transition gap-.5 hover:bg-gray-300 bg-gray-200 p-2 font-semibold hover:cursor-pointer">
            <span>Next</span>
            <span>
              <GrFormNext />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
