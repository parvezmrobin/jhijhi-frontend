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
  const { isWicket, boundary, isWide, playedBy, battingTeam, by, legBy } = props;
  const batsman = battingTeam[playedBy];

  if (props.isWicket) {
    className += 'text-danger';
    badge = <span className="badge badge-danger badge-pill">{isWicket}</span>;
  } else if (boundary.run) {
    const isFour = props.boundary === 4;
    className += isFour ? 'text-info' : 'text-info';
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
    badge = <span className="badge badge-warning">
        {isWide ? 'Wide' : 'No'}
      </span>;
  }
  if (badge) {
    run = run || '';
  }

  const closeButton = <button type="button" className="close" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>;

  return (
    <li className={className}>
      <strong>{toTitleCase(batsman.name)}</strong> - {run} {badge} {closeButton}
    </li>
  );
}

export default Ball;
