import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    roomId:{
        type:String,
        required:[true,"Room Id Is Required"]
    },
    sender:{
        type:String,
        enum:["user","support"],
        required:[true,"Sender Is required"]
    },
    message:{
        type:String,
        required:[true,"Message Is Required"]
    }
},{timestamps:true});

const messageModel = mongoose.model('ChatMessage',chatMessageSchema);

export default messageModel;