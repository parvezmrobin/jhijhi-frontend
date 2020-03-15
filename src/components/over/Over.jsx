/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import { optional, toTitleCase } from '../../lib/utils';
import * as PropTypes from 'prop-types';

function Over(props) {
  const { overNo, over, bowlerName, onOverClick, active } = props;
  const className = `list-group-item text-dark ${active ? 'active' : ''}`;
  const badges = props.over.bowls.filter(bowl => bowl.isWicket || optional(bowl.boundary).run)
    .map(bowl => bowl.isWicket ? 'W' : bowl.boundary?.run)
    .map(
      (event, i) => (
        <span key={i} className={`bowl-event ${(event === 'W') ? 'wicket' : 'boundary'}`}>
        {event}
      </span>),
    );

  return (
    <li onClick={() => onOverClick(overNo - 1)} className={className}>
      {overNo}. <strong>{toTitleCase(bowlerName, ' ')}</strong> » {Over.getRuns(over)} {badges}
    </li>
  );
}

Over.getRuns = (over) => {
  return over.bowls.reduce((runs, bowl) => {
    if (bowl.singles) {
      runs += bowl.singles;
    }
    if (bowl.by) {
      runs += bowl.by;
    }
    if (bowl.legBy) {
      runs += bowl.legBy;
    }
    if (bowl.boundary?.run) {
      runs += bowl.boundary?.run;
    }
    if (bowl.isWide || bowl.isNo) {
      runs++;
    }

    return runs;
  }, 0);
};


Over.propTypes = {
  overNo: PropTypes.number.isRequired,
  over: PropTypes.shape({
    bowls: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  bowlerName: PropTypes.string.isRequired,
  onOverClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
};


export default Over;
