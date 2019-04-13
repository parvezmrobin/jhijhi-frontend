/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';


class Contact extends Component {
  componentDidMount() {
    document.getElementsByTagName('body')[0].classList.add('home');
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].classList.remove('home');
  }

  render() {
    return (
      <div className="d-flex align-items-center vh-100">
        <div className="col-8 offset-2 bg-dark-trans rounded">
          <div className="d-flex justify-content-center v-100">
            <div className="col-auto text-white p-1 fs-2">
                <span className="">
                  Mail me at <a href="mailto:parvezmrobin@gmail.com">parvezmrobin@gmail.com</a>
                </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Contact;
