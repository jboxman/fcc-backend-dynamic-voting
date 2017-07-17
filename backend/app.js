const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const session = require('koa-session');
const logger = require('koa-logger')

const routes = require('./routes');

require('../util/authentication');

const app = new Koa();
app.keys = ['a secret'];

app.use(logger());
app.use(bodyParser());
app.use(session({}, app));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes.routes());
app.use(routes.allowedMethods());

module.exports = app;
