import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllGuestBooking,
  getAllHostListingBooked,
  getBookingById,
  getBookingsList,
  getCheckout,
  prepareCheckOut,
  updateBooking,
} from "../controllers/bookingControllers.js";
import { userPermission } from "../middlewares/authorization.middleware.js";
import { isUserLoggedIn } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.use(isUserLoggedIn);

router.post("/checkout-session/:listId", prepareCheckOut, getCheckout);

router
  .route("/guest")
  .get(userPermission("admin", "guest"), getAllGuestBooking);

router
  .route("/host")
  .get(userPermission("admin", "host"), getAllHostListingBooked);

router
  .route("/host/:listingId")
  .get(userPermission("admin", "host"), getBookingsList);

router
  .route("/:listingId")
  .post(userPermission("admin", "guest"), createBooking);

router
  .route("/:bookingId")
  .get(userPermission("admin", "guest"), getBookingById)
  .patch(userPermission("admin", "guest"), updateBooking)
  .delete(userPermission("admin", "guest"), deleteBooking);

export default router;
