const test = require('tape');

const Mongoose = require('mongoose').Mongoose;
const mongoose = new Mongoose();
mongoose.Promise = global.Promise;

const pollSchema = require('../models/poll').schema;
const Poll = mongoose.model('Poll', pollSchema);

const pollFactory = ({question = 'test', viewCount = 0} = {}) => {
  return {
    question,
    viewCount
  }
}

// Test validations without a database connection
// http://stackoverflow.com/questions/9222376/testing-mongoosejs-validations

// Test instance methods by mocking
// https://github.com/underscopeio/sinon-mongoose/blob/master/examples/promises/test.js

test('Poll', t => {
  const poll = new Poll(pollFactory({question: null}));
  poll.validate((err) => {
    console.log(err);
    t.end();
  })
});
