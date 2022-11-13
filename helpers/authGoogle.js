const passport = require('passport');
const { config } = require("../config/config");
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = "808903375990-as0s17c8ks56jt5b57c66rks3m6dj4rd.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

passport.use(new GoogleStrategy({
  clientID: config.google_client_id,
  clientSecret: config.google_client_secret,
  callbackURL: config.domain+"/users/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null,profile);
  }
));

passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})