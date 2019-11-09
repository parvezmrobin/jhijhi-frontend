import React, { Component } from "react";
import * as feather from "feather-icons";
import { Link } from "react-router-dom";
import CenterContent from "../layouts/CenterContent";
import SidebarList from "../layouts/SidebarList";
import debounce from "lodash/debounce";
import * as PropTypes from "prop-types";

/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Date: Nov 02, 2019
 */

export default class TeamSidebar extends Component {
  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate() {
    feather.replace();
  }

  _renderTeam = team => {
    const teamText = `${team.name} (${team.shortName})`;
    const editButton = <Link to={'team@' + team._id} className="float-right">
      <small className="text-white"><i data-feather="edit"/></small>
    </Link>;
    const className = (team._id === this.props.teamId) ? 'text-success' : 'text-white';
    return <>
      <span className={className}>{teamText}</span>
      {this.props.editable && editButton}
    </>;
  };

  render() {
    return <aside className="col-md-4 col-lg-3">
      <CenterContent col="col">
        <SidebarList
          title="Existing Teams"
          itemMapper={this._renderTeam}
          list={this.props.teams}
          onFilter={debounce(this.props.onFilter, 1000)}/>
      </CenterContent>
    </aside>;
  }
}

TeamSidebar.propTypes = {
  editable: PropTypes.bool,
  teamId: PropTypes.string,
  teams: PropTypes.arrayOf(PropTypes.object),
  onFilter: PropTypes.func,
};
