import React from 'react';
import propTypes from 'prop-types';

import {
  Card,
  Icon,
  Button
} from 'semantic-ui-react';

import Poll from './Poll';

export default class PollGroup extends React.Component {
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

PollGroup.propTypes = {
  polls: propTypes.arrayOf(propTypes.string).isRequired
};
