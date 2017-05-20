const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const passport = require('koa-passport');

const debug = require('debug')('fcc-voting');

const pollsRouter = require('./polls_router');
const usersRouter = require('./users_router');

// Load React UI
router.get('/', async function(ctx, next) {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(path.join(__dirname, '../views/index.html'));
});

router.use(usersRouter.routes());
router.use(pollsRouter.routes());

module.exports = router;

/*
(ctx, next) => {
  if(ctx.isAuthenticated()) {
    return next();
  }
  else {
    console.log('Not authenticated');
    return next();
  }
}, */
