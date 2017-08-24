const config = require('../../config/envs');

import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import {
  Input,
  Menu
} from 'semantic-ui-react';

import loginTab from '../../util/openWindow';
import * as userActions from '../redux/userActions';

class AppMenu extends React.Component {
  constructor() {
      super();
  }

  handleLogIn(e, {name}) {
    const msg = loginTab(config.app.oauthUrl);
    msg.then(user => {
      this.props.actions.injectUser(user);
    });
  }

  handleLogOut(e, {name}) {
    this.props.actions.logoutUser();
  }

  // TODO - Add UserMenu with user specific choices when loggedIn only

  render() {
    const {isAuthenticated} = this.props;

    const loginButton =  isAuthenticated ?
      <Menu.Item name="Logout" onClick={this.handleLogOut.bind(this)} />
      : 
      <Menu.Item name="Login" onClick={this.handleLogIn.bind(this)} />;

    return (
      <Menu>
        <Menu.Item as={Link} to='/create'>
          Add poll
        </Menu.Item>
        <Menu.Item as={Link} to='/'>
          My polls
        </Menu.Item>
        <Menu.Item as={Link} to='/'>
          All polls
        </Menu.Item>
        <Menu.Menu position='right'>
          {loginButton}
        </Menu.Menu>
      </Menu>
    )
  }
}

AppMenu.PropTypes = {
  isAuthenticated: propTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.currentUser.isAuthenticated
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppMenu);
