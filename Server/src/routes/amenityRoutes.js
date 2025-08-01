import { Router } from "express";
import {
  createAmenity,
  deleteAmenity,
  getAllAmenities,
  updateAmenity,
} from "../controllers/amenityController.js";
import { userPermission } from "../middlewares/authorization.middleware.js";
import { isUserLoggedIn } from "../middlewares/authentication.middleware.js";
import upload, {
  processAndUploadImages,
} from "../middlewares/uploadImage.middleware.js";

const router = Router();

// router.use(isUserLoggedIn, userPermission("admin"));

router
  .route("/")
  .post(
    upload.single("icon"),
    processAndUploadImages({
      singleField: "icon",
      resize: false, // Don't resize icons
      folderMap: { icon: "amenity-icons" }, // Store icons in a dedicated folder
    }),
    createAmenity
  )
  .get(getAllAmenities);

router
  .route("/:id")
  .patch(
    upload.single("icon"),
    processAndUploadImages({
      singleField: "icon",
      resize: false, // Don't resize icons
      folderMap: { icon: "amenity-icons" }, // Store icons in a dedicated folder
    }),
    updateAmenity
  )
  .delete(deleteAmenity);

export default router;
