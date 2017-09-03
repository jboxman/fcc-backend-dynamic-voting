import * as actionTypes from './uiActionTypes';

export const showAll = () => ({
  type: actionTypes.UI_FILTER_NONE
});

export const showOwn = () => ({
  type: actionTypes.UI_FILTER_CURRENT_USER
});
