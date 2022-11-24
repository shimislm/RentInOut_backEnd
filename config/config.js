require("dotenv").config()

exports.config = {
    userDb:process.env.USER_DB,
    passDb:process.env.PASS_DB,
    tokenSecret:process.env.TOKEN_SECRET,
    refreshToken:process.env.REFRESH_TOKEN_SECRET,
    superID: process.env.ADMIN_ID,
    domain : process.env.DOMAIN,
    domain_client : process.env.DOMAIN_CLIENT,
    gmailUser: process.env.AUTH_EMAIL,
    gmailPass: process.env.AUTH_PASS,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,

  }