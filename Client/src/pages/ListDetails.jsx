import React, { useState } from "react";
import pic1 from "/imgs/list1.jpg";
import { PiSwimmingPoolLight } from "react-icons/pi";
import MyMap from "../component/Map";
import { RiStarSFill } from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useList } from "../features/Lists/useList";
import Spinner from "../ui/Spinner";
export default function ListingDetails() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { list, error, isLoading } = useList();

  if (isLoading) return <Spinner />;
  if (error) return <h2>{error?.message}error???</h2>;
  console.log(list);
  const data = list.data;
  return (
    <div className="flex flex-col gap-8 ">
      {/* gallery */}
      <div className="grid grid-cols-[1fr_1fr_.5fr] gap-4 bg-gray-50 p-4 mt-1 grid-rows-[10rem_5rem_5rem_5rem] min-h-[60vh] ">
        <div className="bg-red-300 col-span-1 row-span-1 ">
          <img className="h-full w-full" src={data.photos[0]} alt="" />
        </div>
        <div className="bg-green-300 col-span-2 row-span-2">
          <img className="w-full h-full" src={data.photos[1]} alt="" />
        </div>
        <div className="bg-blue-500 col-span-1 row-span-3">
          <img className="w-full h-full" src={data.photos[2]} alt="" />
        </div>
        <div className="bg-amber-200 row-span-2">
          <img className="w-full h-full" src={data.photos[3]} alt="" />
        </div>
        <div className="bg-amber-200 row-span-2">
          <img className="w-full h-full" src={data.photos[4]} alt="" />
        </div>
      </div>

      {/* heading */}
      <div>
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-3xl mb-3">{data.title}</h2>
          <div className="badge badge-accent">{data.categoryId.name}</div>
        </div>
        <p>{data.descrption}</p>
      </div>

      {/* aminites */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">Aminites</h2>
        <div className="flex gap-3 flex-wrap    ">
          {data.amenitiesId.map((item) => {
            return (
              <div className="flex items-center gap-2 p-3 rounded-sm  justify-center   font-semibold border border-gray-300 w-42">
                <span className="text-3xl">
                  <PiSwimmingPoolLight />
                </span>
                {item.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">Location</h2>
        <MyMap
          lat={data.location.coordinates.coordinates[0]}
          lng={data.location.coordinates.coordinates[1]}
        />
      </div>

      {/* Reviews */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">Reviews</h2>
        <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2  ">
              <div className="size-12 flex items-center justify-center bg-secondary rounded-full overflow-hidden">
                <img className="w-3/4" src="/imgs/user.svg" alt="" />
              </div>
              <div>
                <h2>Abdullah</h2>
                <h3 className="text-gray-500">June 2025</h3>
              </div>
            </div>
            <span className="flex gap-0.5 text-primarry">
              <RiStarSFill />
              <RiStarSFill />
              <RiStarSFill />
              <RiStarSFill />
              <RiStarSFill />
            </span>
            <h3>Great place, but there was some noise from the street.</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2  ">
              <div className="size-12 flex items-center justify-center bg-secondary rounded-full overflow-hidden">
                <img className="w-3/4" src="/imgs/user.svg" alt="" />
              </div>
              <div>
                <h2>Abdullah</h2>
                <h3 className="text-gray-500">June 2025</h3>
              </div>
            </div>
            <span className="flex gap-0.5 text-primarry">
              <RiStarSFill />
              <RiStarSFill />
              <RiStarSFill />
              <RiStarSFill />
              <RiStarSFill />
            </span>
            <h3>Great place, but there was some noise from the street.</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2  ">
              <div className="size-12 flex items-center justify-center bg-secondary rounded-full overflow-hidden">
                <img className="w-3/4" src="/imgs/user.svg" alt="" />
              </div>
              <div>
                <h2>Abdullah</h2>
                <h3 className="text-gray-500">June 2025</h3>
              </div>
            </div>
            <span className="flex gap-0.5 text-primarry">
              <RiStarSFill />
              <RiStarSFill />
              <RiStarSFill />
              <RiStarSFill />
              <RiStarSFill />
            </span>
            <h3>Great place, but there was some noise from the street.</h3>
          </div>
        </div>
      </div>

      {/* Host */}

      <div>
        <h2 className="font-semibold text-3xl mb-3">Host</h2>
        <div className="sm:flex items-center gap-8">
          <div className="flex gap-4  items-center">
            <div className="size-24 flex items-center justify-center  bg-gray-500  overflow-hidden rounded-full p-0.5 ">
              <img
                className="w-full rounded-full"
                src={data.host.profilePic}
                alt=""
              />
            </div>
            <div>
              <h2 className="font-semibold text-2xl">{data.host.userName}</h2>
              <h3 className="text-gray-500 text-xl">
                Host since {new Date(data.host.createdAt).getFullYear()}
              </h3>
            </div>
          </div>

          <div>
            <button className="bg-gray-200 text-center py-2 px-8 rounded-full font-semibold hover:cursor-pointer transition-all hover:bg-gray-300">
              Message Host
            </button>
          </div>
        </div>
      </div>

      {/* Booking Date */}
      <div className="">
        <h2 className="font-semibold text-3xl mb-3">Booking</h2>
        <div className="flex gap-4">
          <div className="space-y-2">
            <h3>Check-in</h3>
            <DatePicker
              selected={startDate}
              minDate={new Date()}
              onChange={(date) => setStartDate(date)}
              className="border px-1.5 py-3 text-gray-500 rounded-lg border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <h3>Check-out</h3>
            <DatePicker
              selected={endDate}
              minDate={startDate}
              onChange={(date) => setEndDate(date)}
              className="border px-1.5 py-3 text-gray-500 rounded-lg border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Price */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">Price Details</h2>
        <div className="flex flex-col gap-3 max-w-1/3">
          <div className="flex justify-between">
            <span className="text-gray-500">Nighly rate</span>
            <span className="font-semibold ">$250</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Cleaning Fee</span>
            <span className="font-semibold">$50</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Service Fee</span>
            <span className="font-semibold">$250</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total</span>
            <span className="font-semibold">$500</span>
          </div>
          <button className="bg-primarry mt-8 mb-4 py-2 text-stone-100 rounded-sm text-lg hover:bg-primarry-hover hover:cursor-pointer transition-all">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
