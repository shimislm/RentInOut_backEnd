const mongoose = require("mongoose");
const messageObj ={
    sender: String,
    userName:String,
    message: String
}

const messageSchema = new mongoose.Schema({
    name: String,
    img: String,
    roomID: String,
    creatorID: String,
    messagesArr:[messageObj]
})

exports.MessageModel = mongoose.model("messages", messageSchema);