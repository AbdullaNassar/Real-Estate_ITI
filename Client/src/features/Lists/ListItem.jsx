import { RiStarSFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function ListItem({ list }) {
  const navigate = useNavigate();
  return (
    <div className=" space-y-4 flex-col md:flex-row flex justify-between items-center pb-4 border-b  border-gray-300">
      <div className="space-y-1">
        <h3 className="text-gray-500">
          {list.categoryId?.name} - {list.governorate}, Egypt
        </h3>
        <h3 className="font-semibold">{list.title}</h3>
        <h3 className="text-gray-500">
          {list.maxGustes} guests· {list.roomNumbers ? list.roomNumbers : "no"}
          bedroom · 1 bath
        </h3>
        <h3 className="flex gap-4 mt-4">
          <span className="flex items-center gap-1">
            {list.averageRating ? list.averageRating : 3.6}{" "}
            <span className="text-primarry">
              <RiStarSFill />
            </span>
          </span>
          <span className="p-1 rounded-sm bg-gray-200">
            ${list.pricePerNight}/night
          </span>
          <button
            onClick={() => navigate(`/listDetails/${list._id}`)}
            className="bg-primarry text-sm lg:text-md text-stone-100 p-1 hover:bg-primarry-hover rounded-sm hover:cursor-pointer transition-all"
          >
            Show Details
          </button>
        </h3>
      </div>
      <div>
        <img
          src={list.photos[0]}
          className="w-54 h-38 rounded-md"
          alt="list pic"
        />
      </div>
    </div>
  );
}
