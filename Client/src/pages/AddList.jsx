import { useForm } from "react-hook-form";
import FormInputRow from "../ui/FormInputRow";
import FromTextareaRow from "../ui/FromTextareaRow";
import FormSelectRow from "../ui/FromSelectRow";
import FormCheckboxRow from "../ui/FormCheckboxRow";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";
const governmentList = [
  { label: "sohag", value: "sohag" },
  { label: "cairo", value: "cairo" },
  { label: "sohag", value: "soha" },
  { label: "cairo", value: "cair" },
  { label: "sohag", value: "sohg" },
  { label: "cairo", value: "caio" },
  { label: "sohag", value: "shag" },
  { label: "cairo", value: "cro" },
];

const aminitiesList = [
  "wifi",
  "aircondition",
  "parking",
  "pool",
  "GYM",
  "24/7 Security",
];

const propertyType = [
  { label: "studio", value: "studio" },
  { label: "house", value: "house" },
  { label: "vill", value: "villa" },
];

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
export default function AddList() {
  const [images, setImages] = useState([]);
  const [errorImages, setErrorImages] = useState(null);

  const handleFilesChange = (e) => {
    const file = Array.from(e.target.files);
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [position, setPosition] = useState(null);

  const handleMapClick = (latlng) => {
    setPosition(latlng);
    console.log("Latitude:", latlng.lat, "Longitude:", latlng.lng);
  };

  console.log(errorImages);
  const submitForm = (data) => {
    data.images = images;
    if (images.length < 5) {
      setErrorImages("You must upload 5 images");
      console.log("here");
      return;
    }
    reset();
    setErrorImages("");
    setImages([]);
    console.log(data);
    document.getElementById("my_modal_5").showModal();
  };
  return (
    <div className="my-4">
      <h1 className="text-3xl font-semibold">Add New Listing</h1>
      <form
        className="space-y-6 mt-8  flex flex-col"
        onSubmit={handleSubmit(submitForm)}
      >
        <FormInputRow
          required={true}
          id="title"
          label="Listing Title"
          errors={errors}
          placeholder="e.g.,  Cozy Apartment in Downtown Cairo"
          rules={{
            required: { value: true, message: "title is required" },
            minLength: {
              value: 5,
              message: "minumum title length is 5 charcaters",
            },
          }}
          register={register}
        />
        <FromTextareaRow
          required={true}
          register={register}
          id="descrption"
          errors={errors}
          label="Description"
          rules={{
            required: { value: true, message: "description is required" },
            minLength: { value: 10, message: "enter at least 10 characters" },
          }}
        />
        <FormInputRow
          required={true}
          errors={errors}
          label="Price Per Night(EGP)"
          placeholder="Enter the price per night"
          register={register}
          id="pricePerNight"
          type="number"
          rules={{
            required: { value: true, message: "price is required" },
            min: { value: 10, message: "minummum price 10EGP" },
            max: { value: 10000, message: "Maximmum Price 10,000" },
          }}
        />

        <div>
          <h2 className="text-2xl font-semibold mb-2">Location</h2>
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
          id="government"
          label="Government"
          register={register}
          errors={errors}
          placeholder="Enter the property government"
          rules={{
            required: { value: true, message: "government is required" },
          }}
          options={governmentList}
        />

        <FormInputRow
          required={true}
          id="address"
          label="Address"
          errors={errors}
          placeholder="Enter the property address"
          rules={{
            required: { value: true, message: "Address is required" },
          }}
          register={register}
        />

        <FormCheckboxRow
          options={aminitiesList}
          id="Amenity"
          label="Aminities"
          register={register}
          errors={errors}
        />

        <FormSelectRow
          required={true}
          errors={errors}
          register={register}
          id="Category"
          label="Property Type"
          rules={{
            required: { value: true, message: "Property type is required" },
          }}
          options={propertyType}
        />

        <div className="md:flex  md:w-82 gap-2">
          <div className="flex flex-col space-y-2">
            <label htmlFor="bedroom">Bedrooms</label>
            <input
              id="bedroom"
              {...register("bedroom")}
              type="number"
              className="bg-gray-200 p-2 w-full rounded-sm border-none focus:ring focus:ring-primarry focus:ring-offset-1 border-0 outline-0"
              placeholder="bedrooms..."
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              id="bathrooms"
              {...register("bathrooms")}
              type="number"
              className="bg-gray-200 w-full p-2 rounded-sm border-none focus:ring focus:ring-primarry focus:ring-offset-1 border-0 outline-0"
              placeholder="bathrooms..."
            />
          </div>
        </div>

        <FormInputRow
          type="number"
          required={true}
          errors={errors}
          register={register}
          label="Maximum Guests Allowed"
          placeholder="Enter the maximum number of guests"
          id="maxGustes"
          rules={{
            required: {
              value: true,
              message: "Enter number of maximum guests",
            },
          }}
        />

        <FromTextareaRow id="rules" label="Prperty Rules" register={register} />

        <div>
          <h2 className="text-2xl font-semibold mb-2">Photo Gallery</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold mb-1">Upload Photos</h2>
            {/* <p className="text-sm text-gray-500 mb-4">click to select files</p> */}
            <p className="text-sm text-gray-500 mb-4">
              You can upload up to 5 photos.
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
              Upload
            </label>
            {errorImages && <h2 className="text-red-500">{errorImages}</h2>}

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
        <button className="bg-primarry py-2 text-stone-100 px-30 rounded-full  self-center mt-8 mb-4 hover:bg-primarry-hover hover:cursor-pointer transition-all text-lg font-semibold">
          Save Listing
        </button>
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
