/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Date: Nov 02, 2019
 */

import React, { Component } from 'react';
import * as feather from 'feather-icons';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import * as PropTypes from 'prop-types';
import CenterContent from '../layouts/CenterContent';
import List from '../layouts/List';
import { Team as TeamType } from '../../types';

export default class TeamSidebar extends Component {
  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate() {
    feather.replace();
  }

  _renderTeam = (team) => {
    const { teamId, editable } = this.props;
    const teamText = `${team.name} (${team.shortName})`;
    const editButton = (
      <Link to={`team@${team._id}`} className="float-right">
        <small className="text-white">
          <i data-feather="edit" />
        </small>
      </Link>
    );
    const className = team._id === teamId ? 'text-success' : 'text-white';
    return (
      <>
        <span className={className}>{teamText}</span>
        {editable && editButton}
      </>
    );
  };

  render() {
    const { teams, onFilter } = this.props;
    return (
      <aside className="col-md-4 col-lg-3">
        <CenterContent col="col">
          <List
            title="Existing Teams"
            itemMapper={this._renderTeam}
            list={teams}
            onFilter={debounce(onFilter, 1000)}
          />
        </CenterContent>
      </aside>
    );
  }
}

TeamSidebar.propTypes = {
  editable: PropTypes.bool,
  teamId: PropTypes.string,
  teams: PropTypes.arrayOf(PropTypes.shape(TeamType)).isRequired,
  onFilter: PropTypes.func,
};
