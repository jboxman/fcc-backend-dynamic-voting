import { pollApi } from '../api';
import * as pollActionTypes from './pollActionTypes';

export function createPoll(poll = {}) {
  return {
    type: pollActionTypes.CREATE,
    promise: pollApi.create(poll)
  }
}

// TODO - implement
export function deletePoll({id}) {
  return {
    type: pollActionTypes.DELETE,
    payload
  }
}

export function fetchPolls() {
  return {
    type: pollActionTypes.FETCH,
    promise: pollApi.fetch()
  }
}

export function voteInPoll(id) {
  return {
    type: pollActionTypes.VOTE,
    payload: {
      answerId: id
    }
  }
}

export function filterPolls({createdBy}) {
  return {
    type: pollActionTypes.FILTER,
    payload: {
      createdBy
    }
  }
}

export function addPollChoice(poll) {
  return {
    type: pollActionTypes.ADD_CHOICE,
    payload: {
      ...poll
    }
  }
}
