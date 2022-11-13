require("dotenv").config()

exports.config = {
    userDb:process.env.USER_DB,
    passDb:process.env.PASS_DB,
    tokenSecret:process.env.TOKEN_SECRET,
    superID: process.env.ADMIN_ID,
    domain : process.env.DOMAIN,
    gmailUser: process.env.AUTH_EMAIL,
    gmailPass: process.env.AUTH_PASS,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,

  }