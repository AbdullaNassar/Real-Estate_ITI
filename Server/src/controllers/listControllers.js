import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import listModel from "../models/listModel.js";
import AppError from "../utilities/appError.js";

export const createList = asyncHandler(async (req, res) => {
  const {
    title,
    arTitle,
    descrption,
    arDescrption,
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

  // Validate required fields
  if (
    !title ||
    !arTitle||
    !descrption ||
    !arDescrption||
    !pricePerNight ||
    !longitude ||
    !latitude ||
    !address ||
    !maxGustes ||
    !photos ||
    !governorate
  ) {
    throw new AppError("All required fields must be provided", 400);
  }

  // Validate photo count
  if (photos.length !== 5) {
    throw new AppError(
      `Listing must have exactly 5 images, you uploaded ${photos.length}`,
      400
    );
  }

  const list = await listModel.create({
    host: req.user._id,
    title,
    arTitle,
    descrption,
    arDescrption,
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
    status: "success",
    message: "Listing created successfully",
    data: list,
  });
});

export const readLists = asyncHandler(async (req, res) => {
  const { sort } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const allowedFilters = ["governorate", "categoryId"];
  const filters = {};

  allowedFilters.forEach((key) => {
    if (req.query[key]) filters[key] = req.query[key];
  });

  const queryBody = {
    ...filters,
  };

  // Search logic
  if (req.query.listings && req.query.listings == "approved") {
    queryBody.isApproved = true;
  } else if (req.query.listings && req.query.listings == "notApproved") {
    queryBody.isApproved = false;
  }

  // Price filter
  if (req.query.price && !isNaN(req.query.price)) {
    queryBody.pricePerNight = { $lte: +req.query.price };
  }

  //search
  if (req.query.query) {
    const searchRegex = new RegExp(req.query.query, "i");
    queryBody.$or = [
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { governorate: { $regex: searchRegex } },
    ];
  }

  // Date range filter
  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new AppError("Invalid date format for startDate or endDate", 400);
    }

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
    status: "success",
    total: totalDocs,
    results: listings.length,
    data: listings,
  });
});

export const getListById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new AppError("Listing Id Is Required", 400);

  const list = await listModel
    .findOne({ _id: id })
    .populate("host categoryId amenitiesId");

  if (!list) throw new AppError("Listing Not Found", 404);

  return res.status(200).json({
    status: "Success",
    data: list,
  });
});

export const getListingsByGovernorate = asyncHandler(async (req, res, next) => {
  const listings = await listModel.aggregate([
    { $match: { isApproved: true } },
    {
      $group: {
        _id: "$governorate",
        count: { $sum: 1 },
        listings: { $push: "$$ROOT" },
      },
    },
    { $sort: { _id: 1 } }, // Sort alphabetically by governorate
  ]);

  if (!listings || listings.length === 0) {
    return next(new AppError("No Listings Found", 404));
  }

  res.status(200).json({
    status: "success",
    results: listings.length,
    data: listings,
  });
});

export const updateList = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Listing ID is required", 400));
  }

  const host = req.user._id;

  const list = await listModel.findById(id);

  if (!list) {
    return next(new AppError("List not found", 404));
  }

  if (list.host.toString() !== host.toString()) {
    return next(
      new AppError("You are not authorized to update this list", 403)
    );
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new AppError("Request body is empty", 400));
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
    photos,
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

  if (photos) {
    updateData.photos = photos;
  }

  if (address && longitude && latitude) {
    updateData.location = {
      address,
      coordinates: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    };
  }

  await listModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Listing updated successfully",
  });
});

export const deleteList = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Listing ID is required", 400));
  }

  const host = req.user._id;

  const list = await listModel.findById(id);

  if (!list) {
    return next(new AppError("List not found", 404));
  }

  if (list.host.toString() !== host.toString()) {
    return next(
      new AppError("You are not authorized to delete this list", 403)
    );
  }

  await listModel.deleteOne({ _id: id });

  res.status(200).json({
    status: "success",
    message: "List deleted successfully",
  });
});

export const searchLists = asyncHandler(async (req, res, next) => {
  const keyword = req.query.query?.trim();

  if (!keyword || keyword.length < 3) {
    return next(new AppError("You must enter at least 3 characters", 400));
  }

  const searchRegex = new RegExp(keyword, "i");

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const filter = {
    isApproved: true,
    $or: [
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { governorate: { $regex: searchRegex } },
    ],
  };

  const totalDocs = await listModel.countDocuments(filter);

  const lists = await listModel
    .find(filter)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: totalDocs,
    page,
    limit,
    data: lists,
  });
});

export const approvedListing = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Listing ID is required", 400));
  }

  const listing = await listModel.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true, runValidators: true }
  );

  if (!listing) {
    return next(new AppError("Listing not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Listing approved successfully",
    data: listing,
  });
});

export const HostLists = asyncHandler(async (req, res, next) => {
  const lists = await listModel
    .find({ host: req.user._id })
    .populate("categoryId");

  if (!lists || lists.length === 0) {
    return next(new AppError("No listings found for this host", 404));
  }

  res.status(200).json({
    status: "success",
    results: lists.length,
    lists,
  });
});
