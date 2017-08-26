import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
  isAuthenticated: state.currentUser.isAuthenticated,
  currentUser: state.currentUser.user
});

export default function withAuthStatus(WrappedComponent) {
  return connect(mapStateToProps)(class extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const {isAuthenticated, currentUser, ...rest} = this.props;
      return <WrappedComponent isAuthenticated={isAuthenticated} currentUser={currentUser} {...rest} />;
    }
  });
};
