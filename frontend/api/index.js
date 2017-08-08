import normalizeData from './schema';
import mockData from '../mocks/data.json';

// Here we can reject the promise if "success": false
const pollApi = {
  fetch() {
    return new Promise((fulfill) => {
      const normalized = normalizeData(mockData);
      fulfill(normalized);
    });
  }
}

export {
  pollApi
};
