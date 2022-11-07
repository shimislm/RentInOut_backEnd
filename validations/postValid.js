const { string } = require("joi");
const Joi = require("joi");

exports.validatePost = (_reqBody) => {
  let joiSchema = Joi.object({
    postName : Joi.string().min(2).max(50).required(),
    info : Joi.string().min(2).max(1500).required(),
    img : Joi.string().min(2).max(3000).required(),
    range : Joi.string().valid('long-term','short-term').allow(null,""),
    category_url : Joi.string().min(2).max(100).required(),
    price : Joi.number().min(1).max(10000000).required(),
    type : Joi.string().valid('rent','exchange','delivery').allow(null,""),
    available_from : Joi.date().min(2).max(50).allow(null,""),
    location : Joi.string().min(2).max(50).required(),
  });
  return joiSchema.validate(_reqBody);
};