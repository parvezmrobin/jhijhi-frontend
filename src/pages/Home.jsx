/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */

import React, { Component } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import fetcher from '../lib/fetcher';
import { bindMethods } from '../lib/utils';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      isDropdownOpen: false,
    };
    bindMethods(this);
  }

  handlers = {
    toggle() {
      this.setState((prevState) => ({
        isDropdownOpen: !prevState.isDropdownOpen,
      }));
    },
  };

  componentDidMount() {
    document.getElementsByTagName('body')[0].classList.add('home');

    return fetcher
      .get('matches')
      .then((response) => this.setState({ matches: response.data }));
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].classList.remove('home');
    fetcher.cancelAll();
  }

  render() {
    const { matches, isDropdownOpen } = this.state;
    const options = matches.map((match) => (
      <Link key={match._id} to={`live@${match._id}`}>
        <DropdownItem className="text-white">{match.name}</DropdownItem>
      </Link>
    ));

    const content = options.length ? (
      <div className="col-auto">
        <Dropdown
          id="select-match"
          isOpen={isDropdownOpen}
          toggle={this.toggle}
        >
          {/* eslint-disable-next-line jsx-a11y/tabindex-no-positive */}
          <DropdownToggle tabIndex={1} caret>
            Select Match
          </DropdownToggle>
          <DropdownMenu className="bg-dark w-100">{options}</DropdownMenu>
        </Dropdown>
      </div>
    ) : (
      <div className="col-auto p-1 fs-2">
        <Link className="text-decoration-none" to="/match">
          Create A Match
        </Link>
      </div>
    );

    return (
      <div className="d-flex align-items-center vh-100">
        <div className="col-md-8 offset-md-2 bg-dark-trans rounded">
          <div className="d-flex justify-content-center v-100">{content}</div>
        </div>
      </div>
    );
  }
}

export default Home;
