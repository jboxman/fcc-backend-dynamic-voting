// http://scottksmith.com/blog/2014/09/18/beer-locker-building-a-restful-api-with-node-username-and-password/

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

/*
const fakeUser = {
  email: 'jasonb@edseek.com',
  id: '123'
};
*/

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id).exec();
    done(null, user.toObject());
  }
  catch(err) {
    done(err);
  }
});

// Revealing constructor pattern
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({email: username}).exec();
    if(user) {
      return done(null, user.toObject());
    }
    done(null, false);
  }
  catch(err) {
    done(err);
  }
}));
