import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import amenityModel from "../models/amenityModel.js";
import AppError from "../utilities/appError.js";

export const createAmenity = asyncHandler(async (req, res, next) => {
  const { name, icon } = req.body;

  if (!name) {
    return next(new AppError({en:"Amenity name is required",ar:"اسم الخدمة مطلوب"}, 400));
  }

  const isExisting = await amenityModel.findOne({ name });
  if (isExisting) {
    return next(new AppError({en:"This amenity already exists",ar:"هذه الميزة موجودة بالفعل"}, 400));
  }

  const amenity = await amenityModel.create({ name, icon });

  res.status(201).json({
    status: "success",
    message: {en:"Amenity created successfully",ar:"تم إنشاء الخدمة بنجاح"},
    data: amenity,
  });
});

export const getAllAmenities = asyncHandler(async (req, res, next) => {
  const amenities = await amenityModel.find();

  res.status(200).json({
    status: "success",
    data: amenities,
  });
});

export const updateAmenity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, icon } = req.body;

  if (!id) {
    return next(new AppError({ en: "Amenity ID is required", ar: "مطلوب رقم تعريف وسيلة الراحة" },400));
  }

  const amenity = await amenityModel.findById(id);
  if (!amenity) {
    return next(
    new AppError(
      { en: "Amenity not found", ar: "لم يتم العثور على وسيلة الراحة" },
      404
    )
  );
  }

  const newAmenity = await amenityModel.findByIdAndUpdate(
    id,
    { name, icon },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    message: {en: "Amenity updated successfully",ar: "تم تحديث وسيلة الراحة بنجاح"},
    data: newAmenity,
  });
});

export const deleteAmenity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(
      new AppError(
        { en: "Amenity ID is required", ar: "مطلوب رقم تعريف وسيلة الراحة" },
        400
      )
    );
  }

  const amenity = await amenityModel.findById(id);
  if (!amenity) {
    return next(
      new AppError(
        { en: "Amenity not found", ar: "لم يتم العثور على وسيلة الراحة" },
        404
      )
    );
  }

  await amenityModel.deleteOne({ _id: id });

  res.status(200).json({
    status: "success",
    message: {en: "Amenity deleted successfully",ar: "تم حذف وسيلة الراحة بنجاح"}
  });
});
