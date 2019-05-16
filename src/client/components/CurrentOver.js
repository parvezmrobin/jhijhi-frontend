/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Fragment } from 'react';
import Bowl from './Bowl';
import NextBall from './NextBall';
import { toTitleCase } from '../lib/utils';

function CurrentOver(props) {
  const { bowler, battingTeam, balls, onCrease, onBowlersEnd, title } = props;
  let bowlNo = 1;
  const renderedBowls = balls.map((bowl, i) =>
    <Bowl bowlNo={(bowl.isNo || bowl.isWide) ? bowlNo : bowlNo++} key={i} {...bowl}
          battingTeam={battingTeam}/>);

  return (
    <Fragment>
      {title &&
      <h4 className="mt-2 pt-1 text-center text-white">{title}</h4>}
      {bowler &&
      <h4 className="mt-2 pt-1 text-center text-white">
        <span className="font-italic">{toTitleCase(bowler.name)}</span> is bowling
      </h4>}
      <ul className="list-group">
        {renderedBowls}
        <NextBall onCrease={onCrease} onBowlersEnd={onBowlersEnd}/>
      </ul>
    </Fragment>
  );
}

export default CurrentOver;
