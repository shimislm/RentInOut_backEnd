const mongoose = require("mongoose");

const prodObj = {
  user_id: String,
  renatl_date: Date,
  title: String,
  img: String,
  category: String,
};
const massageObj = {sentDate:{
    type: Date,
    default: Date.now(),
}};
const chatObj = {
  self: { name: String, data: String, user_id: String },
  other: { name: String, data: String, user_id: String },
  messeges_ar: { 
    type: [massageObj],
    default: [] },
};

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: String,
    LastName: String,
  },
  email: String,
  password: String,
  phone: String,
  profile_img: String,
  cover_img: String,

  role: {
    type: String,
    default: "user",
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
  birtdate: Date,
  active: Boolean,
  renk: Number,
  bio: String,
  productsList: {
    type: [String],
    default: [],
  },
  location: String,
  rented_products: {
    type: [prodObj],
    default: [],
  },
  clicked_products: {
    type: [prodObj],
    default: [],
  },
  liked_products: {
    type: [prodObj],
    default: [],
  },
  chat_ar: {
    type: [chatObj],
    default: [],
  },
});

exports.UserModel = mongoose.model("users", userSchema);
