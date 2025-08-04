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

    if (photos.length !== 5) {
      return res.status(400).json({
        status: "Failed",
        message: `Listing Must have 5 Images you Exactly upload ${photos.length}`,
      });
    }

    const list = await listModel.create({
      host: req.user._id,
      title,
      descrption,
      pricePerNight,
      categoryId,
      locationType,
      location: {
        address,
        coordinates: {
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
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
    const { sort } = req?.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const allowedFilters = ["governorate", "categoryId"];
    const filters = {};

    allowedFilters.forEach((key) => {
      if (req.query[key]) filters[key] = req.query[key];
    });

    const queryBody = {
      isApproved: true,
      ...filters,
    };

    if (req.query.price && !isNaN(req.query.price)) {
      queryBody.pricePerNight = { $lte: +req.query.price };
    }

    const startDateStr = req.query.startDate;
    const endDateStr = req.query.endDate;

    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      queryBody.bookedDates = {
        $not: {
          $elemMatch: {
            checkInDate: { $lte: endDate },
            checkOutDate: { $gte: startDate },
          },
        },
      };
    }

    const totalDocs = await listModel.countDocuments(queryBody);

    let query = listModel.find(queryBody).populate("categoryId amenitiesId");

    if (sort) {
      query = query.sort(sort.split(",").join(" "));
    }

    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const listings = await query;

    res.status(200).json({
      status: "Success",
      total: totalDocs,
      results: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error(error);
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

    const list = await listModel
      .findOne({ _id: id })
      .populate("host categoryId amenitiesId");
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

export const getListingsByGovernorate = async (req, res) => {
  try {
    const listings = await listModel.aggregate([
      {
        $match: {
          isApproved: true,
        },
      },
      {
        $group: {
          _id: "$governorate",
          count: { $sum: 1 },
          listings: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { _id: 1 }, // sort alphabetically by governorate
      },
    ]);

    if (!listings) {
      return res.status(404).json({
        status: "Failed",
        message: "No Listings Found",
      });
    }

    return res.status(200).json({
      status: "Success",
      data: listings,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

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

    if (!req.body) {
      return res.status(400).json({
        status: "Failed",
        message: "Body Is Empty",
      });
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
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      };
    }

    if (req.files?.length > 0) {
      updateData.photos = req.files.map((file) => file.path); // or cloudinary URLs
    }

    await listModel.findByIdAndUpdate(id, updateData, {
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
    const {
      title,
      description,
      price,
      date,
      location,
      amenities,
      governorate,
    } = req?.query;
    const query = {
      isApproved: true,
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
