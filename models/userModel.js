
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: String,
    lastName: String,
  },
  email: String,
  password: String,
  password_changed: Date,
  phone: String,
  profile_img: String,
  cover_img: String,
  location: String,
  birtdate: Date,
  role:{
      type: String,
      default: "user",
  },
  active:{
    type: Boolean,
    default: true
  },
  rank:{
    type:Number,
    default: 10
  },
  bio: String,
  productsList: {
    type: [String],
    default: []
  },
},
{
  timestamps: true
}
);

exports.UserModel = mongoose.model("users", userSchema);
