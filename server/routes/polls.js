const Router = require('koa-router');
const debug = require('debug')('fcc-voting');

const pollModel = require('../../models/poll');

const router = new Router({
  prefix: '/polls'
});

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

router.get('/', async function(ctx, next) {
  const polls = await pollModel.findAllPolls();
  ctx.type = 'json';
  ctx.body = polls;
  return;
});

router.get('/view/:id', async function(ctx, next) {
  const {id} = ctx.params;
  // TODO - throw 400 if id missing
  return pollModel.viewPoll(id)
  .then((poll) => {
    ctx.type = 'json';
    ctx.body = poll;
  });
});

router.get('/vote/:id', async function(ctx, next) {
  const {id} = ctx.params;
  return pollModel.vote(id)
  .then((poll) => {
    ctx.status = 200;
  });
});

// add middleware to reject if request-type is not application/json?
router.post('/create', async function(ctx, next) {
  // Need to get the POST data, possibly ensure it's safe
  const payload = ctx.request.body;
  return pollModel.addPoll(payload)
  .then((newPoll) => {
    ctx.status = 201;
    ctx.type = 'json';
    ctx.body = newPoll.toJSON();
  })
  .catch(err => {
    console.log(err);
    ctx.body = {errors: err.errors};
    ctx.status = 400;
  })
  .catch(err => console.log(err));
});

module.exports = router;
