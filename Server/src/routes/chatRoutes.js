import { Router } from "express";
import { createRoom, getMessage } from "../controllers/chatController.js";
import { isUserLoggedIn } from "../middlewares/authentication.middleware.js";

const router = Router();

router 
    .use(isUserLoggedIn)
    
router
    .route('/create-room')
    .post(createRoom)

router
    .route('/:roomId')
    .get(getMessage)

export default router