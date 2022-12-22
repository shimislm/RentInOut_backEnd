const mongoose = require("mongoose");
const messageObj ={
    sender: String,
    img: String,
    userName:String,
    message: String
}

const messageSchema = new mongoose.Schema({
    name: String,
    roomID: String,
    creatorID: String,
    messagesArr:[messageObj]
})

exports.MessageModel = mongoose.model("messages", messageSchema);