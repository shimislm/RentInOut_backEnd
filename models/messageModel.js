const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    name: String,
    roomID: String,
    owner:{
        owner_id: String,
        fullName: String
    },
    user: {
        user_id: String,
        fullName: String
    },
    messages: [],
})

exports.MessageModel = mongoose.model("message", messageSchema);