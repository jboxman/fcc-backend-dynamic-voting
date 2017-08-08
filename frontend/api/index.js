import axios from 'axios';

import normalizeData from './schema';

// Here we can reject the promise if "success": false
const pollApi = {
  fetch() {
    return axios.get('/api/polls')
    .then(result => result.data.data)
    .then(data => normalizeData(data));
  }
}

export {
  pollApi
};
