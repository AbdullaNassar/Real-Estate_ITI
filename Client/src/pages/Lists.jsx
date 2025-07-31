import { RiStarSFill } from "react-icons/ri";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import FormSelectRow from "../ui/FromSelectRow";
import DatePicker from "react-datepicker";
import { useEffect, useRef, useState } from "react";
import { Range } from "react-range";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { CiFilter } from "react-icons/ci";
export default function Lists() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [price, setPrice] = useState(50);

  return (
    <div className="md:flex gap-6 my-6">
      <div className=" w-72">
        <div className="flex gap-1 items-center mb-4 text-2xl">
          <span ss>
            <CiFilter />
          </span>
          <h2 className=" font-semibold ">Filters</h2>
        </div>

        <div>
          <div className="flex flex-col space-y-2 w-3/4 gap-4">
            <select className="p-2 rounded-sm border focus:ring focus:ring-primarry focus:ring-offset-1  border-gray-300 outline-0 disabled:opacity-50">
              <option>Government</option>
            </select>
            <select className="p-2 rounded-sm border focus:ring focus:ring-primarry focus:ring-offset-1  border-gray-300 outline-0 disabled:opacity-50">
              <option>List Type</option>
            </select>

            <div className="space-y-2">
              <h3 className="font-semibold">Available Date</h3>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                placeholderText="Select a date range"
                className="w-full p-2 rounded-sm border focus:ring focus:ring-primarry focus:ring-offset-1  border-gray-300 outline-0 disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Price</h3>
              <div className="flex gap-4 items-center ">
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={price}
                  onChange={(e) => setPrice(+e.target.value)}
                  className="accent-primarry flex-1 hover:cursor-pointer"
                />
                <label htmlFor="">${price}</label>
              </div>
            </div>
            <button className="px-2 py-1 border rounded-sm hover:cursor-pointer hover:bg-gray-800 hover:text-gray-100 transition-all mt-4">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      <div className=" grow space-y-6 flex flex-col">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">20+ Results</h2>
          <label className="input bg-gray-200 rounded-full">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" className="grow" placeholder="Search" />
          </label>
        </div>
        <hr className="text-gray-500" />
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
                className="bg-primarry text-stone-100 p-1 hover:bg-primarry-hover rounded-sm hover:cursor-pointer transition-all"
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
                className="bg-primarry text-stone-100 p-1 hover:bg-primarry-hover rounded-sm hover:cursor-pointer transition-all"
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
                className="bg-primarry text-stone-100 p-1 hover:bg-primarry-hover rounded-sm hover:cursor-pointer transition-all"
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
                className="bg-primarry text-stone-100 p-1 hover:bg-primarry-hover rounded-sm hover:cursor-pointer transition-all"
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
                className="bg-primarry text-stone-100 p-1 hover:bg-primarry-hover rounded-sm hover:cursor-pointer transition-all"
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
                className="bg-primarry text-stone-100 p-1 hover:bg-primarry-hover rounded-sm hover:cursor-pointer transition-all"
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
