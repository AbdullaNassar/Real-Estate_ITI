import mongoose from "mongoose";

const ratingSchema = mongoose.Schema(
  {
    guestId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Guest Id Is Required"],
    },
    listingId: {
      type: mongoose.Types.ObjectId,
      ref: "List",
      required: [true, "Listing Id Is Required"],
    },
    bookingId: {
      type: mongoose.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking Id Is Required"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating Is Required"],
    },
    comment: String,
  },
  { timestamps: true }
);

const ratingModel = mongoose.model("Rating", ratingSchema);

export default ratingModel;
