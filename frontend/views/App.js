import React from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink } from 'react-router';
import { Router } from 'react-router';

import routes from '../routes';

import AppMenu from '../components/AppMenu';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class App extends React.Component {
  render() {
    return (
      <div>
        <AppMenu />
        {this.props.children}
      </div>
    );
  }
}

export default App;
