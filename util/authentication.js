// http://scottksmith.com/blog/2014/09/18/beer-locker-building-a-restful-api-with-node-username-and-password/
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../backend/entities/users/userModel');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id).exec();
    done(null, user.toJSON());
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

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // https://stackoverflow.com/questions/20431049/what-is-function-user-findorcreate-doing-and-when-is-it-called-in-passport
    User.findOrCreate(
      {
        oauthId: profile.id
      },
      {
        oauthId: profile.id,
        oauthProvider: profile.provider,
        email: profile.emails[0].value,
        username: profile.username,
        avatarUrl: profile._json.avatar_url
      },
      function(error, user, created) {
        done(null, user.toJSON());
    });
  }
));
