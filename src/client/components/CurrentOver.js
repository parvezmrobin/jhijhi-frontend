/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';
import { toTitleCase } from '../lib/utils';
import * as feather from 'feather-icons';
import PropTypes from 'prop-types';

import Bowl from './Bowl';
import NextBall from './NextBall';


class CurrentOver extends Component {

  componentDidUpdate() {
    feather.replace();
  }

  render() {
    const { bowler, battingTeam, bowls, onCrease, onBowlersEnd, title, overNo, onEdit } = this.props;
    let bowlNo = 1;
    let actualBowlNo = 0;
    const renderedBowls = bowls.map((bowl, i) =>
      <Bowl actualBowlNo={actualBowlNo++} bowlNo={(bowl.isNo || bowl.isWide) ? bowlNo : bowlNo++}
            key={i} {...bowl} battingTeam={battingTeam} onEdit={bowlNo => onEdit(overNo, bowlNo)}/>,
    );

    return (<>
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
    </>);
  }
}

CurrentOver.propTypes = {
  bowler: PropTypes.object,
  battingTeam: PropTypes.arrayOf(PropTypes.object).isRequired,
  bowls: PropTypes.arrayOf(PropTypes.object),
  onCrease: PropTypes.string,
  onBowlersEnd: PropTypes.string,
  title: PropTypes.string,
  overNo: PropTypes.number,
  onEdit: PropTypes.func,
};


export default CurrentOver;
