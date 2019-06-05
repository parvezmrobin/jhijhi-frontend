/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 05, 2019
 */

import React, { PureComponent } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import fetcher from '../lib/fetcher';
import { toTitleCase } from '../lib/utils';
import { Table } from 'reactstrap';
import Loading from './Loading';
import PlayerSidebar from '../components/PlayerSidebar';

class PlayerDetails extends PureComponent {
  state = {
    stat: {},
    player: {},
    players: [],
  };


  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      // this event handler is called before `this.props.match.params.id` is updated
      const playerId = location.pathname.substr(13);
      this._loadPlayer(playerId);
    });

    this._loadPlayer(this.props.match.params.id);
    fetcher.get('/players')
      .then(response => {
        this.setState({ players: response.data });
      });
  }

  _loadPlayer(playerId) {
    fetcher.get(`/players/${playerId}`)
      .then(response => {
        this.setState({
          stat: response.data.stat,
          player: response.data.player,
        });
      });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { player, stat, players } = this.state;
    if (!player.name) {
      return <Loading/>;
    }
    return (
      <div>
        <div className="row">

          <PlayerSidebar editable playerId={player._id} players={players}/>
          <main className="col">
            <CenterContent col="col-lg-6 col-md-8">
              <h2 className="text-primary text-center">{toTitleCase(player.name)}</h2>
              <h5 className="text-center font-weight-normal pb-3">Jersey No: {player.jerseyNo}</h5>
              <Table>
                <tbody>
                <tr>
                  <th scope="row">Matches</th>
                  <td>{stat.numMatches}</td>
                </tr>
                <tr>
                  <th scope="row">Innings</th>
                  <td>{stat.numInningses}</td>
                </tr>
                <tr>
                  <th scope="row">Total Runs</th>
                  <td>{stat.totalRun}</td>
                </tr>
                <tr>
                  <th scope="row">Average</th>
                  <td>{Number.isNaN(stat.avgRun)? 'N/A' : Number(stat.avgRun).toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">Highest Score</th>
                  <td>{stat.highestRun}</td>
                </tr>
                <tr>
                  <th scope="row">Strike Rate</th>
                  <td>{Number.isNaN(stat.strikeRate)? 'N/A' : Number(stat.strikeRate).toFixed(2)}</td>
                </tr>
                </tbody>
              </Table>

            </CenterContent>
          </main>

        </div>
      </div>
    );
  }
}

export default PlayerDetails;
