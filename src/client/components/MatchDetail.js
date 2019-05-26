/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 23, 2019
 */


import React, { Component } from 'react';
import fetcher from '../lib/fetcher';
import CenterContent from './layouts/CenterContent';
import Score from './Score';
import { CustomInput } from 'reactstrap';
import Overs from './Overs';
import CurrentOver from './CurrentOver';
import { toTitleCase } from '../lib/utils';
import * as PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import ScoreModal from './ScoreModal';

export default class MatchDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: null,
      overIndex: null,
      showSecondInnings: false,
      showModal: false,
    };
  }


  componentDidMount() {
    this._loadMatchIfNecessary();
  }

  componentDidUpdate() {
    this._loadMatchIfNecessary();
  }

  _loadMatchIfNecessary() {
    const { match } = this.state;
    const { matchId } = this.props;
    if ((matchId && matchId !== 'null') && (!match || matchId !== match._id)) {
      this._loadMatch(matchId);
    }
  }

  _loadMatch(matchId) {
    fetcher
      .get(`/matches/${matchId}`)
      .then(response => {
        this.setState({ match: response.data });
        console.log(response.data);
      });
  }


  render() {
    const { match, showSecondInnings } = this.state;
    const { matchId } = this.props;

    if (match === null) {
      const text = (matchId === 'null') ? 'Select a Match' : 'Loading...';
      const loading = <div className="col"><CenterContent><h2 className="text-center">
        {text}
      </h2></CenterContent></div>;
      return <div className="col">{loading}</div>;
    }
    if (match.state !== 'done') {
      return <Redirect to={`/live@${this.props.match.params.id}`}/>;
    }
    let winningTeam,
      type,
      bowlingTeamPlayers,
      battingTeamPlayers,
      tossWinningTeamName,
      innings1TeamName,
      innings2TeamName,
      battingTeamName,
      bowlingTeamName,
      choice;
    if (match.team1WonToss) {
      choice = match.team1BatFirst ? 'bat' : 'bowl';
      tossWinningTeamName = match.team1.name;
    } else {
      choice = match.team1BatFirst ? 'bowl' : 'bat';
      tossWinningTeamName = match.team2.name;
    }
    const { totalRun: innings1score, totalWicket: innings1wicket } = Score.getTotalScore(match.innings1);
    const { totalRun: innings2score, totalWicket: innings2wicket } = Score.getTotalScore(match.innings2);

    if (innings1score > innings2score) {
      winningTeam = match.team1BatFirst ? match.team1.name : match.team2.name;
      type = 'by ' + (innings1score - innings2score) + ' run';
    } else {
      if (match.team1BatFirst) {
        winningTeam = match.team2.name;
        type = 'by ' + (match.team2Players.length - innings2wicket) + ' wicket';
      } else {
        winningTeam = match.team1.name;
        type = 'by ' + (match.team1Players.length - innings1wicket) + ' wicket';
      }

    }
    if (match.team1BatFirst) {
      if (showSecondInnings) {
        bowlingTeamPlayers = match.team1Players;
        battingTeamPlayers = match.team2Players;
        bowlingTeamName = match.team1.name;
        battingTeamName = match.team2.name;
      } else {
        bowlingTeamPlayers = match.team2Players;
        battingTeamPlayers = match.team1Players;
        bowlingTeamName = match.team2.name;
        battingTeamName = match.team1.name;
      }
      innings1TeamName = match.team1.name;
      innings2TeamName = match.team2.name;
    } else {
      if (showSecondInnings) {
        bowlingTeamPlayers = match.team2Players;
        battingTeamPlayers = match.team1Players;
        bowlingTeamName = match.team2.name;
        battingTeamName = match.team1.name;
      } else {
        bowlingTeamPlayers = match.team1Players;
        battingTeamPlayers = match.team2Players;
        bowlingTeamName = match.team1.name;
        battingTeamName = match.team2.name;
      }
      innings2TeamName = match.team1.name;
      innings1TeamName = match.team2.name;
    }

    const { numOvers: numOfOvers1, numBowls: numOfBowls1 } = Score.getOverCount(match.innings1);
    const { numOvers: numOfOvers2, numBowls: numOfBowls2 } = Score.getOverCount(match.innings2);

    const overIndex = this.state.overIndex || 0;
    const innings = showSecondInnings ? match.innings2 : match.innings1;
    const bowlerName = bowlingTeamPlayers[innings.overs[overIndex].bowledBy].name;

    return <main className="col bg-success min-vh-100 pt-5">
      <h2 className="text-success bg-dark-trans pt-2 pb-3 mt-3 rounded text-center">
        {match.name}
      </h2>
      <div className="row mt-1">

        <div className="pt-3 col-lg text-white">
          <h4 className="text-center">{winningTeam}</h4>
          <div className="shadow rounded pb-3 px-2">
            <h5 className="text-center">won the match {type}. </h5>
            <h5 className="d-flex justify-content-center my-3">
              <label className={showSecondInnings ? 'badge' : 'badge badge-primary'}>
                1st innings
              </label>
              <CustomInput className="mx-3" checked={showSecondInnings} type="switch"
                           id="innings" name="innings"
                           onChange={e => this.setState({
                             showSecondInnings: e.target.checked,
                             overIndex: 0,
                           })} inline/>
              <label className={showSecondInnings ? 'badge badge-primary' : 'badge'}>
                2nd innings
              </label>
            </h5>
            <p className="lead">
              <strong>Toss Won:</strong> {tossWinningTeamName}<br/>
              <strong>Decision:</strong> {choice}
            </p>
            <p className="lead">
              <strong>{innings1TeamName}:</strong> {innings1score}/{innings1wicket}{' '}
              <small>({numOfOvers1}.{numOfBowls1} overs)</small>
              <br/>
              <strong>{innings2TeamName}:</strong> {innings2score}/{innings2wicket}{' '}
              <small>({numOfOvers2}.{numOfBowls2} overs)</small>
            </p>
            <div className="row">
              <div className="col-12 col-md col-lg-12">
                <button onClick={() => this.setState({ showModal: true })}
                        className="btn btn-primary btn-block">
                  Show Score Card
                </button>
              </div>
              <div className="col-12 col-md col-lg-12 pt-1 pt-md-0 pt-lg-1">
                <button onClick={(e) => this.copySharableLink(e)}
                        className="btn btn-outline-primary text-white btn-block">
                  Copy Sharable Link
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-1 col-sm">
          <Overs overs={innings.overs} bowlingTeam={bowlingTeamPlayers}
                 onOverClick={(index) => this.setState({ overIndex: index })}/>
        </div>
        <div className="pt-1 col-sm">
          <CurrentOver balls={innings.overs[overIndex].bowls}
                       title={`${toTitleCase(bowlerName)} bowled (Over ${overIndex + 1})`}
                       battingTeam={battingTeamPlayers}/>
        </div>

      </div>

      <ScoreModal isOpen={this.state.showModal} toggle={() => this.setState({showModal: false})}
      innings={innings} battingTeamPlayers={battingTeamPlayers} bowlingTeamPlayers={bowlingTeamPlayers}
      battingTeamName={battingTeamName} bowlingTeamName={bowlingTeamName}/>
    </main>;
  }

  copySharableLink(e) {
    const url = `${window.location.origin}/public@${this.props.matchId}`;
    const el = document.createElement('textarea');
    el.value = url;
    el.setAttribute('readonly', '');
    el.style.display = null;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const button = e.target;
    button.innerHTML = 'Copied';
    setTimeout(() => button.innerHTML = 'Copy Sharable Link', 500);
  }
}

MatchDetail.propTypes = {
  matchId: PropTypes.string,
};
