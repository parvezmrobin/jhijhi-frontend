/**
 * Parvez M Robin
 * me@parvezmrobin.com
 * Date: Oct 26, 2019
 */

import { toTitleCase } from '../../lib/utils';
import { Link } from 'react-router-dom';
import CenterContent from '../layouts/CenterContent';
import SidebarList from '../layouts/SidebarList';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as feather from 'feather-icons';
import debounce from 'lodash/debounce';

export default class UmpireSidebar extends Component {

  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate() {
    feather.replace();
  }

  render() {
    const renderUmpire = umpire => {
      const umpireText = toTitleCase(umpire.name);
      const editButton = <Link to={'umpire@' + umpire._id} className="float-right">
        <small className="text-white"><i data-feather="edit"/></small>
      </Link>;
      const className = (umpire._id === this.props.umpireId) ? 'text-success' : 'text-white';
      return <>
        <span className={className}>{umpireText}</span>
        {this.props.editable && editButton}
      </>;
    };

    return <aside className="col-md-4 col-lg-3">
      <CenterContent col="col">
        <SidebarList
          title="Existing Umpires"
          itemMapper={renderUmpire}
          list={this.props.umpires}
          onFilter={debounce(this.props.onFilter, 1000)}/>
      </CenterContent>
    </aside>;
  }
}

UmpireSidebar.propTypes = {
  umpireId: PropTypes.string,
  umpires: PropTypes.arrayOf(PropTypes.object).isRequired,
  editable: PropTypes.bool,
  onFilter: PropTypes.func.isRequired,
};
