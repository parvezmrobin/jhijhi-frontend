/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import $ from 'jquery';


class Registration extends Component {
  componentDidMount() {
    $('#register').addClass('active');
  }

  componentWillUnmount() {
    $('#register').removeClass('active');
  }

  render() {
    return (
      <AuthForm title="Register" btnClass="outline-success">
        <label className="col-form-label float-right">
          Already Registered? <Link to="/login">Login</Link>
        </label>
      </AuthForm>
    );
  }
}

export default Registration;
