const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String
  },
  oauthId: {
    type: String,
    required: true,
    select: false
  },
  oauthProvider: {
    type: String,
    required: true,
    enum: ['github'],
    select: false
  },
  votedPolls: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Poll'
  }
});

// https://stackoverflow.com/a/42763286/6732764
userSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) { delete ret._id }
});
// https://stackoverflow.com/questions/20431049/what-is-function-user-findorcreate-doing-and-when-is-it-called-in-passport
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
