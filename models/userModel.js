const mongoose = require("mongoose");

const cloudinary = { url: String, img_id: String };
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
    Object: {
      type: cloudinary,
      default: {
        url: "https://upload.wikimedia.org/wikipedia/commons/4/41/Blank_Earth_Banner.jpg",
        img_id: "",
      },
    },
  },
  cover_img: {
    Object: {
      type: cloudinary,
      default: {
        url: "https://upload.wikimedia.org/wikipedia/commons/4/41/Blank_Earth_Banner.jpg",
        img_id: "",
      },
    },
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
