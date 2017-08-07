import test from 'tape';
import reducer from './pollReducer';
import * as Actions from './pollActions';

test('recipeReducer', t => {

  t.test('without arguments', t => {
    const msg = 'should return default state';
    const expected = {};
    const actual = reducer(undefined);

    t.deepEqual(actual, expected, msg);
    
    t.end();
  });

  t.end();
});
