import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import App from '../views/App';

export default class Root extends Component {
  render() {
    const {store, history} = this.props;
    return (
      <Provider store={store}>
        <App history={history} />
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
