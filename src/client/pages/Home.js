/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';
import fetcher from '../lib/fetcher';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
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
      this.setState(prevState => ({
        isDropdownOpen: !prevState.isDropdownOpen,
      }));
    },
  };

  componentDidMount() {
    document.getElementsByTagName('body')[0].classList.add('home');

    fetcher
      .get('matches')
      .then(response => {
        this.setState({
          matches: response.data,
        });
      });
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].classList.remove('home');
  }

  render() {
    const options = this.state.matches.map((match) => {
      return <DropdownItem className="text-primary" key={match._id}>{match.name}</DropdownItem>;
    });

    return (
      <div className="d-flex align-items-center vh-100">
        <div className="col-12 bg-dark rounded">
          <div className="d-flex justify-content-center v-100">
            <div className="col-auto">
              <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggle}>
                <DropdownToggle className="fs-2 p-1 text-info bg-transparent border-0" caret>
                  Select Match
                </DropdownToggle>
                <DropdownMenu className="bg-dark w-100">
                  {options}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Home;
