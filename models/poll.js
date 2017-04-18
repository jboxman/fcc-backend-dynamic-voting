const mongoose = require('mongoose');

const answerSchema = require('./answer').schema;

const pollSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  question: {
    type: String,
    trim: true,
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  answers: {
    type: [answerSchema],
    validate: ensureOneOrMoreAnswers
  }
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

pollSchema.statics.viewPoll = function viewPoll(id) {
  //return this.findById(id).exec();
  // http://stackoverflow.com/questions/16356112/mongoose-increment-with-findone
  return this.findByIdAndUpdate(id, {$inc: {viewCount: 1}}, {new: true});
}

// Need both because we're embedding
pollSchema.statics.vote = function vote(answerId) {
  return this.findOne({'answers._id': { $in: [answerId]}});
}

// Use pollSchema.methods.blah to allow for custom methods

module.exports = mongoose.model('Poll', pollSchema);

function ensureOneOrMoreAnswers(value) {
  if(Array.isArray(value)) {
    return value.length >= 1 ? true : false;
  }
  return false;
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
