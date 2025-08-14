import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import bookingModel from "../models/bookingModel.js";
import listModel from "../models/listModel.js";
import ratingModel from "../models/ratingModel.js";
import AppError from "../utilities/appError.js";

export const addRating = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new AppError("Booking Id is required", 400);
  }

  const booking = await bookingModel.findById(bookingId);
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const { rating, comment } = req.body;
  if (!rating) {
    throw new AppError("Rating is required", 400);
  }

  if (booking.guest.toString() !== req.user._id.toString()) {
    throw new AppError("Unauthorized or booking not found", 403);
  }

  if (booking.checkOut > new Date()) {
    throw new AppError("You can only rate after checkout", 400);
  }

  const existingRating = await ratingModel.findOne({ bookingId: booking._id });
  if (existingRating) {
    throw new AppError("You already rated this booking", 400);
  }

  const newRating = await ratingModel.create({
    bookingId: booking._id,
    listingId: booking.listing,
    guestId: req.user._id,
    rating,
    comment,
  });

  const listing = await listModel.findById(booking.listing);
  listing.reviews.push(newRating);
  await listing.save();

  res.status(201).json({
    status: "Success",
    message: "Rating submitted successfully",
    user: {
      userName: req.user.userName,
      profilePicture: req.user.profilePic,
    },
    rating: newRating,
  });
});

export const getRatingsForListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  if (!listingId) {
    throw new AppError("Listing Id is required", 400);
  }

  const listing = await listModel.findById(listingId);
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  const ratings = await ratingModel.find({ listingId }).populate('guestId');
  if (!ratings.length) {
    throw new AppError("This listing does not have any ratings", 404);
  }

  res.status(200).json({
    status: "Success",
    ratings,
  });
});

export const getRatingsForUser = asyncHandler(async (req, res) => {
  const ratings = await ratingModel.find({ guestId: req.user._id });

  if (!ratings.length) {
    throw new AppError("This user does not have any ratings", 404);
  }

  res.status(200).json({
    status: "Success",
    ratings,
  });
});

export const editExistingRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;

  if (!ratingId) {
    throw new AppError("Rating ID is required", 400);
  }

  const rate = await ratingModel.findById(ratingId);
  if (!rate) {
    throw new AppError("Rating not found", 404);
  }

  const { rating, comment } = req.body;
  if (!rating && !comment) {
    throw new AppError("New rating data is required", 400);
  }

  if (rate.guestId.toString() !== req.user._id.toString()) {
    throw new AppError("Unauthorized or rating not found", 403);
  }

  const updatedRating = await ratingModel.findByIdAndUpdate(
    ratingId,
    { rating, comment },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "Success",
    updatedRating,
  });
});

export const removeExistingRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;

  if (!ratingId) {
    throw new AppError("Rating ID is required", 400);
  }

  const rating = await ratingModel.findById(ratingId);
  if (!rating) {
    throw new AppError("Rating not found", 404);
  }

  const listing = await listModel.findById(rating.listingId);
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  if (rating.guestId.toString() !== req.user._id.toString()) {
    throw new AppError("Unauthorized to delete this rating", 403);
  }

  listing.reviews = listing.reviews.filter(
    (r) => r._id.toString() !== ratingId.toString()
  );
  await listing.save();

  await ratingModel.deleteOne({ _id: ratingId });

  res.status(200).json({
    status: "Success",
    message: "Rating deleted successfully",
  });
});
