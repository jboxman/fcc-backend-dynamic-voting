//require('leaked-handles');

const test = require('tape');
const agent = require('supertest').agent;
const sinon = require('sinon');

const setupDb = require('../../models/index');
const app = require('../../server/app');

// https://medium.com/@juha.a.hytonen/testing-authenticated-requests-with-supertest-325ccf47c2bb
const createAuthenticatedUser = (done) => {
  const httpServer = app.listen();
  const authenticatedUser = agent(app.callback());
  authenticatedUser
  .post('/users/login')
  .send({
    username: 'jasonb@edseek.com',
    password: 'test'
  })
  .end((error, resp) => {
    done(authenticatedUser);
    httpServer.close();
  });
}

let db;
test('setup db', function(t) {
  // TODO - Discover where other UnhandledPromiseRejectionWarning is emitted
  prepareDb().catch(() => {
    console.log('caught');
  });

  async function prepareDb() {
    db = await setupDb();

    // http://stackoverflow.com/a/28067650/6732764
    for(c in db.collections) {
      // (node:8376) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 2): MongoError: ns not found
      if (db.collections[c].collectionName.indexOf('system.') == -1)
        db.collections[c].drop();
      else
        db.collections[c].remove({});
    }
  }

  t.end();
});

test('add a new poll', async (t) => {
  createAuthenticatedUser(async (request) => {
    request
    .put(`/polls/append/abc`)
    .send({})
    .expect(200)
    .end((err, res) => {
      t.end(err);
    });
  });

});

test.onFinish(() => {
  db.close();
});
