/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import { toTitleCase } from '../lib/utils';

function Ball(props) {
  let className = 'list-group-item ';
  let badge;
  let run = props.singles;
  const {bowlNo, isWicket, boundary, isWide, playedBy, battingTeam, by, legBy } = props;
  const batsman = battingTeam[playedBy];

  if (props.isWicket) {
    className += 'text-danger';
    badge = <kbd className="bg-danger">{isWicket}</kbd>;
  } else if (boundary.run) {
    className += 'text-info ';
    run = <>
      {run || ''} <kbd className="bg-info">
      {boundary.run} {(boundary.kind === 'by') ? '(By)' : (boundary.kind === 'legBy') ? '(Leg By)' : ''}
    </kbd>
    </>;
  }
  if (legBy) {
    run = <>{run || ''} <kbd className="bg-dark-trans">Leg by {legBy}</kbd></>;
  }
  if (by) {
    run = <>{run || ''} <kbd className="bg-dark-trans">By {by}</kbd></>;
  }
  if (!props.isWicket && (props.isWide || props.isNo)) {
    className += 'text-warning';
    badge = <kbd className="bg-warning">
        {isWide ? 'Wide' : 'No'}
      </kbd>;
  }
  if (badge) {
    run = run || '';
  }

  const closeButton = <button type="button" className="close" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>;

  return (
    <li className={className}>
      {bowlNo}. <strong>{toTitleCase(batsman.name)}</strong> - {run} {badge} {closeButton}
    </li>
  );
}

export default Ball;
