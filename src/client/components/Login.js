/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Login extends Component {
  render() {
    return <main className="vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-8 col-lg-6">
        <h2>Login</h2>
        <hr/>
        <form action="">
          <div className="form-group row">
            <label htmlFor="username" className="col-md-4 col-lg-2 col-form-label">
              Username
            </label>
            <div className="col">
              <input type="text" className="form-control" name="username" id="username"/>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="password" className="col-md-4 col-lg-2 col-form-label">
              Password
            </label>
            <div className="col">
              <input type="password" className="form-control" name="password" id="password"/>
            </div>
          </div>
          <div className="form-group row">
            <div className="offset-md-4 offset-lg-2 col">
              <input type="submit" className="btn btn-outline-primary" value="Login"/>

              <label className="col-form-label float-right">
                Don't have an account? <Link to="/register">Register</Link>
              </label>
            </div>
          </div>
        </form>
      </div>
    </main>;
  }
}

export default Login;
