import bookingModel from "../models/bookingModel.js";
import listModel from "../models/listModel.js";
import ratingModel from "../models/ratingModel.js";

export const guestRate = async (req,res)=>{
    try {
        const {rating,comment} = req.body;

        const booking = await bookingModel.findById(req.params.bookingId);
        
        if(!booking || booking.guest.toString() !== req.user._id.toString()){
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
        const ratings = await ratingModel.find({ listingId: req.params.listingId });
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