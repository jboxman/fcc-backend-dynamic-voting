const config = require('../../config/envs');

import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import {
  Input,
  Menu,
  Dropdown,
  Icon,
  Image,
  Checkbox
} from 'semantic-ui-react';

import loginTab from '../../util/openWindow';
import * as userActions from '../redux/userActions';
import * as uiActions from '../redux/uiActions';

import withAuthStatus from './hoc/withAuthStatus';

class AppMenu extends React.Component {
  constructor() {
      super();
  }

  showAll() {
    this.props.uiActions.showAll();
  }

  showOwn() {
    this.props.uiActions.showOwn();
  }

  handleLogIn(e, {name}) {
    const msg = loginTab(config.app.oauthUrl);
    msg.then(user => {
      this.props.userActions.injectUser(user);
    });
  }

  handleLogOut(e, {name}) {
    this.props.userActions.logoutUser();
  }

  // TODO - Add UserMenu with user specific choices when loggedIn only

  render() {
    const {isAuthenticated, currentUser} = this.props;

const trigger = (
   <span>
     <Icon name='user' />
     {isAuthenticated ? currentUser.username : ''}
   </span>);
//      <Menu.Item name="Logout" onClick={this.handleLogOut.bind(this)} />
    const loginButton =  isAuthenticated ?
    <Menu.Item>
      <Dropdown simple trigger={trigger}>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to='/create'>Add poll</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={this.showAll.bind(this)}>All polls</Dropdown.Item>
          <Dropdown.Item onClick={this.showOwn.bind(this)}>My polls</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={this.handleLogOut.bind(this)}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </Menu.Item>
      : 
      <Menu.Item name="Login" onClick={this.handleLogIn.bind(this)} />;

    //<Menu.Item as={Link} to='/create'>
    return (
      <Menu>
        <Menu.Menu position='right'>
          {loginButton}
        </Menu.Menu>
      </Menu>
    )
  }
}

AppMenu.PropTypes = {
  isAuthenticated: propTypes.bool,
  currentUser: propTypes.object
};

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
  uiActions: bindActionCreators(uiActions, dispatch)
});

export default withAuthStatus(connect(mapStateToProps, mapDispatchToProps)(AppMenu));
