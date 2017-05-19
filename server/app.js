const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const session = require('koa-session');
const logger = require('koa-logger')

const debug = require('debug')('fcc-voting');

const routes = require('./routes');

require('../util/authentication');

const port = 3000;

app.keys = ['a secret'];

// Each time createApp() is called, it adds more middleware to app.
// This is bad.
function createApp() {
  const app = new Koa();

  app.use(logger());
  app.use(session(app));
  app.use(bodyParser());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(routes.routes());
  app.use(routes.allowedMethods());
  //app.use(router.routes());

  const server = app.listen(port, () => {
    debug(`Listening on ${port}`);
  });

  return {koaApp: app, httpServer: server};
}

module.exports = createApp;
