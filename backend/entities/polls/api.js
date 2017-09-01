const Router = require('koa-router');
const {
  default: validator,
  object,
  string,
  array
} = require('koa-context-validator');
const debug = require('debug')('fcc-voting');

const controller = require('./controller');
const {
  enforceJSON,
  isAuthenticated
} = require('../../helpers');

const router = new Router({
  prefix: '/polls'
});

// BUG - 'ValidationError: "0" is not allowed' without stripUnknown
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
       params: object({
        id: string().required()
      })
    },
    {
      // Silently allows unknown values
      stripUnknown: true
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
    const polls = await controller.findAllPolls();
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
  isAuthenticated,
  enforceJSON,
  validator(...validation['createPoll']),
  createPoll);

/*
  This expects the _id of the answer only, rather than
  the poll _id too. Due to how mongo queries work, this
  is possible, but confusing in retrospect.
*/
router.post(
  '/vote/:id',
  isAuthenticated,
  enforceJSON,
  validator(...validation['votePoll']),
  votePoll);

router.put(
  '/append/:id',
  isAuthenticated,
  enforceJSON,
  validator(...validation['appendPollAnswer']),
  appendPollAnswer);

// Unused
async function viewPoll(ctx, next) {
  const {id} = ctx.params;
  // TODO - throw 400 if id missing
  return controller.viewPoll(id)
  .then((poll) => {
    ctx.type = 'json';
    ctx.body = poll;
  });
}

async function createPoll(ctx, next) {
  return controller.createPoll(ctx.request.body.payload, ctx.state.user)
  .then((doc) => {
    ctx.status = 201;
    ctx.type = 'json';
    ctx.body = doc;
  })
  .catch(err => {
    console.log(err);
    ctx.body = {errors: err.errors};
    ctx.status = 400;
  })
};

async function votePoll(ctx, next) {
  const {id} = ctx.params;
  return controller.votePoll(id)
  .then((poll) => {
    ctx.type = 'json';
    ctx.body = poll;
  });
};

async function appendPollAnswer(ctx, next) {
  const {id} = ctx.params;

  return controller.appendPollAnswer(id, ctx.request.body.payload, ctx.state.user)
  .then((poll) => {
    ctx.type = 'json';
    ctx.body = poll;
  })
  .catch((v) => {
    ctx.status = 500;
    //ctx.throw(500);
  });
};

module.exports = router;
