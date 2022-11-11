/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { shape } from 'prop-types';
import { optional, toTitleCase } from '../../lib/utils';
import { BowlType } from '../../types';

function Over(props) {
  const { overNo, over, bowlerName, onOverClick, active } = props;
  const className = `list-group-item ${
    active ? 'active text-white' : 'text-dark'
  }`;
  /* eslint-disable react/no-array-index-key */
  const badges = over.bowls
    .filter((bowl) => bowl.isWicket || optional(bowl.boundary).run)
    .map((bowl) => (bowl.isWicket ? 'W' : bowl.boundary?.run))
    .map((event, i) => (
      <span
        key={i}
        className={`bowl-event ${event === 'W' ? 'wicket' : 'boundary'}`}
      >
        {event}
      </span>
    ));

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <li onClick={() => onOverClick(overNo - 1)} className={className}>
      {overNo}. <strong>{toTitleCase(bowlerName, ' ')}</strong> »{' '}
      {Over.getRuns(over)} {badges}
    </li>
  );
}

Over.getRuns = (over) =>
  over.bowls.reduce((runs, bowl) => {
    let _runs = runs;
    if (bowl.singles) {
      _runs += bowl.singles;
    }
    if (bowl.by) {
      _runs += bowl.by;
    }
    if (bowl.legBy) {
      _runs += bowl.legBy;
    }
    if (bowl.boundary?.run) {
      _runs += bowl.boundary.run;
    }
    if (bowl.isWide || bowl.isNo) {
      _runs++;
    }

    return _runs;
  }, 0);

Over.propTypes = {
  overNo: PropTypes.number.isRequired,
  over: PropTypes.shape({
    bowls: PropTypes.arrayOf(shape(BowlType)).isRequired,
  }).isRequired,
  bowlerName: PropTypes.string.isRequired,
  onOverClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

export default Over;
