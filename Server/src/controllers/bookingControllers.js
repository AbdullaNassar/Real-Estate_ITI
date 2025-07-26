import bookingModel from "../models/bookingModel.js";
import listModel from "../models/listModel.js";

export const createBooking = async (req,res)=>{
    try {
        const {listingId} = req.params;

        if(!listingId){

            return res.status(400).json({
                status:"Failed",
                message:"Listing Id Is Required"
            })
        }

        const {checkIn,checkOut,paymentMethod} = req.body;

        if(!checkIn || !checkOut || !paymentMethod ){
            return res.status(400).json({
                status:"Failed",
                message:"Provide All Fields"
            })
        }

        const guest = req.user._id;

        const listing = await listModel.findById(listingId);

        if(!listing){
            return res.status(404).json({
                status:"Failed",
                message:"Listing Not Found",
            })
        }

        const days = (new Date(checkOut) - new Date(checkIn))/(1000*60*60*24);

        if(days <=0){
            return res.status(400).json({
                status:"Failed",
                message:"Invalid check-in/check-out dates"
            })
        }

        const totalPrice = listing.pricePerNight * days;

        const booking = await bookingModel.create({
            guest,
            listing:listingId,
            checkIn,
            checkOut,
            totalPrice,
            paymentMethod
        });
        return res.status(201).json({
            status:"Success",
            message:"Booking Created",
            data: booking
        })

    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const updateBooking = async (req,res)=>{
    try {
        const {id} = req.params;

        if(!id){

            return res.status(400).json({
                status:"Failed",
                message:"Booking Id Is Required"
            })
        }

        const booking = await bookingModel.findById(id);
        if(!booking){
            return res. status(404).json({
                status:"Failed",
                message:"Booking Not Found"
            });
        }

        if(booking.guest.toString() !== req.user._id.toString()){
            return res.status(403).json({
                status:"Failed",
                message:"Can Not update this Booking"
            })
        }

        const {checkIn,checkOut,paymentMethod} = req.body;

        if(checkIn&&checkOut){

            const days = (new Date(checkOut) - new Date(checkIn))/(1000*60*60*24);
            if(days <=0){
                return res.status(400).json({
                    status:"Failed",
                    message:"Invalid check-in/check-out dates"
                })
            }

            const listing = await listModel.findById(booking.listing);
            booking.totalPrice = listing.pricePerNight * days;
            booking.checkIn = checkIn;
            booking.checkOut = checkOut;
        };

        if(paymentMethod){
            booking.paymentMethod = paymentMethod;
        }

        await booking.save();

        return res.status(204).json({

            status:"Success",
            message:"Booking is Up-To-Date",
        })
    } catch (error) {
        return res.status(500).json({

            status:"Failed",
            message:"Internal Servrer Error",
            error:error.message
        })
    }
}

export const deleteBooking = async (req,res)=>{
    try {
        const {id} = req.params;

        if(!id){

            return res.status(400).json({
                status:"Failed",
                message:"Booking Id Is Required"
            })
        }

        const booking = await bookingModel.findById(id);
        if(!booking){
            return res.status(404).json({
                status:"Failed",
                message:"Booking Not Found"
            });
        };

        if(booking.guest.toString() !==  req.user._id.toString()){

            return res.status(403).json({
                status:"Failed",
                message:"Can Not Delete This Booking"
            })
        }
        
        await bookingModel.deleteOne({_id:id});

        return res.status(204).json({

            status:"Success",
            message:"Booking Deleted Successfuly",
        });

    } catch (error) {
        return rs.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const getAllGuestBooking = async (req,res)=>{
    try {
        const bookings = await bookingModel.find({guest:req.user._id})
            .populate("listing","title location pricePerNight")
            .sort({createdAt: -1});

        if(!bookings){

            return res.status(404).json({
                status:"Failed",
                message:"No Booking Found"
            });
        }

        return res.status(200).json({
            status:"Success",
            results:bookings.length,
            data: bookings
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const getAllHostListingBooked = async (req,res)=>{
    try {
        const listings = await listModel.find({host:req.user._id});

        if(!listings){

            return res.status(404).json({
                status:"Failed",
                message:"Host Not Have Listings"
            })
        }

        const listingIds = listings.map((l)=>l._id);

        const bookings = await bookingModel.find({listing:{$in:listingIds}})
            .populate("guest","name email")
            .populate("listing","title location")
            .sort({createdAt: -1});

            if(!bookings){
                return res.status(404).json({
                    status:"Failed",
                    message:"You Don not Have Any Bookings.....!"
                })
            }

        return res.status(200).json({
            status:"Success",
            results:bookings.length,
            data: bookings
        });

    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const getBookingById = async (req,res)=>{
    try {
        const {id} = req.params;

        if(!id){

            return res.status(400).json({
                status:"Failed",
                message:"Booking Id Is Required"
            })
        }

        const booking = await bookingModel.findById(id);

        if(!booking){
            return res.status(404).json({
                status:"Failed",
                message:"Booking Not Found"
            })
        }

        if(booking.guest.toString()!==req.user._id.toString()){
            return res.status(403).json({
                status:"Failed",
                message:"Can Not Access this Booking"
            })
        }

        return res.status(200).json({
            status:"Success",
            data : booking
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}