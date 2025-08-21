import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";

import { useLists } from "../features/Lists/useLists";
import Spinner from "../ui/Spinner";
import ListItem from "../features/Lists/ListItem";
import { governmentList, PAGE_SIZE } from "../utils/constants";
import { useCategories } from "../features/Lists/categories/useCategories";
import Empty from "../ui/Empty";
import Error from "../ui/Error";
import { IoSearch } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../utils/helper";
import SEO from "../component/SEO";

export default function Lists() {
  const [searchParam, setSearchParams] = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [price, setPrice] = useState(null);
  const [filter, setFilter] = useState({});
  const [searchQuery, setSearchQuery] = useState();
  const [govern, setGovern] = useState("Government");
  const [category, setCategory] = useState("List Type");
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // hooks
  const { lists, error, isLoading, refetch } = useLists({
    page,
    filter,
    price,
  });
  const {
    categories,
    error: errorCategories,
    isLoading: isLoadingCategories,
  } = useCategories();

  useEffect(() => {
    const query = searchParam.get("query");
    if (query) {
      setFilter({ query });
      setSearchQuery(query);
    }
  }, []);
  // handle loading and error states
  if (isLoading || isLoadingCategories) return <Spinner />;
  if (error || errorCategories)
    return <Error message={errorCategories?.message || error?.message} />;

  const handleNext = () => {
    searchParam.set("page", page + 1);
    setSearchParams(searchParam);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    searchParam.set("page", page - 1);
    setSearchParams(searchParam);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function handleGovern(e) {
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
    setPrice(+e.target.value);
    searchParam.set("pricePerNight", e.target.value);
    setSearchParams(searchParam);
  }

  function handleDate(dates) {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      searchParam.set("startDate", start);
      searchParam.set("endDate", end);
    } else {
      searchParam.delete("startDate");
      searchParam.delete("endDate");
    }
    setSearchParams(searchParam);
  }

  function handleSearch(e) {
    if (e.target.value) {
      searchParam.set("query", e.target.value);
    } else {
      if (searchParam.get("query")) {
        searchParam.delete("query");
      }
      handleApplyFilters();
    }
    setSearchQuery(e.target.value);
    setSearchParams(searchParam);
  }

  function handleReset() {
    navigate(location.pathname);
    setGovern("Government");
    setCategory("List Type");
    setPrice(null);
    setStartDate(null);
    setEndDate(null);
    setFilter({});
    refetch();
  }

  function handleApplyFilters() {
    searchParam.set("page", 1);
    setSearchParams(searchParam);
    const newFilter = {};
    const governorate = searchParam.get("governorate");
    const categoryId = searchParam.get("categoryId");
    const price = searchParam.get("pricePerNight");
    const query = searchParam.get("query");
    const startDate = searchParam.get("startDate");
    const endDate = searchParam.get("endDate");
    if (governorate) newFilter.governorate = governorate;
    if (categoryId) newFilter.categoryId = categoryId;
    if (price) newFilter.price = price;
    if (startDate && endDate) {
      newFilter.startDate = startDate;
      newFilter.endDate = endDate;
    }

    if (query) {
      newFilter.query = query;
    }

    setFilter(newFilter);
    refetch();
    // console.log(startDate, endDate);
  }

  const totalPages = Math.ceil(lists.total / PAGE_SIZE);

  return (
    <>
      <SEO
        title="Listings | Maskn"
        description="Browse property listings on Maskn and reach renters across Egypt."
      />
      <div className="md:flex gap-6 my-6 space-y-4 justify-self-center md:justify-self-auto">
        <div className="items-center  w-72 shadow pl-4 pt-2 ">
          <div className="flex gap-1 items-center mb-4 text-2xl">
            <span>
              <CiFilter />
            </span>
            <h2 className=" font-semibold ">{t("lists.filters.filter")}</h2>
          </div>

          <div>
            <div className="flex flex-col space-y-2 w-3/4 gap-4">
              <select
                onChange={(e) => handleGovern(e)}
                value={govern}
                className="p-2 rounded-sm border focus:ring focus:ring-primarry focus:ring-offset-1 bg-gray-100 border-gray-300 outline-0 disabled:opacity-50"
              >
                <option value="all">{t("lists.filters.govern")}</option>
                {governmentList.map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {lang === "en" ? item.name : item.arName}
                    </option>
                  );
                })}
              </select>
              <select
                onChange={(e) => handleCategory(e)}
                value={category}
                className="p-2 rounded-sm border focus:ring bg-gray-100 focus:ring-primarry focus:ring-offset-1  border-gray-300 outline-0 disabled:opacity-50"
              >
                <option value="all">{t("lists.filters.type")}</option>
                {categories.data.map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {lang === "en" ? item.name : item.arName}
                    </option>
                  );
                })}
              </select>

              <div className="space-y-2">
                <h3 className="font-semibold">{t("lists.filters.date")}</h3>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDate}
                  isClearable={true}
                  minDate={new Date()}
                  placeholderText={t("lists.filters.dateRange")}
                  className="w-full p-2 rounded-sm border focus:ring focus:ring-primarry focus:ring-offset-1 bg-gray-100 border-gray-300 outline-0 disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{t("lists.filters.price")}</h3>
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
                  <label htmlFor="">
                    {t("common.cur")} {formatNumber(price, lang)}
                  </label>
                </div>
              </div>
              <div className="flex gap-1 ">
                <button
                  onClick={handleReset}
                  className="px-2 py-1 border rounded-sm hover:cursor-pointer hover:bg-gray-400 hover:text-gray-100 transition-all mt-4 mb-2"
                >
                  {t("lists.filters.clear")}
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-2 py-1 border rounded-sm hover:cursor-pointer hover:bg-stone-800 hover:text-stone-100 transition-all mt-4 mb-2 bg-stone-700 text-stone-100"
                >
                  {t("lists.filters.apply")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" grow space-y-6 flex flex-col">
          <div className="flex-col-reverse items-start md:flex-row gap-4 md:gap-0 flex md:justify-between md:items-center ">
            <h2 className="text-xl font-bold">
              {formatNumber(lists.total, lang)} {t("lists.results")}
            </h2>
            {/* <div className="flex gap-1">
              <input
                value={searchQuery}
                onChange={handleSearch}
                type="search"
                className=" bg-gray-200 w-[70%] sm:w-auto  rounded-full rounded-r-none p-2 sm:pl-4 grow focus:!outline-none focus:!isolation-auto focus:!z-0 focus:!outline-offset-0"
                placeholder="Search"
              />
              <button
                onClick={handleApplyFilters}
                className="bg-primarry rounded-r-full p-2 hover:cursor-pointer text-stone-200 hover:bg-primarry-hover"
              >
                <IoSearch />
              </button>
            </div> */}
            <div
              className={`flex items-center gap-1 ${
                lang === "ar" ? "flex-row-reverse" : "flex-row"
              }`}
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <input
                value={searchQuery}
                onChange={handleSearch}
                type="search"
                className="bg-gray-200 rounded-full w-[70%] sm:w-auto grow p-2 sm:pl-4 focus:!outline-none focus:!isolation-auto focus:!z-0 focus:!outline-offset-0"
                placeholder={t("common.search")}
              />
              <button
                onClick={handleApplyFilters}
                className="bg-primarry p-2 size-8 text-stone-200 hover:cursor-pointer hover:bg-primarry-hover 
               rounded-full"
              >
                <IoSearch />
              </button>
            </div>
          </div>
          <hr className="text-gray-500" />

          {lists.data.map((list) => {
            return <ListItem list={list} />;
          })}

          {!lists.data.length && <Empty resourceName="lists" />}

          {/* pagination */}
          {totalPages > 1 && (
            <div
              className="flex gap-4 self-center mt-8"
              dir="ltr" // Force LTR
            >
              <button
                disabled={page === 1}
                onClick={handlePrev}
                className="size-8 rounded-full disabled:bg-gray-400 border text-lg hover:bg-gray-300 hover:cursor-pointer border-gray-400 flex items-center justify-center"
              >
                <span>
                  <GrFormPrevious />
                </span>
              </button>

              <button
                disabled={totalPages === page}
                onClick={handleNext}
                className="size-8 rounded-full disabled:bg-gray-400 border text-lg hover:bg-gray-300 hover:cursor-pointer border-gray-400 flex items-center justify-center"
              >
                <span>
                  <GrFormNext />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
