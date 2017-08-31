/* eslint-disable import/default */

import React from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import {AppContainer} from 'react-hot-loader';
import Root from './App/Root';

import configureStore from './App/configureStore';
import {syncHistoryWithStore} from 'react-router-redux';

require('./favicon.ico'); // Tell webpack to load favicon.ico
import 'semantic-ui-css/semantic.min.css';

import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import { pollApi } from './api';
import { initialState } from './redux/pollReducer';

if(process.env.NODE_ENV == 'development') {
  const payload = require('./mocks/polls/fetch.json');
  const request = new axiosMockAdapter(axios);

  request.onGet(/\/polls/).reply(200, payload);
}

// initialState is undefined unless provided here
const getData = async () => await pollApi.fetch();

const renderApp = async () => {
  const store = configureStore({
    polls: {
      ...initialState,
      data: await getData()
    }
  });

  // Create an enhanced history that syncs navigation events with the store
  const history = syncHistoryWithStore(browserHistory, store);

  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('app')
  );
};

renderApp();

if (module.hot) {
  module.hot.accept('./App/Root', () => {
    const NewRoot = require('./App/Root').default;
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
