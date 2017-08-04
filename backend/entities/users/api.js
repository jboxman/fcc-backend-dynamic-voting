const Router = require('koa-router');
const passport = require('koa-passport');
//const debug = require('debug')('fcc-voting');

const {
  isAuthenticated
} = require('../../helpers');

/*
  This router defines routes for user authentication.
  Reference: https://github.com/rkusa/koa-passport-example/blob/master/server.js
*/

const userModel = require('./userModel');

const router = new Router({
  prefix: '/users'
});

router.get('/auth/github',
  passport.authenticate('github')
);

// Custom handler that returns the authenticated user object
router.get('/auth/github/callback', function(ctx) {
  return passport.authenticate('github', async function(err, user, info) {
    await ctx.logIn(user);
    await ctx.render('success', {user: JSON.stringify(ctx.state.user)});
  })(ctx);
});

// TODO - Add logout page
router.get('/auth/logout', isAuthenticated, function(ctx) {
  ctx.logOut();
});

module.exports = router;
