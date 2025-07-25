import { Router } from "express";
import { isUserLoggedIn, userPermission } from "../controllers/authControllers.js";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/categoryController.js";

const router = Router();

router
    .use(isUserLoggedIn,userPermission('admin'));

router
    .route('/')
    .post(createCategory)
    .get(getAllCategories);

router
    .route('/:id')
    .patch(updateCategory)
    .delete(deleteCategory);

export default router