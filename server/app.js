const Koa = require('koa');
const Router = require('koa-router');

const routes = require('./routes');

const app = new Koa();
const router = Router();

// Defer listen
function createApp() {

  /*
  router.get('/', async function(ctx, next) {
    ctx.body = 'hi';
    await next();
  });
  */

  app.use(routes.routes());
  app.use(routes.allowedMethods());
  //app.use(router.routes());

  const server = app.listen(3000);
  return {koaApp: app, httpServer: server};
}

module.exports = createApp;
