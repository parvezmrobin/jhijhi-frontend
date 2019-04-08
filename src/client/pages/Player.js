/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component, Fragment} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import PlayerForm from "../components/PlayerForm";
import fetcher from "../lib/fetcher";
import {toTitleCase} from "../lib/utils";
import {Link} from "react-router-dom";


class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
    }
  }

  componentDidMount() {
    fetcher.get('players')
      .then(response => {
        this.setState({players: response.data});
      });
  }

  render() {
    const renderPlayer = player => {
      const playerText = `${toTitleCase(player.name)} (${player.jerseyNo})`;
      const editButton = <Link to={"player/edit/" + player._id} class="float-right"><kbd>Edit</kbd></Link>;
      return <Fragment>{playerText} {editButton}</Fragment>;
    };
    return (
      <div className="container-fluid pl-0">
        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Existing Players"
                itemClass="text-white"
                itemMapper={renderPlayer}
                list={this.state.players}/>
            </CenterContent>
          </aside>
          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              <PlayerForm/>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Player;
