import React, { Component } from "react";
import * as feather from "feather-icons";
import { Link } from "react-router-dom";
import CenterContent from "./layouts/CenterContent";
import SidebarList from "./SidebarList";
import debounce from "lodash/debounce";
import * as PropTypes from "prop-types";

/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Date: Nov 02, 2019
 */

export default class MatchSidebar extends Component {
  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate() {
    feather.replace();
  }

  renderMatch = match => {
    const regExp = new RegExp(this.props.searchKeyword, 'i');
    const tags = this.props.searchKeyword && match.tags && match.tags.map(
      tag => regExp.test(tag) ? tag : <span key={tag} className="text-secondary">{tag}</span>,
    ); // dim tags that are not matched

    const editButton = <Link to={'match@' + match._id} className="float-right">
      <small className="text-white"><i data-feather="edit"/></small>
    </Link>;
    const className = (match._id === this.props.matchId) ? 'text-success' : 'text-white';

    return <>
      <Link className={className} to={`live@${match._id}`} title={match.tags}>
        {match.name}
        {tags && <> ({tags.map((tag, i) => [!!i && ', ', tag])})</>} {/*put a comma before every element but first one*/}
      </Link>
      {this.props.editable && editButton}
    </>;
  };


  render() {

    return <aside className="col-md-3">
      <CenterContent col="col">
        <SidebarList
          title="Upcoming Matches"
          itemClass="text-white"
          itemMapper={this.renderMatch}
          list={this.props.matches}
          onFilter={debounce(this.props.onFilter, 1000)}/>
      </CenterContent>
    </aside>;
  }
}

MatchSidebar.propTypes = {
  editable: PropTypes.bool,
  matchId: PropTypes.string,
  matches: PropTypes.any,
  onFilter: PropTypes.func,
  searchKeyword: PropTypes.string,
};
