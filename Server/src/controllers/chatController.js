import {v4 as uuidv4} from 'uuid'
import roomModel from '../models/chatRoomModel.js';
import messageModel from '../models/chatMessageModel.js';
import { asyncHandler } from '../middlewares/asyncHandlerError.middleware.js';
import AppError from '../utilities/appError.js';

export const createRoom = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new AppError(
        { 
            en: "User not authenticated", 
            ar: "المستخدم غير مصرح له" 
        }, 
        401
        );
    }

    const roomId = uuidv4();

    const newRoom = await roomModel.create({ userId, roomId });

    res.status(201).json({
        status: "Success",
        message: { 
        en: "Room Created", 
        ar: "تم إنشاء الغرفة" 
        },
        data: newRoom,
    });
});

export const getMessage = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        throw new AppError(
        { 
            en: "Room ID is required", 
            ar: "معرّف الغرفة مطلوب" 
        }, 
        400
        );
    }

    const messages = await messageModel.find({ roomId }).sort({ createdAt: 1 });

    if (!messages || messages.length === 0) {
        throw new AppError(
        { 
            en: "No messages found for this room", 
            ar: "لا توجد رسائل لهذه الغرفة" 
        }, 
        404
        );
    }

    res.status(200).json({
        status: "Success",
        results: messages.length,
        data: messages,
    });
});