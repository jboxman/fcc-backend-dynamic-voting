const Router = require('koa-router');
const debug = require('debug')('fcc-voting');

const pollModel = require('../../models/poll');

const router = new Router({
  prefix: '/polls'
});

const enforceJSON = (ctx, next) => {
  return ctx.request.type == 'application/json' ? next() : ctx.status = 400;
}

/*
  TODO
  - Each payload must be wrapped in a object with meta field
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

// add middleware to reject if request-type is not application/json?
router.post('/vote', enforceJSON, async function(ctx, next) {
  const {id} = ctx.request.body;
  return pollModel.vote(id)
  .then((poll) => {
    ctx.type = 'json';
    ctx.body = poll;
  });
});

// add middleware to reject if request-type is not application/json?
// We need to enforce some kind of contract for allowable JSON.
// We should know the createdBy user from ctx.state.user.
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

// Append a new choice to an existing poll
router.put('/append/:id', async function(ctx, next) {
  const {id} = ctx.params;
  // Validate this
  const payload = Object.assign({}, ctx.request.body, {user: ctx.state.user});

  pollModel.addAnswer(id, payload)
  .then(() => {
    ctx.status = 201;
  });
});

module.exports = router;
