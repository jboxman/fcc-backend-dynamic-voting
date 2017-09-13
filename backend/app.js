const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const session = require('koa-session');
const logger = require('koa-logger')
const static = require('koa-static');
const mount = require('koa-mount');

const routes = require('./routes');

require('../util/authentication');

const app = new Koa();
app.keys = ['a secret'];

app.use(logger());
app.use(bodyParser());
// This can vary based on environment
app.use(session({}, app));

const views = require('koa-views');
app.use(views(`${__dirname}/views`, {
  map: {
    html: 'ejs'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(mount(process.env.NODE_ENV == 'production' ? '/api' : '/', routes.routes()));
app.use(routes.allowedMethods());

// TODO - catch validation errors
// https://github.com/chentsulin/koa-context-validator/blob/master/src/__tests__/index.spec.js#L126
// error.name == ValidationError

app.use(static(path.join(__dirname, '../dist')));

module.exports = app;
