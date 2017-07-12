const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    require: true
  },
  voteCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Answer', answerSchema);
