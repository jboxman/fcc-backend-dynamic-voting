import { handle } from 'redux-pack';
import * as actionTypes from './pollActionTypes';

// polls.data.(entities|result)
// TODO - add visiblePolls array

export const initialState = {
  isLoading: false,
  visiblePolls: [],
  addPoll: {},
  data: {
    entities: {},
    result: []
  }
};

export default function pollReducer(state = initialState, action = {}) {
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

    case actionTypes.CREATE:
      return handle(state, action, {
        success: prevState => {
          const id = payload.result[0];
          let newState = {
            ...prevState,
            data: {
              entities: {
                ...prevState.data.entities,
                polls: {
                  ...prevState.data.entities.polls,
                  [id]: {
                    ...payload.entities.polls[id]
                  }
                }
              },
              result: [
                ...prevState.data.result,
                id
              ]
            }
          };

          // Add user if not currently known to us
          if(state.data.entities.users
            && !state.data.entities.users.hasOwnProperty(payload.entities.polls[id].createdBy)) {
            newState = {
              ...newState,
              data: {
                ...newState.data,
                entities: {
                  ...newState.data.entities,
                  users: {
                    ...newState.data.entities.users,
                    [payload.entities.polls[id].createdBy]: {
                      ...payload.entities.users[id]
                    }
                  }
                }
              }
            }
          }

          // A new answer will never be known to us
          newState.data.entities.answers = Object.assign(
            {},
            newState.data.entities.answers,
            payload.entities.answers);

          return newState;
        }
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
