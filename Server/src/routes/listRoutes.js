import express from 'express'
import { isUserLoggedIn,userPermission } from '../controllers/authControllers.js';
import { approvedListing, createList, deleteList, getListById, readLists, searchLists, updateList } from '../controllers/listControllers.js';

const router = express.Router();

router
    .route('/')
    .get(readLists)

router
    .route('/search')
    .get(searchLists)
    
router
    .route('/:id')
    .get(getListById)

router
    .use(isUserLoggedIn)

router
    .route('/')
    .post(userPermission('host'),createList)

router
    .route('/:id')
    .patch(userPermission('admin','host'),updateList)
    .delete(userPermission('admin','host'),deleteList)

router
    .route('/approved/:id')
    .patch(approvedListing);
    
export default router;

