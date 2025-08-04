import Router from 'express'
import { setQuery, uploadDocument } from '../controllers/RAGChatBoot.js';

const router = Router();

router
    .route('/upload-docs')
    .post(uploadDocument);

router
    .route('/query')
    .post(setQuery);

export default router;