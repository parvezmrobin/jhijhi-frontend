import React, { Component } from 'react';
import '../styles/Loading.css';
import { string } from 'prop-types';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dots: '',
    };
  }

  componentDidMount() {
    const { dots } = this.state;
    this.timerId = setInterval(() => {
      this.setState({
        dots: dots.length === 3 ? '' : `${dots}.`,
      });
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  render() {
    const { dots } = this.state;
    const { className } = this.props;
    return (
      <div className={`load-container ${className || ''}`}>
        <h1>Loading{dots}</h1>
      </div>
    );
  }
}

Loading.propTypes = {
  className: string,
};
