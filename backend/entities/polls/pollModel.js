const mongoose = require('mongoose');

const userModel = require('../users/userModel');
const answerModel = require('./answerModel');

const pollSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
      type: [answerModel.schema],
      validate: ensureOneOrMoreAnswers
    }
  },
  {
    timestamps: true
  });

// https://stackoverflow.com/a/42763286/6732764
pollSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) { delete ret._id }
});

// options, limit, start, order
pollSchema.statics.findAllPolls = function findAllPolls() {
  // http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
  return this.find({}).populate({
          path: 'createdBy'
      }).populate({
        path: 'answers.createdBy'
    }).exec();
}

// Each answer must have a createdBy
pollSchema.statics.addPoll = function addPoll(payload) {
  const poll = Object.assign({answers: []}, payload);

  // TODO - rework using ramda
  poll.answers.forEach(answer => {
    Object.assign(answer, {
      createdBy: poll.createdBy
    });
  });

  // https://stackoverflow.com/a/33092800/6732764
  const apoll = new this(poll);
  return apoll.save();
}

pollSchema.statics.removePoll = function removePoll(id) {
  return this.findByIdAndRemove(id).exec();
}

pollSchema.statics.viewPoll = function viewPoll(id) {
  // http://stackoverflow.com/questions/16356112/mongoose-increment-with-findone
  return this.findByIdAndUpdate(
    id,
    {
      $inc: {
        viewCount: 1
      }
    },
    {new: true}).populate({
          path: 'createdBy'
      }).populate({
        path: 'answers.createdBy'
    }).exec();
}

/*
  This may be needlessly opaque. Rather than POST to /polls/vote/{id}
  the ID of the answer, we use mongo query syntax to find the poll
  by the answer ID itself and increment the vote count.
*/
pollSchema.statics.vote = function vote(answerId) {
  // http://stackoverflow.com/questions/10522347/mongodb-update-objects-in-a-documents-array-nested-updating
  return this.findOneAndUpdate(
    {
      'answers._id': {
        $in: [answerId]
      }
    },
    {
      $inc: {
        'answers.$.voteCount': 1
      }
    },
    {new: true});
}

pollSchema.statics.addAnswer = function addAnswer(id, answer) {
  return this.findOneAndUpdate(
    id,
    {
      $push: {
        answers: {
          $each: [answer]
        }
      }
    },
    {new: true}).populate();
}

// Use pollSchema.methods.blah to allow for custom methods

module.exports = mongoose.model('Poll', pollSchema);

function ensureOneOrMoreAnswers(value) {
  if(Array.isArray(value)) {
    return value.length >= 1 ? true : false;
  }
  return false;
}
