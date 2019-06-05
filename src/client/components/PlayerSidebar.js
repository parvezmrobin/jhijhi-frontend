import { toTitleCase } from '../lib/utils';
import { Link } from 'react-router-dom';
import CenterContent from './layouts/CenterContent';
import SidebarList from './SidebarList';
import * as PropTypes from 'prop-types';
import React from 'react';

/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 05, 2019
 */


export default function PlayerSidebar(props) {
  const renderPlayer = player => {
    const playerText = `${toTitleCase(player.name)} (${player.jerseyNo})`;
    const editButton = <Link to={'player@' + player._id} className="float-right">
      <small className="text-white"><i data-feather="edit"/></small>
    </Link>;
    const className = (player._id === props.playerId) ? 'text-success' : 'text-white';
    return <>
      <Link to={`player-stat@${player._id}`} className={className}>{playerText}</Link>
      {editButton}
    </>;
  };

  return <aside className="col-md-3">
    <CenterContent col="col">
      <SidebarList
        title="Existing Players"
        itemMapper={renderPlayer}
        list={props.players}/>
    </CenterContent>
  </aside>;
}

PlayerSidebar.propTypes = {
  playerId: PropTypes.string,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
};
