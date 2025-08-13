import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import amenityModel from "../models/amenityModel.js";
import AppError from "../utilities/appError.js";

export const createAmenity = asyncHandler(async (req, res, next) => {
  const { name, icon } = req.body;

  if (!name) {
    return next(new AppError("Amenity name is required", 400));
  }

  const isExisting = await amenityModel.findOne({ name });
  if (isExisting) {
    return next(new AppError("This amenity already exists", 400));
  }

  const amenity = await amenityModel.create({ name, icon });

  res.status(201).json({
    status: "success",
    message: "Amenity created successfully",
    data: amenity,
  });
});

export const getAllAmenities = asyncHandler(async (req, res, next) => {
  const amenities = await amenityModel.find();

  if (!amenities || amenities.length === 0) {
    return next(new AppError("No amenities found", 404));
  }

  res.status(200).json({
    status: "success",
    data: amenities,
  });
});

export const updateAmenity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, icon } = req.body;

  if (!id) {
    return next(new AppError("Amenity ID is required", 400));
  }

  const amenity = await amenityModel.findById(id);
  if (!amenity) {
    return next(new AppError("Amenity not found", 404));
  }

  const newAmenity = await amenityModel.findByIdAndUpdate(
    id,
    { name, icon },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    message: "Amenity updated successfully",
    data: newAmenity,
  });
});

export const deleteAmenity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Amenity ID is required", 400));
  }

  const amenity = await amenityModel.findById(id);
  if (!amenity) {
    return next(new AppError("Amenity not found", 404));
  }

  await amenityModel.deleteOne({ _id: id });

  res.status(200).json({
    status: "success",
    message: "Amenity deleted successfully",
  });
});
