import mongoose from "mongoose";

const amenitySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Amenity Name Is Required"],
      unique: [true, "This Amenity Created Before"],
      trim: true,
    },
    arName:{
      type: String,
      required: [true, "Amenity Arabic Name Is Required"],
      unique: [true, "This Amenity Created Before"],
    },
    icon: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const amenityModel = mongoose.model("Amenity", amenitySchema);

export default amenityModel;
