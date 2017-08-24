import * as uiActions from './uiActionTypes';

export const STATE_KEY = 'ui';

const initialState = {
  filterByCurrentUser: false
};

export default function (state = initialState, action = {}) {
  const {type, payload} = action;

  switch(type) {
    case uiActions.UI_FILTER_CURRENT_USER:
      return {
        ...state,
        filterByCurrentUser: true
      };
    case uiActions.UI_FILTER_NONE:
      return {
        ...state,
        filterByCurrentUser: false
      };
    default:
      return state;
  }
};
