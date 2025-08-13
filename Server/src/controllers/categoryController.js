import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import categoryModel from "../models/categoryModel.js";
import AppError from "../utilities/appError.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new AppError("Category Name Is Required", 400);

  const category = await categoryModel.create({ name });

  res.status(201).json({
    status: "Success",
    message: "Category Created Successfully",
    category,
  });
}); 

export const getAllCategories = asyncHandler(async (req, res) => {

  const categories = await categoryModel.find();
  if (!categories || categories.length === 0)
    throw new AppError("No Categories Found", 404);

  res.status(200).json({
    status: "Success",
    data: categories,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) throw new AppError("Id of Category Is Required", 400);
  if (!name) throw new AppError("Category Name Is Required", 400);

  const category = await categoryModel.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  );

  if (!category) throw new AppError("Category Not Found", 404);

  res.status(200).json({
    status: "Success",
    message: "Category Updated Successfully",
    category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new AppError("Id of Category Is Required", 400);

  const category = await categoryModel.findById(id);
  if (!category) throw new AppError("Category Not Found", 404);

  await categoryModel.deleteOne({ _id: id });

  res.status(200).json({
    status: "Success",
    message: "Category Deleted Successfully",
  });
});
