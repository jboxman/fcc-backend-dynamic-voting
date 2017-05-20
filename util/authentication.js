// http://scottksmith.com/blog/2014/09/18/beer-locker-building-a-restful-api-with-node-username-and-password/

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const fakeUser = {
  email: 'jasonb@edseek.com',
  id: '123'
};


passport.serializeUser(function(user, done) {
  done(null, 1);
});

passport.deserializeUser(async function(id, done) {
  done(null, fakeUser);
});

// Revealing constructor pattern
passport.use(new LocalStrategy((username, password, done) => {
  return done(null, fakeUser);
}));
