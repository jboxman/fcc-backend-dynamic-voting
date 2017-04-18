const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

module.exports = {schema: answerSchema};
//module.exports = mongoose.model('Answer', answerSchema);
