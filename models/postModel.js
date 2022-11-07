const mongoose = require("mongoose");
// helper object for likes
const likesObject = {
    user_id: String,
    profile: String,
    fullName: {
        firstName: String,
        lastName: String
    }
}
const postSchema = new mongoose.Schema({
    title: String,
    info: String,
    img: String,
    range: {
        type: String,
        enum: ['long-term', 'short-term'],
        default: 'short-term'
    },
    creator_id: String,
    category_url : {
        type : String,
        default : "skate"
    },
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
        default: new Date(Date.now() +2 * 60 * 60 * 1000)
    },
    location: String,
    likes:{
        type: Array(likesObject),
        default: []
    },
    craetedAt :{
        type: Date,
        default: new Date(Date.now() +2 * 60 * 60 * 1000)
    },
    updatedAt :{
        type: Date,
        default: new Date(Date.now() +2 * 60 * 60 * 1000)
    }
});

exports.PostModel = mongoose.model("posts", postSchema);
