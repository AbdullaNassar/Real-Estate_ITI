import express from 'express'
import { 
    createBooking,
    deleteBooking,
    getAllGuestBooking,
    getAllHostListingBooked,
    getBookingById,
    updateBooking
        } from '../controllers/bookingControllers.js';
import { userPermission } from '../middlewares/authorization.middleware.js';
import { isUserLoggedIn } from '../middlewares/authentication.middleware.js';

const router = express.Router();

router
    .use(isUserLoggedIn)

router
    .route('/guest')
    .get(userPermission("admin","guest"),getAllGuestBooking)

router
    .route('/host')
    .get(userPermission("admin","host"),getAllHostListingBooked)

router 
    .route('/:listingId')
    .post(userPermission("admin","guest"),createBooking)
    .get(userPermission("admin","guest"),getBookingById)
    .patch(userPermission("admin","guest"),updateBooking)
    .delete(userPermission("admin","guest"),deleteBooking)

export default router;