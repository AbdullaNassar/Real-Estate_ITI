import {v4 as uuidv4} from 'uuid'
import roomModel from '../models/chatRoomModel.js';
import messageModel from '../models/chatMessageModel.js';
import { asyncHandler } from '../middlewares/asyncHandlerError.middleware.js';
import AppError from '../utilities/appError.js';

export const createRoom = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new AppError("User not authenticated", 401);
    }

    const roomId = uuidv4();

    const newRoom = await roomModel.create({ userId, roomId });

    res.status(201).json({
        status: "Success",
        message: "Room Created",
        data: newRoom,
    });
});

export const getMessage = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        throw new AppError("Room ID is required", 400);
    }

    const messages = await messageModel.find({ roomId }).sort({ createdAt: 1 });

    if (!messages || messages.length === 0) {
        throw new AppError("No messages found for this room", 404);
    }

    res.status(200).json({
        status: "Success",
        results: messages.length,
        data: messages,
    });
});