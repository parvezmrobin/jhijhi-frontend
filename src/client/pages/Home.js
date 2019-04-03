/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import $ from 'jquery';


class Home extends Component {
  componentDidMount() {
    $('#home').addClass('active');
  }

  componentWillUnmount() {
    $('#home').removeClass('active');
  }


  render() {
    return (
      <CenterContent>
        <h2 className="text-center">
          A simple <span className="text-monospace">react</span> app
          backed by <span className="text-monospace">Express JS</span> to maintain cricket score
        </h2>
      </CenterContent>
    );
  }

}

export default Home;
