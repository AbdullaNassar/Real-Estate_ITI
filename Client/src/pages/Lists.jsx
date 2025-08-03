import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import { useLists } from "../features/Lists/useLists";
import Spinner from "../ui/Spinner";
import ListItem from "../features/Lists/ListItem";
import { governmentList, PAGE_SIZE } from "../utils/constants";
import { useCategories } from "../features/Lists/categories/useCategories";
import Empty from "../ui/Empty";
export default function Lists() {
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchParam, setSearchParams] = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  console.log(page);
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [price, setPrice] = useState(null);
  const [filter, setFilter] = useState({});
  const { lists, error, isLoading, refetch } = useLists({
    page,
    filter,
    price,
  });

  const [govern, setGovern] = useState("Government");
  const [category, setCategory] = useState("List Type");

  const {
    categories,
    error: errorCategories,
    isLoading: isLoadingCategories,
  } = useCategories();

  if (isLoading || isLoadingCategories) return <Spinner />;
  if (error || errorCategories)
    return (
      <h1>
        {errorCategories?.message} {error?.message}Error while loading lists...{" "}
      </h1>
    );
  console.log(lists);
  const handleNext = () => {
    searchParam.set("page", page + 1);
    setSearchParams(searchParam);
  };

  const handlePrev = () => {
    searchParam.set("page", page - 1);
    setSearchParams(searchParam);
  };

  function handleGovern(e) {
    searchParam.set("page", 1);
    if (e.target.value === "all") {
      setGovern("Government");
      searchParam.delete("governorate");
      setSearchParams(searchParam);
    } else {
      setGovern(e.target.value);
      searchParam.set("governorate", e.target.value);
      setSearchParams(searchParam);
    }
  }

  function handleCategory(e) {
    searchParam.set("page", 1);
    if (e.target.value === "all") {
      setCategory("List Type");
      searchParam.delete("categoryId");
      setSearchParams(searchParam);
    } else {
      setCategory(e.target.value);
      searchParam.set("categoryId", e.target.value);
      setSearchParams(searchParam);
    }
  }

  function handlePrice(e) {
    searchParam.set("page", 1);
    setPrice(+e.target.value);
    searchParam.set("pricePerNight", e.target.value);
    setSearchParams(searchParam);
  }

  function handleReset() {
    navigate(location.pathname);
    setGovern("Government");
    setCategory("List Type");
    setPrice(null);
    setFilter({});
    setDateRange([null, null]);
    refetch();
  }
  function handleApplyFilters() {
    const newFilter = {};
    const governorate = searchParam.get("governorate");
    const categoryId = searchParam.get("categoryId");
    const price = searchParam.get("pricePerNight");
    if (governorate) newFilter.governorate = governorate;
    if (categoryId) newFilter.categoryId = categoryId;
    if (price) newFilter.price = price;
    setFilter(newFilter);
    refetch();
  }

  const totalPages = Math.ceil(lists.total / PAGE_SIZE);
  return (
    <div className="md:flex gap-6 my-6 space-y-4 ">
      <div className=" w-72 shadow pl-4 pt-2 ">
        <div className="flex gap-1 items-center mb-4 text-2xl">
          <span>
            <CiFilter />
          </span>
          <h2 className=" font-semibold ">Filters</h2>
        </div>

        <div>
          <div className="flex flex-col space-y-2 w-3/4 gap-4">
            <select
              onChange={(e) => handleGovern(e)}
              value={govern}
              className="p-2 rounded-sm border focus:ring focus:ring-primarry focus:ring-offset-1 bg-gray-100 border-gray-300 outline-0 disabled:opacity-50"
            >
              <option value="all">Government</option>
              {governmentList.map((item) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <select
              onChange={(e) => handleCategory(e)}
              value={category}
              className="p-2 rounded-sm border focus:ring bg-gray-100 focus:ring-primarry focus:ring-offset-1  border-gray-300 outline-0 disabled:opacity-50"
            >
              <option value="all">List Type</option>
              {categories.data.map((item) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
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
                className="w-full p-2 rounded-sm border focus:ring focus:ring-primarry focus:ring-offset-1 bg-gray-100 border-gray-300 outline-0 disabled:opacity-50"
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
                  onChange={(e) => handlePrice(e)}
                  className="accent-primarry flex-1 hover:cursor-pointer"
                />
                <label htmlFor="">${price}</label>
              </div>
            </div>
            <div className="flex justify-between ">
              <button
                onClick={handleReset}
                className="px-2 py-1 border rounded-sm hover:cursor-pointer hover:bg-gray-800 hover:text-gray-100 transition-all mt-4 mb-2"
              >
                clear Filters
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-2 py-1 border rounded-sm hover:cursor-pointer hover:bg-stone-800 hover:text-stone-100 transition-all mt-4 mb-2 bg-stone-700 text-stone-100"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" grow space-y-6 flex flex-col">
        <div className="flex-col-reverse items-start md:flex-row gap-4 md:gap-0 flex md:justify-between md:items-center ">
          <h2 className="text-xl font-bold">{lists.total} Results</h2>
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

        {lists.data.map((list) => {
          return <ListItem list={list} />;
        })}

        {!lists.data.length && <Empty resourceName="lists" />}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex gap-4 self-center mt-8">
            <button
              disabled={page == 1}
              onClick={handlePrev}
              className="flex  items-center transition gap-.5 disabled:bg-gray-400 hover:bg-gray-300 bg-gray-200 p-2 font-semibold hover:cursor-pointer"
            >
              <span>
                <GrFormPrevious />
              </span>
              <span>Prev</span>
            </button>
            <button
              disabled={totalPages === page}
              onClick={handleNext}
              className="flex disabled:bg-gray-400 items-center transition gap-.5 hover:bg-gray-300 bg-gray-200 p-2 font-semibold hover:cursor-pointer"
            >
              <span>Next</span>
              <span>
                <GrFormNext />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
