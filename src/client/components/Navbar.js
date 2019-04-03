/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
        <NavLink exact className="navbar-brand" to="/">Jhijhi</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" id="home">
              <NavLink exact className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item" id="contact">
              <NavLink className="nav-link" to="/contact">Contact</NavLink>
            </li>
            <li className="nav-item" id="team">
              <NavLink className="nav-link" to="/team">Team</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item" id="register">
              <NavLink className="nav-link" to="/register">Register</NavLink>
            </li>
            <li className="nav-item" id="login">
              <NavLink className="nav-link" to="/login">Login</NavLink>
            </li>
            <li className="nav-item dropdown" id="user">
              <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {this.props.username}
              </NavLink>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <NavLink className="dropdown-item" to="#">Change Password</NavLink>
                <NavLink className="dropdown-item" to="#">Manage Account</NavLink>
                <div className="dropdown-divider"/>
                <NavLink className="dropdown-item text-warning" to="#">Logout</NavLink>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

}

export default Navbar;
