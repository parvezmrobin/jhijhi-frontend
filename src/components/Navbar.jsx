/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar as BaseNavbar,
  NavbarToggler,
  UncontrolledDropdown,
} from 'reactstrap';
import { bool, string } from 'prop-types';
import { logout } from '../lib/utils';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    this.setState({ isOpen: false });
  }

  toggle = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  collapse = () => {
    this.setState({ isOpen: false });
  };

  render() {
    let nav;
    const { isLoggedIn, username } = this.props;
    const { isOpen } = this.state;
    if (isLoggedIn) {
      nav = (
        <Collapse navbar isOpen={isOpen} id="navbar">
          <Nav navbar>
            <NavLink
              onClick={this.collapse}
              className="nav-item nav-link"
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              onClick={this.collapse}
              className="nav-item nav-link"
              to="/contact"
            >
              Contact
            </NavLink>
          </Nav>
          <Nav navbar className="highlight mx-auto">
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Set Up
              </DropdownToggle>
              <DropdownMenu right>
                <NavLink
                  onClick={this.collapse}
                  className="dropdown-item"
                  to="/player"
                >
                  Player
                </NavLink>
                <NavLink
                  onClick={this.collapse}
                  className="dropdown-item"
                  to="/team"
                >
                  Team
                </NavLink>
                <NavLink
                  onClick={this.collapse}
                  className="dropdown-item"
                  to="/umpire"
                >
                  Umpire
                </NavLink>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavLink
              onClick={this.collapse}
              className="nav-item nav-link"
              to="/match"
            >
              Match
            </NavLink>
            <NavLink
              onClick={this.collapse}
              className="nav-item nav-link"
              to="/history@null"
            >
              Score
            </NavLink>
          </Nav>
          <Nav navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {username}
              </DropdownToggle>
              <DropdownMenu right>
                <NavLink
                  className="dropdown-item"
                  onClick={this.collapse}
                  to="/password"
                >
                  Change Password
                </NavLink>
                <NavLink
                  className="dropdown-item"
                  onClick={this.collapse}
                  to="/kidding"
                >
                  Manage Account
                </NavLink>
                <DropdownItem divider />
                <NavLink
                  className="dropdown-item bg-warning text-white"
                  to="#"
                  onClick={() => {
                    this.collapse();
                    logout();
                  }}
                >
                  Logout
                </NavLink>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      );
    } else {
      nav = (
        <Collapse navbar isOpen={isOpen} id="navbar">
          <Nav navbar className="ml-auto">
            <NavLink
              onClick={this.collapse}
              className="nav-item nav-link"
              to="/register"
            >
              Register
            </NavLink>
            <NavLink
              onClick={this.collapse}
              className="nav-item nav-link"
              to="/login"
            >
              Login
            </NavLink>
          </Nav>
        </Collapse>
      );
    }
    return (
      <BaseNavbar color="light" light expand="md" fixed="top">
        <NavLink onClick={this.collapse} exact className="navbar-brand" to="/">
          Jhijhi
        </NavLink>
        <NavbarToggler onClick={this.toggle} />

        {nav}
      </BaseNavbar>
    );
  }
}

Navbar.propTypes = {
  isLoggedIn: bool.isRequired,
  username: string,
};

export default Navbar;
