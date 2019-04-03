/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 03, 2019
 */


import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Sidebar extends Component {

  render() {
    return (
      <nav className="nav rounded nav-pills nav-fill flex-column">
        <NavLink className="nav-link" to="/team">Team</NavLink>
        <NavLink className="nav-link" to="/player">Player</NavLink>
        <NavLink className="nav-link" to="/umpire">Umpire</NavLink>
        <NavLink className="nav-link" to="/match" >Match</NavLink>
      </nav>
    );
  }

}

export default Sidebar;
