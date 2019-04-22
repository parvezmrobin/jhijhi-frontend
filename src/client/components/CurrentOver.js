/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component, Fragment } from 'react';
import Ball from './Ball';
import NextBall from './NextBall';
import { toTitleCase } from '../lib/utils';

class CurrentOver extends Component {
  balls;
  bowler;
  onCrease;

  render() {
    const { bowler, battingTeam, balls } = this.props;
    let bowlNo = 1;
    return (
      <Fragment>
        <h4 className="mt-2 pt-1 text-center text-white">
          <span className="font-italic">{toTitleCase(bowler.name)}</span> is bowling
        </h4>
        <ul className="list-group">
          {balls.map(
            (bowl, i) => {
              return (
                <Ball bowlNo={(bowl.isNo || bowl.isWide) ? bowlNo : bowlNo++} key={i} {...bowl}
                      battingTeam={battingTeam}/>);
            },
          )}
          <NextBall onCrease={this.props.onCrease}/>
        </ul>
      </Fragment>
    );
  }

}

export default CurrentOver;
