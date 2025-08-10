import React, { useEffect, useState } from "react";
import pic1 from "/imgs/list1.jpg";
import { PiSwimmingPoolLight } from "react-icons/pi";
import MyMap from "../component/Map";
import { RiStarSFill } from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useList } from "../features/Lists/useList";
import Spinner from "../ui/Spinner";
import { useUser } from "../features/auth/useUser";
import { useNavigate, useParams } from "react-router-dom";
import { useCheckoutSessionMutation } from "../features/booking/useCheckoutSession";
import { useGuestBookings } from "../features/booking/useGeustBooking";
import toast from "react-hot-toast";
import Review from "../component/review";
import { useReviews } from "../features/review/useReviews";
import { MdDelete } from "react-icons/md";
import { MdSystemUpdateAlt } from "react-icons/md";
import { useDeleteReview } from "../features/review/useDeleteReviews";

export default function ListingDetails() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { list, error, isLoading } = useList();
  const [showReview, setShowReview] = useState(false);
  const { error: errorUser, isLoading: isLoadingUser, user } = useUser();
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const navigate = useNavigate();
  const {
    fetchCheckoutSession,
    session,
    isPending,
    error: errorCheckout,
  } = useCheckoutSessionMutation();

  const { data: bookingsData } = useGuestBookings();
  console.log("bookingsData", bookingsData);
  const { id } = useParams();
  const { mutate: removeReview, isPending: isDeleting } = useDeleteReview(id);
  const {
    data: reviewForSpecificList,
    isLoading: reviewsLoading,
    isError: reviewsError,
    error: reviewsErrorObj,
  } = useReviews(id);

  if (isLoading || isLoadingUser) return <Spinner />;
  if (error || errorUser) return <h2>{error?.message}error???</h2>;
  const bookedDates = list?.data?.bookedDates?.map((item) => {
    return { start: item.checkInDate, end: item.checkOutDate };
  });
  console.log(bookedDates);

  const data = list?.data;
  const days = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const validBooking = bookingsData?.data?.find(
    (b) =>
      String(b.listing?._id ?? b.listing) === String(data._id) &&
      new Date(b.checkOut) < new Date()
  );

  function handleBook() {
    if (!user || user?.user.role !== "guest") {
      toast.error("you must be logged as a guest to book a list");
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
            error?.response?.data?.message ||
            error?.message ||
            "Booking failed. Please try again.";
          toast.error(message);
        },
      }
    );
    console.log("booked");
  }

  function handleDate(dates) {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  }
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
          <div className="badge badge-accent">{data.categoryId?.name}</div>
        </div>
        <p>{data.descrption}</p>
      </div>

      {/* aminites */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">Aminites</h2>
        <div className="flex gap-3 flex-wrap    ">
          {data?.amenitiesId.map((item) => {
            return (
              <div className="flex items-center gap-2 p-3 rounded-sm  justify-center   font-semibold border border-gray-300 w-42">
                <span className="text-3xl">
                  <PiSwimmingPoolLight />
                </span>
                {item?.name}
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
                            className="text-red-500 cursor-pointer hover:text-red-700 transition"
                            title="Delete review"
                            disabled={isDeleting}
                            onClick={() => removeReview(review._id)}
                          >
                            <MdDelete size={24} />
                          </button>

                          <button
                            className="text-blue-500 cursor-pointer hover:text-blue-700 transition"
                            title="Update review"
                            onClick={() => {
                              setShowReview(true);
                              setReviewToEdit(review); 
                            }}
                          >
                            <MdSystemUpdateAlt size={24} />
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
          <p>No reviews yet.</p>
        )}
      </div>

      <div className="flex justify-start">
        <button
          onClick={() => setShowReview(!showReview)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          make a review
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
        <h2 className="font-semibold text-3xl mb-3">Host</h2>
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
                Host since {new Date(data.host?.createdAt).getFullYear()}
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

        <div className="space-y-2 ">
          <h3> Select Your Stay Dates</h3>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDate}
            isClearable={true}
            placeholderText="Select a date range"
            excludeDateIntervals={bookedDates}
            className="w-full p-2 rounded-sm border focus:ring focus:ring-primarry focus:ring-offset-1 bg-gray-100 border-gray-300 outline-0 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <h2 className="font-semibold text-3xl mb-3">Price Details</h2>
        <div className="flex flex-col gap-3 max-w-1/3">
          <div className="flex justify-between">
            <span className="text-gray-500">Nighly rate</span>
            <span className="font-semibold ">${data?.pricePerNight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Cleaning Fee</span>
            <span className="font-semibold">$0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Service Fee</span>
            <span className="font-semibold">$0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total</span>
            <span className="font-semibold">
              ${Math.round(days * data.pricePerNight)}
            </span>
          </div>
          <button
            disabled={isPending}
            onClick={handleBook}
            className="bg-primarry mt-8 mb-4 py-2 text-stone-100 rounded-sm
            text-lg hover:bg-primarry-hover hover:cursor-pointer transition-all"
          >
            {isPending ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
