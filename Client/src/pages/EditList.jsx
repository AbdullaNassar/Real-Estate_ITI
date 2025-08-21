import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";

import FormInputRow from "../ui/FormInputRow";
import FromTextareaRow from "../ui/FromTextareaRow";
import FormSelectRow from "../ui/FromSelectRow";
import FormCheckboxRow from "../ui/FormCheckboxRow";
import { useAminites } from "../features/Lists/aminites/useAminites";
import { useCategories } from "../features/Lists/categories/useCategories";
import Spinner from "../ui/Spinner";
import { governmentList } from "../utils/constants";
import { useUser } from "../features/auth/useUser";
import { useNavigate } from "react-router-dom";
import { useList } from "../features/Lists/useList";
import Error from "../ui/Error";
import { useUpdateList } from "../features/Lists/useUpdateList";
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

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function EditList() {
  const [curImages, setCurImages] = useState([]);
  const [images, setImages] = useState([]);
  const [errorImages, setErrorImages] = useState(null);
  const [position, setPosition] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // hooks
  const { error, isLoading, user } = useUser();
  const { error: errorList, isLoading: loadingList, list: data } = useList();
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
  const { mutate: updateList, isPending: isUpdating } = useUpdateList();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      descrption: "",
      pricePerNight: "",
      governorate: "",
      address: "",
      amenitiesId: [],
      categoryId: "",
      bedroom: "",
      bathrooms: "",
      maxGustes: "",
      rules: "",
      arTitle: "",
      arDescrption: "",
    },
  });
  // end of hooks

  const handleFilesChange = (e) => {
    const file = Array.from(e.target.files);
    // console.log(file);
    if (!file) return;

    if (images.length + file.length > 5) {
      toast.error("You can only upload up to 5 images.");
      return;
    }

    setImages((prev) => [...prev, ...file]);
    // Reset input so user can upload the same file again if needed
    e.target.value = null;
  };

  const handleDeleteImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => idx !== i));
  };

  // add initial values to the form
  useEffect(() => {
    if (data?.data) {
      reset({
        title: data.data.title || "",
        descrption: data.data.descrption || "",
        pricePerNight: data.data.pricePerNight || "",
        governorate: data.data.governorate || "",
        address: data.data?.location?.address || "",
        amenitiesId: data.data.amenitiesId || [],
        categoryId: data.data.categoryId._id || "",
        bedroom: data.data.bedroom || "",
        bathrooms: data.data.bathrooms || "",
        maxGustes: data.data.maxGustes || "",
        arDescrption: data.data.arDescrption || "",
        arTitle: data.data.arTitle || "",
      });

      // also set position for the map if you have lat/lng
      if (data.data?.location?.coordinates?.coordinates?.[0]) {
        // console.log("uuuuu");
        setPosition({
          lng: data.data?.location?.coordinates?.coordinates?.[0],
          lat: data.data?.location?.coordinates?.coordinates?.[1],
        });
      }

      // if editing images
      if (data.data.photos?.length) {
        setCurImages(data.data.photos);
      }
    }
  }, [data, reset]);

  const handleMapClick = (latlng) => {
    setPosition(latlng);
    // console.log("Latitude:", latlng.lat, "Longitude:", latlng.lng);
  };

  // handel loading and errors states
  if (isAminites || loadingCategories || isLoading || loadingList)
    return <Spinner />;
  if (errorAminites || errorCategories || error || errorList)
    return (
      <Error
        message={
          errorAminites?.message ||
          errorCategories?.message ||
          errorList?.message
        }
      />
    );

  // handle unautorized user
  if (!user || user?.user.role !== "host") {
    alert(
      "you must be login as a host to add a list or create new account as a host"
    );
    navigate("/login");
  }

  const list = data.data;

  const submitForm = (data) => {
    data.photos = images;
    data.longitude = position.lng;
    data.latitude = position.lat;
    if (images.length < 5) {
      setErrorImages("You must upload 5 images");
      return;
    }
    data.amenitiesId = data.amenitiesId?.map((item) => item._id);
    console.log(data);
    updateList(
      { id: list._id, data },
      {
        onSuccess: () => {
          toast.success(t("toast.Listing updated successfully"));
          reset(); // reset your form
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
    setErrorImages("");
  };

  return (
    <div className="my-4">
      <SEO
        title={`Edit ${list.title} | Maskn`}
        description={`Update details for ${list.title}, in Egypt on Maskn.`}
      />
      <h1 className="text-3xl font-semibold">
        {t("profile.Edit")}: {lang === "en" ? list.title : list.arTitle}
      </h1>
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
                {lang === "en" ? errorImages : "يجب رفع 5 صور "}
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
            {curImages.length && (
              <div className="flex justify-center mt-4 gap-2">
                {curImages.map((image) => {
                  return (
                    <img
                      className="relative w-24 h-24 rounded overflow-hidden shadow"
                      src={image}
                      alt="list pics"
                    />
                  );
                })}
              </div>
            )}
            <p></p>
          </div>
        </div>
        <button
          disabled={isUpdating}
          className="bg-primarry py-2 text-stone-100 px-30 rounded-full  self-center mt-8 mb-4 hover:bg-primarry-hover hover:cursor-pointer transition-all text-lg font-semibold"
        >
          {isUpdating ? t("lists.Updating...") : t("lists.save")}
        </button>
        {isUpdating && <Spinner />}
      </form>

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      {/* <button
        className="btn"
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        open modal
      </button> */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box text-sm text-gray-600 bg-gray-100 border border-gray-300">
          <h3 className="font-bold text-lg">Listing Submitted</h3>
          <p className="py-4 text-md/[1.5]">
            Your listing has been successfully submitted and is pending review
            by an admin. It will appear on the website once approved.
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn hover:bg-black bg-stone-700">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
