import React from 'react';
import propTypes from 'prop-types';

import {
  Input,
  Menu
} from 'semantic-ui-react';

/*
  We care about user authentication status here.
  isAuthenticated?
*/

class AppMenu extends React.Component {
  constructor() {
      super();
      this.state = {};
      this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(e, {name}) {
    this.setState({activeItem: name});
  }

  render() {
    const { activeItem } = this.state;
    return (
      <Menu>
        <Menu.Item
          name='Add poll'
          onClick={this.handleItemClick}
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
          <Menu.Item name="Login" />
        </Menu.Menu>
      </Menu>
    )
  }
}

AppMenu.defaultProps = {
  isAuthenticated: true
}

export default AppMenu;
