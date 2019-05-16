/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { logout } from '../lib/utils';


function Navbar(props) {
  let nav;
  if (props.isLoggedIn) {
    nav = (
      <div className="collapse navbar-collapse" id="navbar">
        <div className="navbar-nav">
          <NavLink exact className="nav-item nav-link" to="/">Home</NavLink>
          <NavLink className="nav-item nav-link" to="/contact">Contact</NavLink>
        </div>
        <div className="navbar-nav mx-auto">
          <NavLink className="nav-item nav-link text-primary" to="/player">Player</NavLink>
          <NavLink className="nav-item nav-link text-primary" to="/team">Team</NavLink>
          <NavLink className="nav-item nav-link text-primary" to="/umpire">Umpire</NavLink>
          <NavLink className="nav-item nav-link text-primary" to="/match">Match</NavLink>
        </div>
        <div className="navbar-nav">
          <div className="nav-item dropdown" id="user">
            <NavLink className="nav-item nav-link dropdown-toggle" to="#" id="navbarDropdown"
                     role="button"
                     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {props.username}
            </NavLink>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
              <NavLink className="dropdown-item" to="password">Change Password</NavLink>
              <NavLink className="dropdown-item" to="kidding">Manage Account</NavLink>
              <div className="dropdown-divider"/>
              <NavLink className="dropdown-item text-warning" onClick={logout}
                       to="#">Logout</NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    nav = (
      <div className="collapse navbar-collapse" id="navbar">
        <div className="navbar-nav ml-auto">
          <NavLink className="nav-item nav-link" to="/register">Register</NavLink>
          <NavLink className="nav-item nav-link" to="/login">Login</NavLink>
        </div>
      </div>
    );
  }
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
      <NavLink exact className="navbar-brand" to="/">Jhijhi</NavLink>
      <button className="navbar-toggler" type="button" data-toggle="collapse"
              data-target="#navbar" aria-controls="navbar"
              aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"/>
      </button>

      {nav}

    </nav>
  );
}

export default Navbar;
