const mongoose = require("mongoose");

const rank = {
  user_id: String,
  rank: Number,
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
  profile_img: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
  },
  cover_img: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/4/41/Blank_Earth_Banner.jpg",
  },
  country: String,
  city: String,
  birthdate: Date,
  role: {
    type: String,
    default: "user",
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
});

exports.UserModel = mongoose.model("users", userSchema);
