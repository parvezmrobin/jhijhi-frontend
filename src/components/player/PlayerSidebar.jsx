import { toTitleCase } from '../../lib/utils';
import { Link } from 'react-router-dom';
import CenterContent from '../layouts/CenterContent';
import List from '../layouts/List';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as feather from 'feather-icons';
import debounce from 'lodash/debounce';

/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 05, 2019
 */


export default class PlayerSidebar extends Component {

  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate() {
    feather.replace();
  }

  render() {
    const renderPlayer = player => {
      const playerText = `${toTitleCase(player.name)} (${player.jerseyNo})`;
      const editButton = <Link to={'player@' + player._id} className="float-right">
        <small className="text-white"><i data-feather="edit"/></small>
      </Link>;
      const className = (player._id === this.props.playerId) ? 'text-success' : 'text-white';
      return <>
        <Link to={`player-stat@${player._id}`} className={className}>{playerText}</Link>
        {this.props.editable && editButton}
      </>;
    };

    return <aside className="col-md-4 col-lg-3">
      <CenterContent col="col">
        <List
          title="Existing Players"
          itemMapper={renderPlayer}
          list={this.props.players}
          onFilter={debounce(this.props.onFilter, 1000)}/>
      </CenterContent>
    </aside>;
  }
}

PlayerSidebar.propTypes = {
  playerId: PropTypes.string,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  editable: PropTypes.bool,
  onFilter: PropTypes.func.isRequired,
};
