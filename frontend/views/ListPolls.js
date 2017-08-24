import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import { pollSelectorByUser } from '../redux/pollReducer';
import PollGroup from '../components/PollGroup';

class ListPolls extends React.Component {
  render() {
    const {polls} = this.props;
    return <PollGroup polls={polls} />;
  }
}

const mapStateToProps = (state, ownProps) => ({
  polls: pollSelectorByUser(state, state.ui.filterByCurrentUser ? state.currentUser.user.id : false)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListPolls);
