import { useNavigate, useParams } from "react-router-dom";
import { useUserPublic } from "../features/profile/useUserPublic";
import Spinner from "../ui/Spinner";
import Error from "../ui/Error";

import { User, Mail, Shield, Star, Calendar, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../utils/helper";
import SEO from "../component/SEO";
export default function PublicProfile() {
  const { data, error, isLoading } = useUserPublic();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <SEO
        title={`${data?.user?.userName}'s Listings | Maskn`}
        description={`View ${data?.user?.userName}'s profile and explore their available properties for rent across Egypt.`}
      />
      {/* User Profile Header */}
      <div className="bg-gray-100 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={data.user.profilePic}
              alt={data.user.userName}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
            {data.user.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <Shield className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {data.user.userName}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-gray-800">
                {data.user.role}
              </span>
            </div>

            <div className="space-y-2 text-gray-600">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                <span>{data.user.email}</span>
              </div>

              {data.user.isVerified && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-green-600">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">
                    {t("profile.Verified Host")}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold text-blue-900">
                  {formatNumber(data?.lists?.length, lang)}{" "}
                  {t("profile.Apartment")}
                  {data?.lists.length !== 1 && lang === "en" ? "s" : ""}{" "}
                  {t("profile.Available")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apartments Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t("profile.Available Apartments")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.lists.map((apartment) => (
            <div
              key={apartment.id}
              className="bg-gray-100 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Apartment Image */}
              <div className="relative h-48">
                <img
                  src={apartment.photos[0]}
                  alt={apartment.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-stone-800">
                      {formatNumber(apartment.averageRating, lang)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Apartment Info */}
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {lang === "en" ? apartment.title : apartment.arTitle}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {apartment.arDescription}
                </p>

                {/* Stats */}
                <div className="space-y-3 flex-grow">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(apartment.averageRating)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatNumber(apartment.averageRating, lang)}{" "}
                      {t("profile.out of")}
                      {formatNumber(5, lang)}
                    </span>
                  </div>

                  {/* Bookings */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {apartment.bookedDates.length} {t("profile.bookings")}
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => navigate(`/listDetails/${apartment._id}`)}
                  className="mt-4 w-full bg-primarry text-white py-2 px-4 rounded-lg hover:bg-primarry-hover hover:cursor-pointer transition-colors duration-200 font-medium"
                >
                  {t("common.showDetails")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {data.lists.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            No apartments available
          </h3>
          <p className="text-gray-400">
            This host hasn't listed any apartments yet.
          </p>
        </div>
      )}
    </div>
  );
}
