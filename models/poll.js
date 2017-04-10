const mongoose = require('mongoose');

const answerSchema = require('./answer').schema;

const pollSchema = mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  answers: [answerSchema]
});

pollSchema.statics.findAllPolls = function findAllPolls() {
  this.find({}).then((v) => console.log(v));
  return this.find({});
}
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
pollSchema.statics.addPoll = function addPoll(o) {
  // Get back err.errors on failure.
  return this.create(o);
}

// Use pollSchema.methods.blah to allow for custom methods

module.exports = mongoose.model('Poll', pollSchema);
