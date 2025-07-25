import { Router } from "express";
import { getRatingsForListing, guestRate } from "../controllers/ratingController.js";
import { isUserLoggedIn, userPermission } from "../controllers/authControllers.js";

const router = Router();

router
    .use(isUserLoggedIn);

router
    .route('/:bookingId')
    .post(userPermission('guest'),guestRate);

router
    .route('/listing/:listingId')
    .get(userPermission('admin','host'),getRatingsForListing);

export default router;