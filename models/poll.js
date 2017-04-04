const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  text: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  voteCount: Number
});

const pollSchema = mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  viewCount: Number,
  answers: [answerSchema]
});

module.exports = {
  schema: pollSchema,
  model: mongoose.model('Poll', pollSchema)
};
