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

const prepare = () => {
  const {koaApp, httpServer} = createApp();
  const request = agent(koaApp.callback());
  return {request, httpServer};
}

test('app', t => {
  t.test('setup db', async function(t) {
    db = setupDb();

    // TODO - return Promise from setupDb() instead of abritrary setTimeout()
    setTimeout(async function() {
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
      //await Answer.create({createdBy: defaultUser, answer: 'Frank'});

      t.end();
    }, 50);
  });

  // status, statusCode, statusType, text, type
  t.test('should work', t => {
    const {request, httpServer} = prepare();

    request
    .get('/')
    .expect(200)
    .end((err, res) => {
      httpServer.close();
      t.end(err);
    });

  });

  t.test('create and view a poll', async function(t) {
    const {request, httpServer} = prepare();

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
      httpServer.close();
      t.end();
    }
  });

  t.test('get all polls', t => {
    const {request, httpServer} = prepare();

    request
    .get('/polls')
    .expect(200)
    .end((err, res) => {
      httpServer.close();
      t.end(err);
    });
  });

  t.test('vote in a poll', async function(t) {
    const {request, httpServer} = prepare();

    // It may be cleaner to simply do /polls/vote/:id/:answerId
    const doc = await Poll.findOne({}).exec();

    // Send _id of poll answer choice 
    request
    .post(`/polls/vote/`)
    .send(doc.answers[1]._id)
    .set('Accept', 'application/json')
    .expect(200)
    .end((err, res) => {
      httpServer.close();
      t.end(err);
    });
  });

});

test.onFinish(() => db.close());
