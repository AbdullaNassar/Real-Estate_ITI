import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { latLng } from "leaflet";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import FormInputRow from "../ui/FormInputRow";
import FromTextareaRow from "../ui/FromTextareaRow";
import FormSelectRow from "../ui/FromSelectRow";
import FormCheckboxRow from "../ui/FormCheckboxRow";
import { useAminites } from "../features/Lists/aminites/useAminites";
import { useCategories } from "../features/Lists/categories/useCategories";
import { useCreateList } from "../features/Lists/useCreateList";
import Spinner from "../ui/Spinner";
import { governmentList } from "../utils/constants";
import { useUser } from "../features/auth/useUser";
import { useTranslation } from "react-i18next";
import SEO from "../component/SEO";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

//handle map Click
function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function AddList() {
  const [position, setPosition] = useState(null);
  const [images, setImages] = useState([]);
  const [errorImages, setErrorImages] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // hooks
  const { error, isLoading, user } = useUser();
  const {
    amenities,
    isLoading: isAminites,
    error: errorAminites,
  } = useAminites();
  const {
    categories,
    error: errorCategories,
    isLoading: loadingCategories,
  } = useCategories();
  const { createList, isPending: isCreatingList } = useCreateList();
  // end of hooks

  // handle images
  const handleFilesChange = (e) => {
    const file = Array.from(e.target.files);
    console.log(file);
    if (!file) return;

    if (images.length + file.length > 5) {
      toast.error(t("toast.You can only upload up to 5 images."));
      return;
    }

    setImages((prev) => [...prev, ...file]);
    // Reset input so user can upload the same file again if needed
    e.target.value = null;
  };
  const handleDeleteImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => idx !== i));
  };

  const handleMapClick = (latlng) => {
    setPosition(latlng);
    console.log("Latitude:", latlng.lat, "Longitude:", latlng.lng);
  };

  const submitForm = (data) => {
    data.photos = images;
    if (!position) {
      toast.error(t("toast.Select List Location on Map"));
      return;
    }
    data.longitude = position.lng;
    data.latitude = position.lat;
    if (images.length < 5) {
      setErrorImages("You must upload 5 images");
      return;
    }
    createList(data, {
      onSuccess: () => {
        setImages([]);
        document.getElementById("my_modal_5").showModal();
        reset();
      },
    });
    setErrorImages("");
  };

  // handle loading, errors states
  if (isAminites || loadingCategories || isLoading) return <Spinner />;
  if (errorAminites || errorCategories || error)
    return <h1>Eroor in aminties</h1>;

  // unautorized user
  if (!user || user?.user.role !== "host") {
    alert(
      "you must be login as a host to add a list or create new account as a host"
    );
    navigate("/login");
  }

  return (
    <div className="my-4">
      <SEO
        title="Add New Property | Maskn"
        description="List your apartment, villa, or house on Maskn and start earning by renting it across Egypt."
      />
      <h1 className="text-3xl font-semibold">{t("lists.Add New Listing")}</h1>
      <form
        className="space-y-6 mt-8  flex flex-col"
        onSubmit={handleSubmit(submitForm)}
      >
        <FormInputRow
          required={true}
          id="title"
          label={t("lists.Listing Title")}
          errors={errors}
          placeholder="e.g.,  Cozy Apartment in Downtown Cairo"
          rules={{
            required: {
              value: true,
              message: t("lists.errors.title is required"),
            },
            minLength: {
              value: 5,
              message: t("lists.errors.minumum title length is 5 charcaters"),
            },
          }}
          register={register}
        />
        <FormInputRow
          required={true}
          id="arTitle"
          label={t("lists.Arabic Title")}
          errors={errors}
          placeholder="مثال:  شقه فاخره بالاقصر"
          rules={{
            required: {
              value: true,
              message: t("lists.errors.Arabic title is required"),
            },
            minLength: {
              value: 5,
              message: t("lists.errors.minumum title length is 5 charcaters"),
            },
          }}
          register={register}
        />
        <FromTextareaRow
          required={true}
          register={register}
          id="descrption"
          errors={errors}
          label={t("lists.Description")}
          rules={{
            required: {
              value: true,
              message: t("lists.errors.description is required"),
            },
            minLength: {
              value: 10,
              message: t("lists.errors.enter at least 10 characters"),
            },
          }}
        />
        <FromTextareaRow
          required={true}
          register={register}
          id="arDescrption"
          errors={errors}
          label={t("lists.Arabic Description")}
          rules={{
            required: {
              value: true,
              message: t("lists.errors.Arabic description is required"),
            },
            minLength: {
              value: 10,
              message: t("lists.errors.enter at least 10 characters"),
            },
          }}
        />
        <FormInputRow
          required={true}
          errors={errors}
          label={t("lists.Price Per Night(EGP)")}
          placeholder={t("lists.placeholders.Enter the price per night")}
          register={register}
          id="pricePerNight"
          type="number"
          rules={{
            required: {
              value: true,
              message: t("lists.errors.price is required"),
            },
            min: { value: 10, message: t("lists.errors.minummum price 10EGP") },
            max: {
              value: 10000,
              message: t("lists.errors.Maximmum Price 10,000"),
            },
          }}
        />

        <div>
          <h2 className="text-2xl font-semibold mb-2">{t("lists.location")}</h2>
          <MapContainer
            center={[26.8206, 30.8025]} // Egypt center
            zoom={6}
            className="h-[500px] w-full rounded-lg"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
            /> */}
            <ClickHandler onClick={handleMapClick} />
            {position && <Marker position={position} />}
          </MapContainer>
        </div>
        <FormSelectRow
          required={true}
          id="governorate"
          label={t("lists.Government")}
          register={register}
          errors={errors}
          placeholder={t("lists.placeholders.Enter the property government")}
          rules={{
            required: {
              value: true,
              message: t("lists.errors.government is required"),
            },
          }}
          options={governmentList}
        />

        <FormInputRow
          required={true}
          id="address"
          label={t("lists.Address")}
          errors={errors}
          placeholder={t("lists.placeholders.Enter the property address")}
          rules={{
            required: {
              value: true,
              message: t("lists.errors.Address is required"),
            },
          }}
          register={register}
        />

        <FormCheckboxRow
          options={amenities.data}
          id="amenitiesId"
          label={t("lists.amenities")}
          register={register}
          errors={errors}
        />

        <FormSelectRow
          required={true}
          errors={errors}
          register={register}
          id="categoryId"
          label={t("lists.Property Type")}
          rules={{
            required: {
              value: true,
              message: t("lists.errors.Property type is required"),
            },
          }}
          options={categories.data}
        />

        <div className="md:flex  md:w-82 gap-2">
          <div className="flex flex-col space-y-2">
            <label htmlFor="bedroom">{t("lists.Bedrooms")}</label>
            <input
              id="bedroom"
              {...register("bedroom")}
              type="number"
              className="bg-gray-200 p-2 w-full rounded-sm border-none focus:ring focus:ring-primarry focus:ring-offset-1 border-0 outline-0"
              placeholder={t("lists.placeholders.bedrooms...")}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="bathrooms">{t("lists.Bathrooms")}</label>
            <input
              id="bathrooms"
              {...register("bathrooms")}
              type="number"
              className="bg-gray-200 w-full p-2 rounded-sm border-none focus:ring focus:ring-primarry focus:ring-offset-1 border-0 outline-0"
              placeholder={t("lists.placeholders.bathrooms...")}
            />
          </div>
        </div>

        <FormInputRow
          type="number"
          required={true}
          errors={errors}
          register={register}
          label={t("lists.Maximum Guests Allowed")}
          placeholder={t(
            "lists.placeholders.Enter the maximum number of guests"
          )}
          id="maxGustes"
          rules={{
            required: {
              value: true,
              message: t("lists.errors.Enter number of maximum guests"),
            },
          }}
        />

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            {t("lists.Photo Gallery")}
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold mb-1">
              {t("lists.Upload Photos")}
            </h2>
            {/* <p className="text-sm text-gray-500 mb-4">click to select files</p> */}
            <p className="text-sm text-gray-500 mb-4">
              {t("lists.You can upload up to 5 photos.")}
            </p>

            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilesChange}
            />

            <label
              htmlFor="imageUpload"
              className="cursor-pointer inline-block px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
            >
              {t("lists.Upload")}
            </label>
            {errorImages && (
              <h2 className="text-red-500">
                {lang == "en" ? "You must upload 5 images" : "يجب رفع 5 صور "}
              </h2>
            )}

            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {images.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded overflow-hidden shadow"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-0 right-0 hover:cursor-pointer bg-opacity-50 text-white text-xs rounded-bl px-1 hover:bg-red-600"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p></p>
          </div>
        </div>
        <button
          disabled={isCreatingList}
          className="bg-primarry py-2 text-stone-100 px-16 sm:px-30 rounded-full  self-center mt-8 mb-4 hover:bg-primarry-hover hover:cursor-pointer transition-all sm:text-lg font-semibold"
        >
          {isCreatingList ? t("lists.Creating...") : t("lists.Save Listing")}
        </button>
        {/* <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          click me{" "}
        </button> */}
      </form>

      <dialog
        id="my_modal_5"
        class="modal fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 opacity-0 invisible transition-all duration-300"
      >
        <div class="modal-box relative bg-gray-50 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20 transform scale-90 translate-y-4 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-success">
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h3 class="font-bold text-2xl text-center mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {t("lists.Listing Submitted")}
          </h3>

          <p class="text-gray-600 text-center leading-relaxed mb-8 px-2">
            {t(
              "lists.Your listing has been successfully submitted and is pending reviewby an admin. It will appear on the website once approved."
            )}
          </p>

          <div class="modal-action flex justify-center">
            <form method="dialog" class="w-full">
              <button
                onclick="closeModal()"
                class="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black hover:cursor-pointer text-gray-50 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {t("lists.Close")}
              </button>
            </form>
          </div>

          <div class="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-40"></div>
        </div>
      </dialog>
    </div>
  );
}
