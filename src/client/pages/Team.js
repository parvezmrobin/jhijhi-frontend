/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import TeamForm from '../components/TeamForm';
import fetcher from "../lib/fetcher";


class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: {
        name: '',
        shortName: '',
      },
      players: [],
      teams: [],
      selectedPlayerIndices: [],
    }
  }

  componentDidMount() {
    fetcher
      .get('players')
      .then(response => {
        this.setState({players: response.data})
      });
    fetcher
      .get('teams')
      .then(response => {
        this.setState({teams: response.data})
      });
  }

  render() {
    return (
      <div className="container-fluid px-0">
        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Existing Teams"
                itemClass="text-white"
                itemMapper={(team) => `${team.name} (${team.shortName})`}
                list={this.state.teams}/>
            </CenterContent>
          </aside>
          <main className="col-md-6">
            <CenterContent col="col mt-5">
              <TeamForm players={this.state.players}/>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Team;
