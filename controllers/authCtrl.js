const { validateUser, validateUserLogin } = require("../validations/userValid");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const { createToken , sendResetEmail , sendVerificationEmail } = require("../helpers/userHelper");
const { UserVerificationModel } = require("../models/UserVerificationModel");
const path = require("path");
require("dotenv").config();

const salRounds = 10;

exports.authCtrl = {
  
    signUp: async (req, res) => {
        let validBody = validateUser(req.body);
        if (validBody.error) {
          return res.status(400).json(validBody.error.details);
        }
        try {
          let user = new UserModel(req.body);
          user.password = await bcrypt.hash(user.password, salRounds);
          await user.save();
          user.password = "********";
          // send verification email
          sendVerificationEmail(user, res);
          res.status(201).json(user);
        }
        catch (err) {
          if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })
          }
          console.log(err);
          res.status(500).json({ msg: "err", err })
        }
      },
  login: async (req, res) => {
    const validBody = validateUserLogin(req.body);
    if (validBody.error) {
      return res.status(401).json({ msg_err: validBody.error.details });
    }
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ msg_err: "User not found" });
      }
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {
        return res.status(401).json({ msg_err: "Invalid password" });
      }
      const { active } = user;
      if(!active){
        return res.status(401).json({ msg_err: "User blocked/ need to verify your email" });
      }
      let newToken = createToken(user._id, user.role);
      return res.json({ token: newToken, active });
    } catch (err) {
      return res.status(500).json({ msg_err: "There was an error signing" });
    }
  },
  verifyUser: async (req, res) => {
    let { userId, uniqueString } = req.params;
    UserVerificationModel.find({ userId }).then((result) => {
      //check if user exist in system
        if (result.length > 0) {
          const { expiresAt } = result[0];
          const hashedUniqueString = result[0].uniqueString;
          if (expiresAt < (Date.now()+ 2* 60* 60*1000)) {
            //checkes if link expired and sent a messege, delete verify collection in db
            UserVerificationModel.deleteOne({ userId })
            .then(() => {
                UserModel.deleteOne({ _id: userId }).then(() => {
                    let message = "link has expired.please sigh up again ";
                    res.redirect(`/users/verified/?error=true&message=${message}`);
                  })
                  .catch(() => {
                    let message = "clearing user with expired unique string failed ";
                    res.redirect(`/users/verified/?error=true&message=${message}`);
                  })
              })
              .catch((error) => {
                console.log(error);
                let message = "an error occurre while clearing  expired user verification record";
                res.redirect(`/users/verified/?error=true&message=${message}`);
              })
          }
          else {
            bcrypt.compare(uniqueString, hashedUniqueString)
              .then(result => {
                if (result) {
                  // update user to active state
                  UserModel
                    .updateOne({ _id: userId }, { active: true })
                    .then(() => {
                      // delet verify user collection when verified
                      UserVerificationModel.deleteOne({ userId })
                        .then(() => {
                          res.sendFile(path.join(__dirname, "./../views/verified.html"));
                        })
                        .catch(error => {
                          console.log(error)
                          let message = "an error occurre while finalizing sucssful verification  ";
                          res.redirect(`/users/verified/?error=true&message=${message}`);
                        })
                    }
                    )
                    .catch(error => {
                      console.log(error)
                      let message = "an error occurre while updating user verified ";
                      res.redirect(`/users/verified/?error=true&message=${message}`);
                    })

                } else {
                  let message = "invalid verification details passed.check your inbox.";
                  res.redirect(`/users/verified/?error=true&message=${message}`);
                }
              })
              .catch((error) => {
                console.log(error)
                let message = "an error occurre while compering unique strings ";
                res.redirect(`/users/verified/?error=true&message=${message}`);
              })
          }

        } else {
          let message = "Account doesnt exist or has been verified already.please sign up or login in.";
          res.redirect(`/users/verified/?error=true&message=${message}`);
        }
      })
      .catch((error) => {
        console.log(error)
        let message = "an error occurre while checking for existing user Verification record ";
        res.redirect(`/users/verified/?error=true&message=${message}`);
      })
  },
  verifiedUser: async (req, res) => {
    res.sendFile(path.join(__dirname, "../views/verified.html"))
  },
  requestPasswordReset: async (req,res) =>{
    const { email , redirectUrl } = req.body;
    
    UserModel.findOne({ email })
      .then((data) => {
        if(data){
          // check if user is active
          if(!data.active){
            res.json({
              status: "failed",
              message: "Email isn't verified yet or account as been suspended, please check your email"
            })
          }else{
            // procced to email reset pasword
            sendResetEmail(data , redirectUrl , res)
          }
        }else{
          res.json({
            status: "failed",
            message: "No account with the supplied email found. Please try again"
          })
        }
      })
      .catch(error=>{
        console.log(error)
        res.json({
          status: "failed",
          message: "an error occured while checking user existing",
        });
    })
  }
};
