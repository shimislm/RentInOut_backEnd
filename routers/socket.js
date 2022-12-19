exports.sockets = (socket) => {
    socket.on("send-messege",({message , roomID})=>{
        socket.to(roomID).emit('messege-back', {message});
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
    socket.on('disconnect', (socket)=>{
        // console.log("Disconnect")
    })
}
