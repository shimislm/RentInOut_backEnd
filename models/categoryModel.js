const mongoose =require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name:String,
  url_name:String,
  info:String,
  img_url:String
})



exports.CategoryModel = mongoose.model("categories",categorySchema);


