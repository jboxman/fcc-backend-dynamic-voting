const Router = require('koa-router');
const debug = require('debug')('fcc-voting');

const answerModel = require('../../models/answers');

const router = new Router({
  prefix: '/answers'
});

/*
  TODO
  - vote for answer
  - add answer
*/
