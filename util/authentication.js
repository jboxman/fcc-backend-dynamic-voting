// http://scottksmith.com/blog/2014/09/18/beer-locker-building-a-restful-api-with-node-username-and-password/

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, 1);
});

passport.deserializeUser(async function(id, done) {
  done(null, {email: 'jasonb@edseek.com'});
});

// Revealing constructor pattern
passport.use(new LocalStrategy((username, password, done) => {
  const user = {
    email: 'jasonb@edseek.com'
  };
  return done(null, user);
}));
