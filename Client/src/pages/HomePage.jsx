import Hero from "../component/Hero";
import ListsContainer from "../component/ListsContainer";
import { HiArrowSmRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 flex flex-col">
      <Hero />
      <ListsContainer />
      <button
        onClick={() => navigate("/listings")}
        className="border border-primarry px-4 py-2 self-center flex items-center gap-1 text-xl my-4 font-semibold hover:bg-primarry justify-center hover:cursor-pointer transition-all text-gray-800 hover:text-stone-200"
      >
        <span>Show All Listings</span>
        <span className="text-2xl">
          <HiArrowSmRight />
        </span>
      </button>
    </div>
  );
}
