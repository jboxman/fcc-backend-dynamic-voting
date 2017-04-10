const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  text: {
    type: String,
    require: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  voteCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Answer', answerSchema);
