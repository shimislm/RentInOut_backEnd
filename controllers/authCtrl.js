const { validateUser, validateUserLogin } = require("../validations/userValid");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const { createToken ,mailOptions } = require("../helpers/userHelper");
const { UserVerificationModel } = require("../models/UserVerificationModel");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
require("dotenv").config();

const salRounds = 10;

let transporter = nodemailer.createTransport({

  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
});


const sendVerificationEmail = async({ _id, email }, res) => {
    console.log("email " + email)
    console.log("id " + _id)
    const uniqueString = uuidv4() + _id;
    let mail=mailOptions(_id,uniqueString,email);
    console.log("hash: " ,uniqueString)
    await bcrypt
      .hash(uniqueString, salRounds)
      .then((hasheduniqueString) => {
  
        const userVerification = new UserVerificationModel({
          userId: _id,
          uniqueString: hasheduniqueString,
        });
        userVerification
          .save()
          .then(() => {
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
      let newToken = createToken(user._id, user.role);
      return res.json({ token: newToken, active });
    } catch (err) {
      return res.status(500).json({ msg_err: "There was an error signing" });
    }
  },
  verifyUser: async (req, res) => {
    let { userId, uniqueString } = req.params;
    UserVerificationModel.find({ userId }).then((result) => {
        if (result.length > 0) {
          const { expiresAt } = result[0];
          const hashedUniqueString = result[0].uniqueString;
          if (expiresAt < (Date.now()+ 2* 60* 60*1000)) {
            UserVerificationModel.deleteone({ userId })
            .then(() => {
                UserModel.deleteone({ _id: userId }).then(() => {
                    let message = "link hsa expired.please sigh up again ";
                    res.redirect(`/users/verified/error=true&message=${message}`);
                  })
                  .catch(() => {
                    let message = "clearing user with expired unique string failed ";
                    res.redirect(`/users/verified/error=true&message=${message}`);
                  })
              })
              .catch((error) => {
                console.log(error);
                let message = "an error occurre while clearing  expired user verification record";
                res.redirect(`/users/verified/error=true&message=${message}`);
              })
          }
          else {
            bcrypt
              .compare(uniqueString, hashedUniqueString)
              .then(result => {
                if (result) {
                  UserModel
                    .updateOne({ _id: userId }, { active: true })
                    .then(() => {
                      UserVerificationModel.deleteOne({ _id :userId })
                        .then(() => {
                          res.sendFile(path.join(__dirname, "./../views/verified.html"));
                        })
                        .catch(error => {
                          console.log(error)
                          let message = "an error occurre while finalizing sucssful verification  ";
                          res.redirect(`/users/verified/error=true&message=${message}`);
                        })
                    }
                    )
                    .catch(error => {
                      console.log(error)
                      let message = "an error occurre while updating user verified ";
                      res.redirect(`/users/verified/error=true&message=${message}`);
                    })

                } else {
                  let message = "invalid verification details passed.check your inbox.";
                  res.redirect(`/users/verified/error=true&message=${message}`);
                }
              })
              .catch((error) => {
                console.log(error)
                let message = "an error occurre while compering unique strings ";
                res.redirect(`/users/verified/error=true&message=${message}`);
              })
          }

        } else {
          let message = "Account   doesnt exist or has been verified already.please sign up or login in.";
          res.redirect(`/users/verified/error=true&message=${message}`);
        }
      })
      .catch((error) => {
        console.log(error)
        let message = "an error occurre while checking for existing user Verification record ";
        res.redirect(`/users/verified/error=true&message=${message}`);
      })
  },
  verifiedUser: async (req, res) => {
    res.sendFile(path.join(__dirname, "../views/verified.html"))
  }
};
