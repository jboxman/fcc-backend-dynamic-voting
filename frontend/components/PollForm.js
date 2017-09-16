import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { connect, dispatch } from 'react-redux';

import { Form, Input, Button } from 'semantic-ui-react';
import { DisplayFormikState } from './DisplayFormikState';

import { createPoll } from '../redux/pollActions';
import { STATE_KEY as POLL_STATE_KEY } from '../redux/pollReducer';

import { pollApi } from '../api/index';

// TODO - allow variable number of fields up to a hard limit

const renderChoiceFields = ({values, handleChange, handleBlur}) => {
  const fields = [];
  let count = 0;

  Object.keys(values).forEach(function(field) {
    if(~field.indexOf('answers.')) {
      count++;
      fields.push(
        <Form.Field key={field}>
          <label>Choice {count}</label>
          <Input name={field} value={values[field]} onChange={handleChange} />
        </Form.Field>
      );
    }
  });

  return fields;
}

class PollForm extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      values,
      touched,
      dirty,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      handleReset,
      setFieldValue,
      isSubmitting,
      ...rest
    } = this.props;

    return (
      <div>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Question</label>
          <Form.Input name="question" value={values.question} onChange={handleChange} />
        </Form.Field>
        {
          renderChoiceFields({values, handleChange, handleBlur})
        }
        <Button type='submit'>Submit</Button>
        <Button type='submit' onClick={this.props.handleCancel}>Cancel</Button>
      </Form>
      <DisplayFormikState {...{values, touched, dirty, errors, isSubmitting, rest}} />
      </div>
    );
  }
}

const mapPropsToValues = props => {
  // Flatten answers into answers.0..N
  const answers = props.initialData.answers
    .map((q, idx) => ({[`answers.${idx}`]: q}))
    .reduce((accum, field) => ({...accum, ...field}), {});
  return {
    question: props.initialData.question,
    ...answers
  };
};

const mapValuesToPayload = values => {
  // Accumulate answers into array
  const answers = Object.keys(values)
    .filter(field => ~field.indexOf('answers.'))
    .filter(field => values[field].length > 0)
    .reduce((accum, field) => [
      ...accum,
      {
        text: values[field]
      }
    ], []);
  return {
    question: values.question,
    answers
  };
};

const mapStateToProps = (state, ownProps) => ({});

PollForm.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  doRedirect: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps
)(Formik({
  mapPropsToValues,
  handleSubmit: (values, bag) => {
    const dispatch = bag.props.dispatch;
    const payload = mapValuesToPayload(values);
    console.log(payload);
    // TODO - Handle API call directly, then sync update via dispatch
    pollApi.create(payload)
    .then((poll) => {
      dispatch(createPoll(poll));
      bag.props.doRedirect();
    });
  },
  displayName: 'PollForm'
})(PollForm));
