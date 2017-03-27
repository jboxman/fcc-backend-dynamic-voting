const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
    question: String,
    viewCount: Number,
    answers: [answerSchema]
});

const answerSchema = mongoose.Schema({
    text: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    voteCount: Number
});

module.exports = mongoose.model('Poll', pollSchema);
