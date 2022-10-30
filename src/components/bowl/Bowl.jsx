/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes, { shape } from 'prop-types';
import { toTitleCase } from '../../lib/utils';
import { BowlType, PlayerType } from '../../types';

function Bowl(props) {
  const { bowlNo, bowlIndex, active, bowl, battingTeam, onEdit } = props;
  const { singles, isWicket, boundary, isWide, isNo, playedBy, by, legBy } =
    bowl;
  const batsman = battingTeam[playedBy];

  const className = `list-group-item${active ? ' active' : ''} text-dark`;
  const elements = [
    <kbd key="singles" className="mr-1">
      {singles}
    </kbd>,
  ];
  if (isWicket?.kind) {
    const outPlayer = Number.isInteger(isWicket.player)
      ? battingTeam[isWicket.player].name
      : null;
    const wicket = (
      <kbd className="bg-danger mr-1" key="wicket">
        {toTitleCase(isWicket.kind, ' ')}
        {outPlayer && `(${outPlayer})`}
      </kbd>
    );
    elements.push(wicket);
  }
  if (boundary?.run) {
    let boundaryKind;
    if (boundary.kind === 'by') {
      boundaryKind = '(By)';
    } else {
      boundaryKind = boundary.kind === 'legBy' ? '(Leg By)' : '';
    }
    const boundaryElement = (
      <kbd className="bg-info mr-1" key="boundary">
        {boundary.run}
        {boundaryKind}
      </kbd>
    );
    elements.push(boundaryElement);
  }
  if (legBy) {
    elements.push(
      <kbd className="bg-secondary mr-1" key="legBy">
        Leg By {legBy}
      </kbd>
    );
  }
  if (by) {
    elements.push(
      <kbd className="bg-secondary mr-1" key="by">
        By {by}
      </kbd>
    );
  }
  if (isWide || isNo) {
    elements.push(
      <kbd className="bg-warning-light mr-1" key="wide">
        {isWide ? 'Wide' : 'No'}
      </kbd>
    );
  }

  if (elements.length > 1 && !singles) {
    elements.shift();
  }

  const editButton = onEdit && (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link to="#" onClick={() => onEdit(bowlIndex)} className="float-right">
      <small className={active ? 'text-white' : 'text-dark'}>
        <i data-feather="edit" />
      </small>
    </Link>
  );

  return (
    <li className={className}>
      {bowlNo}. <strong>{batsman && toTitleCase(batsman.name)}</strong> »{' '}
      {elements} {editButton}
    </li>
  );
}

Bowl.propTypes = {
  bowlNo: PropTypes.number.isRequired,
  bowlIndex: PropTypes.number,
  active: PropTypes.bool,
  bowl: PropTypes.shape(BowlType),
  battingTeam: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  onEdit: PropTypes.func,
};

export default Bowl;
