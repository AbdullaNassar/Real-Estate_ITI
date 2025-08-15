import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdCircle, MdDeleteOutline } from "react-icons/md";
import { RiStarSFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { LuFolderOpen } from "react-icons/lu";
import { FaRegCalendarCheck } from "react-icons/fa";
import { BsCalendar2Check } from "react-icons/bs";

import { useDeleteList } from "../Lists/useDeleteList";
import { ConfirmationModal } from "../../ui/Modal";

export default function ListOwnerItem({ list }) {
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();

  const { isPending, deleteList } = useDeleteList();

  function handleDeleteList(id) {
    deleteList(id, {
      onSettled: () => {
        setDeleteModal(false);
      },
    });
  }
  console.log(list);

  return (
    <>
      <div className=" space-y-4 flex-col md:flex-row flex md:justify-between items-center pb-4 border-gray-300">
        <div className="space-y-1 flex flex-col items-center md:block">
          <h3 className="text-gray-500 space-x-4 flex flex-wrap justify-between gap-2 bg-red">
            <span>
              {list.categoryId.name} - {list.governorate}, Egypt
            </span>
            <span className="text-gray-800">
              {list.bookedDates.length === 0 ? (
                <span className="flex items-center gap-1 text-gray-500">
                  <MdCircle className="text-green-500" /> No bookings
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FaRegCalendarCheck className="text-green-500" />
                  {list.bookedDates.length}x booked
                </span>
              )}
            </span>
          </h3>
          <h3 className="font-semibold">{list.title}</h3>
          <h3 className="text-gray-500">
            {list.maxGustes} guests·{" "}
            {list.roomNumbers ? list.roomNumbers : "no"}
            bedroom · 1 bath
          </h3>
          <h3 className="flex gap-4  items-center ">
            <span className="flex items-center gap-1">
              {list.averageRating ? list.averageRating : 3.6}{" "}
              <span className="text-primarry">
                <RiStarSFill />
              </span>
            </span>
            <span className="p-1 rounded-sm">${list.pricePerNight}/night</span>
            {list.isApproved ? (
              <span className="  bg-gray-300 text-gray-800 rounded-sm text-xs p-0.5">
                Approved
              </span>
            ) : (
              <span className="  bg-gray-300 text-gray-800 rounded-sm text-xs p-0.5">
                In Review
              </span>
            )}
          </h3>
          <div className="space-x-3  mt-4 border-gray-300 p-1 rounded-sm">
            <div className="tooltip" data-tip="Show Details">
              <button
                onClick={() => navigate(`/listDetails/${list._id}`)}
                className="bg-gray-200 p-1 text-2xl rounded-full hover:bg-gray-300 hover:cursor-pointer"
              >
                <LuFolderOpen />
              </button>
            </div>
            <div className="tooltip" data-tip="Edit">
              <button
                onClick={() => navigate(`/editList/${list._id}`)}
                className="bg-gray-200 p-1 text-2xl rounded-full hover:bg-gray-300 hover:cursor-pointer"
              >
                <CiEdit />
              </button>
            </div>
            <div className="tooltip" data-tip="Remove">
              <button
                onClick={() => setDeleteModal(true)}
                className="bg-gray-200 p-1 text-2xl rounded-full hover:bg-gray-300 hover:cursor-pointer"
              >
                <MdDeleteOutline />
              </button>
            </div>
            <div className="tooltip" data-tip="Show Bookings">
              <button
                onClick={() => navigate(`/bookings/${list._id}`)}
                className="bg-gray-200 p-1 text-2xl rounded-full hover:bg-gray-300 hover:cursor-pointer"
              >
                <BsCalendar2Check />
              </button>
            </div>
          </div>
        </div>

        <div className="w-54 h-38 grid grid-cols-2 gap-1.5 grid-rows-2">
          <img
            src={list.photos[0]}
            className=" rounded-md w-full h-full"
            alt="list pic"
          />
          <div className="bg-blue-300">
            <img
              src={list.photos[1]}
              className=" rounded-md w-full h-full"
              alt="list pic"
            />
          </div>
          <div className="bg-green-300">
            <img
              src={list.photos[2]}
              className=" rounded-md w-full h-full"
              alt="list pic"
            />
          </div>
          <div className="bg-yellow-300">
            <img
              src={list.photos[3]}
              className=" rounded-md w-full h-full"
              alt="list pic"
            />
          </div>
        </div>
      </div>

      {deleteModal && (
        <ConfirmationModal
          isOpen={deleteModal}
          onCancel={() => setDeleteModal(false)}
          title="Property"
          isPending={isPending}
          onConfirm={() => {
            handleDeleteList(list._id);
          }}
        />
      )}
    </>
  );
}
