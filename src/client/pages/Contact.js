/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import $ from 'jquery';


class Contact extends Component {
  componentDidMount() {
    $('#contact').addClass('active');
  }

  componentWillUnmount() {
    $('#contact').removeClass('active');
  }


  render() {
    return (
      <CenterContent>
        <h2 className="text-center">
          Mail me at <a href="mailto:parvezmrobin@gmail.com">parvezmrobin@gmail.com</a>
        </h2>
      </CenterContent>
    );
  }

}

export default Contact;
