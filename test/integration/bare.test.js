const test = require('tape');
const agent = require('supertest').agent;
const sinon = require('sinon');

const Koa = require('koa');
const route = require('koa-route');
const bodyparser = require('koa-bodyparser');

//const createApp = require('../../server/app');
const setupDb = require('../../models/index');

const User = require('../../models/user');
const Poll = require('../../models/poll');
const Answer = require('../../models/answer');

let db;
let defaultUser;
let defaultAnswer;
let newAnswer;

// Test the routes directly

const app = new Koa();

app.use(bodyparser());

// https://github.com/rkusa/koa-passport/blob/master/test/authenticate.js
let session;
app.use(function(ctx, next) {
  ctx.session = session = {};
  return next();
});

// https://github.com/rkusa/koa-passport/blob/master/test/authenticate.js
let context;
app.use(function(ctx, next) {
  context = ctx;
  // This will be a hydrated user object if passport authentication succeeds
  Object.assign(context, {
      state: {
          user: {
              email: 'jasonb@edseek.com'
            }
      }
  });
  return next();
});

// This will be live server routes
app.use(route.get('/', function(ctx) {
  ctx.status = 204;
}));

let client;
let server;
test('try', t => {
  t.test('before', t => {
    server = app.listen(4000);
    client = agent(app.callback());
    t.end();
  });

  // This can be a test for a route expecting authentication
  t.test('try this', t => {
    client
    .get('/')
    .then((v) => {
        console.log(context.state.user);
        //console.log(v);
        t.end();
    });
  });

});

test.onFinish(() => server.close());