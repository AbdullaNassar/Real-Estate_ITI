import { Router } from "express";
import { isUserLoggedIn, userPermission } from "../controllers/authControllers.js";
import { createAmenity, deleteAmenity, getAllAmenities, updateAmenity } from "../controllers/amenityModel.js";

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