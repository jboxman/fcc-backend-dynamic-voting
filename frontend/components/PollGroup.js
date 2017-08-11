import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Card,
  Icon,
  Button
} from 'semantic-ui-react'

import Poll from './Poll';

const data = require('../mocks/output.json');

class PollGroup extends React.Component {
  renderPolls() {
    const {polls} = this.props;
    return polls.map(id => <Poll key={id} pollId={id} />);
  }

  render() {
    return (
      <Card.Group>
        {this.renderPolls()}
      </Card.Group>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  polls: state.polls.data.result
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PollGroup);
