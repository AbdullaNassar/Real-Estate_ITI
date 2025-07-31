import bookingModel from "../models/bookingModel.js";
import listModel from "../models/listModel.js";

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
    const egyptTimezone = 'Africa/Cairo';
    
    // Get current time in Egypt for validation
    const currentEgyptTime = new Date().toLocaleString('en-US', { timeZone: egyptTimezone });
    const currentDate = new Date(currentEgyptTime);
    
    // Convert check-in/out dates to Egypt time
    const checkInDate = new Date(new Date(checkIn).toLocaleString('en-US', { timeZone: egyptTimezone }));
    const checkOutDate = new Date(new Date(checkOut).toLocaleString('en-US', { timeZone: egyptTimezone }));
    
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
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = listing.pricePerNight * days;

    // Generate booking dates with proper time information
    const requestedDates = [];
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    
    for (let current = startDate; current <= endDate;) {
      requestedDates.push({
        date: new Date(current),
        isCheckIn: current.getTime() === startDate.getTime(),
        isCheckOut: current.getTime() === endDate.getTime()
      });
      current = new Date(current.setDate(current.getDate() + 1));
    }

    // Check for date conflicts
    if (listing.bookedDates && listing.bookedDates.length > 0) {
      const hasConflict = listing.bookedDates.some(bookedDate => {
        const bookedStart = new Date(new Date(bookedDate.checkInDate).toLocaleString('en-US', { timeZone: egyptTimezone }));
        const bookedEnd = new Date(new Date(bookedDate.checkOutDate).toLocaleString('en-US', { timeZone: egyptTimezone }));
        
        // More precise time-based conflict checking
        return (
          (checkInDate.getTime() >= bookedStart.getTime() && checkInDate.getTime() <= bookedEnd.getTime()) ||
          (checkOutDate.getTime() >= bookedStart.getTime() && checkOutDate.getTime() <= bookedEnd.getTime()) ||
          (checkInDate.getTime() <= bookedStart.getTime() && checkOutDate.getTime() >= bookedEnd.getTime())
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

    // Create an array of dates between check-in and check-out
    const bookedDatesUpdate = [];
    for (let current = new Date(startDate); current <= endDate;) {
      bookedDatesUpdate.push({
        date: new Date(current),
        bookingId: booking._id,
        guestId: guest,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        dayType: current.getTime() === checkInDate.getTime() ? 'check-in' :
                current.getTime() === checkOutDate.getTime() ? 'check-out' : 'stay'
      });
      current = new Date(current.setDate(current.getDate() + 1));
    }

    // Update the listing with new dates
    await listModel.findByIdAndUpdate(
      listingId,
      { $push: { bookedDates: { $each: bookedDatesUpdate } } },
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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Booking Id Is Required",
      });
    }

    const booking = await bookingModel.findById(id);
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

    if (checkIn && checkOut) {
      const days =
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
      if (days <= 0) {
        return res.status(400).json({
          status: "Failed",
          message: "Invalid check-in/check-out dates",
        });
      }

      const listing = await listModel.findById(booking.listing);
      booking.totalPrice = listing.pricePerNight * days;
      booking.checkIn = checkIn;
      booking.checkOut = checkOut;
    }

    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }

    await booking.save();

    return res.status(200).json({
      status: "Success",
      message: "Booking is Up-To-Date",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Servrer Error",
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Booking Id Is Required",
      });
    }

    const booking = await bookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({
        status: "Failed",
        message: "Booking Not Found",
      });
    }

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "Can Not Delete This Booking",
      });
    }

    // Remove the booking
    await bookingModel.deleteOne({ _id: id });

    // Remove the booked dates from the listing
    await listModel.findByIdAndUpdate(
      booking.listing,
      { $pull: { bookedDates: { bookingId: id } } },
      { new: true }
    );

    return res.status(200).json({
      status: "Success",
      message: "Booking Deleted Successfully",
    });
  } catch (error) {
    return rs.status(500).json({
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
      .populate("listing", "title location pricePerNight")
      .sort({ createdAt: -1 });

    if (!bookings) {
      return res.status(404).json({
        status: "Failed",
        message: "No Booking Found",
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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Booking Id Is Required",
      });
    }

    const booking = await bookingModel.findById(id);

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
