import { Router } from "express";
import { createAmenity, deleteAmenity, getAllAmenities, updateAmenity } from "../controllers/amenityController.js";
import { userPermission } from "../middlewares/authorization.middleware.js";
import { isUserLoggedIn } from "../middlewares/authentication.middleware.js";

const router = Router();

router
    .use(isUserLoggedIn,userPermission('admin'));

router
    .route('/')
    .post(createAmenity)
    .get(getAllAmenities)

router
    .route('/:id')
    .patch(updateAmenity)
    .delete(deleteAmenity)

export default router