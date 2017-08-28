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

    const {editMode} = this.props;
    this.state = {
      editMode
    };

    this.inputEl = null;
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
    return answers.map((v, i) => {
      return (
        <Form.Checkbox key={v.id} label={`${i+1}. ${v.text}`} />
      );
    });
  }

  // This has our submit
  renderInputField() {
    const {isAuthenticated} = this.props;
    const {editMode} = this.state;

    if(isAuthenticated) {
      if(!editMode) {
        return <Button onClick={e => this.setState({editMode: true})}>Add</Button>;
      }
      else {
        return (
          <Form.Group inline>
          <Form.Field><Input ref={el => this.inputEl = el} /></Form.Field>
          <Button onClick={this.handleAddChoice.bind(this)}>Save</Button>
          <Button onClick={e => this.setState({editMode: false})}>Cancel</Button>
          </Form.Group>
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
            <Button type='submit'>Vote</Button>
          </Form>
    );
  }
};

PollChoices.propTypes = {
  pollId: PropTypes.string.isRequired,
  answers: PropTypes.array.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  maxAnswers: PropTypes.number.isRequired,
  editMode: PropTypes.bool.isRequired
};

PollChoices.defaultProps = {
  maxAnswers: 5,
  isAuthenticated: false,
  editMode: true
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(pollActions, dispatch)
});

export default connect(null, mapDispatchToProps)(PollChoices);
