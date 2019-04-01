/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';


class Login extends Component {
  render() {
    return (
      <AuthForm title="Login">
        <label className="col-form-label float-right">
          Don't have an account? <Link to="/register">Register</Link>
        </label>
      </AuthForm>
    );
  }
}

export default Login;
