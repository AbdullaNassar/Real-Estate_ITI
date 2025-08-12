import {v4 as uuidv4} from 'uuid'
import roomModel from '../models/chatRoomModel.js';
import messageModel from '../models/chatMessageModel.js';

export const createRoom = async(req,res)=>{
    try {
        const userId = req.user._id;
        const roomId = uuidv4();

        const newRoom = await roomModel.create({userId,roomId});

        return res.status(201).json({
            status:"Success",
            message:"Room Created",
            newRoom
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const getMessage = async(req,res)=>{
    try {
        const {roomId} = req.params;

        const message = await messageModel.find({roomId}).sort({createdAt: 1});

        return res.status(200).json({
            status:"Success",
            message
        })
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}