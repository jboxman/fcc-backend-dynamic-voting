import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import pollReducer, { STATE_KEY as POLL_STATE_KEY } from './pollReducer';
import userReducer, { STATE_KEY as USER_STATE_KEY } from './userReducer';
import uiReducer, { STATE_KEY as UI_STATE_KEY } from './uiReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  [POLL_STATE_KEY]: pollReducer,
  [USER_STATE_KEY]: userReducer,
  [UI_STATE_KEY]: uiReducer
});

export default rootReducer;
