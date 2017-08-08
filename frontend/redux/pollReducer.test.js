import test from 'tape';
import {LIFECYCLE, KEY} from 'redux-pack';

import reducer from './pollReducer';
import * as Actions from './pollActions';
import normalizeData from '../api/schema';
import mockData from '../mocks/data.json';

const payload = normalizeData(mockData);

// From: https://github.com/lelandrichardson/redux-pack
// this utility method will make an action that redux pack understands
function makePackAction(lifecycle, payload, { type, meta={} }) {
  return {
    type,
    payload,
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

  t.test('with FETCH type', t => {
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
      start: makePackAction(LIFECYCLE.START, {}, Actions.fetchPolls()),
      success: makePackAction(LIFECYCLE.SUCCESS, payload, Actions.fetchPolls())
    }

    t.deepEqual(reducer(undefined, actual.start), expected.start, 'on start');
    t.deepEqual(reducer(undefined, actual.success), expected.success, 'on success');

    t.end();
  });

  t.end();
});
