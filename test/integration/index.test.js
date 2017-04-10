const test = require('tape');
const agent = require('supertest').agent;
const sinon = require('sinon');

const createApp = require('../../server/app');
const setupDb = require('../../models/index');

let db;

const prepare = () => {
  const {koaApp, httpServer} = createApp();
  const request = agent(koaApp.callback());
  return {request, httpServer};
}

test('app', t => {
  t.test('setup db', t => {
    db = setupDb();
    t.end();
  });

  // status, statusCode, statusType, text, type
  t.test('should work', t => {
    const {request, httpServer} = prepare();

    request
    .get('/')
    .expect(200)
    .end((err, res) => {
      t.equal(true, true);
      httpServer.close();
      t.end(err);
    });

  });

  t.test('should get all polls', t => {
    const {request, httpServer} = prepare();

    request
    .get('/polls')
    .expect(200)
    .end((err, res) => {
      t.equal(true, true);
      httpServer.close();
      t.end(err);
    });
  });

  t.test('should create a poll', t => {
    const {request, httpServer} = prepare();

    request
    .post('/polls/create')
    .send({})
    .set('Accept', 'application/json')
    .expect(200)
    .end((err, res) => {
      t.equal(true, true);
      httpServer.close();
      t.end(err);
    });
  });

});

test.onFinish(() => db.close());
