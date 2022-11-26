const mongoose =require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name:String,
  url_name:String,
  info:String,
  img_url:String,
  craetedAt :{
    type: Date,
    default: new Date(Date.now() +2 * 60 * 60 * 1000)
},
updatedAt :{
    type: Date,
    default: new Date(Date.now() +2 * 60 * 60 * 1000)
},
creator_id: String,
editor_id: {
    type: String,
    default: creator_id
}
})



exports.CategoryModel = mongoose.model("categories",categorySchema);


