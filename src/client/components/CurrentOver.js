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
    const { bowler, battingTeam, bowls, onCrease, onBowlersEnd, title, overNo, onEdit, onSwitch, activeIndex } = this.props;

    let bowlNo = 1;
    let bowlIndex = 0;
    const renderedBowls = bowls.map((bowl, i) =>
      <Bowl key={i} active={Number.isInteger(activeIndex) && i === activeIndex} bowl={bowl}
            bowlIndex={bowlIndex++} bowlNo={(bowl.isNo || bowl.isWide) ? bowlNo : bowlNo++}
            battingTeam={battingTeam} onEdit={onEdit && (bowlNo => onEdit(overNo, bowlNo))}/>,
    );

    return (<div className={this.props.className}>
      {title &&
      <h4 className="mt-2 pt-1 text-center text-white">{title}</h4>}
      {bowler &&
      <h4 className="mt-2 pt-1 text-center text-white">
        <span className="font-italic">{toTitleCase(bowler.name)}</span> is bowling
      </h4>}
      <ul className="list-group">
        {renderedBowls}
        <NextBall onSwitch={onSwitch} onCrease={onCrease} onBowlersEnd={onBowlersEnd}/>
      </ul>
    </div>);
  }
}

CurrentOver.propTypes = {
  className: PropTypes.string,
  bowler: PropTypes.object,
  battingTeam: PropTypes.arrayOf(PropTypes.object).isRequired,
  bowls: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCrease: PropTypes.string,
  onBowlersEnd: PropTypes.string,
  title: PropTypes.string,
  overNo: PropTypes.number,
  activeIndex: PropTypes.number,
  onEdit: PropTypes.func,
  onSwitch: PropTypes.func,
};


export default CurrentOver;
