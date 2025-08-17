import mongoose, { Schema } from "mongoose";
import { ratingSchema } from "./ratingModel.js";

const listSchema = new Schema(
  {
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    title: {
      type: String,
      required: [true, "Listing Title is required"],
      unique: [true, "Title Must Be Unique"],
      trim: true,
    },
    arTitle: {
      type: String,
      required: [true, "Listing Arabic Title is required"],
      unique: [true, "Title Must Be Unique"],
    },
    descrption: {
      type: String,
      required: [true, "Listing Description is required"],
    },
    arDescrption: {
      type: String,
      required: [true, "Listing Arabic Description is required"],
    },
    roomNumbers: {
      type: Number,
      default: 1,
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price Per Night is Required"],
      min: [0, "preice Per Night must be grater than Or equal to 0"],
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Category Id Is Required"],
    },
    locationType: {
      type: String,
      enum: ["seaside", "city", "mountain", "rural"],
      default: "city",
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is Required"],
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: [true, "Location coordinates is Required"],
        },
      },
    },
    governorate: {
      type: String,
      enum: [
        "Cairo",
        "Giza",
        "Alexandria",
        "Qalyubia",
        "PortSaid",
        "Suez",
        "Dakahlia",
        "Sharqia",
        "Gharbia",
        "Monufia",
        "Beheira",
        "KafrElSheikh",
        "Fayoum",
        "BeniSuef",
        "Minya",
        "Assiut",
        "Sohag",
        "Qena",
        "Luxor",
        "Aswan",
        "RedSea",
        "NewValley",
        "Matrouh",
        "NorthSinai",
        "SouthSinai",
      ],
      required: [true, "Governorate is required"],
    },
    amenitiesId: {
      type: [mongoose.Types.ObjectId],
      ref: "Amenity",
      default: [],
    },
    maxGustes: {
      type: Number,
      required: [true, "Max Gustes is Required"],
      min: [1, "Max Gustes must be grater than Or equal to 1"],
    },
    photos: {
      type: [String],
      required: [true, "Five Photo Required"],
      validate: {
        validator: (value) => {
          return value.length >= 5;
        },
        message: "{PATH} must have 5 photos At Least",
      },
    },
    bookedDates: [
      {
        date: Date,
        bookingId: {
          type: Schema.Types.ObjectId,
          ref: "Booking",
        },
        guestId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        checkInDate: Date,
        checkOutDate: Date,
        dayType: {
          type: String,
          enum: ["check-in", "stay", "check-out"],
          default: "stay",
        },
      },
    ],
    reviews: [ratingSchema],
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

listSchema.virtual("averageRating").get(function () {
  if (this.reviews.length === 0) return 0;

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);

  return total / this.reviews.length;
});

listSchema.set("toObject", { virtuals: true });
listSchema.set("toJSON", { virtuals: true });

listSchema.index({
  title: "text",
  description: "text",
  governorate: "text",
});

const listModel = mongoose.model("List", listSchema);
export default listModel;
