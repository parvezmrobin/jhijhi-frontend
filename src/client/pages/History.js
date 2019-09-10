import React, { Component } from 'react';
import fetcher from '../lib/fetcher';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
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

  onFilter = (keyword) => {
    return fetcher
      .get(`/matches/done?search=${keyword}`)
      .then(response => this.setState({ matches: response.data }));
  };

  componentDidMount() {
    return fetcher
      .get('/matches/done')
      .then(response => this.setState({ matches: response.data }));
  }

  componentWillUnmount() {
    fetcher.cancelAll();
  }

  render() {
    const matchId = this.props.match.params.id;
    const matches = this.state.matches;

    if (matches && !matches.length) {
      return <CenterContent>
        <h2 className="text-center mt-10" style={{fontFamily: 'cursive'}}>
          You want score before even playing a match!
        </h2>
        <div className="row justify-content-center">
          <img className="img-fluid" src={'/frustrated.gif'} alt="frustrated"/>
        </div>
      </CenterContent>;
    }
    const sidebarItemMapper = (match) => {
      return <Link className={(match._id === matchId) ? 'text-success' : 'text-white'}
                   to={`history@${match._id}`}>{match.name}</Link>;
    };
    const sidebar = <aside className="col-md-3">
      <CenterContent col="col">
        <SidebarList title="Completed Matches" itemMapper={sidebarItemMapper} list={matches || []}
                     onFilter={debounce(this.onFilter, 500)}/>
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
