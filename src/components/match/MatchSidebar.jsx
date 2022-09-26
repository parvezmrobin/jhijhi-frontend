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
import { Match as MatchType } from '../../types';

export default class MatchSidebar extends Component {
  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate() {
    feather.replace();
  }

  renderMatch = (match) => {
    const { searchKeyword, matchId, editable } = this.props;
    const regExp = new RegExp(searchKeyword, 'i');
    const tags =
      searchKeyword &&
      match.tags &&
      match.tags.map((tag) => {
        if (regExp.test(tag)) {
          return tag;
        }
        return (
          <span key={tag} className="text-secondary">
            {tag}
          </span>
        );
      }); // dim tags that are not matched

    const editButton = (
      <Link to={`match@${match._id}`} className="float-right">
        <small className="text-white">
          <i data-feather="edit" />
        </small>
      </Link>
    );
    const className = match._id === matchId ? 'text-success' : 'text-white';

    return (
      <>
        <Link className={className} to={`live@${match._id}`} title={match.tags}>
          {match.name}
          {tags && <> ({tags.map((tag, i) => [!!i && ', ', tag])})</>}{' '}
          {/* put a comma before every element but first one */}
        </Link>
        {editable && editButton}
      </>
    );
  };

  render() {
    const { matches, onFilter } = this.props;
    return (
      <aside className="col-md-3">
        <CenterContent col="col">
          <List
            title="Upcoming Matches"
            itemClass="text-white"
            itemMapper={this.renderMatch}
            list={matches}
            onFilter={debounce(onFilter, 1000)}
          />
        </CenterContent>
      </aside>
    );
  }
}

MatchSidebar.propTypes = {
  editable: PropTypes.bool,
  matchId: PropTypes.string,
  matches: PropTypes.arrayOf(PropTypes.shape(MatchType)),
  onFilter: PropTypes.func,
  searchKeyword: PropTypes.string,
};
