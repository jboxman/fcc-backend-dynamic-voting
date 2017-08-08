import test from 'tape';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import {LIFECYCLE, KEY} from 'redux-pack';

import reducer from './pollReducer';
import * as Actions from './pollActions';
import normalizeData from '../api/schema';
import mockData from '../mocks/data.json';

const request = new axiosMockAdapter(axios);

const payload = normalizeData(mockData);

// From: https://github.com/lelandrichardson/redux-pack
// this utility method will make an action that redux pack understands
async function makePackAction(lifecycle, { type, promise, meta={} }) {
  // Manually set payload to mimick what happens in redux-pack middleware
  return {
    type,
    payload: await promise,
    meta: {
      ...meta,
      [KEY.LIFECYCLE]: lifecycle
    }
  }
}

test('recipeReducer', t => {

  t.test('without arguments', t => {
    const msg = 'should return default state';
    const expected = {};
    const actual = reducer(undefined);

    t.deepEqual(actual, expected, msg);
    
    t.end();
  });

  t.test('with FETCH type', async t => {
    request.onAny().reply(200, mockData);

    // Finish always follows success/failure
    const expected = {
      start: {
        isLoading: true
      },
      success: {
        isLoading: false,
        data: payload
      }
    };

    const actual = {
      start: await makePackAction(LIFECYCLE.START, Actions.fetchPolls()),
      success: await makePackAction(LIFECYCLE.SUCCESS, Actions.fetchPolls())
    }

    console.log(actual.success);

    t.deepEqual(reducer(undefined, actual.start), expected.start, 'on start');
    t.deepEqual(reducer(undefined, actual.success), expected.success, 'on success');

    t.end();
  });

  t.end();
});
