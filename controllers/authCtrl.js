const { validateUser, validateUserLogin } = require("../validations/userValid");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const {
  sendResetEmail,
  sendVerificationEmail,
  createToken,
} = require("../helpers/userHelper");
const { UserVerificationModel } = require("../models/userVerificationModel");
const path = require("path");
const { PasswordReset } = require("../models/passwordReset");
require("dotenv").config();

const saltRounds = 10;

exports.authCtrl = {
  signUp: async (req, res) => {
    let validBody = validateUser(req.body);
    if (validBody.error) {
      return res.status(400).json({ Messege: "User information is invalid" });
    }
    try {
      let user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, saltRounds);
      user.email = user.email.toLowerCase();
      await user.save();
      user.password = "********";
      // send verification email
      sendVerificationEmail(user, res);
      res
        .status(201)
        .json({
          msg: `New user ${user.fullName.firstName} ${user.fullName.lastName} created!`,
        });
    } catch (err) {
      if (err.code == 11000) {
        return res
          .status(409)
          .json({ msg: "Email already in system, try log in", code: 11000 });
      }
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  login: async (req, res) => {
    const validBody = validateUserLogin(req.body);
    if (validBody.error) {
      return res.status(401).json({ msg: validBody.error.details });
    }
    try {
      const user = await UserModel.findOne({
        email: req.body.email.toLowerCase(),
      });
      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {
        return res.status(401).json({ msg: "Invalid password" });
      }
      const { active } = user;
      if (!active) {
        return res
          .status(401)
          .json({ msg: "User blocked/ need to verify your email" });
      }
      let newAccessToken = createToken(user._id, user.role);
      const result = await user.save();
      return res.json({ token: newAccessToken, user });
    } catch (err) {
      return res.status(500).json({ msg: "There was an error signing" });
    }
  },

  verifyUser: async (req, res) => {
    let { userId, uniqueString } = req.params;
    UserVerificationModel.findOne({ userId })
      .then((result) => {
        //check if user exist in system
        if (result) {
          const { expiresAt } = result;
          const hashedUniqueString = result.uniqueString;
          if (expiresAt < Date.now() + 2 * 60 * 60 * 1000) {
            //checkes if link expired and sent a messege, delete verify collection in db
            UserVerificationModel.deleteOne({ userId })
              .then(() => {
                UserModel.deleteOne({ _id: userId })
                  .then(() => {
                    let message = "link has expired.please sigh up again ";
                    res.redirect(
                      `/users/verified/?error=true&message=${message}`
                    );
                  })
                  .catch(() => {
                    let message =
                      "clearing user with expired unique string failed ";
                    res.redirect(
                      `/users/verified/?error=true&message=${message}`
                    );
                  });
              })
              .catch((error) => {
                console.log(error);
                let message =
                  "an error occurre while clearing  expired user verification record";
                res.redirect(`/users/verified/?error=true&message=${message}`);
              });
          } else {
            bcrypt
              .compare(uniqueString, hashedUniqueString)
              .then((result) => {
                if (result) {
                  // update user to active state
                  UserModel.updateOne({ _id: userId }, { active: true })
                    .then(() => {
                      // delet verify user collection when verified
                      UserVerificationModel.deleteOne({ userId })
                        .then(() => {
                          res.sendFile(
                            path.join(__dirname, "./../views/verified.html")
                          );
                        })
                        .catch((error) => {
                          console.log(error);
                          let message =
                            "an error occurre while finalizing sucssful verification  ";
                          res.redirect(
                            `/users/verified/?error=true&message=${message}`
                          );
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      let message =
                        "an error occurre while updating user verified ";
                      res.redirect(
                        `/users/verified/?error=true&message=${message}`
                      );
                    });
                } else {
                  let message =
                    "invalid verification details passed.check your inbox.";
                  res.redirect(
                    `/users/verified/?error=true&message=${message}`
                  );
                }
              })
              .catch((error) => {
                console.log(error);
                let message =
                  "an error occurre while compering unique strings ";
                res.redirect(`/users/verified/?error=true&message=${message}`);
              });
          }
        } else {
          let message =
            "Account doesnt exist or has been verified already.please sign up or login in.";
          res.redirect(`/users/verified/?error=true&message=${message}`);
        }
      })
      .catch((error) => {
        console.log(error);
        let message =
          "an error occurre while checking for existing user Verification record ";
        res.redirect(`/users/verified/?error=true&message=${message}`);
      });
  },
  verifiedUser: async (req, res) => {
    res.sendFile(path.join(__dirname, "../views/verified.html"));
  },
  requestPasswordReset: async (req, res) => {
    const { email, redirectUrl } = req.body;
    UserModel.findOne({ email }).then((data) => {
      if (data) {
        // check if user is active
        if (!data.active) {
          res.json({
            status: "failed",
            message:
              "Email isn't verified yet or account as been suspended, please check your email",
          });
        } else {
          // procced to email reset pasword
          sendResetEmail(data, redirectUrl, res);
        }
      } else {
        res.json({
          status: "failed",
          message: "No account with the supplied email found. Please try again",
        });
      }
    });
  },
  resetPassword: async (req, res) => {
    const { userId, resetString, newPassword } = req.body;
    try {
      let result = await PasswordReset.findOne({ userId });
      if (result) {
        const { expiresAt } = result;
        const hashedResetString = result.resetString;
        if (expiresAt < Date.now() + 2 * 60 * 60 * 1000) {
          // checking if link expired
          let reset = await PasswordReset.deleteOne({ userId });
          if (!reset) {
            res
              .status(401)
              .json({ msg: "Password reset link as expired", err });
          }
        } else {
          //compare reset string with string from db
          let result = await bcrypt.compare(resetString, hashedResetString);
          if (result) {
            const hashedNewPassword = await bcrypt.hash(
              newPassword,
              saltRounds
            );
            if (hashedNewPassword) {
              // update user password
              let update = await UserModel.updateOne(
                { _id: userId },
                {
                  password: hashedNewPassword,
                  updatedAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
                }
              );
              if (update) {
                // update completed
                let reset = await PasswordReset.deleteOne({ userId });
                if (reset) {
                  res
                    .status(200)
                    .json({
                      status: "Success",
                      message: "Password reset successfully",
                    });
                } else {
                  res
                    .status(401)
                    .json({ msg: "Failed to update user password", error });
                }
              }
            }
          } else {
            res.status(401).json({ msg: "Invalid password details" });
          }
        }
      } else {
        // password reset request not found
        res.status(401).json({ msg: "Password reset request not found" });
      }
    } catch (error) {
      console.log(err);
      res
        .status(500)
        .json({ msg: "Checking for existing password recors failed", err });
    }
  },
  // Gmail controllers
  callbackGmail: async (req, res) => {
    req.session.loggedin = true;
    res.redirect("/users/welcome");
    res.end();
  },
  logoutGmail: async (req, res) => {
    if (req.session.loggedin) {
      req.session.destroy();
      res.end();
    } else {
      res.end();
    }
  },
  loginRegisterGmail: async (req, res) => {
    if (req.session.loggedin) {
      let userFound = await UserModel.findOne({ email: req.user.email });
      if (userFound) {
        try {
          const { active } = userFound;
          if (!active) {
            localStorage.setItem(
              "googleResp",
              "User blocked/ need to verify your email"
            );
            return res
              .status(401)
              .json({ msg_err: "User blocked/ need to verify your email" });
          }
          console.log(userFound._id, userFound.role);
          let newToken = createToken(userFound._id, userFound.role);
          let success = {
            token: newToken,
            active: userFound.active,
            role: userFound.role,
          };
          localStorage.setItem("googleResp", JSON.stringify(success));
          return res.json({ msg: "success" });
        } catch (err) {
          localStorage.setItem("googleResp", "There was a problem");
          return res.json({ err: "There was a problem" });
        }
      }
      let fail = {
        code: 404,
        email: req.user.email,
        firstName: req.user.given_name,
        lastName: req.user.family_name,
        profile: req.user.picture,
      };
      localStorage.setItem("googleResp", JSON.stringify(fail));
      // return res.json({ code : 404,email: req.user.email, firstName : req.user.given_name, lastName : req.user.family_name, profile : req.user.picture })
      return res.json({ err: "User not register yet..." });
    } else {
      res.json({ err: "access denied" });
      res.end();
    }
  },
  //  sendEmail: async({_id } ,   res )=>{
  //  const user = await findOne({_id})

  //   const html = `<div>
  //   <p>${user.fullName.firstName } ${user.fullName.lastName }</p>
  //   <p>${user.email }</p>
  //   <p>${user.phone }</p>
  //   <p>${user.textarea }</p>
  //   </div>
  //   `;

  //   let mail = mailOptions( `ido12301f@gmail.com` , `New messege from ${user.phone }`, html)
  //  try{
  //   transporter.sendMail(mail , (err, info) => {
  //     res.json({
  //       status: "Pending",
  //       message: "The message sent successfully"
  //     })
  //   })
  //  }
  //  catch (err) {
  //   return res.json({ err: "There was a problem" })
  // }
  // }
};
