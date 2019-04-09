/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 09, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../../components/layouts/CenterContent';
import SidebarList from '../../components/SidebarList';
import fetcher from "../../lib/fetcher";
import {toTitleCase} from "../../lib/utils";


class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: {
        name: '',
        shortName: '',
        players: [],
      },
    };
  }


  componentDidMount() {
    fetcher
      .get(`teams/${this.props.match.params.id}`)
      .then(response => {
        this.setState({team: response.data})
      });
  }

  render() {
    return (
      <div className="container-fluid px-0">

        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Players"
                itemClass="text-white"
                itemMapper={(player) => `${toTitleCase(player.name)} (${player.jerseyNo})`}
                list={this.state.team.players}/>
            </CenterContent>
          </aside>
          <main className="col">
            <CenterContent col="col mt-5">
              <h1 className="text-center text-primary">{this.state.team.name}</h1>
              <h4 className="text-center">{this.state.team.shortName.toUpperCase()}</h4>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Team;
