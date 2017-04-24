const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const debug = require('debug')('fcc-voting');

const pollsRouter = require('./polls');

// Load React UI
router.get('/', async function(ctx, next) {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(path.join(__dirname, '../views/index.html'));
});

router.use(pollsRouter.routes());

module.exports = router;
