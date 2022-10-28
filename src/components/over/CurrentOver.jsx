/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React, { Component } from 'react';
import * as feather from 'feather-icons';
import PropTypes, { shape } from 'prop-types';
import { toTitleCase } from '../../lib/utils';

import Bowl from '../bowl/Bowl';
import NextBowl from '../bowl/NextBowl';
import { PlayerType, BowlType } from '../../types';

class CurrentOver extends Component {
  componentDidUpdate() {
    feather.replace();
  }

  render() {
    const {
      bowler,
      battingTeam,
      bowls,
      onCrease,
      onBowlersEnd,
      title,
      overNo,
      onEdit,
      onSwitch,
      activeIndex,
      className,
    } = this.props;

    let bowlNo = 1;
    let bowlIndex = 0;
    const renderedBowls = bowls.map((bowl, i) => (
      <Bowl
        key={bowl._id}
        active={Number.isInteger(activeIndex) && i === activeIndex}
        bowl={bowl}
        bowlIndex={bowlIndex++}
        bowlNo={bowl.isNo || bowl.isWide ? bowlNo : bowlNo++}
        battingTeam={battingTeam}
        onEdit={onEdit && ((_bowlNo) => onEdit(overNo, _bowlNo))}
      />
    ));

    return (
      <div className={className}>
        {title && <h4 className="mt-2 pt-1 text-center text-white">{title}</h4>}
        {bowler && (
          <h4 className="mt-2 pt-1 text-center text-white">
            <span className="font-italic">{toTitleCase(bowler.name)}</span> is
            bowling
          </h4>
        )}
        <ul className="list-group">
          {renderedBowls}
          <NextBowl
            onSwitch={onSwitch}
            onCrease={onCrease}
            onBowlersEnd={onBowlersEnd}
          />
        </ul>
      </div>
    );
  }
}

CurrentOver.propTypes = {
  className: PropTypes.string,
  bowler: shape(PlayerType),
  battingTeam: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  bowls: PropTypes.arrayOf(shape(BowlType)).isRequired,
  onCrease: PropTypes.string,
  onBowlersEnd: PropTypes.string,
  title: PropTypes.string,
  overNo: PropTypes.number,
  activeIndex: PropTypes.number,
  onEdit: PropTypes.func,
  onSwitch: PropTypes.func,
};

export default CurrentOver;
