import Stripe from "stripe";
import bookingModel from "../models/bookingModel.js";
import listModel from "../models/listModel.js";
import userModel from "../models/userModel.js";
import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import AppError from "../utilities/appError.js";

export const prepareCheckOut = asyncHandler(async (req, res, next) => {
  const list = await listModel.findById(req.params.listId);
  if (!list) {
    return next(
      new AppError(
        { 
          en: "Can't find list", 
          ar: "لا يمكن العثور على القائمة" 
        }, 
        404
      )
    );
  }

  if (req?.user?.role !== "guest") {
    return next(
      new AppError(
        { 
          en: "You must be a guest to book a list", 
          ar: "يجب أن تكون ضيفًا لحجز قائمة" 
        }, 
        403
      )
    );
  }

  let { checkIn, checkOut } = req.body;
  if (!checkIn || !checkOut) {
    return next(
      new AppError(
        { 
          en: "Check-in and check-out dates are required", 
          ar: "تاريخ تسجيل الوصول والمغادرة مطلوب" 
        }, 
        400
      )
    );
  }

  checkIn = new Date(checkIn);
  checkOut = new Date(checkOut);

  if (isNaN(checkIn) || isNaN(checkOut)) {
    return next(
      new AppError(
        { 
          en: "Invalid check-in or check-out date", 
          ar: "تاريخ تسجيل الوصول أو المغادرة غير صالح" 
        }, 
        400
      )
    );
  }

  // Egypt timezone
  const egyptTimezone = "Africa/Cairo";
  const currentEgyptTime = new Date().toLocaleString("en-US", {
    timeZone: egyptTimezone,
  });
  const currentDate = new Date(currentEgyptTime);

  const checkInDate = new Date(
    new Date(checkIn).toLocaleString("en-US", { timeZone: egyptTimezone })
  );
  const checkOutDate = new Date(
    new Date(checkOut).toLocaleString("en-US", { timeZone: egyptTimezone })
  );

  checkOutDate.setHours(23, 59, 59, 999);

  if (checkInDate < currentDate) {
    return next(
      new AppError(
        { 
          en: "Check-in date must be in the future", 
          ar: "يجب أن يكون تاريخ تسجيل الوصول في المستقبل" 
        }, 
        400
      )
    );
  }

  if (checkOutDate <= checkInDate) {
    return next(
      new AppError(
        { 
          en: "Check-out date must be after check-in date", 
          ar: "يجب أن يكون تاريخ تسجيل المغادرة بعد تاريخ تسجيل الوصول" 
        }, 
        400
      )
    );
  }

  // Days calculation
  const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  const totalPrice = list.pricePerNight * days;

  // Requested dates
  const requestedDates = [];
  const startDate = new Date(checkInDate);
  const endDate = new Date(checkOutDate);

  for (let current = startDate; current <= endDate; ) {
    requestedDates.push({
      date: new Date(current),
      isCheckIn: current.getTime() === startDate.getTime(),
      isCheckOut: current.getTime() === endDate.getTime(),
    });
    current = new Date(current.setDate(current.getDate() + 1));
  }

  // Conflict check
  if (list.bookedDates && list.bookedDates.length > 0) {
    const hasConflict = list.bookedDates.some((bookedDate) => {
      const bookedStart = new Date(
        new Date(bookedDate.checkInDate).toLocaleString("en-US", {
          timeZone: egyptTimezone,
        })
      );
      const bookedEnd = new Date(
        new Date(bookedDate.checkOutDate).toLocaleString("en-US", {
          timeZone: egyptTimezone,
        })
      );

      return (
        (checkInDate.getTime() >= bookedStart.getTime() &&
          checkInDate.getTime() <= bookedEnd.getTime()) ||
        (checkOutDate.getTime() >= bookedStart.getTime() &&
          checkOutDate.getTime() <= bookedEnd.getTime()) ||
        (checkInDate.getTime() <= bookedStart.getTime() &&
          checkOutDate.getTime() >= bookedEnd.getTime())
      );
    });

    if (hasConflict) {
      return next(
      new AppError(
        { 
          en: "These dates are not available for booking", 
          ar: "هذه التواريخ غير متاحة للحجز" 
        }, 
        400
      )
    );
    }
  }

  req.booking = {
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
  };

  next();
});

