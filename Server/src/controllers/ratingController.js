import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import bookingModel from "../models/bookingModel.js";
import listModel from "../models/listModel.js";
import ratingModel from "../models/ratingModel.js";
import AppError from "../utilities/appError.js";

export const addRating = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new AppError(
      { 
        en: "Booking ID is required", 
        ar: "معرّف الحجز مطلوب" 
      }, 
      400
    );
  }

  const booking = await bookingModel.findById(bookingId);
  if (!booking) {
    throw new AppError(
      { 
        en: "Booking not found", 
        ar: "لم يتم العثور على الحجز" 
      }, 
      404
    );
  }

  const { rating, comment } = req.body;
  if (!rating) {
    throw new AppError(
      { 
        en: "Rating is required", 
        ar: "التقييم مطلوب" 
      }, 
      400
    );
  }

  if (booking.guest.toString() !== req.user._id.toString()) {
    throw new AppError(
      { 
        en: "Unauthorized or booking not found", 
        ar: "غير مصرح أو لم يتم العثور على الحجز" 
      }, 
      403
    );
  }

  if (booking.checkOut > new Date()) {
    throw new AppError(
      { 
        en: "You can only rate after checkout", 
        ar: "يمكنك التقييم فقط بعد تسجيل المغادرة" 
      }, 
      400
    );
  }

  const existingRating = await ratingModel.findOne({ bookingId: booking._id });
  if (existingRating) {
    throw new AppError(
      { 
        en: "You already rated this booking", 
        ar: "لقد قمت بتقييم هذا الحجز مسبقًا" 
      }, 
      400
    );
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
    message: { 
      en: "Rating submitted successfully", 
      ar: "تم إرسال التقييم بنجاح" 
    },
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
    throw new AppError(
      { 
        en: "Listing ID is required", 
        ar: "معرّف القائمة مطلوب" 
      }, 
      400
    );
  }

  const listing = await listModel.findById(listingId);

  if (!listing) {
    throw new AppError(
      { 
        en: "Listing not found", 
        ar: "لم يتم العثور على القائمة" 
      }, 
      404
    );
  }

  const ratings = await ratingModel.find({ listingId }).populate('guestId');
  
  res.status(200).json({
    status: "Success",
    ratings,
  });
});

export const getRatingsForUser = asyncHandler(async (req, res) => {
  const ratings = await ratingModel.find({ guestId: req.user._id });

  res.status(200).json({
    status: "Success",
    ratings,
  });
});

export const editExistingRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;

  if (!ratingId) {
    throw new AppError(
      { 
        en: "Rating ID is required", 
        ar: "معرّف التقييم مطلوب" 
      }, 
      400
    );

  }

  const rate = await ratingModel.findById(ratingId);

  if(!rate){
    throw new AppError(
      { 
        en: "rating Not Found", 
        ar: " التقييم غير موجود " 
      }, 
      404
    );
  }

  const { rating, comment } = req.body;
  if (!rating && !comment) {
    throw new AppError(
      { 
        en: "New rating data is required", 
        ar: "بيانات التقييم الجديدة مطلوبة" 
      }, 
      400
    );
  }

  if (rate.guestId.toString() !== req.user._id.toString()) {
    throw new AppError(
      { 
        en: "Unauthorized or rating not found", 
        ar: "غير مصرح أو لم يتم العثور على التقييم" 
      }, 
      403
    );

  }

  const updatedRating = await ratingModel.findByIdAndUpdate(
    ratingId,
    { rating, comment },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Rating Updated successfully", 
      ar: "تم تعديل التقييم بنجاح"
  },
    updatedRating,
  });
});

export const removeExistingRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;

  if (!ratingId) {
    throw new AppError(
      { 
        en: "Rating ID is required", 
        ar: "معرّف التقييم مطلوب" 
      }, 
      400
    );
  }

  const rating = await ratingModel.findById(ratingId);
  if (!rating) {
    throw new AppError(
      { 
        en: "Rating not found", 
        ar: "لم يتم العثور على التقييم" 
      }, 
      404
    );
  }

  const listing = await listModel.findById(rating.listingId);
  if (!listing) {
    throw new AppError(
      { 
        en: "Listing not found", 
        ar: "لم يتم العثور على القائمة" 
      }, 
      404
    );
  }

  if (rating.guestId.toString() !== req.user._id.toString()) {
    throw new AppError(
      { 
        en: "Unauthorized to delete this rating", 
        ar: "غير مصرح لك بحذف هذا التقييم" 
      }, 
      403
    );
  }

  listing.reviews = listing.reviews.filter(
    (r) => r._id.toString() !== ratingId.toString()
  );
  await listing.save();

  await ratingModel.deleteOne({ _id: ratingId });

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Rating deleted successfully", 
      ar: "تم حذف التقييم بنجاح" 
    }
  });
});
