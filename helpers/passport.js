const passport = require('passport');
const { config } = require("../config/config");
const GoogleStrategy = require('passport-google-oauth2').Strategy;


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