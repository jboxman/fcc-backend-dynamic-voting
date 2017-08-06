// seed database

const dbConnect = require('../models');

const Poll = require('../backend/entities/polls/pollModel');
const User = require('../backend/entities/users/userModel');

async function seed() {
  const conn = await dbConnect();

  try {
    await Poll.remove({});
    await User.remove({});
  }
  catch(e) {
    console.log(e);
    process.exit(1);
  }

  // Eventually will include fields from github oauth2
  const user = await User.create({
    username: 'user',
    email: 'user@example.com',
    avatarUrl: 'https://avatars2.githubusercontent.com/u/354496?v=4',
    oauthProvider: 'github',
    oauthId: 'abc'
  });

  const polls = [{
    question: 'How are you?',
    answers: [
      {
        text: 'Good'
      },
      {
        text: 'Ok'
      },
      {
        text: 'Winning'
      }
    ],
    createdBy: user._id.toJSON()
  },
  {
    question: 'What day is it?',
    answers: [
      {
        text: 'Saturday'
      },
      {
        text: 'Saturday'
      },
      {
        text: 'Saturday'
      }
    ],
    createdBy: user._id.toJSON()
  }];

  const results = await Promise.all(polls.map(poll => Poll.addPoll(poll)));
  results.map(r => console.log(`Created poll: ${r._id}`));

  conn.close();
}

seed();
