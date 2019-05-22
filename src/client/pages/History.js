import React, { Component } from 'react';
import fetcher from '../lib/fetcher';
import { Link } from 'react-router-dom';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import MatchDetail from '../components/MatchDetail';


class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
    };
  }

  componentDidMount() {
    fetcher
      .get('/matches/done')
      .then(response => this.setState({ matches: response.data }));
  }

  render() {
    const matchId = this.props.match.params.id;
    const sidebar = <aside className="col-3">
      <CenterContent col="col">
        <SidebarList
          title="Completed Matches"
          itemClass="text-white"
          itemMapper={(match) => {
            return <Link className={(match._id === matchId) ? 'text-primary' : 'text-info'}
                         to={`history@${match._id}`}>{match.name}</Link>;
          }}
          list={this.state.matches}/>
      </CenterContent>
    </aside>;

    return (
      <div className="row">
        {sidebar}
        <MatchDetail matchId={matchId}/>
      </div>
    );
  }
}

export default History;
