/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Date: Nov 02, 2019
 */

import React, { Component } from "react";
import List from "../layouts/List";
import debounce from "lodash/debounce";
import * as PropTypes from "prop-types";
import { toTitleCase } from "../../lib/utils";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { Edit } from "@material-ui/icons";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Link from "@material-ui/core/Link";

export default class TeamSidebar extends Component {
  _renderTeam = team => {
    const teamText = `${toTitleCase(team.name)} (${team.shortName})`;
    const editButton = <ListItemIcon>
      <Link href={'#/team@' + team._id}><Edit/></Link>
    </ListItemIcon>;
    return <ListItem key={team._id} selected={team._id === this.props.teamId}>
      <ListItemText>{teamText}</ListItemText>
      {this.props.editable && editButton}
    </ListItem>;
  };

  render() {
    return <List
      title="Existing Teams"
      itemMapper={this._renderTeam}
      list={this.props.teams}
      onFilter={debounce(this.props.onFilter, 1000)}/>;
  }
}

TeamSidebar.propTypes = {
  editable: PropTypes.bool,
  teamId: PropTypes.string,
  teams: PropTypes.arrayOf(PropTypes.object),
  onFilter: PropTypes.func,
};
