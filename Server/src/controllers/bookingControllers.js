import Stripe from "stripe";

import bookingModel from "../models/bookingModel.js";
import listModel from "../models/listModel.js";
import userModel from "../models/userModel.js";

export const prepareCheckOut = async (req, res, next) => {
  try {
    console.log("body", req.body);
    const list = await listModel.findById(req.params.listId);
    if (!list) {
      return res.status(400).json({
        status: "failed",
        message: "can't found list",
      });
    }

    if (req?.user?.role !== "guest") {
      console.log(req.user.role);
      return res.status(400).json({
        status: "failed",
        message: "you must be a guest to booking list",
      });
    }

    let checkIn = req?.body?.checkIn;
    let checkOut = req?.body?.checkOut;

    if (!checkIn || !checkOut)
      return res.status(400).json({
        status: "failed",
        message: "checkIn and Checkout dates are required",
      });

    // Check for invalid dates

    checkIn = new Date(checkIn);
    checkOut = new Date(checkOut);

    // Check for invalid dates
    if (isNaN(checkIn) || isNaN(checkOut)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid check-in or check-out date",
      });
    }

    // Convert dates to Egypt timezone (UTC+2)
    const egyptTimezone = "Africa/Cairo";

    // Get current time in Egypt for validation
    const currentEgyptTime = new Date().toLocaleString("en-US", {
      timeZone: egyptTimezone,
    });
    const currentDate = new Date(currentEgyptTime);

    // Convert check-in/out dates to Egypt time
    const checkInDate = new Date(
      new Date(checkIn).toLocaleString("en-US", { timeZone: egyptTimezone })
    );
    const checkOutDate = new Date(
      new Date(checkOut).toLocaleString("en-US", { timeZone: egyptTimezone })
    );

    // Keep check-in as is (preserving the time) and set check-out to end of day
    checkOutDate.setHours(23, 59, 59, 999);

    if (checkInDate < currentDate) {
      return res.status(400).json({
        status: "Failed",
        message: "Check-in date must be in the future",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        status: "Failed",
        message: "Check-out date must be after check-in date",
      });
    }

    // Calculate total days (including partial days)
    const days = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = list.pricePerNight * days;

    // Generate booking dates with proper time information
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

    // Check for date conflicts
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

        // More precise time-based conflict checking
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
        return res.status(400).json({
          status: "Failed",
          message: "These dates are not available for booking",
        });
      }
    }

    req.booking = {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
    };

    next();
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

