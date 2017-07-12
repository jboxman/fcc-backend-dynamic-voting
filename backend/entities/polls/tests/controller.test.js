const test = require('tape');
const sinon = require('sinon');
require('sinon-mongoose');

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const {
  viewPoll
} = require('../controller');

const Poll = mongoose.model('Poll');

// TODO - migrate tests here
// TODO - Refactor controller

function pollFactory(poll = {
  question: 'How are you?',
  viewCount: 0,
  createdBy: {
    _id: 0,
    email: 'jasonb@edseek.com',
    votedPolls: []
  },
  answers: [],
  _id: 0
}) {
  return poll;
}

function userFactory(user = {
  email: 'jasonb@edseek.com',
  votedPolls: [],
  _id: 0
}) {
  return user;
}

test('controller', t => {

  t.test('viewPoll', t => {
    sinon.stub(Poll, 'viewPoll').resolves(pollFactory());

    viewPoll(123).then((poll) => {
      const expected = {
        success: true,
        count: 1,
        data: [pollFactory()]
      };

      t.deepEqual(
        poll,
        expected);

      t.end();
    });
  });

  t.test('createPoll', t => {
    sinon.stub(Poll, 'createPoll').resolves(pollFactory());

    t.end();
  });

  t.end();
});

