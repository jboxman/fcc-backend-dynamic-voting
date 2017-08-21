import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import pollReducer from './pollReducer';
import userReducer, { STATE_KEY as USER_STATE_KEY } from './userReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  polls: pollReducer,
  [USER_STATE_KEY]: userReducer
});

export default rootReducer;
