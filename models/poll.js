const mongoose = require('mongoose');

const answerSchema = require('./answer').schema;

/*
  TODO
  - answers array cannot be empty
*/

const pollSchema = mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  // use validate and fn to enforce not empty, but what about message?
  answers: [answerSchema]
});

pollSchema.statics.findAllPolls = function findAllPolls() {
  return this.find({});
}

// What happens if one or more answers is invalid?
pollSchema.statics.addPoll = function addPoll(o) {
  // Get back err.errors on failure.
  return this.create(o);
}

pollSchema.statics.removePoll = function removePoll(id) {
  return this.findByIdAndRemove(id).exec();
}

/*
  TODO
  - Increment view count
*/
pollSchema.statics.viewPoll = function viewPoll(id) {
  return this.findById(id).exec();
}

// Use pollSchema.methods.blah to allow for custom methods

module.exports = mongoose.model('Poll', pollSchema);

// We need back validation failure
/*
{ [ValidationError: Validation failed]
  message: 'Validation failed',
  name: 'ValidationError',
  errors: 
   { Name: 
      { [ValidatorError: Path `Name` is required.]
        message: 'Path `Name` is required.',
        name: 'ValidatorError',
        path: 'Name',
        type: 'required',
        value: undefined } } }
*/
