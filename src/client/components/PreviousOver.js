/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';
import { toTitleCase } from '../lib/utils';

class PreviousOver extends Component {

  render() {
    const className = 'list-group-item ';
    const {overNo, runs, bowler, onOverClick} = this.props;
    const badges = this.props.wickets.map(
      (wicket, i) => (<kbd key={i} className="bg-danger mr-1">{toTitleCase(wicket.kind, ' ')}</kbd>),
    );

    return (
      <li onClick={() => onOverClick(overNo - 1)} className={className}>
        {overNo}. <strong>{toTitleCase(bowler, ' ')}</strong> - {runs} {badges}
      </li>
    );
  }

}

export default PreviousOver;
