import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Guest is Required"],
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: [true, "Listing is Required"],
  },
  checkIn: {
    type: Date,
    required: [true, "Chack In Date is Required"],
  },
  checkOut: {
    type: Date,
    required: [true, "Check Out Date is Required"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total Price is Required"],
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["stripe", "paypal"],
    required: [true, "Payment Method is Required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bookingModel = mongoose.model("Booking", bookingSchema);
export default bookingModel;
