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
import PlayerSidebar from '../components/player/PlayerSidebar';
import ErrorModal from '../components/modal/ErrorModal';

class PlayerDetails extends PureComponent {
  state = {
    stat: {},
    player: {},
    players: [],
    showErrorModal: false,
  };


  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      // this event handler is called before `this.props.match.params.id` is updated
      const playerId = location.pathname.substr(13);
      this._loadPlayer(playerId);
    });

    this._loadPlayer(this.props.match.params.id);
    this._loadPlayers();
  }

  _loadPlayers = (keyword = '') => {
    fetcher.get(`/players?search=${keyword}`)
      .then(response => {
        return this.setState({ players: response.data });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  };

  _loadPlayer(playerId) {
    fetcher.get(`/players/${playerId}`)
      .then(response => {
        return this.setState({
          stat: response.data.stat,
          player: response.data.player,
        });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  }

  componentWillUnmount() {
    this.unlisten();
    fetcher.cancelAll();
  }

  render() {
    const { player, stat: { bat: battingStat, bowl: bowlingStat, numMatch }, players } = this.state;
    let mainContent;
    if (!player.name) {
      mainContent = <Loading className="col"/>;
    } else {
      mainContent = <main className="col">
        <CenterContent col="col-lg-6 col-md-8">
          <h2 className="text-primary text-center">{toTitleCase(player.name)}</h2>
          <h5 className="text-center font-weight-normal pb-3">Jersey No: {player.jerseyNo}</h5>
          <Table>
            <tbody>
            <tr>
              <th scope="row" colSpan="2">Matches</th>
              <td colSpan="2">{numMatch}</td>
            </tr>
            <tr>
              {battingStat.numInnings > 0 && <>
                <th scope="row">Innings Batted</th>
                <td>{battingStat.numInnings}</td>
              </>}
              {!battingStat.numInnings &&
              <th scope="row" rowSpan="5" colSpan="2" className="fs-2 font-weight-normal">
                Never Batted
              </th>}
              {bowlingStat.numInnings > 0 && <>
                <th scope="row">Innings Bowled</th>
                <td>{bowlingStat.numInnings}</td>
              </>}
              {!bowlingStat.numInnings &&
              <th scope="row" rowSpan="5" colSpan="2" className="fs-2 font-weight-normal">
                Never Bowled
              </th>}
            </tr>
            <tr>
              {battingStat.numInnings > 0 && <>
                <th scope="row">Total Runs</th>
                <td>{battingStat.totalRun}</td>
              </>}
              {bowlingStat.numInnings > 0 && <>
                <th scope="row">Total Wickets</th>
                <td>{bowlingStat.totalWickets}</td>
              </>}
            </tr>
            <tr>
              {battingStat.numInnings > 0 && <>
                <th scope="row">Batting Average</th>
                <td>{!Number.isFinite(battingStat.avgRun) ? 'N/A'
                  : Math.round(battingStat.avgRun * 100) / 100}</td>
              </>}
              {bowlingStat.numInnings > 0 && <>
                <th scope="row">Bowling Average</th>
                <td>{!Number.isFinite(bowlingStat.avgWicket) ? 'N/A'
                  : Math.round(bowlingStat.avgWicket * 100) / 100}</td>
              </>}
            </tr>
            <tr>
              {battingStat.numInnings > 0 && <>
                <th scope="row">Highest Score</th>
                <td>{battingStat.highestRun}</td>
              </>}
              {bowlingStat.numInnings > 0 && <>
                <th scope="row">Best Figure</th>
                <td>{Number.isInteger(bowlingStat.bestFigure.run) &&
                `${bowlingStat.bestFigure.wicket}-${bowlingStat.bestFigure.run}`}</td>
              </>}
            </tr>
            <tr>
              {battingStat.numInnings > 0 && <>
                <th scope="row">Batting Strike Rate</th>
                <td>{!Number.isFinite(battingStat.strikeRate) ? 'N/A'
                  : Math.round(battingStat.strikeRate * 100) / 100}</td>
              </>}
              {bowlingStat.numInnings > 0 && <>
                <th scope="row">Bowling Strike Rate</th>
                <td>{!Number.isFinite(bowlingStat.strikeRate) ? 'N/A'
                  : Math.round(bowlingStat.strikeRate * 100) / 100}</td>
              </>}
            </tr>
            </tbody>
          </Table>

        </CenterContent>
      </main>;
    }
    return (
      <div>
        <div className="row">

          <PlayerSidebar editable playerId={player._id} players={players}
                         onFilter={this._loadPlayers}/>

          {mainContent}

        </div>
        <ErrorModal isOpen={this.state.showErrorModal}
                    close={() => this.setState({ showErrorModal: false })}/>
      </div>
    );
  }
}

export default PlayerDetails;
