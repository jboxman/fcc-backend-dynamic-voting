const Router = require('koa-router');
const {
  default: validator,
  object,
  string,
  array
} = require('koa-context-validator');
const debug = require('debug')('fcc-voting');

const pollModel = require('../../models/poll');

/*
  ctx.body shape
  {
    payload: {
      // Actual data
    }
  }
*/

const router = new Router({
  prefix: '/polls'
});

const enforceJSON = (ctx, next) => {
  return ctx.request.type == 'application/json' ? next() : ctx.status = 400;
}

const validation = {
  viewPoll: [
    {
      params: object({
        id: string().required()
      })
    },
    {
      // Silently allows unknown values
      stripUnknown: true
    }    
  ],
  createPoll: [
    {
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
    }
  ],
  votePoll: [
    {
       body: object({
        id: string().required()
      })
    }
  ],
  appendPollAnswer: [
    {
      params: object({
        id: string().required()
      }),
      body: object().keys({
        payload: object({
          text: string().required()
        })
    })},
    {
      stripUnknown: true
    }
  ]
};

router.get(
  '/',
  async function(ctx, next) {
    const polls = await pollModel.findAllPolls();
    ctx.type = 'json';
    ctx.body = polls;
    return next();
  });

/*
  TODO - Why does 0 end up in params?
  ValidationError: "0" is not allowed
  Object {0: "", id: "5921ffad00fe3aaad218a13e"}
*/
router.get(
  '/view/:id',
  validator(...validation['viewPoll']),
  viewPoll);

router.post(
  '/create',
  enforceJSON,
  validator(...validation['createPoll']),
  createPoll);

router.post(
  '/vote',
  enforceJSON,
  validator(...validation['votePoll']),
  votePoll);

/*
  Append a new choice to an existing poll.
  This expects the _id of the answer only, rather than
  the poll _id too. Due to how mongo queries work, this
  is possible, but confusing in retrospect.
*/
router.put(
  '/append/:id',
  enforceJSON,
  validator(...validation['appendPollAnswer']),
  appendPollAnswer);

async function viewPoll(ctx, next) {
  const {id} = ctx.params;
  // TODO - throw 400 if id missing
  return pollModel.viewPoll(id)
  .then((poll) => {
    ctx.type = 'json';
    ctx.body = poll;
  });
}

async function createPoll(ctx, next) {
  const payload = Object.assign(
    {},
    {data: ctx.request.body.payload},
    {user: ctx.state.user});

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

async function votePoll(ctx, next) {
  const {id} = ctx.request.body;
  return pollModel.vote(id)
  .then((poll) => {
    ctx.type = 'json';
    ctx.body = poll;
  });
}

async function appendPollAnswer(ctx, next) {
  const {id} = ctx.params;
  const payload = Object.assign(
    {},
    {data: ctx.request.body.payload},
    {user: ctx.state.user});

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

module.exports = router;
