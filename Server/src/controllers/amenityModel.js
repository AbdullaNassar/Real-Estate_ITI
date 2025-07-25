import amenityModel from "../models/amenityModel.js";

export const createAmenity = async (req,res)=>{
    try {
        const {name,icon} = req.body;
        const amenity = await amenityModel.create({
            name,
            icon
        });

        return res.status(201).json({
            status:"Success",
            message:"Amenity Created Successfuly",
            data:amenity
        })
    } catch (error) {
        return res.status(400).json({
            status:"Failed",
            message:error.message
        })
    }
}

export const getAllAmenities = async (req,res)=>{
    try {
        const amenities = await amenityModel.find();
        return res.status(200).json({
            status:"Success",
            data:amenities
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const updateAmenity = async (req,res)=>{
    try {
        const {id} = req.params;
        const {name,icon} = req.body;

        const amenity = await amenityModel.findByIdAndUpdate(id,{name,icon},{new:true,runValidators:true});
        return res.status(200).json({
            status:"Success",
            message:"Amenity Updated Successfuly",
            data:amenity
        })

    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const deleteAmenity = async (req,res)=>{
    try {
        const {id} = req.params;

        const amenity = await amenityModel.deleteOne({_id:id});
        return res.status(200).json({
            status:"Success",
            message:"Amenity Deleted Successfuly",
            data:amenity
        })

    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}