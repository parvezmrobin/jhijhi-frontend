import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';


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
      <CenterContent>
        <h2 className="text-center mt-10 mt-lg-0">
          Loading{this.state.dots}
        </h2>
      </CenterContent>
    );
  }
}
