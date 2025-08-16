import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import AppError from "../utilities/appError.js";
import { addDocs, askQuestion } from "../utilities/RAGCycle.js";

export const uploadDocument = asyncHandler(async (req, res) => {
    const { documents } = req.body;

    if (!Array.isArray(documents)) {
        throw new AppError("Documents must be an array", 400);
    }

    await addDocs(documents);

    res.status(200).json({
        status: "Success",
        message: `${documents.length} Documents uploaded and indexed`,
    });
});

export const setQuery = asyncHandler(async (req, res) => {
    const { question } = req.body;

    if (!question) {
        throw new AppError("Question is required", 400);
    }

    const answer = await askQuestion(question);

    res.status(200).json({
        status: "Success",
        answer,
    });
});