const Joi = require("joi");

exports.validateUser = (_reqBody) => {
    let joiSchema = Joi.object({
        fullName: {
            firstName:Joi.string().min(2).max(25).required(),
            LastName: Joi.string().min(2).max(25).required(), 
          },
        name: Joi.string().min(2).max(25).required(),
        email: Joi.string().email().min(2).max(25).required(),
        password: Joi.string().min(2).max(25).required(),
        phone: Joi.string().min(2).max(15).required()
    })
    return joiSchema.validate(_reqBody);
}

exports.validateUserLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().email().min(2).max(35).required(),
        password: Joi.string().min(2).max(25).required()
    })

    return joiSchema.validate(_reqBody);
}