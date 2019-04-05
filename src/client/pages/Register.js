/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import {bindMethods} from "../lib/utils";
import * as axios from "axios";


class Register extends Component {
  handlers = {
    onSubmit() {
      const postData = {...this.state};
      axios.post('/api/auth/register', postData)
        .then(response => {
          console.log(response.data);
        });
    },

    onChange(newState) {
      this.setState(newState);
      console.log(newState);
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    bindMethods(this);
  }

  render() {
    return (
      <AuthForm title="Register" onChange={this.onChange} onSubmit={this.onSubmit} values={this.state} btnClass="outline-success">
        <label className="col-form-label float-right">
          Already Registered? <Link to="/login">Login</Link>
        </label>
      </AuthForm>
    );
  }

}

export default Register;
