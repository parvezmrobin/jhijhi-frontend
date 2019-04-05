/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';

class NextBall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dots: '',
    };
  }


  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({ dots: (this.state.dots.length === 3) ? '' : this.state.dots + '.' });
    }, 500);
  }


  componentWillUnmount() {
    clearInterval(this.timerId);
  }


  render() {
    return (
      <li className="list-group-item text-white bg-info rounded-0">{this.props.onCrease} is on crease{this.state.dots}</li>
    );
  }

}

export default NextBall;
