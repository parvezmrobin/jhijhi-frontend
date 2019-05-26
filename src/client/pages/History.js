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
      matches: null,
    };
  }

  componentDidMount() {
    fetcher
      .get('/matches/done')
      .then(response => this.setState({ matches: response.data }));
  }

  render() {
    const matchId = this.props.match.params.id;
    const matches = this.state.matches;

    if (matches && !matches.length) {
      return <CenterContent>
        <h2 className="text-center mt-10">You want score before even playing a match!</h2>
        <div className="row justify-content-center">
          <img className="img-fluid" src={"/frustrated.gif"} alt="frustrated"/>
        </div>
      </CenterContent>;
    }
    const sidebar = <aside className="col-md-3">
      <CenterContent col="col">
        <SidebarList title="Completed Matches" itemMapper={(match) => {
          return <Link className={(match._id === matchId) ? 'text-success' : 'text-white'}
                       to={`history@${match._id}`}>{match.name}</Link>;
        }}
                     list={matches || []}/>
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
