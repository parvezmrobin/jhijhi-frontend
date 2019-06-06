import React, { Component } from 'react';
import '../styles/Loading.css'

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dots: '',
    };
  }


  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({dots: (this.state.dots.length === 3) ? '' : this.state.dots + '.'});
    }, 500);
  }


  componentWillUnmount() {
    clearInterval(this.timerId);
  }


  render() {
    return (
      <div className="load-container">
        <h1>
          Loading{this.state.dots}
        </h1>
      </div>
    );
  }
}
