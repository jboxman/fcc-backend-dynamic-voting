const config = require('../../config/envs');

import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import {
  Input,
  Menu
} from 'semantic-ui-react';

import popup from '../../util/openWindow';
import * as userActions from '../redux/userActions';

class AppMenu extends React.Component {
  constructor() {
      super();
      this.state = {};
      // This mysteriously fails with
      // warning: setstate(...): can only update a mounted or mounting component
      //this.handleItemClick = this.handleItemClick.bind(this);
      //console.log(this);
  }

  // dispatch to user login
  handleLogIn(e, {name}) {
    const promise = popup(config.app.oauthUrl);
    promise.then(user => this.props.actions.injectUser(user));
  }

  handleLogOut(e, {name}) {
    this.props.actions.logoutUser();
  }

  handleItemClick(e, {name}) {
    console.log(name);
    this.setState({activeItem: name});
  }

  render() {
    const {activeItem} = this.state;
    const {isAuthenticated} = this.props;

    const loginButton =  isAuthenticated ?
      <Menu.Item name="Logout" onClick={this.handleLogOut.bind(this)} />
      : 
      <Menu.Item name="Login" onClick={this.handleLogIn.bind(this)} />;

    return (
      <Menu>
        <Menu.Item
          name='Add poll'
          onClick={this.handleItemClick.bind(this)}
        >
          Add poll
        </Menu.Item>

        <Menu.Item
          name='My polls'
          onClick={this.handleItemClick}
        >
          My polls
        </Menu.Item>

        <Menu.Item
          name='All polls'
          active={activeItem === 'upcomingEvents'}
          onClick={this.handleItemClick}
        >
          All polls
        </Menu.Item>
        <Menu.Menu position='right'>
          {loginButton}
        </Menu.Menu>
      </Menu>
    )
  }
}

AppMenu.defaultProps = {
  isAuthenticated: true
}

const mapStateToProps = state => ({
  isAuthenticated: state.currentUser.isAuthenticated
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppMenu);
