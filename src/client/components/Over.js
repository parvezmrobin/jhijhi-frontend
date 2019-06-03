/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';
import { toTitleCase } from '../lib/utils';

class Over extends Component {

  render() {
    const className = 'list-group-item ';
    const { overNo, runs, bowler, onOverClick } = this.props;
    const badges = this.props.events.map(
      (event, i) => (
        <span key={i} className={`bowl-event ${(event === 'w') ? 'wicket' : 'boundary'}`}>
        {event}
      </span>),
    );

    return (
      <li onClick={() => onOverClick(overNo - 1)} className={className}>
        {overNo}. <strong>{toTitleCase(bowler, ' ')}</strong> - {runs} {badges}
      </li>
    );
  }

}

export default Over;
