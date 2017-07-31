// Deprecated test
const test = require('tape');
const agent = require('supertest').agent;
const sinon = require('sinon');

const Koa = require('koa');
const route = require('koa-route');
const bodyparser = require('koa-bodyparser');
const passport = require('koa-passport');
const app = new Koa();

require('../../util/authentication');

app.use(bodyparser());

// https://github.com/rkusa/koa-passport/blob/master/test/authenticate.js

let session;
app.use(function(ctx, next) {
  ctx.session = session = {};
  return next();
});

app.use(passport.initialize());
app.use(passport.session());

let context;
app.use(function(ctx, next) {
  context = ctx;
  return next();
});

app.use(route.get('/', function(ctx) {
  ctx.status = 204;
}));

app.use(route.post('/login',
  passport.authenticate('local', {
    successRedirect: '/secured',
    failureRedirect: '/failed'
  })
));

app.use(route.post('/custom', function(ctx, next) {
  return passport.authenticate('local', function(err, user, info) {
    if (user === false) {
      ctx.status = 401
      ctx.body = { success: false }
    } else {
      ctx.body = { success: true }
      return ctx.login(user)
    }
  })(ctx, next);
}));

let server;
test('stuff', t => {
  t.test('before', t => {
    server = app.listen(4000);
    client = agent(app.callback());
    t.end();
  });

  t.test('can login', t => {
    client
    .post('/login')
    .send({username: 'hi', password: 'hi'})
    .expect(302)
    .then(() => {
      console.log(session);
      // context.state.user
      console.log(context.state.user);
      t.end();
    });
  });
});

test.onFinish(() => server.close());
