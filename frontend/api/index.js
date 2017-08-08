import axios from 'axios';

import normalizeData from './schema';

// Here we can reject the promise if "success": false
const pollApi = {

  fetch() {
    return axios.get('/api/polls')
    .then(result => result.data.data)
    .then(data => normalizeData(data));
  },

  /*
  destroy(id) {
    return axios.get(`/api/polls/destroy/${id}`)
    .then(result => result);
  },
  */

  create(payload) {
    return axios.post('/api/polls/create', {payload})
    .then(result => result.data.data);
  },

  // TODO - use empty body instead for this
  vote(id) {
    return axios.post('/api/polls/vote', {id})
    .then(result => result.data.data);
  },

  addAnswer(id, payload) {
    return axios.post(`/api/polls/append/${id}`, {payload})
  }
}

export {
  pollApi
};
