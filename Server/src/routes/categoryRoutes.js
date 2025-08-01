import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { isUserLoggedIn } from "../middlewares/authentication.middleware.js";
import { userPermission } from "../middlewares/authorization.middleware.js";

const router = Router();

// router.use(isUserLoggedIn, userPermission("admin"));

router.route("/").post(createCategory).get(getAllCategories);

router.route("/:id").patch(updateCategory).delete(deleteCategory);

export default router;
