const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger')
const debug = require('debug')('fcc-voting');

const routes = require('./routes');

const app = new Koa();
const port = 3000;

// Defer listen
function createApp() {

  app.use(logger());
  app.use(bodyParser());
  app.use(routes.routes());
  app.use(routes.allowedMethods());
  //app.use(router.routes());

  const server = app.listen(port, () => {
    debug(`Listening on ${port}`);
  });

  return {koaApp: app, httpServer: server};
}

module.exports = createApp;
