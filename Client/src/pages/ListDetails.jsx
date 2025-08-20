import { useState } from "react";
import { PiSwimmingPoolLight } from "react-icons/pi";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MdSystemUpdateAlt } from "react-icons/md";
import { FaFilePen } from "react-icons/fa6";

import MyMap from "../component/Map";
import { RiStarSFill } from "react-icons/ri";
import { useList } from "../features/Lists/useList";
import Spinner from "../ui/Spinner";
import { useUser } from "../features/auth/useUser";
import { useCheckoutSessionMutation } from "../features/booking/useCheckoutSession";
import { useGuestBookings } from "../features/booking/useGeustBooking";
import Review from "../features/review/Review";
import { useReviews } from "../features/review/useReviews";
import { MdDelete } from "react-icons/md";
import { useDeleteReview } from "../features/review/useDeleteReviews";
import { formatNumber, formatPrice } from "../utils/helper";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleFavs } from "../features/favs/useToggleFavs";
import { useFavsList } from "../features/favs/useFavsList";
import Error from "../ui/Error";

export default function ListingDetails() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { list, error, isLoading } = useList();
  const [showReview, setShowReview] = useState(false);
  const { error: errorUser, isLoading: isLoadingUser, user } = useUser();
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const queryClient = useQueryClient();

  // hooks
  const { mutate: toggleFavs } = useToggleFavs();
  let { data: favs, isLoading: loadingFavs, error: errorFavs } = useFavsList();
  const {
    fetchCheckoutSession,
    session,
    isPending,
    error: errorCheckout,
  } = useCheckoutSessionMutation();
  const { data: bookingsData } = useGuestBookings();
  const { mutate: removeReview, isPending: isDeleting } = useDeleteReview(id);
  const {
    data: reviewForSpecificList,
    isLoading: reviewsLoading,
    isError: reviewsError,
    error: reviewsErrorObj,
  } = useReviews(id);
  // end of hooks

  // handle loading and error states
  if (isLoading || isLoadingUser || loadingFavs) return <Spinner />;
  if (error || errorUser || errorFavs)
    return (
      <Error
        message={error?.message || errorUser?.message || errorFavs?.message}
      />
    );

  favs = favs.favorites;
  //function to check if the list in current user Favourites
  function isFavourites(id) {
    for (let i = 0; i < favs.length; i++) {
      if (favs[i]._id === id) return true;
    }
    return false;
  }

  function handleFavClick(id) {
    const remove = isFavourites(id);
    toggleFavs(id, {
      onSuccess: () => {
        {
          remove
            ? toast.success(t("toast.Removed from favorites successfully"))
            : toast.success(t("toast.Added to favorites successfully"));
        }
        queryClient.invalidateQueries({ queryKey: ["favs"] });
      },
    });
  }
  // preprocess data
  const bookedDates = list?.data?.bookedDates?.map((item) => {
    return { start: item.checkInDate, end: item.checkOutDate };
  });

  const data = list?.data;
  const days = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const validBooking = bookingsData?.data?.find(
    (b) =>
      String(b.listing?._id ?? b.listing) === String(data._id) &&
      new Date(b.checkOut) < new Date()
  );

  function handleBook() {
    if (!user || user?.user.role !== "guest") {
      toast.error(t("toast.you must be logged as a guest to book a list"));
      // navigate("/login");
      return;
    }

    fetchCheckoutSession(
      { listId: data._id, checkIn: startDate, checkOut: endDate },
      {
        onSuccess: (data) => {
          navigate("/");
          console.log(data);
          window.location.href = data.session.url;
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message[lang] ||
            error?.message ||
            t("toast.Booking failed. Please try again.");
          toast.error(message);
        },
      }
    );
  }

  function handleDate(dates) {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  }
  return (
    <div className="flex flex-col gap-8 ">
      <div className="carousel rounded-box space-x-3.5 bg-gray-50 p-3">
        {data.photos.map((item) => {
          return (
            <div className="carousel-item">
              <img className="h-92" src={item} alt="Burger" />
            </div>
          );
        })}
      </div>
      {/* gallery */}
      {/* <div className="grid grid-cols-[1fr_1fr_.5fr] gap-4 bg-gray-50 p-4 mt-1 grid-rows-[10rem_5rem_5rem_5rem] min-h-[60vh] ">
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
      </div> */}

      {/* heading */}
      <div>
        <div className="flex items-center gap-4">
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-3xl mb-3">
                {lang === "en" ? data.title : data.arTitle}
              </h2>
              <div className="badge badge-accent">
                {lang === "en"
                  ? data.categoryId?.name
                  : data.categoryId?.arName}
              </div>
            </div>
            <button
              onClick={() => handleFavClick(data._id)}
              className=" hover:cursor-pointer text-gray-100  text-3xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isFavourites(data._id) ? "#C69963" : "gray"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <p>{lang === "en" ? data.descrption : data.arDescrption}</p>
      </div>

      {/* aminites */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">{t("lists.amenities")}</h2>
        <div className="flex gap-3 flex-wrap">
          {data?.amenitiesId.map((item) => {
            return (
              <div className="w-full sm:w-fit flex items-center gap-2 p-3 rounded-sm font-semibold border border-gray-300">
                <img src={item.icon} alt="aminity icon" className="size-8" />
                {/* <span className="text-3xl">
                  <PiSwimmingPoolLight />
                </span> */}
                {lang === "en" ? item?.name : item?.arName}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">{t("lists.location")}</h2>
        <MyMap
          lat={data.location.coordinates.coordinates[0]}
          lng={data.location.coordinates.coordinates[1]}
        />
      </div>

      {/* Reviews */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">{t("lists.reviews")}</h2>
        {reviewForSpecificList?.ratings?.length > 0 ? (
          <div className="space-y-6">
            {reviewForSpecificList.ratings.map((review) => {
              const canModify = user?.user?.id === review?.guestId?._id;

              return (
                <div key={review._id} className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <div className="size-12 flex items-center justify-center bg-secondary rounded-full overflow-hidden">
                      <img
                        className="rounded-full"
                        src={review.guestId?.profilePic}
                        alt={review.guestId?.userName}
                      />
                    </div>
                    <div>
                      <h2>{review.guestId?.userName}</h2>
                      <h3 className="text-gray-500">
                        {new Date(review.createdAt).toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-primarry">
                    {[...Array(review.rating)].map((_, i) => (
                      <RiStarSFill
                        key={`filled-${i}`}
                        className="text-yellow-500"
                        size={24}
                      />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <RiStarSFill
                        key={`empty-${i}`}
                        className="text-gray-300"
                        size={24}
                      />
                    ))}
                  </span>

                  <div className="max-w-lg">
                    <h3>{review.comment}</h3>
                    <div className="flex gap-2 mt-1">
                      {canModify && (
                        <>
                          <button
                            className=" cursor-pointer hover:text-red-700 transition"       
                            title="Delete review"
                            disabled={isDeleting}
                            onClick={() => removeReview(review._id)}
                          >
                            <MdDelete size={24} />
                          </button>

                          <button
                            className="text-[#e5e5e5;] cursor-pointer hover:text-blue-700 transition"
                            title="Update review"
                            onClick={() => {
                              setShowReview(true);
                              setReviewToEdit(review);
                            }}
                          >
                            <FaFilePen  size={24}/>
                            
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>{t("lists.No reviews yet.")}</p>
        )}
      </div>

      <div className="flex justify-start">
        <button
          onClick={() => setShowReview(!showReview)}
          className="bg-blue-700 text-gray-50 px-4 py-2 rounded-md hover:scale-105 transition cursor-pointer"
        >
          {t("lists.write a review")}
        </button>
      </div>

      {showReview && (
        <Review
          bookingId={validBooking?._id}
          listingId={id}
          reviewToEdit={reviewToEdit}
          onClose={() => {
            setShowReview(false);
            setReviewToEdit(null);
          }}
        />
      )}
      {/* Host */}

      <div>
        <h2 className="font-semibold text-3xl mb-3">{t("lists.host")}</h2>
        <div className="sm:flex items-center gap-8">
          <div className="flex gap-4  items-center">
            <div className="size-24 flex items-center justify-center  bg-gray-500  overflow-hidden rounded-full p-0.5 ">
              <img
                className="w-full rounded-full"
                src={data.host?.profilePic}
                alt=""
              />
            </div>
            <div>
              <h2 className="font-semibold text-2xl">{data.host?.userName}</h2>
              <h3 className="text-gray-500 text-xl">
                {t("lists.host")} {t("lists.since")}{" "}
                {formatNumber(
                  new Date(data.host?.createdAt).getFullYear(),
                  lang
                )}
              </h3>
            </div>
          </div>
          {/* 
          <div>
            <button className="bg-gray-200 text-center py-2 px-8 rounded-full font-semibold hover:cursor-pointer transition-all hover:bg-gray-300">
              Message Host
            </button>
          </div> */}
        </div>
      </div>

      {/* Booking Date */}
      <div className="">
        <h2 className="font-semibold text-3xl mb-3">{t("lists.booking")}</h2>

        <div className="space-y-2 ">
          <h3> {t("lists.Select Your Stay Dates")}</h3>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDate}
            isClearable={true}
            placeholderText={t("lists.Select a date range")}
            excludeDateIntervals={bookedDates}
            className="w-full p-2 rounded-sm border focus:ring focus:ring-primarry focus:ring-offset-1 bg-gray-100 border-gray-300 outline-0 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">
          {t("lists.Price Details")}
        </h2>
        <div className="flex flex-col gap-3 sm:max-w-1/3 justify-between">
          <div className="flex justify-between">
            <span className="text-gray-500">{t("lists.Nightly rate")}</span>
            <span className="font-semibold ">
              {formatPrice(data?.pricePerNight, lang)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("lists.Cleaning Fee")}</span>
            <span className="font-semibold text-gray-500">
              {t("lists.Free")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("lists.Service Fee")}</span>
            <span className="font-semibold text-gray-500">
              {t("lists.Free")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("lists.Total")}</span>
            <span className="font-semibold">
              {startDate && endDate
                ? formatPrice(Math.round(days * data.pricePerNight))
                : formatPrice(0, lang)}
            </span>
          </div>
          <button
            disabled={isPending}
            onClick={handleBook}
            className="bg-primarry mt-8 mb-4 py-2 text-stone-100 rounded-sm
            text-lg hover:bg-primarry-hover hover:cursor-pointer transition-all"
          >
            {isPending
              ? t("lists.Processing...")
              : t("lists.Proceed to Checkout")}
          </button>
        </div>
      </div>
    </div>
  );
}