async function createBookinCheckOut(session) {
  try {
    // console.log("session", session);

    const user = await userModel.findOne({ email: session.customer_email });
    let checkIn = session.metadata.checkIn;
    let checkOut = session.metadata.checkOut;
    const listing = session.client_reference_id;
    const totalPrice = session.metadata.totalPrice;

    checkIn = new Date(checkIn * 1000);
    checkOut = new Date(checkOut * 1000);

    // Create the booking with exact check-in/out times
    const booking = await bookingModel.create({
      guest: user._id,
      listing,
      checkIn,
      checkOut,
      totalPrice,
      paymentMethod: "stripe",
      paymentStatus: "paid",
    });

    // Create an object of dates between check-in and check-out
    const current = new Date(checkIn); // or use any specific day you want

    const bookedDate = {
      date: current,
      bookingId: booking._id,
      guestId: user._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      // dayType: "check-in", // or 'stay' or 'check-out'
    };

    const found = await listModel.findByIdAndUpdate(
      listing,
      { $push: { bookedDates: bookedDate } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
}

export const getCheckout = async (req, res) => {
  try {
    // get the currently booked list
    const list = await listModel.findById(req.params.listId);

    // console.log(process.env.STRIPE_SECRET_KEY);
    // create checkout session
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
            currency: "usd",
            unit_amount: req.booking.totalPrice * 100, // amount in cents
            product_data: {
              name: list.title,
              description: list.descrption,
              images: [list.photos[0]],
            },
          },
          quantity: 1,
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

export const stripeWebhookHandler = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
      { tolerance: 600 } // 10 minutes for production
    );
  } catch (err) {
    console.log("Webhook signature verification failed. ", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Create booking in DB
    await createBookinCheckOut(session);
  }

  res.status(200).json({ received: true });
};
export const createBooking = async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!listingId) {
      return res.status(400).json({
        status: "Failed",
        message: "Listing Id Is Required",
      });
    }

    const { checkIn, checkOut, paymentMethod } = req.body;

    if (!checkIn || !checkOut || !paymentMethod) {
      return res.status(400).json({
        status: "Failed",
        message: "Provide All Fields",
      });
    }

    const guest = req.user._id;

    const listing = await listModel.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        status: "Failed",
        message: "Listing Not Found",
      });
    }

    // Convert dates to Egypt timezone (UTC+2)
    const egyptTimezone = "Africa/Cairo";

    // Get current time in Egypt for validation
    const currentEgyptTime = new Date().toLocaleString("en-US", {
      timeZone: egyptTimezone,
    });
    const currentDate = new Date(currentEgyptTime);

    // Convert check-in/out dates to Egypt time
    const checkInDate = new Date(
      new Date(checkIn).toLocaleString("en-US", { timeZone: egyptTimezone })
    );
    const checkOutDate = new Date(
      new Date(checkOut).toLocaleString("en-US", { timeZone: egyptTimezone })
    );

    // Keep check-in as is (preserving the time) and set check-out to end of day
    checkOutDate.setHours(23, 59, 59, 999);

    if (checkInDate < currentDate) {
      return res.status(400).json({
        status: "Failed",
        message: "Check-in date must be in the future",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        status: "Failed",
        message: "Check-out date must be after check-in date",
      });
    }

    // Calculate total days (including partial days)
    const days = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = listing.pricePerNight * days;

    // Generate booking dates with proper time information
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

    // Check for date conflicts
    if (listing.bookedDates && listing.bookedDates.length > 0) {
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

        // More precise time-based conflict checking
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
        return res.status(400).json({
          status: "Failed",
          message: "These dates are not available for booking",
        });
      }
    }

    // Create the booking with exact check-in/out times
    const booking = await bookingModel.create({
      guest,
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      paymentMethod,
    });

    // Create an object of dates between check-in and check-out
    const current = new Date(checkInDate); // or use any specific day you want

    const bookedDate = {
      date: current,
      bookingId: booking._id,
      guestId: guest,
      checkInDate,
      checkOutDate,
      dayType: "check-in", // or 'stay' or 'check-out'
    };

    await listModel.findByIdAndUpdate(
      listingId,
      { $push: { bookedDates: bookedDate } },
      { new: true }
    );

    return res.status(201).json({
      status: "Success",
      message: "Booking Created",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        status: "Failed",
        message: "Booking Id Is Required",
      });
    }

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        status: "Failed",
        message: "Booking Not Found",
      });
    }

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "Can Not update this Booking",
      });
    }

    const { checkIn, checkOut, paymentMethod } = req.body;

    const listing = await listModel.findById(booking.listing);

    if (!listing) {
      return res.status(404).json({
        status: "Failed",
        message: "Listing Not Found",
      });
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
        return res.status(400).json({
          status: "Failed",
          message: "Invalid check-in/check-out dates",
        });
      }

      booking.totalPrice = listing.pricePerNight * days;
      booking.checkIn = checkIn;
      booking.checkOut = checkOut;

      // Step 3: Rebuild new bookedDates
      const current = new Date(checkIn); // You can use any specific date here

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
        { $push: { bookedDates: bookedDate } }, // Pushes one object, not an array
        { new: true }
      );
    }

    // Update payment method if provided
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }

    await booking.save();

    return res.status(200).json({
      status: "Success",
      message: "Booking and listing dates updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        status: "Failed",
        message: "Booking ID is required",
      });
    }

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        status: "Failed",
        message: "Booking not found",
      });
    }

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "You are not allowed to delete this booking",
      });
    }

    // Step 1: Remove related bookedDates from the listing
    await listModel.findByIdAndUpdate(booking.listing, {
      $pull: {
        bookedDates: { bookingId: booking._id },
      },
    });

    // Step 2: Delete the booking itself
    await bookingModel.findByIdAndDelete(bookingId);

    return res.status(200).json({
      status: "Success",
      message: "Booking and related dates removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllGuestBooking = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ guest: req.user._id })
      .populate("listing")
      // .populate("listing", "title location pricePerNight")
      .sort({ createdAt: -1 });

    // if (!bookings) {
    //   return res.status(404).json({
    //     status: "Failed",
    //     message: "No Booking Found",
    //   });
    // }

    return res.status(200).json({
      status: "Success",
      results: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const getAllHostListingBooked = async (req, res) => {
  try {
    const listings = await listModel.find({ host: req.user._id });

    if (!listings) {
      return res.status(404).json({
        status: "Failed",
        message: "Host Not Have Listings",
      });
    }

    const listingIds = listings.map((l) => l._id);

    const bookings = await bookingModel
      .find({ listing: { $in: listingIds } })
      .populate("guest", "name email")
      .populate("listing", "title location")
      .sort({ createdAt: -1 });

    if (!bookings) {
      return res.status(404).json({
        status: "Failed",
        message: "You Don not Have Any Bookings.....!",
      });
    }

    return res.status(200).json({
      status: "Success",
      results: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        status: "Failed",
        message: "Booking Id Is Required",
      });
    }

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        status: "Failed",
        message: "Booking Not Found",
      });
    }

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "Can Not Access this Booking",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getBookingsList = async (req, res) => {
  try {
    const { listingId } = req.params;
    console.log(listingId);
    const bookings = await bookingModel
      .find({ listing: listingId })
      .populate("guest listing");

    return res
      .status(200)
      .json({ status: "success", results: bookings.length, bookings });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
