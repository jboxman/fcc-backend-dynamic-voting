const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const debug = require('debug')('fcc-voting');

const pollModel = require('../../models/poll');
const answerModel = require('../../models/answer');

/*
  TODO
  - Each payload must be wrapped in a object with meta field
*/

/*
  Add routes for
  listing polls
  reading a poll
  deleting a poll
  adding an answer by itself
  eventually login
*/

// Load React UI
router.get('/', async function(ctx, next) {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(path.join(__dirname, '../views/index.html'));
});

router.get('/polls', async function(ctx, next) {
  const polls = await pollModel.findAllPolls();
  ctx.type = 'json';
  ctx.body = polls;
  return;
});

router.post('/polls/view/:id', async function(ctx, next) {
  return pollModel.viewPoll()
  .then((poll) => {
    ctx.type = 'json';
    ctx.body = poll;
  });
});

// add middleware to reject if request-type is not application/json?
router.post('/polls/create', async function(ctx, next) {
  // Need to get the POST data, possibly ensure it's safe
  const payload = ctx.request.body;
  return pollModel.addPoll(payload)
  .then(() => ctx.status = 201)
  .catch(err => {
    console.log(err);
    ctx.body = {errors: err.errors};
    ctx.status = 400;
  })
  .catch(err => console.log(err));
});

module.exports = router;
