const test = require('tape');
const agent = require('supertest').agent;
const sinon = require('sinon');

const createApp = require('../../server/app');
const setupDb = require('../../models/index');

const User = require('../../models/user');
const Poll = require('../../models/poll');
const Answer = require('../../models/answer');

let db;
let defaultUser;
let defaultAnswer;
let newAnswer;

/*
  TODO
  - Implement basic walkthrough
  - Create several polls
  - Find all polls
  - View a poll
  - Remove a poll
  - Vote in a poll
  - Add an answer to a poll
*/

// Need to return to this so I can use scoped authenticated agents
const prepare = () => {
  const {koaApp, httpServer} = createApp();
  const request = agent(koaApp.callback());
  return {request, httpServer};
}

const createAuthenticatedUser = done => {
  // This is the same server that's already running
  const authenticatedUser = agent(k.callback());
  authenticatedUser
  .post({
    username: 'jasonb@edseek.com',
    password: 'test'
  })
  .send()
  .end((error, resp) => {
    console.log(error);
    console.log(resp);
    done(authenticatedUser);
  });
}

let server;
let request;
let k;
test('app', t => {
  t.test('setup db', function(t) {

    const {koaApp, httpServer} = createApp();
    request = agent(koaApp.callback());
    server = httpServer;
    k = koaApp;

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

      defaultUser = await User.create({email: 'user@example.com'});
      defaultAnswers = [
        {
          createdBy: defaultUser.get('_id').toJSON(),
          text: 'Bob'
        },
        {
          createdBy: defaultUser.get('_id').toJSON(),
          text: 'Frank'
        },
        {
          createdBy: defaultUser.get('_id').toJSON(),
          text: 'Jackie'
        }
      ];
      newAnswer = {
        /*createdBy: defaultUser.get('_id').toJSON(),*/
        text: 'Johnie'
      }

      t.end();
    }

  });

  // status, statusCode, statusType, text, type
  t.test('should work', t => {
    //const {request, httpServer} = prepare();

    request
    .get('/')
    .expect(200)
    .end((err, res) => {
      t.end(err);
    });

  });

  t.test('create and view a poll', async function(t) {
    //const {request, httpServer} = prepare();

    const payload = {
      question: 'What is your name?',
      createdBy: {_id: defaultUser.get('_id').toJSON()},
      answers: defaultAnswers
    };

    let createReq, viewReq;
    try {
      createReq = await request
      .post('/polls/create')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(201);

      viewReq = await request
      .get(`/polls/view/${createReq.body._id}`)
      .expect(200)

      t.equal(viewReq.body.viewCount, 1, 'viewCount should equal 1');
    }
    catch(e) {
      console.log(e);
    }
    finally {
      t.end();
    }
  });

  // http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
  /*
  t.test('check populate', async function(t) {
    const doc = await Poll.findOne({}).populate({
      path: 'createdBy'
      }).populate({
        path: 'answers.createdBy'
      }).exec();
    t.end();
  });
  */

  t.test('get all polls', t => {
    //const {request, httpServer} = prepare();

    request
    .get('/polls')
    .expect(200)
    .end((err, res) => {
      t.end(err);
    });
  });

  t.test('add a new poll', async (t) => {
    //const {request, httpServer} = prepare();

    // This is assuming we have a valid ctx.state.user object, but we do not.
    // How to setup a session for testing?
    createAuthenticatedUser(async () => {
      const doc = await Poll.findOne({}).exec();
      request
      .put(`/polls/append/${doc._id}`)
      .send(newAnswer)
      .expect(201)
      .end((err, res) => {
        t.end(err);
      });
    });

  });

  t.test('vote in a poll', function(t) {
    //const {request, httpServer} = prepare();

    // generator experiment
    function *getDoc() {
      return yield Poll.findOne({}).exec();
    }

    const promise = getDoc().next().value;
    promise.then(doc => {
      request
      .post(`/polls/vote/`)
      .send({id: `${doc.answers[1]._id}`})
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        t.end(err);
      });
    });

  });

});

test.onFinish(() => {
  db.close();
  server.close();
});
