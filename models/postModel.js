
const mongoose = require("mongoose");
const likesObject = {
    user_id: String,
    profile: String,
    fullName: {
        firstName: String,
        lastName: String
    }
}
const postSchema = new mongoose.Schema({
    postName: String,
    info: String,
    img: String,
    range: {
        type: String,
        enum: ['long-term', 'short-term'],
        default: 'short-term'
    },
    creator_id: String,
    category_url: String,
    price: Number,
    type: {
        type: String,
        enum: ['rent', 'exchange', 'delivery'],
        default: 'rent'
    },
    collect_points: {
        type : Array(String),
        default : []
    },
    active: {
        type: Boolean,
        default: true
    },
    available_from: {
        type: Date,
        default: Date.now()
    },
    location: String,
    likes:{
        type: Array(likesObject),
        default: []
    }
},
    { timestamps: true });

exports.UserModel = mongoose.model("users", userSchema);
