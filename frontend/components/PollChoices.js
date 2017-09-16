import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Input
} from 'semantic-ui-react';

import { pollApi } from '../api/index';
import * as pollActions from '../redux/pollActions';


class PollChoices extends React.Component {
  constructor(props) {
    super(props);

    //const {editMode} = this.props;
    this.state = {
      editMode: false,
      pollChoice: null
    };

    this.inputEl = null;
  }

  // Get active radio button
  handleVote() {
    const {pollChoice} = this.state;
    pollApi.vote(pollChoice).then(data => {
      this.props.actions.voteInPoll(pollChoice);
    });
  }

  handleRadioSelection(e, {value}) {
    this.setState({pollChoice: value});
  }

  // Unmanaged field
  handleAddChoice() {
    const text = this.inputEl.inputRef.value;
    if(!text) {
      return;
    }
    const payload = {
      text
    };

    // TODO - Handle sad-path
    pollApi.addAnswer(this.props.pollId, payload)
    .then(data => {
      this.setState({
        editMode: false
      });

      this.props.actions.addPollChoice(data);
    });
  }

  renderFormCheckboxes() {
    const {answers} = this.props;
    const {pollChoice} = this.state;
    return answers.map((v, i) => {
      return (
        <Form.Radio
          key={v.id} label={`${i+1}. ${v.text} (${v.voteCount})`} value={v.id}
          checked={pollChoice == v.id} onChange={this.handleRadioSelection.bind(this)}/>
      );
    });
  }

  // This has our submit
  renderInputField() {
    const {isAuthenticated, answers, maxAnswers} = this.props;
    const {editMode} = this.state;

    if(isAuthenticated) {
      if(!editMode) {
         return answers.length <= maxAnswers ?
          <Button onClick={e => this.setState({editMode: true})}>Add</Button>
          :
          null;
      }
      else {
        return (
          <div>
          <Form.Field><Input ref={el => this.inputEl = el} /></Form.Field>
          <Button onClick={this.handleAddChoice.bind(this)}>Save</Button>
          <Button onClick={e => this.setState({editMode: false})}>Cancel</Button>
          </div>
        );
      }
    }
    return null;
  }

  render() {
    return (
          <Form>
            <Form.Group grouped>
              <label>Choices</label>
          {
            this.renderFormCheckboxes()
          }
          {
            this.renderInputField()
          }
            </Form.Group>
            <Button type='submit' disabled={!this.state.pollChoice} onClick={this.handleVote.bind(this)}>Vote</Button>
          </Form>
    );
  }
};

PollChoices.propTypes = {
  pollId: PropTypes.string.isRequired,
  answers: PropTypes.array.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  maxAnswers: PropTypes.number.isRequired,
  //editMode: PropTypes.bool.isRequired
};

PollChoices.defaultProps = {
  maxAnswers: 5,
  isAuthenticated: false,
  //editMode: true
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(pollActions, dispatch)
});

export default connect(null, mapDispatchToProps)(PollChoices);
