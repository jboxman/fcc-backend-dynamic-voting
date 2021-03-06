//require('leaked-handles');

const test = require('tape');
const agent = require('supertest').agent;
const sinon = require('sinon');

const app = require('../../backend/app');
const dbConnect = require('../../models/index');

const User = require('../../backend/entities/users/userModel');
const Poll = require('../../backend/entities/polls/pollModel');

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
  .get('/users/auth/github/callback')
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
    defaultUser = await User.create({
      email: 'jasonb@edseek.com',
      username: 'jboxman',
      oauthId: 'any',
      oauthProvider: 'github'
    });
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

        if(createReq.body.errors) {
          throw(new Error('error'));
        }

        viewReq = await request
        .get(`/polls/view/${createReq.body.data[0].id}`)
        .expect(200);

        if(viewReq.body.errors) {
          throw(new Error('error'));
        }

        t.equal(viewReq.body.data[0].viewCount, 1, 'viewCount should equal 1');
      }
      catch(e) {
        // Promise rejection
        console.log(e);
      }
      finally {
        t.end();
      }
    });
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

  t.test('add a new poll answer', async (t) => {
    const payload = {
      text: 'Johnie'
    }
    createAuthenticatedUser(async (request) => {
      const doc = await Poll.findOne({}).exec();
      request
      .put(`/polls/append/${doc._id}`)
      .send({payload})
      .expect(200)
      .end((err, res) => {
        // Confirm docs match
        t.equal(res.body.data[0].id, doc._id.toJSON());
        t.end(err);
      });
    });
  });

  // TODO - fix breaking change, POST takes param now, empty body
  t.test('vote in a poll', function(t) {
    createAuthenticatedUser(async (request) => {
      // generator experiment
      function *getDoc() {
        return yield Poll.findOne({}).exec();
      }

      const promise = getDoc().next().value;
      promise.then(doc => {
        request
        .post(`/polls/vote/${doc.answers[1]._id}`)
        .send({})
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          t.end(err);
        });
      });
    });

  });

});

test.onFinish(() => {
  conn.close();
});
