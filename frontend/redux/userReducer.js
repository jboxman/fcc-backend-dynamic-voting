import * as actionTypes from './userActionTypes';

export const STATE_KEY = 'currentUser';

export const initialState = {
  isAuthenticated: false,
  user: {}
};

/*
{
    email: "jasonb@edseek.com",
    username: "jboxman",
    avatarUrl: "https://avatars2.githubusercontent.com/u/354496?v=4",
    votedPolls: [],
    id: "598cea681793df0bda448850"
}
*/

export default function userReducer(state = initialState, action = {}) {
  const {type, payload} = action;

  switch(type) {
    case actionTypes.INJECT:
      return {
        ...state,
        isAuthenticated: true,
        user: payload.user
      };

    case actionTypes.LOGOUT:
      return {
        ...initialState
      };
    
    default:
      return state;
  }
};
