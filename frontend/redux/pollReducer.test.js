import test from 'tape';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import { LIFECYCLE, KEY } from 'redux-pack';

import reducer, { initialState as pollInitialState } from './pollReducer';
import * as Actions from './pollActions';
import normalizeData from '../api/schema';

const request = new axiosMockAdapter(axios);

const util = require('util');
const inspectLog = (value) => console.log(util.inspect(value, false, null));

// From: https://github.com/lelandrichardson/redux-pack
// this utility method will make an action that redux pack understands
async function makePackAction(lifecycle, { type, promise, meta={} }) {
  // Manually set payload to mimick what happens in redux-pack middleware
  return {
    type,
    payload: (lifecycle != LIFECYCLE.START) ? await promise : undefined,
    meta: {
      ...meta,
      [KEY.LIFECYCLE]: lifecycle
    }
  }
}

test('recipeReducer', t => {

  t.test('without arguments', t => {
    const msg = 'should return default state';
    const expected = pollInitialState;
    const actual = reducer(undefined);

    t.deepEqual(actual, expected, msg);
    
    t.end();
  });

  t.test('with FETCH type', async t => {
    const payload = require('../mocks/polls/fetch.json');
    const data = normalizeData(payload.data);

    request.onAny().reply(200, payload);

    // Finish always follows success/failure
    const expected = {
      start: {
        ...pollInitialState,
        isLoading: true
      },
      success: {
        ...pollInitialState,
        isLoading: false,
        data
      }
    };

    const action = Actions.fetchPolls();
    const actual = {
      start: await makePackAction(LIFECYCLE.START, action),
      success: await makePackAction(LIFECYCLE.SUCCESS, action)
    }

    t.deepEqual(reducer(undefined, actual.start), expected.start, 'on start');
    t.deepEqual(reducer(undefined, actual.success), expected.success, 'on success');

    request.reset();
    t.end();
  });

  // If the create is successful, there should be additional data merged into our store
  t.test('with CREATE type, empty store', async t => {
    // This should be the create mock
    const payload = require('../mocks/polls/create-success.json');
    const data = normalizeData(payload.data);
    request.onAny().reply(200, payload);

    const expected = {};

    const action = Actions.createPoll();
    const actual = {
      success: await makePackAction(LIFECYCLE.SUCCESS, action)
    };

    request.reset();
    t.end();
  });

  /*
    TODO -
    - Test for new poll with a user not current in state
    - Mock correct URLs and HTTP verbs
  */
  t.test('with CREATE type, populated store', async t => {
    // This should be the create mock
    const initial = require('../mocks/polls/fetch.json');
    const initialData = normalizeData(initial.data);

    const poll = require('../mocks/polls/create-success.json');
    const newPoll = normalizeData(poll.data);
    
    request
    .onAny().replyOnce(200, initial)
    .onAny().replyOnce(200, poll);

    const hasKey = (key, data) => Object.keys(data).includes(key);

    const currentState = reducer(undefined, await makePackAction(LIFECYCLE.SUCCESS, Actions.fetchPolls()));

    const action = Actions.createPoll();
    const actual = {
      success: await makePackAction(LIFECYCLE.SUCCESS, action)
    };

    const newState = reducer(currentState, actual.success);

    inspectLog(Object.keys(currentState.data.entities.answers).length);
    inspectLog(Object.keys(newState.data.entities.answers).length);

    t.equal(newState.data.result.length, 3, 'append result');
    t.equal(hasKey(newPoll.result[0], newState.data.entities.polls), true, 'have new key');
    t.equal(
      Object.keys(newState.data.entities.answers).length,
      (Object.keys(currentState.data.entities.answers).length + Object.keys(newPoll.entities.answers).length),
      'has new answers');

    request.reset();
    t.end();
  });

  t.skip('with ADD_CHOICE type', async t => {
    t.end();
  });

  t.skip('with DELETE type', async t => {
    t.end();
  });

  // sync
  t.skip('with FILTER type', t => {
    t.end();
  });

  t.end();
});
