import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './views/App';
import NotFoundPage from './views/NotFoundPage';
import ListPolls from './views/ListPolls';
import AddPoll from './views/AddPoll';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ListPolls} />
    <Route path="/create" component={AddPoll} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);
