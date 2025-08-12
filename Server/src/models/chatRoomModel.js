import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
    roomId:{
        type:String,
        required:[true, "Room ID Is Required"],
        unique:[true,"Room ID Must Be Unique"]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"User Id Is required"]
    },
    supportId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
        // required:[true,"Support Id Is Required"]
    }
},{timestamps:true})

const roomModel = mongoose.model('ChatRoom',chatRoomSchema);

export default roomModel;