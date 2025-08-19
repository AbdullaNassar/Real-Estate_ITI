import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import AppError from "../utilities/appError.js";
import processDocument from "../utilities/documentProcessor.js";
import { addDocs, askQuestion } from "../utilities/RAGCycle.js";

export const uploadDocument = asyncHandler(async (req, res) => {
        
        let documents = [];
        
        // Handle multipart form data (file uploads)
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const text = await processDocument(file);
                documents.push(text);
            }
        } 
        // Handle JSON data
        else if (req.is('application/json')) {
            if (!req.body || !req.body.documents) {
                throw new AppError(
                    { 
                        en: "Request must include 'documents' field in JSON format", 
                        ar: "يجب أن يتضمن الطلب حقل المستندات بتنسيق JSON" 
                    }, 
                    400
                );
            }
            documents = req.body.documents;
        } 
        // Handle URL-encoded form data
        else if (req.is('application/x-www-form-urlencoded')) {
            if (!req.body.documents) {
                throw new AppError(
                    { 
                        en: "Request must include 'documents' field in form data", 
                        ar: "يجب أن يتضمن الطلب حقل المستندات بتنسيق JSON" 
                    }, 
                    400
                );
            }
            documents = req.body.documents;
        }
        
        // Ensure documents is an array
        if (typeof documents === 'string') {
            try {
                documents = JSON.parse(documents);
            } catch (e) {
                documents = [documents];
            }
        }
        
        if (!Array.isArray(documents)) {
            documents = [documents];
        }

        if (documents.length === 0) {
            throw new AppError(
                    { 
                        en: "No documents provided", 
                        ar: "لم يتم تقديم أي وثائق" 
                    }, 
                    400
                );
        }

        await addDocs(documents);
        res.json({ message: "Documents uploaded and indexed" });
});

export const setQuery = asyncHandler(async (req, res) => {
    const { question } = req.body;

    if (!question) {
        throw new AppError(
            { 
                en: "Question is required", 
                ar: "السؤال مطلوب" 
            }, 
            400
        );
    }

    const answer = await askQuestion(question);

    res.status(200).json({
        status: "Success",
        answer,
    });
});