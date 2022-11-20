const mongoose = require("mongoose");
const rank = {
  user_id: String,
  rank: Number
};
const userSchema = new mongoose.Schema({
  fullName: {
    firstName: String,
    lastName: String,
  },
  email: String,
  password: String,
  password_changed: Date,
  phone: String,
  profile_img:{
    type: String,
    default: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
  },
  cover_img: String,
  location: String,
  birthdate: Date,
  role: {
    type: String,
    default: "user"
  },
  active: {
    type: Boolean,
    default: false,
  },
  rank: {
    type: Array(rank),
    default: [],
  },
  productsList: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
  updatedAt: {
    type: Date,
    default: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
  refreshToken : String

});

exports.UserModel = mongoose.model("users", userSchema);
