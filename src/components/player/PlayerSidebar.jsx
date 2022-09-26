/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 05, 2019
 */

import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as feather from 'feather-icons';
import debounce from 'lodash/debounce';
import List from '../layouts/List';
import CenterContent from '../layouts/CenterContent';
import { toTitleCase } from '../../lib/utils';


export default class PlayerSidebar extends Component {
  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate() {
    feather.replace();
  }

  render() {
    const {
      playerId, players, editable, onFilter,
    } = this.props;
    const renderPlayer = (player) => {
      const playerText = `${toTitleCase(player.name)} (${player.jerseyNo})`;
      const editButton = (
        <Link to={`player@${player._id}`} className="float-right">
          <small className="text-white"><i data-feather="edit" /></small>
        </Link>
      );
      const className = (player._id === playerId) ? 'text-success' : 'text-white';
      return (
        <>
          <Link to={`player-stat@${player._id}`} className={className}>{playerText}</Link>
          {editable && editButton}
        </>
      );
    };

    return (
      <aside className="col-md-4 col-lg-3">
        <CenterContent col="col">
          <List
            title="Existing Players"
            itemMapper={renderPlayer}
            list={players}
            onFilter={debounce(onFilter, 1000)}
          />
        </CenterContent>
      </aside>
    );
  }
}

PlayerSidebar.propTypes = {
  playerId: PropTypes.string,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  editable: PropTypes.bool,
  onFilter: PropTypes.func.isRequired,
};
