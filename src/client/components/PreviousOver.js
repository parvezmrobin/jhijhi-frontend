/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';

class PreviousOver extends Component {

  render() {
    const className = 'list-group-item ';
    const {runs, bowler} = this.props;
    const badges = this.props.wickets.map(
      wicket => (<span key={wicket} className="badge badge-danger mr-1">{wicket}</span>),
    );

    return (
      <li className={className}>
        <strong>{bowler}</strong> - {runs} {badges}
      </li>
    );
  }

}

export default PreviousOver;
