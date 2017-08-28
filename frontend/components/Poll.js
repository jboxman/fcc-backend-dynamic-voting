import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Form,
  Card,
  Icon,
  Button,
  Image
} from 'semantic-ui-react';

import PollVotingChart from './PollVotingChart';
import PollChoices from './PollChoices';

// TODO - refactor
import { denormalize } from 'normalizr';
import { getPollSchema } from '../api/schema';

import withAuthStatus from './hoc/withAuthStatus';

class Poll extends React.Component {
  constructor() {
    super();
  }

  renderFormCheckboxes() {
    const {poll} = this.props;    
    return poll.answers.map((v, i) => {
      return (
        <Form.Checkbox key={v.id} label={`${i+1}. ${v.text}`} />
      );
    });
  }

  // TODO - only allow add answer or delete of OWN polls, by ID
  renderActionButtons() {
    const {isAuthenticated} = this.props;
    const buttons = [];
    if(isAuthenticated) {
      buttons.push(
        <Button key={1} basic color='green'>Add choice</Button>,
        <Button key={2} basic color='red'>Delete poll</Button>
      );
    }
    buttons.push(<Button key={3} basic color='blue'>Share</Button>);
    return buttons;
  }

  render() {
    const {poll, isAuthenticated} = this.props;
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            {poll.question}
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <PollVotingChart pollId={poll.id} poll={poll} />
        </Card.Content>
        <Card.Content>
          <PollChoices pollId={poll.id} answers={poll.answers} isAuthenticated={isAuthenticated} />
        </Card.Content>
        <Card.Content>
          <Image avatar src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" />
          Poll by <strong>{poll.createdBy.username}</strong>
        </Card.Content>
        <Card.Content extra>
          <div className='ui three buttons'>
            {this.renderActionButtons()}
          </div>
        </Card.Content>
      </Card>
    );
  }
}

Poll.propTypes = {
  pollId: propTypes.string.isRequired,
  isAuthenticated: propTypes.bool
};

Poll.defaultProps = {
  isAuthenticated: false
};

const mapStateToProps = (state, ownProps) => ({
  poll: denormalize(ownProps.pollId, getPollSchema(), state.polls.data.entities)
});

export default withAuthStatus(connect(mapStateToProps)(Poll));
