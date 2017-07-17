const pollModel = require('./pollModel');

function success(result, obj = {success: true, data: null}) {
  if(Array.isArray(result)) {
    obj.data = [].concat(result.map(mdoc => mdoc.toJSON()));
    obj.count = result.length;
  }
  else {
    obj.data = [result.toJSON()];
    obj.count = 1;
  }
  //Object.assign(obj.data, result);
  return obj;
}

// Also called if an exception is raised in success()
function failure(result, obj = {success: false, errors: {}}) {
  Object.assign(obj.errors, result);
  return obj;
}

function findAllPolls() {
  // Array
  return pollModel.findAllPolls()
  .then(success)
  .catch(failure);
}

function viewPoll(id) {
  return pollModel.viewPoll(id)
  .then(success)
  .catch(failure);
}

async function createPoll(data, user) {
  const payload = Object.assign({}, data, {createdBy: user._id});

  return pollModel.addPoll(payload)
  .then(success)
  .catch(failure);
};

async function votePoll(id) {
  return pollModel.vote(id)
  .then(success)
  .catch(failure);
}

// Watch user
async function appendPollAnswer(id, data, user) {
  const payload = Object.assign(
    {},
    {data},
    {createdBy: user._id});

  return pollModel.addAnswer(id, payload)
  .then(success)
  .catch(failure);
};

module.exports = {
  findAllPolls,
  viewPoll,
  createPoll,
  appendPollAnswer,
  votePoll
};
