const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');

const Collections = require('../models/collections');
const keys = require('../config/keys');

const User = mongoose.model(Collections.users);
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwtpayload, done) => {
      User.findById(jwtpayload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }

          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
