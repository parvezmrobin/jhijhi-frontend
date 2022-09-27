/**
 * Parvez M Robin
 * me@parvezmrobin.com
 * Date: Oct 26, 2019
 */

import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import * as feather from 'feather-icons';
import debounce from 'lodash/debounce';
import { arrayOf, bool, shape, string, func } from 'prop-types';
import List from '../layouts/List';
import CenterContent from '../layouts/CenterContent';
import { toTitleCase } from '../../lib/utils';
import { UmpireType } from '../../types';

export default class UmpireSidebar extends Component {
  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate() {
    feather.replace();
  }

  render() {
    const { umpireId, umpires, onFilter, editable } = this.props;
    const renderUmpire = (umpire) => {
      const umpireText = toTitleCase(umpire.name);
      const editButton = (
        <Link to={`umpire@${umpire._id}`} className="float-right">
          <small className="text-white">
            <i data-feather="edit" />
          </small>
        </Link>
      );
      const className = umpire._id === umpireId ? 'text-success' : 'text-white';
      return (
        <>
          <span className={className}>{umpireText}</span>
          {editable && editButton}
        </>
      );
    };

    return (
      <aside className="col-md-4 col-lg-3">
        <CenterContent col="col">
          <List
            title="Existing Umpires"
            itemMapper={renderUmpire}
            list={umpires}
            onFilter={debounce(onFilter, 1000)}
          />
        </CenterContent>
      </aside>
    );
  }
}

UmpireSidebar.propTypes = {
  umpireId: string,
  umpires: arrayOf(shape(UmpireType)).isRequired,
  editable: bool,
  onFilter: func.isRequired,
};
