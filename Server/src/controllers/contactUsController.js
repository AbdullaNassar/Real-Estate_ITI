import { asyncHandler } from "../middlewares/asyncHandlerError.middleware.js";
import contactModel from "../models/contactUsModel.js";
import AppError from "../utilities/appError.js";

export const createMessage = asyncHandler(async (req, res, next) => {

    const user = req.user._id;

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return next(
        new AppError(
            { en: "All fields are required", ar: "جميع الحقول مطلوبة" },
            400
        )
        );
    }

    const newMessage = await contactModel.create({ user , name, email, subject, message });

    res.status(201).json({
        status: "success",
        message: {
            en: "Message sent successfully",
            ar: "تم إرسال الرسالة بنجاح",
        },
        data: newMessage,
    });
});

export const getMessages = asyncHandler(async (req, res, next) => {
    const messages = await contactModel.find().populate("user", "userName email").sort({ createdAt: -1 });

    res.status(200).json({
        status: "success",
        results: messages.length,
        data: messages,
    });
});