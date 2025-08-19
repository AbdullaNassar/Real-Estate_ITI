import express from "express";
import { isUserLoggedIn } from "../middlewares/authentication.middleware.js";
import { userPermission } from "../middlewares/authorization.middleware.js";
import { createMessage, getMessages } from "../controllers/contactUsController.js";

const router = express.Router();

router
    .use(isUserLoggedIn);

router
    .route('/')
    .post(createMessage);

router
    .route('/')
    .get( userPermission("admin"), getMessages);

export default router;