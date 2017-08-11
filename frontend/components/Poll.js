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

import { denormalize } from 'normalizr';
import { getPollSchema } from '../api/schema';

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

  render() {
    const {poll} = this.props;
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
          <Form>
            <Form.Group grouped>
              <label>Choices</label>
          {
            this.renderFormCheckboxes()
          }
            </Form.Group>
          </Form>
        </Card.Content>
        <Card.Content>
          <Image avatar src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" />
          Poll by <strong>{poll.createdBy.email}</strong>
        </Card.Content>
        <Card.Content extra>
          <div className='ui three buttons'>
            <Button basic color='green'>Add choice</Button>
            <Button basic color='red'>Delete poll</Button>
            <Button basic color='blue'>Share</Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

Poll.propTypes = {
  pollId: propTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  poll: denormalize(ownProps.pollId, getPollSchema(), state.polls.data.entities)
});

export default connect(mapStateToProps)(Poll);
