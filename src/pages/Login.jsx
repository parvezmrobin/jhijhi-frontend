/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import AuthForm from '../components/auth/AuthForm';
import { bindMethods } from '../lib/utils';
import ErrorModal from '../components/modal/ErrorModal';

class Login extends Component {
  handlers = {
    onSubmit() {
      const {
        values,
      } = this.state;
      const postData = { ...values };

      axios
        .post(`${process.env.SERVER_URL}/api/auth/login`, postData, { cancelToken: this.cancelTokenSource.token })
        .then((response) => {
          const isValid = {
            username: true,
          };
          const feedback = {
            username: null,
          };
          if (response.data.success) {
            if (typeof window.localStorage === 'undefined') {
              // eslint-disable-next-line no-alert
              return alert('You need to update your browser in order to use this site.');
            }
            window.localStorage.setItem('token', response.data.token);
            const { location } = this.props;
            const queryString = location.search;
            if (queryString.startsWith('?redirect=')) {
              window.location.href = `/#${queryString.substring('?redirect='.length)}`;
              window.location.reload();
            } else {
              window.location.href = '/';
            }
          } else {
            isValid.username = false;
            feedback.username = 'Wrong username and/or password';
          }
          return this.setState({
            isValid,
            feedback,
          });
        })
        .catch(() => this.setState({ showErrorModal: true }));
    },

    onChange(newValues) {
      this.setState((prevState) => ({ values: { ...prevState.values, ...newValues } }));
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      values: {
        username: '',
        password: '',
      },
      isValid: {
        username: null,
      },
      feedback: {
        username: null,
      },
      showErrorModal: false,
    };
    this.cancelTokenSource = axios.CancelToken.source();
    bindMethods(this);
  }

  componentWillUnmount() {
    this.cancelTokenSource.cancel();
  }

  render() {
    const {
      values,
      isValid,
      feedback,
      showErrorModal,
    } = this.state;
    return (
      <AuthForm
        title="Login"
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        values={values}
        isValid={isValid}
        feedback={feedback}
      >
        <span className="col-form-label float-right">
          Don&apos;t have an account?
          {' '}
          <Link to="/register">Register</Link>
        </span>
        <ErrorModal
          isOpen={showErrorModal}
          close={() => this.setState({ showErrorModal: false })}
        />
      </AuthForm>
    );
  }
}

Login.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default Login;
