import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import categoryModel from "../models/categoryModel.js";
import AppError from "../utilities/appError.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name , arName } = req.body;
  if (!name || !arName) {
    throw new AppError(
      { 
        en: "Category Name is required", 
        ar: "اسم التصنيف مطلوب" 
      }, 
      400
    );
  }

  const category = await categoryModel.create({ name , arName });

  res.status(201).json({
    status: "Success",
    message: { 
      en: "Category Created Successfully", 
      ar: "تم إنشاء التصنيف بنجاح" 
    },
    category,
  });
}); 

export const getAllCategories = asyncHandler(async (req, res) => {

  const categories = await categoryModel.find();

  res.status(200).json({
    status: "Success",
    data: categories,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) {
    throw new AppError(
      { 
        en: "Id of Category is required", 
        ar: "معرّف التصنيف مطلوب" 
      }, 
      400
    );
  }
  if (!name) {
    throw new AppError(
      { 
        en: "Category Name is required", 
        ar: "اسم التصنيف مطلوب" 
      }, 
      400
    );
  }

  const category = await categoryModel.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  );

  if (!category) {
    throw new AppError(
      { 
        en: "Category not found", 
        ar: "لم يتم العثور على التصنيف" 
      }, 
      404
    );
  }

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Category Updated Successfully", 
      ar: "تم تحديث التصنيف بنجاح" 
    },
    category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError(
      { 
        en: "Id of Category is required", 
        ar: "معرّف التصنيف مطلوب" 
      }, 
      400
    );
  }

  const category = await categoryModel.findById(id);

  if (!category) {
    throw new AppError(
      { 
        en: "Category not found", 
        ar: "لم يتم العثور على التصنيف" 
      }, 
      404
    );
  }

  await categoryModel.deleteOne({ _id: id });

  res.status(200).json({
    status: "Success",
    message: { 
      en: "Category Deleted Successfully", 
      ar: "تم حذف التصنيف بنجاح" 
    }
  });
});
