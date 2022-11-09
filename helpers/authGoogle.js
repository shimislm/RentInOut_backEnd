const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = "808903375990-as0s17c8ks56jt5b57c66rks3m6dj4rd.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/users/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(profile);
  }
));

passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})