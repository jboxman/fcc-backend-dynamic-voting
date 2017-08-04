const isAuthenticated = (ctx, next) => {
  return ctx.isAuthenticated() ? next() : ctx.status = 403;
};

const enforceJSON = (ctx, next) => {
  return ctx.request.type == 'application/json' ? next() : ctx.status = 400;
};

module.exports = {
  isAuthenticated,
  enforceJSON
}