const createBookinCheckOut = asyncHandler(async (session) => {
  const user = await userModel.findOne({ email: session.customer_email });
  if (!user) {
    throw new AppError(
      { 
        en: "User not found for provided email", 
        ar: "لم يتم العثور على مستخدم للبريد الإلكتروني المقدم" 
      }, 
      404
    );
  }

  if (!session.metadata?.checkIn || !session.metadata?.checkOut) {
    throw new AppError(
      { 
        en: "Check-in and check-out dates are required", 
        ar: "تاريخ تسجيل الوصول والمغادرة مطلوب" 
      }, 
      400
    );
  }

  const listing = session.client_reference_id;
  if (!listing) {
    throw new AppError(
      { 
        en: "Listing ID is required", 
        ar: "مطلوب رقم تعريف القائمة" 
      }, 
      400
    );
  }

  const totalPrice = session.metadata.totalPrice;
  if (!totalPrice) {
    throw new AppError(
      { 
        en: "Total price is required", 
        ar: "السعر الإجمالي مطلوب" 
      }, 
      400
    );
  }

  let checkIn = new Date(session.metadata.checkIn * 1000);
  let checkOut = new Date(session.metadata.checkOut * 1000);

  if (isNaN(checkIn) || isNaN(checkOut)) {
    throw new AppError(
      { 
        en: "Invalid check-in or check-out date", 
        ar: "تاريخ تسجيل الوصول أو المغادرة غير صالح" 
      }, 
      400
    );
  }

  const booking = await bookingModel.create({
    guest: user._id,
    listing,
    checkIn,
    checkOut,
    totalPrice,
    paymentMethod: "stripe",
    paymentStatus: "paid",
  });

  const bookedDate = {
    date: new Date(checkIn),
    bookingId: booking._id,
    guestId: user._id,
    checkInDate: checkIn,
    checkOutDate: checkOut,
  };

  await listModel.findByIdAndUpdate(
    listing,
    { $push: { bookedDates: bookedDate } },
    { new: true }
  );
});

