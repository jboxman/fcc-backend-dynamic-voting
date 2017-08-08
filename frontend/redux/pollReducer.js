import { handle } from 'redux-pack';
import * as actionTypes from './pollActionTypes';

// polls.data.(entities|result)
// TODO - add visiblePolls array

export default function pollReducer(state = {}, action = {}) {
  const {type, payload} = action;
  switch(type) {
    case actionTypes.FETCH:
      return handle(state, action, {
        start: prevState => {
          return {
            ...prevState,
            isLoading: true
          };
        },
        success: prevState => {
          return {
            ...prevState,
            data: payload
          };
        },
        finish: prevState => {
          return {
            ...prevState,
            isLoading: false
          };
        }
      });

    // merge in created object
    case actionTypes.CREATE:
      return handle(state, action, {

      });

    // remove item from local store upon success
    case actionTypes.DELETE:
      return handle(state, action, {

      });

    // merge in new answer
    case actionTypes.ADD_CHOICE:
      return handle(state, action, {

      });

    // manage visiblePolls array
    case actionTypes.FILTER:
      return handle(state, action, {

      });

    default:
      return state;
  }
}
