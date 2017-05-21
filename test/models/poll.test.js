const test = require('tape');
const sinon = require('sinon');

const dbConnect = require('../../models/index');

const Poll = require('../../models/poll');
const User = require('../../models/user');

let db;
let user;

test('polls', async (t) => {

  t.test('db setup', async (t) => {

    db = await dbConnect();

    user = await User.create({
      email: 'jasonb@edseek.com'
    });
    console.log(user);

    t.end();
  });

  // Try for missing user, ect.
  t.test('add poll', async (t) => {
    const poll = {
      question: 'How do you feel?',
      answers: [
        {
          text: 'Happy'
        },
        {
          text: 'Sad'
        }
      ]
    };
    const payload = {
      data: poll,
      user: user.toObject()
    }

    const actual = await Poll.addPoll(payload);
    console.log(actual);

    t.end();
  });

  t.test('add answer', async (t) => {
    const poll = await Poll.create({
      question: 'What color is the sky?',
      createdBy: user,
      answers: [
        {
          text: 'blue',
          createdBy: user
        },
        {
          text: 'red',
          createdBy: user
        }
      ]
    });

    const payload = {
        data: {
          text: 'green'
        },
        user: user.toObject()
    }
    const actual = await Poll.addAnswer(
      poll._id,
      payload);

    console.log(actual);

    t.end();
  });

  t.end();
});

test.onFinish(() => {
  db.close();
});
