import { handle } from 'redux-pack';
import * as actionTypes from './pollActionTypes';

import { denormalize } from 'normalizr';
import { getPollSchema } from '../api/schema';

export const STATE_KEY = 'polls';

// polls.data.(entities|result)

export const initialState = {
  isLoading: false,
  data: {
    entities: {},
    result: []
  }
};

// TODO - Try
// https://stackoverflow.com/questions/35592078/cleaner-shorter-way-to-update-nested-state-in-redux

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
      {
        const pollId = payload.result[0];
        let newState = {
          ...state,
          data: {
            entities: {
              ...state.data.entities,
              polls: {
                ...state.data.entities.polls,
                [pollId]: {
                  ...payload.entities.polls[pollId]
                }
              }
            },
            result: [
              ...state.data.result,
              pollId
            ]
          }
        };

        newState = updateUsersEntity(pollId, newState, payload);

        // A new answer will never be known to us
        newState.data.entities.answers = Object.assign(
          {},
          newState.data.entities.answers,
          payload.entities.answers);

        console.log(newState);
        return newState;
      }

    // remove item from local store upon success
    case actionTypes.DELETE:
      return handle(state, action, {

      });

    case actionTypes.VOTE:
      return {
        ...state,
        data: {
          ...state.data,
          entities: {
            ...state.data.entities,
            answers: {
              ...state.data.entities.answers,
              [payload.answerId]: {
                ...state.data.entities.answers[payload.answerId],
                voteCount: (state.data.entities.answers[payload.answerId].voteCount + 1)
              }
            }
          }
        }
      };

    // merge in new answer
    case actionTypes.ADD_CHOICE:
      const choiceId = payload.result[0];
      let newState = {
        ...state,
        data: {
          ...state.data,
          entities: {
            ...state.data.entities,
            answers: {
              ...Object.assign({}, state.data.entities.answers, payload.entities.answers),
            },
            polls: {
              ...state.data.entities.polls,
              [id]: {
                ...state.data.entities.polls[choiceId],
                answers: [...payload.entities.polls[choiceId].answers]
              }
            }
          }
        }
      }
      return newState;

    // manage visiblePolls array
    case actionTypes.FILTER:
      return handle(state, action, {

      });

    default:
      return state;
  }
}

const updateUsersEntity = (id, state, payload) => {
  // Add user if not currently known to us
  const {users} = state.data.entities;
  if(users
    && !users.hasOwnProperty(payload.entities.polls[id].createdBy)) {
    state = {
      ...state,
      data: {
        ...state.data,
        entities: {
          ...state.data.entities,
          users: {
            ...state.data.entities.users,
            [payload.entities.polls[id].createdBy]: {
              ...payload.entities.users[id]
            }
          }
        }
      }
    }
  }

  return state;
};

export const pollSelectorByUser = (state, createdBy = false) => {
  const {entities, result} = state[STATE_KEY].data;
  if(!createdBy) {
    return result;
  }

  return Object.keys(entities.polls)
    .filter(poll => {
      return entities.polls[poll].createdBy == createdBy ? true : false
    })
    .map(poll => entities.polls[poll].id);
};
