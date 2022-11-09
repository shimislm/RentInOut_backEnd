require("dotenv").config()

exports.DOMAIN = "http://localhost:3000"


exports.config = {
    userDb:process.env.USER_DB,
    passDb:process.env.PASS_DB,
    tokenSecret:process.env.TOKEN_SECRET,
    superID: process.env.ADMIN_ID,
    googleId : process.env.GOOGLE_CLIENT_ID,
    googleSecret : process.env.GOOGLE_CLIENT_SECRET
  }