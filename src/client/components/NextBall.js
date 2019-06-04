/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';


class NextBall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dots: '',
      isTooltipOpen: false,
    };
  }

  toggleTooltip = () => {
    this.setState(state => ({ isTooltipOpen: !state.isTooltipOpen }));
  };


  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({ dots: (this.state.dots.length === 3) ? '' : this.state.dots + '.' });
    }, 500);
  }


  componentWillUnmount() {
    clearInterval(this.timerId);
  }


  render() {
    const { onCrease, onBowlersEnd, onSwitch } = this.props;
    const { dots, isTooltipOpen } = this.state;
    const switchButton = <Link to="#" id="batsman-switch" onClick={onSwitch} className="float-right">
      <i className="text-primary" data-feather="chevrons-up"/>
    </Link>;

    return (
      <>
        {onCrease &&
        <li className="list-group-item text-white bg-dark">{onCrease} is on crease{dots}</li>}
        {onBowlersEnd &&
        <>
          <li className="list-group-item text-white bg-secondary">
            {onBowlersEnd} is on bowler's end{dots} {switchButton}
          </li>
          <Tooltip isOpen={isTooltipOpen} toggle={this.toggleTooltip} target="batsman-switch">
            Put {onBowlersEnd} on crease
          </Tooltip>
        </>}
      </>
    );
  }

}

NextBall.propTypes = {
  onCrease: PropTypes.string,
  onBowlersEnd: PropTypes.string,
  onSwitch: PropTypes.func.isRequired,
};


export default NextBall;
