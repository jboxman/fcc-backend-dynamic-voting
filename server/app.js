const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const routes = require('./routes');

const app = new Koa();
//const router = Router();

// Defer listen
function createApp() {

  app.use(bodyParser());
  app.use(routes.routes());
  app.use(routes.allowedMethods());
  //app.use(router.routes());

  const server = app.listen(3000);

  return {koaApp: app, httpServer: server};
}

module.exports = createApp;
