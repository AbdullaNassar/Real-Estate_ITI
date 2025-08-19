import Router from 'express'
import { setQuery, uploadDocument } from '../controllers/RAGChatBoot.js';
import upload from '../utilities/multerForRAG.js';

const router = Router();

router
    .route('/upload-docs')
    .post(upload.array('documents',5),uploadDocument);

router
    .route('/query')
    .post(setQuery);

export default router;