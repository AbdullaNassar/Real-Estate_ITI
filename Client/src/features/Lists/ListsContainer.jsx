import { HiArrowSmRight } from "react-icons/hi";
import ListsBox from "./ListsBox";
import { useListsByGovern } from "./useListsByGovern";
import Spinner from "../../ui/Spinner";
import Counter from "../../ui/animated/Counter";
const listHeading = [
  "Popular homes in ",
  "Stay in ",
  "Homes in ",
  "Places to stay in ",
  "Check out homes in ",
];
export default function ListsContainer() {
  let { data: lists, error, isLoading } = useListsByGovern();
  if (isLoading) return <Spinner />;
  if (error) return <h2>{error.message} Error....</h2>;

  let data = lists.data.slice(0, 4);
  return (
    <div className="mt-16 flex flex-col gap-4">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          <Counter
            from={0}
            to={100}
            separator=","
            direction="up"
            duration={1}
            className="count-up-text text-gray-800"
          />
          + Premium Apartments
        </h2>
        {/* <h2 className="text-4xl font-bold text-stone-800 mb-4">
          Find Your Perfect Stay in Egypt
        </h2> */}
        <p className="text-2xl font-semibold text-gray-600">
          Find Your Perfect Stay in Egypt
        </p>
        {/* Decorative line */}
        <div className="mt-8 flex items-center justify-center">
          <div className="h-1 w-24 bg-gradient-to-r from-primarry to-primarry-hover rounded-full"></div>
          <div className="mx-4 w-3 h-3 bg-gradient-to-r from-primarry to-primarry-hover rounded-full"></div>
          <div className="h-1 w-24 bg-gradient-to-r from-primarry to-primarry-hover rounded-full"></div>
        </div>
      </div>

      {data?.map((govern, idx) => {
        return (
          <ListsBox
            govern={govern}
            heading={listHeading[idx % listHeading.length]}
          />
        );
      })}

      {/* Call to Action */}
      <div className="mt-4 mb-12 text-center">
        <div className="bg-gray/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl max-w-4xl mx-auto border border-white/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Find Your Dream Home?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of satisfied residents who've found their perfect
            apartment through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primarry to-primarry-hover text-white font-semibold px-8 py-3 rounded-xl hover:cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Browse All Apartments
            </button>
          </div>
        </div>
      </div>

      {/* <button
        onClick={() => navigate("/listings")}
        className="border border-primarry px-4 py-2 self-center flex items-center gap-1 text-xl my-4 font-semibold hover:bg-primarry justify-center hover:cursor-pointer transition-all text-gray-800 hover:text-stone-200"
      >
        <span>Show All Listings</span>
        <span className="text-2xl">
          <HiArrowSmRight />
        </span>
      </button> */}
    </div>
  );
}
