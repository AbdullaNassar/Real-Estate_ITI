import express from 'express';
import {
            changePassword,
            deleteAllUsers,
            deleteUser,
            getAllUsers,
            requestPasswordReset,
            resendOTP,
            resetPassword,
            updateUser,
            verifyOTP
        } from '../controllers/userControllers.js';
import { login, signUp } from '../controllers/authControllers.js';
import { isUserLoggedIn } from '../middlewares/authentication.middleware.js';
import { userPermission } from '../middlewares/authorization.middleware.js';
import upload, { processAndUploadImages } from '../middlewares/uploadImage.middleware.js';

const router = express.Router();

router
    .route('/login')
    .post(login)

router
    .route('/signup')
    .post(signUp)

router
    .route('/verify-otp')
    .post(verifyOTP)

router
    .route('/request-password-reset')
    .post(requestPasswordReset);

router
    .route('/reset-password')
    .post(resetPassword);

router
    .route('/resend-otp')
    .post(resendOTP);

router
    .route('/all')
    .get(isUserLoggedIn,userPermission('admin'),getAllUsers)
    .delete(isUserLoggedIn,userPermission('admin'),deleteAllUsers);

router
    .route('/')
    .patch(
        isUserLoggedIn,
        upload.single('profilePic'),
        processAndUploadImages('profilePictures'),
        updateUser
    )
    .delete(isUserLoggedIn,deleteUser);

router
    .route('/change-password')
    .patch(isUserLoggedIn,changePassword);


export default router;
