/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { func, shape } from 'prop-types';
import AuthForm from '../components/auth/AuthForm';
import { bindMethods, formatValidationFeedback } from '../lib/utils';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        username: '',
        password: '',
        confirm: '',
      },
      isValid: {
        username: null,
        password: null,
      },
      feedback: {
        username: null,
        password: null,
      },
    };
    this.cancelTokenSource = axios.CancelToken.source();
    bindMethods(this);
  }

  handlers = {
    onSubmit() {
      const { values } = this.state;
      const { history } = this.props;

      axios
        .post(
          `${process.env.SERVER_URL}/api/auth/register`,
          { ...values },
          {
            cancelToken: this.cancelTokenSource.token,
          }
        )
        .then(() => {
          history.push('/login');
          window.location.href = '';
          return window.location.href;
        })
        .catch((err) => {
          const { isValid, feedback } = formatValidationFeedback(err);

          this.setState({ isValid, feedback });
        });
    },

    onChange(newValues) {
      this.setState((prevState) => ({
        values: { ...prevState.values, ...newValues },
      }));
    },
  };

  componentWillUnmount() {
    this.cancelTokenSource.cancel();
  }

  render() {
    const { values, isValid, feedback } = this.state;
    return (
      <AuthForm
        title="Register"
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        values={values}
        isValid={isValid}
        feedback={feedback}
        confirmPassword
        btnClass="outline-success"
      >
        <span className="col-form-label float-right">
          Already Registered? <Link to="/login">Login</Link>
        </span>
      </AuthForm>
    );
  }
}

Register.propTypes = {
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

export default Register;
