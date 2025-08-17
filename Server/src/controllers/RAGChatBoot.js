import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import AppError from "../utilities/appError.js";
import { addDocs, askQuestion } from "../utilities/RAGCycle.js";

export const uploadDocument = asyncHandler(async (req, res) => {
    const { documents } = req.body;

    if (!Array.isArray(documents)) {
        throw new AppError(
            { 
                en: "Documents must be an array", 
                ar: "يجب أن تكون المستندات مصفوفة" 
            }, 
            400
        );
    }

    await addDocs(documents);

    res.status(200).json({
        status: "Success",
        message: { 
            en: `${documents.length} documents uploaded and indexed`, 
            ar: `تم رفع وفهرسة ${documents.length} مستندات` 
        },
    });
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