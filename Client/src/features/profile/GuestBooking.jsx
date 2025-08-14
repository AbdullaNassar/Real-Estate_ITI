import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CalendarCheck,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  User,
} from "lucide-react";

import Spinner from "../../ui/Spinner";
import Error from "../../ui/Error";
import { useGuestBookings } from "../booking/useGeustBooking";

export default function GuestBooking() {
  const { data, error, isLoading } = useGuestBookings();
  const navigate = useNavigate();

  // handle loading, error states
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  // handle empty state
  if (!data.results)
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-gray-50 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          You don't have any Bookings yet
        </h2>
        <button
          onClick={() => navigate("/listings")}
          className="bg-primarry hover:bg-primarry-hover text-stone-100 font-medium py-3 px-6 rounded-lg hover:cursor-pointer shadow transition-all duration-200"
        >
          Explore Our Properties!
        </button>
      </div>
    );

  const bookings = data.data;
  return (
    <div className="space-y-10 mt-10">
      <TotalBookingsMinimal data={data.results} />
      <div className="space-y-4">
        {bookings.map((booking) => {
          return <BookingItem booking={booking} />;
        })}
      </div>
    </div>
  );
}

const TotalBookingsMinimal = ({ data }) => {
  return (
    <div className="bg-gray-50 rounded-lg shadow-md border-l-4 border-blue-500 p-6">
      <div className="flex items-center">
        <div className="bg-blue-100 rounded-full p-3 mr-4">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {data.toLocaleString()}
          </h2>
        </div>
      </div>
    </div>
  );
};

function BookingItem({ booking }) {
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Get payment status styling
  const getPaymentStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: CheckCircle,
          border: "border-green-200",
        };
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: Clock,
          border: "border-yellow-200",
        };
      case "failed":
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: CreditCard,
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: CreditCard,
          border: "border-gray-200",
        };
    }
  };

  const paymentStyle = getPaymentStatusStyle(booking.paymentStatus || "paid");
  const PaymentIcon = paymentStyle.icon;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          src={booking.listing.photos[0]}
          alt={booking.listing.title}
        />
        <div className="absolute top-4 right-4">
          <div
            className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${paymentStyle.bg} ${paymentStyle.border}`}
          >
            <PaymentIcon className={`h-4 w-4 ${paymentStyle.text}`} />
            <span
              className={`text-sm font-semibold ${paymentStyle.text} capitalize`}
            >
              {booking.paymentStatus || "Paid"}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Price per night */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
            {booking.listing.title}
          </h2>
          <div className="flex items-center text-gray-600">
            {/* <DollarSign className="h-5 w-5 mr-1" /> */}
            <span className="text-lg font-semibold">
              {formatPrice(booking.listing.pricePerNight)}
            </span>
            <span className="text-gray-500 ml-1">/ night</span>
          </div>
        </div>

        {/* Check-in and Check-out */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="bg-green-100 rounded-full p-2">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Check-in</p>
              <p className="text-green-700 font-semibold">
                {formatDate(booking.checkIn)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="bg-red-100 rounded-full p-2">
              <CalendarCheck className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">Check-out</p>
              <p className="text-red-700 font-semibold">
                {formatDate(booking.checkOut)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-blue-800 font-medium">Total Amount</p>
                <p className="text-3xl font-bold text-blue-900">
                  {formatPrice(booking.totalPrice)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-600 text-sm">Final Price</p>
              <p className="text-blue-800 font-medium">All inclusive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
