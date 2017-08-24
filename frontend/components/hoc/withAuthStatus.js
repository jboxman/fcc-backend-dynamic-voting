import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
  isAuthenticated: state.currentUser.isAuthenticated
});

export default function withAuthStatus(WrappedComponent) {
  return connect(mapStateToProps)(class extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const {isAuthenticated, ...rest} = this.props;
      console.log(isAuthenticated);
      return <WrappedComponent isAuthenticated={isAuthenticated} {...rest} />;
    }
  });
};
