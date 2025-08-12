import { CiUser } from "react-icons/ci";
import { MdOutlineRoom } from "react-icons/md";
import { RiStarSFill } from "react-icons/ri";
import { IoPricetagOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
export default function ListItemCard({ list }) {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col border border-primarry shadow-xl text-center">
      <div className="grow">
        <img src={list.photos[0]} alt="list pic" className="h-48 w-full" />
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
        className="bg-primarry w-full   py-4 text-stone-100 transition-all mt-4 hover:cursor-pointer hover:bg-primarry-hover"
      >
        Show Details
      </button>
    </div>
  );
}
