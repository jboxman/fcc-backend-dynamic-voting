const test = require('tape');

const Mongoose = require('mongoose').Mongoose;
const mongoose = new Mongoose();
mongoose.Promise = global.Promise;

const Poll = require('../models/poll');

// Exclude any model field defaults
const pollFactory = ({question = 'test'} = {}) => {
  return {
    question
  }
};
// This somehow needs to map back to a user, maybe not in this test
const answerFactory = ({text = 'Eggs', createdBy = 0} = {}) => {
  return {
    text,
    createdBy
  }
};

// Test validations without a database connection
// http://stackoverflow.com/questions/9222376/testing-mongoosejs-validations

// Test instance methods by mocking
// https://github.com/underscopeio/sinon-mongoose/blob/master/examples/promises/test.js

/*
Now it may be possible to test adding Poll questions.
A Poll must have questions by default, but more can be added later.
*/

test('Poll', t => {
  const poll = new Poll(pollFactory({question: null}));
  // err.errors contains each field name that fails?
  poll.validate((err) => {
    console.log(err);
    t.end();
  })
});
