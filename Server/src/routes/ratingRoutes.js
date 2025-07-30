import { Router } from "express";
import {
  getRatingsForListing,
  guestRate,
  removeExistingRating,
} from "../controllers/ratingController.js";
import { isUserLoggedIn } from "../middlewares/authentication.middleware.js";
import { userPermission } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(isUserLoggedIn);

router.route("/:bookingId").post(userPermission("guest"), guestRate);

router
  .route("/listing/:listingId")
  .get(userPermission("admin", "host"), getRatingsForListing);

router
  .route('/:ratingId')
  .delete(userPermission('admin','guest'),removeExistingRating)

export default router;
