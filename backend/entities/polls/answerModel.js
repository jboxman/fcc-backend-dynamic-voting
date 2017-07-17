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

// https://stackoverflow.com/a/42763286/6732764
answerSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model('Answer', answerSchema);
