import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import pollsReducer from './pollReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  polls: pollsReducer
});

export default rootReducer;
