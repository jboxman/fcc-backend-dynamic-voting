const Router = require('koa-router');
const passport = require('koa-passport');
//const debug = require('debug')('fcc-voting');

/*
  This router defines routes for user authentication.
  Reference: https://github.com/rkusa/koa-passport-example/blob/master/server.js
*/

const userModel = require('../../models/user');

const router = new Router({
  prefix: '/users'
});

// https://github.com/rkusa/koa-passport-example/blob/master/server.js
router.post('/login', (ctx) => {
  return passport.authenticate('local', (err, user, info, status) => {
    if(user) {
      ctx.body = {success: true};
      return ctx.login(user);
    }
    else {
      ctx.body = {success: false};
      ctx.throw(401);
    }
  })(ctx, next);
});

router.get('/session', (ctx) => {

});

module.exports = router;
