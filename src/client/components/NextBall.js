/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, {Component} from 'react';

class NextBall extends Component {
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
    const {onCrease, onBowlersEnd} = this.props;
    const {dots} = this.state;
    return (
      <>
        {onCrease &&
        <li className="list-group-item text-white bg-dark">{onCrease} is on crease{dots}</li>}
        {onBowlersEnd &&
        <li className="list-group-item text-white bg-info">{onBowlersEnd} is on bowler's end{dots}</li>}
      </>
    );
  }

}

export default NextBall;
