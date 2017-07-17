const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  votedPolls: [mongoose.SchemaTypes.ObjectId]
});

// https://stackoverflow.com/a/42763286/6732764
userSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model('User', userSchema);
