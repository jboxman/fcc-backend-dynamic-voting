import * as actionTypes from './userActionTypes';

export default function userReducer(state = {}, action = {}) {
  const {type, payload} = action;
  switch(type) {
    case actionTypes.INJECT:
      return state;
    default:
      return state;
  }
}
