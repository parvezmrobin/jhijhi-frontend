/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
        <Link className="navbar-brand" to="/">Jhijhi</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" id="home">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item" id="contact">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item" id="register">
              <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item" id="login">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item dropdown" id="user">
              <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {this.props.username}
              </Link>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="#">Change Password</Link>
                <Link className="dropdown-item" to="#">Manage Account</Link>
                <div className="dropdown-divider"/>
                <Link className="dropdown-item text-warning" to="#">Logout</Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

}

export default Navbar;
