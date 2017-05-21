//require('leaked-handles');

const test = require('tape');
const agent = require('supertest').agent;
const sinon = require('sinon');

const app = require('../../server/app');
const dbConnect = require('../../models/index');

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

// http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
const prepare = () => {
  const httpServer = app.listen();
  const request = agent(app.callback());
  return {
    request,
    httpServer
  };
}

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

const dbClear = async (conn) => {
  // http://stackoverflow.com/a/28067650/6732764
  for(c in conn.collections) {
    try {
      if (conn.collections[c].collectionName.indexOf('system.') == -1)
        await conn.collections[c].drop();
      else
        await conn.collections[c].remove({});
    }
    catch(e) {}
  }
};

test('app', t => {
  t.test('setup db', async function(t) {

    conn = await dbConnect();
    await dbClear(conn);

    // collection fixtures would be nice for this
    defaultUser = await User.create({email: 'jasonb@edseek.com'});
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
      //createdBy: {_id: defaultUser.get('_id').toJSON()},
      answers: defaultAnswers
    };

    let createReq, viewReq;
    createAuthenticatedUser(async (request) => {
      try {
        createReq = await request
        .post('/polls/create')
        .send({payload})
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
  });

  /*
  // http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
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
    const {request, httpServer} = prepare();

    request
    .get('/polls')
    .expect(200)
    .end((err, res) => {
      httpServer.close();
      t.end(err);
    });
  });

  t.test('add a new poll answer', async (t) => {
    createAuthenticatedUser(async (request) => {
      const doc = await Poll.findOne({}).exec();
      request
      .put(`/polls/append/${doc._id}`)
      .send(newAnswer)
      .expect(200)
      .end((err, res) => {
        t.end(err);
      });
    });
  });

  t.test('vote in a poll', function(t) {
    const {request, httpServer} = prepare();

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
        httpServer.close();
        t.end(err);
      });
    });

  });

});

test.onFinish(() => {
  conn.close();
});
