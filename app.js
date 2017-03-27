const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();

app.use(async (ctx) => {
    ctx.body = 'yes';
});

app.listen(3000);
