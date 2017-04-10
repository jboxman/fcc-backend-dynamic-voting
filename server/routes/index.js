const fs = require('fs');
const path = require('path');
const router = require('koa-router')();

const pollModel = require('../../models/poll');
const answerModel = require('../../models/answer');

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
});

// add middleware to reject if request-type is not application/json?
router.post('/polls/create', async function(ctx, next) {
  // Need to get the POST data, possibly ensure it's safe
  const body = ctx.request.body;
  pollModel.addPoll({})
  .then(() => ctx.status = 201)
  .catch(err => {
    ctx.body = {errors: err.errors};
    ctx.status = 400;
  });
});

module.exports = router;
