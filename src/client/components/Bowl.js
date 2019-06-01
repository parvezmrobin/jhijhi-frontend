/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import { toTitleCase } from '../lib/utils';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Bowl(props) {
  let className = 'list-group-item ';
  let badge;
  let run = props.singles;
  const { bowlNo, actualBowlNo, isWicket, boundary, isWide, isNo, playedBy, battingTeam, by, legBy, onEdit } = props;
  const batsman = battingTeam[playedBy];

  if (isWicket) {
    className += 'text-danger';
    badge = <kbd className="bg-danger">{toTitleCase(isWicket.kind, ' ')}</kbd>;
  } else if (boundary.run) {
    className += 'text-info ';
    run = <>
      {run || ''} <kbd className="bg-info">
      {boundary.run}{(boundary.kind === 'by') ? '(By)' : (boundary.kind === 'legBy') ? '(Leg By)' : ''}
    </kbd>
    </>;
  }
  if (legBy) {
    run = <>{run || ''} <kbd className="bg-dark-trans">Leg By {legBy}</kbd></>;
  }
  if (by) {
    run = <>{run || ''} <kbd className="bg-dark-trans">By {by}</kbd></>;
  }
  if (!isWicket && (isWide || isNo)) {
    className += 'text-warning';
    badge = <kbd className="bg-warning">
      {isWide ? 'Wide' : 'No'}
    </kbd>;
  }
  if (badge) {
    run = run || '';
  }

  const editButton = <Link to="#" onClick={() => onEdit(actualBowlNo)} className="float-right">
    <small className="text-dark"><i data-feather="edit"/></small>
  </Link>;

  return (
    <li className={className}>
      {bowlNo}. <strong>{toTitleCase(batsman.name)}</strong> - {run} {badge} {editButton}
    </li>
  );
}

Bowl.propTypes = {
  bowlNo: PropTypes.number.isRequired,
  actualBowlNo: PropTypes.number.isRequired,
  isWicket: PropTypes.object,
  boundary: PropTypes.object,
  isWide: PropTypes.bool,
  isNo: PropTypes.bool,
  playedBy: PropTypes.number.isRequired,
  battingTeam: PropTypes.arrayOf(PropTypes.object).isRequired,
  by: PropTypes.number,
  legBy: PropTypes.number,
  onEdit: PropTypes.func.isRequired,
};


export default Bowl;
