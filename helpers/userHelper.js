
const jwt = require("jsonwebtoken");
const { config } = require('../config/config');

exports.createToken = (_id, role) =>{
    let token = jwt.sign({_id,role}, config.tokenSecret,{expiresIn:"180mins"})
    return token;
}
const currentUrl = "http://localhost:3000"

exports.mailOptions = (_id,_uniqueString,_email) => {
  console.log(currentUrl)
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: _email,
      subject: "Verify Your Email",
      html: `<p>Verify Your Email </p><p> click <a href=${currentUrl+"/users/verified/"+_id+"/"+_uniqueString}> here</a></p>`
    };
  
  return mailOptions;
  }