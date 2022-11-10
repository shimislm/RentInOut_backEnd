const bcrypt = require("bcrypt");
const { UserVerificationModel } = require("../models/UserVerificationModel");
const { PasswordReset} = require("../models/passwordReset")
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { DOMAIN, config } = require("../config/config");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.createToken = (_id, role) =>{
    let token = jwt.sign({_id,role}, config.tokenSecret,{expiresIn:"180mins"})
    return token;
}
const saltRounds = 10;
// import email props
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
});

const mailOptions = (_id,_uniqueString,_email , _subject , _html) => {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: _email,
      subject: _subject,
      html: _html
    };
  
  return mailOptions;
  }

exports.sendVerificationEmail = async({ _id, email }, res) => {
    // console.log("email " + email)
    // console.log("id " + _id)
    const uniqueString = uuidv4() + _id;
    const html =`<p>Verify Your Email </p><p> click <a href=${DOMAIN+"/users/verify/"+_id+"/"+uniqueString}> here</a></p>`
    
    // creat an unique string
    // create email options for spcific collection 
    let mail = mailOptions(_id,uniqueString,email , "Verify Your Email" , html);
    await bcrypt.hash(uniqueString, saltRounds)
    // hashed the unique string
      .then((hasheduniqueString) => {
        // create ne collection in verify user model
        const userVerification = new UserVerificationModel({
          userId: _id,
          uniqueString: hasheduniqueString,
        });
        userVerification.save()
          .then(() => {
            // send the email notification
            transporter.sendMail(mail, (err, info) => {
              if (err) {
                console.log(err);
              }
              console.log('Message sent: %s', info.response );
  
            })
          })
          .catch((error) => {
            console.log(error)
            res.json({
              status: "failed",
              message: "an error  cant save",
            });
          })
  
      })
  };
// redirect url is an frontend url were we reset password
  exports.sendResetEmail = async({_id , email} , redirectUrl , res )=>{
    const resetString = uuidv4() + _id;
    const html = `<p>We heard that you forgot your password.</p>
    <p>Don't worry, use the link below to reset it.</p>
    <p>This link <b>expires in 60min </b></p>
    <p>Press <a href=${redirectUrl +"/"+_id+"/"+ resetString}>here</a></p>`;
    // clear all existing request for the same user
    let mail = mailOptions(_id, resetString , email , "Password reset" , html)
    PasswordReset.deleteMany({userId : _id})
      .then( result =>{
        bcrypt.hash(resetString, saltRounds)
        // create new password request
          .then(hashedResetString => {
            const newPasswordReset = new PasswordReset({
              userId : _id,
              resetString : hashedResetString,
            })
            newPasswordReset.save()
            .then(() => {
              // send the email notification
              transporter.sendMail(mail , (err, info) => {
                res.json({
                  status: "Pending",
                  message: "Password reset email sent"
                })
              })
            })
          })
      })
      .catch((error)=>{
        console.log(error)
        res.json({
          status: "failed",
          message: "Error while cleaning existing requests",
        });
      }) 
  }