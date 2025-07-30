import listModel from "../models/listModel.js";

export const createList = async (req, res) => {
  try {
    const {
      title,
      descrption,
      pricePerNight,
      categoryId,
      locationType,
      address,
      longitude,
      latitude, 
      governorate,
      amenitiesId,
      maxGustes,
      photos,
    } = req.body;

    if (
      !title ||
      !descrption ||
      !pricePerNight ||
      !longitude ||
      !latitude ||
      !address ||
      !maxGustes ||
      !photos ||
      !governorate
    ) {
      return res.status(400).json({
        status: "Failed",
        message: "Provide All Fields",
      });
    }

    const list = await listModel.create({
      host: req.user._id,
      title,
      descrption,
      pricePerNight,
      categoryId,
      locationType,
      location:{
        address,
        coordinates:{
          coordinates:[parseFloat(longitude),parseFloat(latitude)]
        }
      },
      governorate,
      amenitiesId,
      maxGustes,
      photos,
    });

    res.status(201).json({
      status: "Success",
      message: "List Created",
      data: list,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const readLists = async (req, res) => {
  try {
    const { sort, page, limit, field } = req?.query;
    const queryBody = {
      isApproved: true,
    };

    let query = listModel.find(queryBody).populate("categoryId amenitiesId");

    if (sort) {
      query = query.sort(sort.split(",").join(" "));
    }

    if (field) {
      query = query.select(field.split(",").join(" "));
    }

    if (page) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(+limit);
    }

    const lists = await query;

    if (!lists) {
      return res.status(404).json({
        status: "Failed",
        message: "No Listings Found",
      });
    }

    res.status(200).json({
      status: "Success",
      results: lists.length,
      data: lists,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getListById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Listing Id Is required",
      });
    }

    const list = await listModel.findOne({ _id: id });
    if (!list) {
      return res.status(404).json({
        status: "Failed",
        message: "List Not Found",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: list,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getListingsByGovernorate  = async (req,res) =>{
  try {
    const { governorate } = req.params;

    const validGovernorates = [
      "Cairo", "Giza", "Alexandria", "Qalyubia", "Port Said", "Suez",
      "Dakahlia", "Sharqia", "Gharbia", "Monufia", "Beheira",
      "Kafr El Sheikh", "Fayoum", "Beni Suef", "Minya", "Assiut",
      "Sohag", "Qena", "Luxor", "Aswan", "Red Sea", "New Valley",
      "Matrouh", "North Sinai", "South Sinai"
    ];

    if(!governorate){

      return res.status(400).json({
        status:"Failed",
        message:"Governorate Is Required"
      });
    }

    if(!validGovernorates.includes(governorate)){

      return res.status(400).json({
        status:"Failed",
        message:"Invalid governorate name"
      });
    }

    const listing = await listModel.find({governorate});

    return res.status(200).json({
      status:"Success",
      results:listing.length,
      data: listing
    })



  } catch (error) {
    return res.status(500).json({
      status:"Failed",
      message:"Internal Server Error",
      error:error.message
    })
  }
}

export const updateList = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Listing Id Is required",
      });
    }

    const host = req.user._id;

    const list = await listModel.findOne({ _id: id });

    if (!list) {
      return res.status(404).json({
        status: "Failed",
        message: "List Not Found",
      });
    }

    if (list.host.toString() !== host.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "Can not to Update this List",
      });
    }

    if(!req.body){
      return res.status(400).json({
        status:"Failed",
        message:"Body Is Empty"
      })
    }

    const {
      title,
      descrption,
      pricePerNight,
      categoryId,
      locationType,
      address,
      longitude,
      latitude,
      amenitiesId,
      maxGustes,
    } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(descrption && { descrption }),
      ...(pricePerNight && { pricePerNight }),
      ...(categoryId && { categoryId }),
      ...(locationType && { locationType }),
      ...(amenitiesId && { amenitiesId }),
      ...(maxGustes && { maxGustes }),
    };

    if (address && longitude && latitude) {
      updateData.location = {
        address,
        coordinates: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      };
    }

    if (req.files?.length > 0) {
      updateData.photos = req.files.map((file) => file.path); // or cloudinary URLs
    }

    await listModel.findByIdAndUpdate(id,updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      message: "Listing Updated Successfuly",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Listing Id Is required",
      });
    }

    const host = req.user._id;

    const list = await listModel.findOne({ _id: id });

    if (!list) {
      return res.status(404).json({
        status: "Failed",
        message: "List Not Found",
      });
    }

    if (list.host.toString() !== host.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "Can not to Delete This List",
      });
    }

    await listModel.deleteOne({ _id: id });

    return res.status(200).json({
      status: "Success",
      message: "List Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const searchLists = async (req, res) => {
  try {
    const { title, description, price, date, location, amenities , governorate } = req?.query;
    const query = {
      isApproved:true
    };
    if (title?.trim()) {
      query.title = { $regex: new RegExp(title, "i") };
    }
    if (description?.trim()) {
      query.descrption = { $regex: new RegExp(description, "i") };
    }
    if (price?.trim()) {
      query.pricePerNight = { $lte: price };
    }
    if (date?.trim()) {
      const currDate = new Date(date);
      const nextDate = new Date(currDate);
      nextDate.setDate(nextDate.getDate() + 1);

      query.createdAt = {
        $gte: currDate,
        $lt: nextDate,
      };
    }
    if (location?.trim()) {
      query.location = { $regex: new RegExp(location, "i") };
    }
    if (amenities?.trim()) {
      query.amenities = { $regex: new RegExp(amenities, "i") };
    }

    if (governorate?.trim()) {
      query.governorate = { $regex: new RegExp(governorate, "i") };
    }    

    const lists = await listModel.find(query);

    res.status(200).json({
      status: "Success",
      results: lists.length,
      lists: lists,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const approvedListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Listing Id Is required",
      });
    }

    const listing = await listModel.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: "Success",
      message: "Listing Approved Successfuly",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
