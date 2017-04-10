const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  votedPolls: [mongoose.SchemaTypes.ObjectId]
});

module.exports = mongoose.model('User', userSchema);
