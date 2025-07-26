import amenityModel from "../models/amenityModel.js";

export const createAmenity = async (req,res)=>{
    try {
        const {name,icon} = req.body;

        if(!name){
            return res.status(400).json({
                status:"Failed",
                message:"Amenity Name Is Required...!"
            })
        }
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
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const getAllAmenities = async (req,res)=>{
    try {
        const amenities = await amenityModel.find();

        if(amenities==[]){
            return res.status(200).json({
                status:"Success",
                message:"No Amenities Found"
            });
        }

        return res.status(200).json({
            status:"Success",
            data:amenities
        });
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        });
    }
}

export const updateAmenity = async (req,res)=>{
    try {
        const {id} = req.params;
        
        const {name,icon} = req.body;

        if(!id){
            return res.status(400).json({
                status:"Failed",
                message:"Id of Amenity Is Required"
            })
        }

        if(!name){
            return res.status(400).json({
                status:"Failed",
                message:"Name Or Icon of Amenity Is Required"
            })
        }

        const amenity = await amenityModel.findOne({_id:id});

        if(!amenity){
            return res.status(400).json({
                status:"Failed",
                message:"Amenity Not Found"
            })
        }

        const newAmenity = await amenityModel.findByIdAndUpdate(id,{name,icon},{new:true,runValidators:true});

        return res.status(200).json({
            status:"Success",
            message:"Amenity Updated Successfuly",
            data:newAmenity
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

        if(!id){
            return res.status(400).json({
                status:"Failed",
                message:"Id Of Amenity Is Required"
            })
        }

        const amenity = await amenityModel.findOne({_id:id});
        if(!amenity){
            return res.status(400).json({
                status:"Failed",
                message:"Id Of Amenity Is Incorrect"
            })
        }

        await amenityModel.deleteOne({_id:id});
        
        return res.status(204).json({
            status:"Success",
            message:"Amenity Deleted Successfuly",
        })

    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}