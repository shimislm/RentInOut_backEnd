
const jwt = require("jsonwebtoken");
const { config, DOMAIN } = require('../config/config');

exports.createToken = (_id, role) =>{
    let token = jwt.sign({_id,role}, config.tokenSecret,{expiresIn:"180mins"})
    return token;
}


exports.mailOptions = (_id,_uniqueString,_email) => {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: _email,
      subject: "Verify Your Email",
      html: `<p>Verify Your Email </p><p> click <a href=${DOMAIN+"/users/verify/"+_id+"/"+_uniqueString}> here</a></p>`
    };
  
  return mailOptions;
  }