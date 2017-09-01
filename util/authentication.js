// http://scottksmith.com/blog/2014/09/18/beer-locker-building-a-restful-api-with-node-username-and-password/
const passport = require('koa-passport');
const GitHubStrategy = require('passport-github2').Strategy;
const MockStrategy = require('./mock-strategy').Strategy;

const User = require('../backend/entities/users/userModel');

function onSuccess(accessToken, refreshToken, profile, done) {
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

function strategyForEnvironment() {
  let strategy;
  switch(process.env.NODE_ENV) {
    case 'production':
     strategy = new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
      }, onSuccess);
    break;
    default:
      strategy = new MockStrategy('github', onSuccess);
  }
  return strategy;
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// TODO - Sad path, user ID doesn't exist, possibly because it was deleted
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id).exec();
    done(null, user.toJSON());
  }
  catch(err) {
    done(err);
  }
});

passport.use(strategyForEnvironment());
