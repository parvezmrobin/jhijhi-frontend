/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';

class Ball extends Component {
  batsman;

  render() {
    let className = 'list-group-item ';
    let badge;
    let run = this.props.run;
    const {isWicket, boundary, isWide, batsman} = this.props;

    if (this.props.isWicket) {
      className += 'text-danger';
      badge = <span className="badge badge-danger badge-pill">{isWicket}</span>;
    } else if (this.props.boundary) {
      const isFour = this.props.boundary === 4;
      className += isFour ? 'text-info' : 'text-info';
      run = <kbd className={isFour? "bg-info": "bg-info"}>{boundary}</kbd>;
    }
    if (!this.props.isWicket && (this.props.isWide || this.props.isNo)) {
      className += 'text-warning';
      badge = <span className="badge badge-warning badge-pill">
        {isWide ? 'Wide' : 'No'}
      </span>;
    }

    const closeButton = <button type="button" className="close" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>;

    return (
      <li className={className}>
        <strong>{batsman}</strong> - {run} {badge} {closeButton}
      </li>
    );
  }

}

export default Ball;
