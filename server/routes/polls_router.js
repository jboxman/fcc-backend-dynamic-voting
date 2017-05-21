const Router = require('koa-router');
const {
  default: validator,
  object,
  string,
  array
} = require('koa-context-validator');
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

const createPoll = async (ctx, next) => {
  const payload = Object.assign(
    {},
    {data: ctx.request.body.payload},
    {user: ctx.state.user});

  //const {payload} = ctx.request.body;
  return pollModel.addPoll(payload)
  .then((doc) => {
    ctx.status = 201;
    ctx.type = 'json';
    ctx.body = doc.toJSON();
  })
  .catch(err => {
    console.log(err);
    ctx.body = {errors: err.errors};
    ctx.status = 400;
  })
};

// add middleware to reject if request-type is not application/json?
// We need to enforce some kind of contract for allowable JSON.
// We should know the createdBy user from ctx.state.user.
router.post(
  '/create',
  enforceJSON,
  validator({
    body: object().keys({
      payload: object({
        question: string().required(),
        answers: array().required().items(object({
          text: string().required()
        }))
      })
    })},
    {
      // Silently allows unknown values
      stripUnknown: true
    }),
  createPoll);

// What is the API contract? What shape does the JSON send in take?
const appendPollAnswer = async (ctx, next) => {
  const {id} = ctx.params;
  // Validate this
  // user should be a valid Mongoose model; if it's not,
  // that is a CastError from Mongoose, so might as well throw anyway.
  const payload = Object.assign({}, {answer: ctx.request.body}, {user: ctx.state.user});

  return pollModel.addAnswer(id, payload)
  .then((v) => {
    ctx.status = 200;
    ctx.body = {success: true}
  })
  .catch((v) => {
    ctx.status = 500;
    //ctx.throw(500);
  });
};

// Append a new choice to an existing poll
router.put(
  '/append/:id',
  validator({
    body: object().keys({
      answer: string().required()
    })},
    {
      stripUnknown: true
    }),
  appendPollAnswer);

module.exports = router;
