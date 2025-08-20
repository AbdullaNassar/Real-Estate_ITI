import React from "react";
import { useFavsList } from "./useFavsList";
import Spinner from "../../ui/Spinner";
import Error from "../../ui/Error";
import { useTranslation } from "react-i18next";
import Lists from "../../pages/Lists";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useToggleFavs } from "./useToggleFavs";
import { useQueryClient } from "@tanstack/react-query";

export default function Favs() {
  let { data: favs, isLoading: loadingFavs, error: errorFavs } = useFavsList();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (loadingFavs) return <Spinner />;
  if (errorFavs) return <Error message={errorFavs.message} />;

  favs = favs.favorites;
  if (!favs) return <EmptyFavs />;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4">
      {favs?.map((item) => {
        return <FavItem list={item} />;
      })}
    </div>
  );
}

function EmptyFavs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 mt-4 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {t("profile.empty favs")}
      </h2>
      <button
        onClick={() => navigate("/listings")}
        className="bg-primarry hover:bg-primarry-hover text-stone-100 font-medium py-3 px-6 rounded-lg hover:cursor-pointer shadow transition-all duration-200"
      >
        {t("profile.Explore Our Properties!")}
      </button>
    </div>
  );
}

function FavItem({ list }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: toggleFavs, isPending } = useToggleFavs();
  let { data: favs, isLoading: loadingFavs, error: errorFavs } = useFavsList();

  if (loadingFavs) return <Spinner />;
  if (errorFavs) return <Error message={errorFavs.message} />;
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
  return (
    <div className="relative card bg-gray-200 shadow-sm">
      <button
        onClick={() => handleFavClick(list._id)}
        className="absolute top-4 right-3 hover:cursor-pointer text-gray-100  text-3xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isFavourites(list._id) ? "#C69963" : "gray"}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>
      <figure>
        <img className="h-52 w-full" src={list.photos[0]} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {lang === "en" ? list.title : list.arTitle}
          {/* <div className="badge badge-secondary">{}</div> */}
        </h2>
        <p>{lang === "en" ? list.descrption : list.arDescrption}</p>
        <div className="card-actions justify-center mt-3">
          <button
            onClick={() => navigate(`/listDetails/${list._id}`)}
            className="bg-primarry hover:bg-primarry-hover hover:cursor-pointer text-stone-50 p-2 rounded-sm transition"
          >
            {t("common.showDetails")}
          </button>
        </div>
      </div>
    </div>
  );
}
