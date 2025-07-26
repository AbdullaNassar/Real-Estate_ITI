import bookingModel from "../models/bookingModel.js";
import listModel from "../models/listModel.js";
import ratingModel from "../models/ratingModel.js";

export const guestRate = async (req,res)=>{
    try {
        const {bookingId} = req.params;

        if(bookingId){
            return res.status(400).json({
                status:"Failed",
                message:"Booking Id Is Required"
            });
        }

        const booking = await bookingModel.findById(bookingId);

        if(!booking){
            return res.status(404).json({
                status:"Failed",
                message:"Booking Not Found"
            });
        }

        const {rating,comment} = req.body;
        
        if(!rating){

            return res.status(400).json({
                status:"Failed",
                message:"Rating Is Required"
            })
        }
        
        if(booking.guest.toString() !== req.user._id.toString()){

            return res.status(403).json({
                status:"Failed",
                message:"Unauthorized or booking not found"
            });
        };

        
        if(booking.checkOut > new Date()){

            return res.status(400).json({
                status:"Failed",
                message:"You can only rate after checkout"
            });
        }

        const existingRating = await ratingModel.findOne({ bookingId:booking._id });

        if (existingRating){

            return res.status(400).json({
                status:"Failed",
                message: "You already rated this booking" 
            })};

        const newRating = await ratingModel.create({
            bookingId:booking._id,
            listingId:booking.listing,
            guestId:req.user._id,
            rating,
            comment
        });

        const ratings = await ratingModel.find({listingId:booking.listing});
        const avgRating = ratings.reduce((sum,r)=>{
            return (sum + r.rating) / ratings.length
        },0);
        
        await listModel.findByIdAndUpdate(booking.listing,{averageRating : avgRating},{new:true,runValidators:true});

        return res.status(201).json({
            status:"Success",
            message:"Rating submitted Successfuly",
            rating:newRating
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server error",
        })
    }
}

export const getRatingsForListing = async (req, res) => {
    try {

        const {listingId} = req.params.listingId;

        if(!listingId){

            return res.status(400).json({
                status:"Failed",
                message:"Listing Id Is Required"
            })
        }

        const listing = await listModel.findOne({_id:listingId});

        if(!listing){

            return res.status(404).json({
                status:"Failed",
                message:"Listing Not Found"
            })
        }

        const ratings = await ratingModel.find({listingId});

        if(!ratings){
            return res.status(404).json({
                status:"Failed",
                message:"This Listing Not Have Any Ratings"
            })
        }

        return res.status(200).json({
            status: "Success",
            ratings 
        });

    } catch (error) {
        
        return res.status(500).json({
            status: "Failed",
            message: "Internal Server Error",
        });
    }
};