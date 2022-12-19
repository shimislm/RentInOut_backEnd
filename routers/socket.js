const { MessageModel } = require("../models/messageModel");

exports.sockets = (socket) => {
    socket.on("send-messege",({message , roomID , userName})=>{
        console.log(userName)
        socket.to(roomID).emit('messege-back', {message , userName});
    })
    socket.on("typing-start",({roomID})=>{
        socket.to(roomID).emit("recieve-typing");
    })
    socket.on("typing-end",({roomID})=>{
        socket.to(roomID).emit("notRecieve-typing");
    })
    socket.on("join-room",({roomID})=>{
        socket.join(roomID);
    })
    socket.on('disconnect', ({roomID , userId})=>{
        let chatMessage = MessageModel.findOne({id:roomID})
        if(chatMessage){
            
        }
    })
}
