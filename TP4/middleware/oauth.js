const passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var {usuario} = require('../models');

passport.use(new GoogleStrategy({
    clientID:     "448241908773-b925nkns9vjs8cnect6vkp6gk1jgnoo7.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8888/google/callback",
    passReqToCallback : true
  },
  function(request, accessToken, refreshToken, profile, done) {
     usuario.findOrCreate({where:{
         nombre: profile.displayName, password: profile.displayName
     }}).then((usuario, creado) => {
         return done(null, usuario)
     })
  }
  ));

passport.serializeUser(function(user,done){
    done(null, user);
})
passport.deserializeUser(function(user,done){
    done(null, user);
})
module.exports = passport;

 