import { Router } from "express";
import {
  addRating,
  editExistingRating,
  getRatingsForListing,
  getRatingsForUser,
  removeExistingRating,
} from "../controllers/ratingController.js";
import { isUserLoggedIn } from "../middlewares/authentication.middleware.js";
import { userPermission } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(isUserLoggedIn);

router
  .route('')
  .get(userPermission('admin','guest'),getRatingsForUser);

router.route("/:bookingId").post(userPermission("guest"), addRating);

router
  .route("/listing/:listingId")
  .get(userPermission("admin", "host"), getRatingsForListing);

router
  .route('/:ratingId')
  .patch(userPermission('admin','guest'),editExistingRating)
  .delete(userPermission('admin','guest'),removeExistingRating)

export default router;
