const { config } = require("../config/config");
const nodemailer = require("nodemailer");
const { UserModel } = require("../models/userModel");



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
  console.log(req.body)

   
         
        let mailOption = {
            from: config.gmailUser,
            to: 'ido12301f@gmail.com',
            subject: `New messege from ${req.body.firstName} -${req.body.phone} -${req.body.email} `,
            text: " hi are you"
          };
          try{
            transporter.sendMail(mailOption, function(err, info){
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
 
  
   
         
  
      
  