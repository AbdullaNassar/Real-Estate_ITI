import { Server } from "socket.io";
import messageModel from "../models/chatMessageModel.js";

let io;
export const initSocket = (server)=>{
    io = new Server(server,{
        cors:{
            origin:"*",
            methods:["GET","POST"]
        }
    })

    io.on('connection',(socket)=>{
        console.log("New client connected:", socket.id);

        socket.on('joinRoom',(roomId)=>{
            socket.join(roomId);

            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });

        socket.on('sendMessage', async (data)=>{
            const {roomId,sender,message} = data;

            await messageModel.create((roomId,sender,message));

            io.to(roomId).emit("receiveMessage",{sender,message})
        });

        socket.on('disconnect',()=>{
            console.log("Client disconnected:", socket.id);
        });
    });
    return io;
}