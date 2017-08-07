import * as pollActionTypes from './pollActionTypes';

export function createPoll(payload = {}) {
  return {
    type: pollActionTypes.CREATE,
    payload
  }
}

export function deletePoll(payload = {id: null}) {
  return {
    type: pollActionTypes.DELETE,
    payload
  }
}

export function fetchPolls() {
  return {
    type: pollActionTypes.FETCH
  }
}

export function filterPolls(payload = {createdBy: null}) {
  return {
    type: pollActionTypes.FILTER,
    payload
  }
}

export function addPollChoice(payload = {}) {
  return {
    type: pollActionTypes.ADD_CHOICE,
    payload
  }
}