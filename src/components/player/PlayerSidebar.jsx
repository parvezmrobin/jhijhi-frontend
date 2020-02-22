import { toTitleCase } from '../../lib/utils';
import List from '../layouts/List';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import Link from "@material-ui/core/Link";
import { Edit } from "@material-ui/icons";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 05, 2019
 */


class PlayerSidebar extends Component {
  render() {
    const renderPlayer = player => {
      const playerText = `${toTitleCase(player.name)} (${player.jerseyNo})`;
      const editButton = <ListItemIcon><Link href={'#/player@' + player._id} className="float-right">
        <Edit/>
      </Link></ListItemIcon>;

      return <ListItem key={player._id} selected={player._id === this.props.playerId}>
        <ListItemText><Link href={`#player-stat@${player._id}`}>{playerText}</Link></ListItemText>
        {this.props.editable && editButton}
      </ListItem>;
    };

    return <List
      title="Existing Players"
      itemMapper={renderPlayer}
      list={this.props.players}
      onFilter={debounce(this.props.onFilter, 1000)}/>;
  }
}

PlayerSidebar.propTypes = {
  playerId: PropTypes.string,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  editable: PropTypes.bool,
  onFilter: PropTypes.func.isRequired,
};

export default PlayerSidebar;

