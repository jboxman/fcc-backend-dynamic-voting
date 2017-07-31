const Router = require('koa-router');
const passport = require('koa-passport');
//const debug = require('debug')('fcc-voting');

/*
  This router defines routes for user authentication.
  Reference: https://github.com/rkusa/koa-passport-example/blob/master/server.js
*/

const userModel = require('./userModel');

const router = new Router({
  prefix: '/users'
});

router.post('/login', (ctx, next) => {
  return passport.authenticate('local', (err, user, info, status) => {
    if(user) {
      ctx.body = {success: true};
      return ctx.login(user);
    }
    else {
      ctx.body = {success: false};
      ctx.status = 401;
    }
  })(ctx, next);
});

router.get('/auth/github',
  passport.authenticate('github')
);

// Custom handler that returns the authenticated user object
router.get('/auth/github/callback', function(ctx) {
  return passport.authenticate('github', async function(err, user, info) {
    //ctx.type = 'json'
    //ctx.body = user
    await ctx.logIn(user);
    await ctx.render('success', {user: JSON.stringify(ctx.state.user)});
  })(ctx);
});

module.exports = router;
