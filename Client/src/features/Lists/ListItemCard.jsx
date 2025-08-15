import { CiHeart, CiUser } from "react-icons/ci";
import { MdOutlineRoom } from "react-icons/md";
import { RiStarSFill } from "react-icons/ri";
import { IoPricetagOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaFireFlameCurved } from "react-icons/fa6";
export default function ListItemCard({ list }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/ListDetails/${list._id}`)}
      role="button"
      className="relative hover:cursor-pointer p-2 h-full flex flex-col shadow-xl bg-gray-50 text-center rounded-md"
    >
      <span className="absolute top-4 right-3 text-gray-100  text-3xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="gray"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </span>
      <span className="bg-gray-50 absolute rounded-full flex items-center gap-1 p-1 font-semibold left-3 justify-center text-gray-800 top-4">
        <span>
          {" "}
          <FaFireFlameCurved className="text-primarry" />
        </span>{" "}
        Poublar home{" "}
      </span>
      <div className="grow">
        <img
          src={list.photos[0]}
          alt="list pic"
          className="h-48 w-full rounded-md"
        />
        <div className="p-2 space-y-2">
          <h3>{list.title}</h3>
        </div>

        <div className="text-gray-500 flex justify-around items-center mb-4">
          <span className="flex gap-1 items-center">
            <MdOutlineRoom className="text-xl text-primarry" />
            <span>{list.governorate}</span>
          </span>
          <span className="flex gap-1 items-center">
            <CiUser className="text-xl text-primarry" />
            <span>
              {list.roomNumbers} {list.roomNumbers == 1 ? "room" : "rooms"}
            </span>
          </span>
        </div>
        <div className="text-gray-500 flex justify-around items-center mb-3">
          <span className="flex gap-1 items-center">
            <RiStarSFill className="text-xl text-primarry" />
            <span>3.6 </span>
          </span>
          <span className="flex gap-1 items-center">
            <IoPricetagOutline className="text-xl text-primarry" />
            <span>{list.pricePerNight}/night</span>
          </span>
        </div>
        <div></div>
      </div>
      <button
        onClick={() => navigate(`/ListDetails/${list._id}`)}
        className="bg-gray-200 w-full rounded-sm  py-4 text-gray-800 sm:text-lg  transition-all mt-4 hover:cursor-pointer hover:bg-primarry-hover hover:text-stone-100"
        // className="bg-primarry w-full rounded-sm  py-4 text-stone-100 transition-all mt-4 hover:cursor-pointer hover:bg-primarry-hover"
      >
        Show Details
      </button>
    </div>
  );
}
