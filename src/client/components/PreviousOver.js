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
    const {overNo, runs, bowler} = this.props;
    const badges = this.props.wickets.map(
      wicket => (<kbd key={wicket} className="bg-danger mr-1">{toTitleCase(wicket, ' ')}</kbd>),
    );

    return (
      <li className={className}>
        {overNo}. <strong>{toTitleCase(bowler, ' ')}</strong> - {runs} {badges}
      </li>
    );
  }

}

export default PreviousOver;
