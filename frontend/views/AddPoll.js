import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import PollForm from '../components/PollForm';

export default class AddPoll extends React.Component {

  handleCancel() {
    this.props.router.push('/');
  }

  doRedirect() {
    this.props.router.push('/');
  }

  render() {
    return <PollForm
      handleCancel={this.handleCancel.bind(this)}
      doRedirect={this.doRedirect.bind(this)}
      initialData={this.props.initialData}
      />;
  }  
}

AddPoll.defaultProps = {
  initialData: {
    question: '',
    answers: [
      '', '', '', '', '', ''
    ]
  }
};