export const getCheckout = asyncHandler(async (req, res) => {
  const list = await listModel.findById(req.params.listId);
  if (!list) {
    throw new AppError(
      { 
        en: "Listing not found", 
        ar: "لم يتم العثور على القائمة" 
      }, 
      404
    );
  }

  if (!req.booking) {
    throw new AppError(
      { 
        en: "Booking details are missing", 
        ar: "تفاصيل الحجز مفقودة" 
      }, 
      400
    );
  }
  if (
    !req.booking.checkIn ||
    !req.booking.checkOut ||
    !req.booking.totalPrice
  ) {
    throw new AppError(
      { 
        en: "Incomplete booking details", 
        ar: "تفاصيل الحجز غير مكتملة" 
      }, 
      400
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${process.env.CLIENT_URL}/payment-success`,
    cancel_url: `${process.env.CLIENT_URL}/ListDetails/${req.params.listId}`,
    customer_email: req.user.email,
    client_reference_id: req.params.listId,
    mode: "payment",
    metadata: {
      checkIn: req.booking.checkIn,
      checkOut: req.booking.checkOut,
      totalPrice: req.booking.totalPrice,
    },
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: req.booking.totalPrice * 100, // amount in cents
          product_data: {
            name: list.title,
            description: list.descrption || "No description available",
            images: list.photos?.length ? [list.photos[0]] : [],
          },
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

export const stripeWebhookHandler = asyncHandler(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
      { tolerance: 600 } // 10 minutes
    );
  } catch (err) {
    // Stripe webhooks require sending plain text for signature errors
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await createBookinCheckOut(session);
  }

  res.status(200).json({ received: true });
});

export const createBooking = asyncHandler(async (req, res, next) => {
  const { listingId } = req.params;

  if (!listingId) {
    return next(
      new AppError(
        { 
          en: "Listing Id is required", 
          ar: "معرّف القائمة مطلوب" 
        }, 
        400
      )
    );
  }

  const { checkIn, checkOut, paymentMethod } = req.body;

  if (!checkIn || !checkOut || !paymentMethod) {
    return next(
      new AppError(
        { 
          en: "Provide all required fields", 
          ar: "يرجى توفير جميع الحقول المطلوبة" 
        }, 
        400
      )
    );
  }

  const guest = req.user._id;
  const listing = await listModel.findById(listingId);

  if (!listing) {
    return next(
      new AppError(
        { 
          en: "Listing not found", 
          ar: "لم يتم العثور على القائمة" 
        }, 
        404
      )
    );
  }

  const egyptTimezone = "Africa/Cairo";
  const currentEgyptTime = new Date().toLocaleString("en-US", {
    timeZone: egyptTimezone,
  });
  const currentDate = new Date(currentEgyptTime);

  const checkInDate = new Date(
    new Date(checkIn).toLocaleString("en-US", { timeZone: egyptTimezone })
  );
  const checkOutDate = new Date(
    new Date(checkOut).toLocaleString("en-US", { timeZone: egyptTimezone })
  );

  checkOutDate.setHours(23, 59, 59, 999);

  if (checkInDate < currentDate) {
    return next(
      new AppError(
        { 
          en: "Check-in date must be in the future", 
          ar: "يجب أن يكون تاريخ تسجيل الوصول في المستقبل" 
        }, 
        400
      )
    );
  }

  if (checkOutDate <= checkInDate) {
    return next(
      new AppError(
        { 
          en: "Check-out date must be after check-in date", 
          ar: "يجب أن يكون تاريخ تسجيل المغادرة بعد تاريخ تسجيل الوصول" 
        }, 
        400
      )
    );
  }

  const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalPrice = listing.pricePerNight * days;

  const requestedDates = [];
  const startDate = new Date(checkInDate);
  const endDate = new Date(checkOutDate);

  for (let current = startDate; current <= endDate; ) {
    requestedDates.push({
      date: new Date(current),
      isCheckIn: current.getTime() === startDate.getTime(),
      isCheckOut: current.getTime() === endDate.getTime(),
    });
    current = new Date(current.setDate(current.getDate() + 1));
  }

  if (listing.bookedDates?.length > 0) {
    const hasConflict = listing.bookedDates.some((bookedDate) => {
      const bookedStart = new Date(
        new Date(bookedDate.checkInDate).toLocaleString("en-US", {
          timeZone: egyptTimezone,
        })
      );
      const bookedEnd = new Date(
        new Date(bookedDate.checkOutDate).toLocaleString("en-US", {
          timeZone: egyptTimezone,
        })
      );

      return (
        (checkInDate >= bookedStart && checkInDate <= bookedEnd) ||
        (checkOutDate >= bookedStart && checkOutDate <= bookedEnd) ||
        (checkInDate <= bookedStart && checkOutDate >= bookedEnd)
      );
    });

    if (hasConflict) {
      return next(
        new AppError(
          { 
            en: "These dates are not available for booking", 
            ar: "هذه التواريخ غير متاحة للحجز" 
          }, 
          400
        )
      );
    }
  }

  const booking = await bookingModel.create({
    guest,
    listing: listingId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
    paymentMethod,
  });

  const bookedDate = {
    date: checkInDate,
    bookingId: booking._id,
    guestId: guest,
    checkInDate,
    checkOutDate,
    dayType: "check-in",
  };

  await listModel.findByIdAndUpdate(
    listingId,
    { $push: { bookedDates: bookedDate } },
    { new: true }
  );

  res.status(201).json({
    status: "Success",
    message: { 
      en: "Booking Created Successfully", 
      ar: "تم الحجز بنجاح" 
    },
    data: booking,
  });
});

export const updateBooking = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return next(
      new AppError(
        { 
          en: "Booking ID is required", 
          ar: "معرّف الحجز مطلوب" 
        }, 
        400
      )
    );
  }

  const booking = await bookingModel.findById(bookingId);
  if (!booking) {
    return next(
      new AppError(
        { 
          en: "Booking not found", 
          ar: "لم يتم العثور على الحجز" 
        }, 
        404
      )
    );
  }

  if (booking.guest.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        { 
          en: "You are not allowed to update this booking", 
          ar: "غير مسموح لك بتعديل هذا الحجز" 
        },
        403
      )
);
  }

  const { checkIn, checkOut, paymentMethod } = req.body;

  const listing = await listModel.findById(booking.listing);
  if (!listing) {
    return next(
      new AppError(
        { 
          en: "Listing not found", 
          ar: "لم يتم العثور على القائمة" 
        }, 
        404
      )
    );
  }

  // Step 1: Remove old bookedDates linked to this booking
  await listModel.findByIdAndUpdate(listing._id, {
    $pull: {
      bookedDates: { bookingId: booking._id },
    },
  });

  // Step 2: Update booking fields
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const days = (end - start) / (1000 * 60 * 60 * 24);
    if (days <= 0) {
      return next(
      new AppError(
        { 
          en: "Invalid check-in/check-out dates", 
          ar: "تواريخ تسجيل الوصول والمغادرة غير صالحة" 
        }, 
        400
      )
    );
    }

    booking.totalPrice = listing.pricePerNight * days;
    booking.checkIn = checkIn;
    booking.checkOut = checkOut;

    // Step 3: Rebuild new bookedDates
    const current = new Date(checkIn);
    const checkInDateObj = new Date(checkIn);
    const checkOutDateObj = new Date(checkOut);

    let dayType = "stay";
    if (current.getTime() === checkInDateObj.getTime()) {
      dayType = "check-in";
    } else if (current.getTime() === checkOutDateObj.getTime()) {
      dayType = "check-out";
    }

    const bookedDate = {
      date: current,
      bookingId: booking._id,
      guestId: booking.guest,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      dayType,
    };

    await listModel.findByIdAndUpdate(
      listing._id,
      { $push: { bookedDates: bookedDate } },
      { new: true }
    );
  }

  // Step 4: Update payment method if provided
  if (paymentMethod) {
    booking.paymentMethod = paymentMethod;
  }

  await booking.save();

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Booking and listing dates updated successfully", 
      ar: "تم تحديث تواريخ الحجز والقائمة بنجاح" 
    }
  });
});

export const deleteBooking = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return next(
      new AppError(
        { 
          en: "Booking ID is required", 
          ar: "معرّف الحجز مطلوب" 
        }, 
        400
      )
    );
  }

  const booking = await bookingModel.findById(bookingId);
  if (!booking) {
    return next(
      new AppError(
        { 
          en: "Booking not found", 
          ar: "لم يتم العثور على الحجز" 
        }, 
        404
      )
    );
  }

  if (booking.guest.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        { 
          en: "You are not allowed to delete this booking", 
          ar: "غير مسموح لك بحذف هذا الحجز" 
        }, 
        403
      )
    );
  }

  // Step 1: Remove related bookedDates from the listing
  await listModel.findByIdAndUpdate(booking.listing, {
    $pull: {
      bookedDates: { bookingId: booking._id },
    },
  });

  // Step 2: Delete the booking itself
  await bookingModel.findByIdAndDelete(bookingId);

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Booking and related dates removed successfully", 
      ar: "تم حذف الحجز والتواريخ المرتبطة بنجاح" 
    }
  });
});

export const getAllGuestBooking = asyncHandler(async (req, res, next) => {
  const bookings = await bookingModel
    .find({ guest: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "Success",
    results: bookings.length,
    data: bookings,
  });
});

export const getAllHostListingBooked = asyncHandler(async (req, res, next) => {
  const listings = await listModel.find({ host: req.user._id });

  const listingIds = listings.map((l) => l._id);

  const bookings = await bookingModel
    .find({ listing: { $in: listingIds } })
    .populate("guest", "name email")
    .populate("listing", "title location")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "Success",
    results: bookings.length,
    data: bookings,
  });
});

export const getBookingById = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return next(
      new AppError(
        { 
          en: "Booking ID is required", 
          ar: "معرّف الحجز مطلوب" 
        }, 
        400
      )
    );
  }

  const booking = await bookingModel.findById(bookingId);

  if (!booking) {
    return next(
      new AppError(
        { 
          en: "Booking not found", 
          ar: "لم يتم العثور على الحجز" 
        }, 
        404
      )
    );
  }

  if (booking.guest.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        { 
          en: "You are not allowed to access this booking", 
          ar: "غير مسموح لك بالوصول إلى هذا الحجز" 
        }, 
        403
      )
    );
  }

  res.status(200).json({
    status: "Success",
    data: booking,
  });
});

export const getBookingsList = asyncHandler(async (req, res, next) => {
  const { listingId } = req.params;

  if (!listingId) {
    return next(
      new AppError(
        { 
          en: "Listing ID is required", 
          ar: "معرّف القائمة مطلوب" 
        }, 
        400
      )
    );
  }

  const bookings = await bookingModel
    .find({ listing: listingId })
    .populate("guest listing");

  res.status(200).json({
    status: "success",
    results: bookings.length,
    bookings,
  });
});

export const getAllBookings = asyncHandler(async (req, res, next) => {

  const bookings = await bookingModel
    .find()
    .populate("guest listing");

  res.status(200).json({
    status: "success",
    results: bookings.length,
    bookings,
  });
});
