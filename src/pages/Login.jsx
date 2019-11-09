/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import axios from 'axios';
import { bindMethods } from '../lib/utils';
import ErrorModal from '../components/ErrorModal';


class Login extends Component {
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

  handlers = {
    onSubmit() {
      const postData = { ...this.state.values };

      axios
        .post(`${process.env.SERVER_URL}/api/auth/login`, postData, { cancelToken: this.cancelTokenSource.token })
        .then(response => {
          const isValid = {
            username: true,
          };
          const feedback = {
            username: null,
          };
          if (response.data.success) {
            if (typeof window.localStorage === 'undefined') {
              return alert('You need to update your browser in order to use this site.');
            }
            window.localStorage.setItem('token', response.data.token);
            const queryString = this.props.location.search;
            if (queryString.startsWith('?redirect=')) {
              window.location.href = '/#' + queryString.substr('?redirect='.length);
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
      this.setState(prevState => ({ values: { ...prevState.values, ...newValues } }));
    },
  };

  componentWillUnmount() {
    this.cancelTokenSource.cancel();
  }

  render() {
    return (
      <AuthForm title="Login" onChange={this.onChange} onSubmit={this.onSubmit}
                values={this.state.values} isValid={this.state.isValid}
                feedback={this.state.feedback}>
        <label className="col-form-label float-right">
          Don't have an account? <Link to="/register">Register</Link>
        </label>
        <ErrorModal isOpen={this.state.showErrorModal}
                    close={() => this.setState({ showErrorModal: false })}/>
      </AuthForm>
    );
  }

}

export default Login;
