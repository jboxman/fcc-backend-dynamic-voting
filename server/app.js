const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const session = require('koa-session');
const logger = require('koa-logger')

const debug = require('debug')('fcc-voting');

const config = require('../config/envs');
const routes = require('./routes');

require('../util/authentication');

const app = new Koa();
app.keys = ['a secret'];

app.use(logger());
app.use(bodyParser());
app.use(session({}, app));

app.use(passport.initialize());
app.use(passport.session());

// where is my ctx.cookies
app.use((ctx, next) => {
  return next();
});

app.use(routes.routes());
app.use(routes.allowedMethods());

if(!module.parent) {
  app.listen(config.app.port, () => {
    debug(`Listening on ${config.app.port}`);
  });
}

module.exports = app;
