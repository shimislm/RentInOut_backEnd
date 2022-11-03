
const jwt = require("jsonwebtoken");
const { config } = require('../config/config');

exports.createToken = (_id, role) =>{
    let token = jwt.sign({_id,role}, config.tokenSecret,{expiresIn:"180mins"})
    return token;
}