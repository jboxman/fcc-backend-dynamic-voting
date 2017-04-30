const Router = require('koa-router');
//const debug = require('debug')('fcc-voting');

/*
  This router defines routes for user authentication.
  Reference: https://github.com/rkusa/koa-passport-example/blob/master/server.js
*/

const userModel = require('../../models/user');

const router = new Router({
  prefix: '/users'
});

router.post('/login', (ctx) => {

});

router.get('/session', (ctx) => {

});

module.exports = router;
