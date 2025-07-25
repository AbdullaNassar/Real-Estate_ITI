import express from 'express'
import { isUserLoggedIn, userPermission } from '../controllers/authControllers.js';
import { 
    createBooking,
    deleteBooking,
    getAllGuestBooking,
    getAllHostListingBooked,
    getBookingById,
    updateBooking
        } from '../controllers/bookingControllers.js';

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
    .route('/:id')
    .post(userPermission("admin","guest"),createBooking)
    .get(userPermission("admin","guest"),getBookingById)
    .patch(userPermission("admin","guest"),updateBooking)
    .delete(userPermission("admin","guest"),deleteBooking)

export default router;