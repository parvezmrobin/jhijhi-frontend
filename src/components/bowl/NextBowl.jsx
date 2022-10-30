/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

class NextBowl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dots: '',
      isTooltipOpen: false,
    };
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      const { dots } = this.state;
      this.setState({
        dots: dots.length === 3 ? '' : `${dots}.`,
      });
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  toggleTooltip = () => {
    this.setState((state) => ({ isTooltipOpen: !state.isTooltipOpen }));
  };

  render() {
    const { onCrease, onBowlersEnd, onSwitch } = this.props;
    const { dots, isTooltipOpen } = this.state;
    const switchButton = (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <Link
        to="#"
        id="batsman-switch"
        onClick={onSwitch}
        className="float-right"
      >
        <i className="text-primary" data-feather="chevrons-up" />
      </Link>
    );

    return (
      <>
        {onCrease && (
          <li className="list-group-item text-white bg-dark">
            {onCrease} is on crease{dots}
          </li>
        )}
        {onBowlersEnd && (
          <>
            <li className="list-group-item text-white bg-secondary">
              {onBowlersEnd} is on bowler‘s end{dots} {switchButton}
            </li>
            <Tooltip
              isOpen={isTooltipOpen}
              toggle={this.toggleTooltip}
              target="batsman-switch"
            >
              Put {onBowlersEnd} on crease
            </Tooltip>
          </>
        )}
      </>
    );
  }
}

NextBowl.propTypes = {
  onCrease: PropTypes.string,
  onBowlersEnd: PropTypes.string,
  onSwitch: PropTypes.func,
};

export default NextBowl;
