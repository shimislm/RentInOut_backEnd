const { config } = require("../config/config");
const nodemailer = require("nodemailer");
const { UserModel } = require("../models/userModel");
const { mailOptions } = require("../helpers/userHelper");



let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: config.gmailUser,
      pass: config.gmailPass
    }
  });

 exports.mailMe={
    
 
    sendEmail : async( req,res) => {
  
        html: `<div>
        <h2>${req.body.firstName} - ${req.body.lastName}</h2>
        <h3>${req.body.phone}</h3>
        <p>${req.body.email}</p>
        <p>${req.body.textarea}</p>
            
            
        </div>`
  const mailOptions = {
    from: config.gmailUser,
    to: "ido12301f@gmail.com",
    subject: "mail send from "  + req.body.phone,
    html: `<div color:danger>
    <h2>${req.body.firstName} - ${req.body.lastName}</h2>
    <span>${req.body.phone}</span> | <span>${req.body.email}</span>
    
    <p>${req.body.textarea}</p>
    </div>`
  }; 
       
          try{
            transporter.sendMail(mailOptions, (err, info) => {
                res.json({
                          status: "send",
                          message: "The message sent successfully"
                        })
                        return
                      })
                     }
                     catch (err) {
                      return res.json({ err: "There was a problem" })
                    }
         
       
    
        }
 }
 
  
   
         
  
      
  