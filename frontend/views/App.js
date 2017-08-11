import React from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink } from 'react-router';
import { Router } from 'react-router';

import routes from '../routes';
import popup from '../../util/openWindow';

import AppMenu from '../components/AppMenu';
import PollGroup from '../components/PollGroup';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class App extends React.Component {
  render() {
    const {history} = this.props;
    return (
      <div>
        <AppMenu />
        <PollGroup />
        <Router history={history} routes={routes} />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  history: PropTypes.object.isRequired
};

export default App;
