/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';

class Ball extends Component {
  batsman;

  render() {
    let className = 'rounded-0 list-group-item';
    let badge;
    let run = this.props.run;

    if (this.props.isWicket) {
      className += ' list-group-item-danger';
      badge = <span className="badge badge-danger badge-pill">{this.props.isWicket}</span>;
    } else if (this.props.boundary) {
      className += (this.props.boundary === 4) ? ' list-group-item-success' : ' list-group-item-primary';
      run = <kbd>{this.props.boundary}</kbd>
    }
    const closeButton = <button type="button" className="close" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>;

    return (
      <li className={className}>
        {this.props.batsman} - {run} {badge} {closeButton}
      </li>
    );
  }

}

export default Ball;
