
const jwt = require("jsonwebtoken");
const { config, DOMAIN } = require('../config/config');

exports.createToken = (_id, role) =>{
    let token = jwt.sign({_id,role}, config.tokenSecret,{expiresIn:"180mins"})
    return token;
}
/** Get the props: who to where and mail context */
exports.mailOptions = (_id,_uniqueString,_email) => {
    const firstName = _email.split("@")[0];
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: _email,
      subject: "Verify Your Email",
      html: `<h2>Hello ${firstName}!</h2><p>Please verify Your Email </p><p> click <a href=${DOMAIN+"/users/verified/"+_id+"/"+_uniqueString}> here</a></p>`
    };
  
  return mailOptions;
  }