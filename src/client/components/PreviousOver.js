/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';

class PreviousOver extends Component {

  render() {
    let className = 'rounded-0 list-group-item ';
    let runs = this.props.runs;
    const badges = this.props.wickets.map(
      wicket => (<span key={wicket} className="badge badge-danger badge-pill">{wicket}</span>),
    );

    return (
      <li className={className}>
        <strong>{this.props.bowler}</strong> - {runs} {badges}
      </li>
    );
  }

}

export default PreviousOver;
