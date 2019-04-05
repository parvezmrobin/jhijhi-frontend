/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import * as axios from "axios";
import {bindMethods} from "../lib/utils";


class Login extends Component {

  handlers = {
    onSubmit() {
      const postData = {...this.state.values};

      axios
        .post('/api/auth/login', postData)
        .then(response => {
          const isValid = {
            username: true,
          };
          const feedback = {
            username: null,
          };
          if (response.data.success) {
            if (typeof window.localStorage === 'undefined') {
              return alert("You need to update your browser in order to use this site.");
            }
            window.localStorage.setItem('token', response.data.token);
            window.location.href = "/";
          } else {
            isValid.username = false;
            feedback.username = "Wrong username and/or password";
          }
          this.setState({isValid, feedback});
        })
        .catch();
    },

    onChange(newValues) {
      this.setState(prevState => ({values: {...prevState.values, ...newValues}}));
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
    };
    bindMethods(this);
  }

  render() {
    return (
      <AuthForm title="Login" onChange={this.onChange} onSubmit={this.onSubmit} values={this.state}
                isValid={this.state.isValid} feedback={this.state.feedback}>
        <label className="col-form-label float-right">
          Don't have an account? <Link to="/register">Register</Link>
        </label>
      </AuthForm>
    );
  }

}

export default Login;
