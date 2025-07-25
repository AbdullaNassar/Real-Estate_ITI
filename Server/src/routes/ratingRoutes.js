import { Router } from "express";
import { getRatingsForListing, guestRate } from "../controllers/ratingController.js";
import { isUserLoggedIn } from "../controllers/authControllers.js";

const router = Router();

router
    .use(isUserLoggedIn);

router
    .route('/:bookingId')
    .post(guestRate);

router
    .route('/listing/:listingId')
    .get(getRatingsForListing);

export default router;