/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 23, 2019
 */


import React, {Component} from 'react';
import fetcher from '../lib/fetcher';
import CenterContent from './layouts/CenterContent';
import Score from './Score';
import {Button, CustomInput, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Overs from './Overs';
import CurrentOver from './CurrentOver';
import {copySharableLink, toTitleCase} from '../lib/utils';
import * as PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import ScoreModal from './ScoreModal';
import ErrorModal from "./ErrorModal";

export default class MatchDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: null,
      overIndex: null,
      showSecondInnings: false,
      showModal: false,
      forceWatching: null,
      showErrorModal: false,
    };
  }

  componentDidMount() {
    this._loadMatchIfNecessary();
  }

  componentWillReceiveProps () {
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
    return fetcher
      .get(`/matches/${matchId}`)
      .then(response => {
        return this.setState({ match: response.data });
      })
      .catch(() => this.setState({showErrorModal: true}));
  }

  componentWillUnmount() {
    fetcher.cancelAll();
  }

  _copySharableLinkAndShowConfirmation = e => {
    copySharableLink(this.props.matchId);
    const button = e.target;
    button.innerHTML = 'Copied';
    setTimeout(() => button.innerHTML = 'Copy Sharable Link', 500);
  };

  getUI() {
    const { match, showSecondInnings, forceWatching } = this.state;
    const { matchId, isPrivate } = this.props;

    if (match === null) {
      const text = (matchId === 'null') ? 'Select a Match' : 'Loading...';
      const loading = <div className="col"><CenterContent><p className="text-center display-2">
        {text}
      </p></CenterContent></div>;
      return <div className="col">{loading}</div>;
    }
    if (forceWatching === false) {
      return <Redirect to={`/live@${matchId}`} push/>;
    }

    if (isPrivate && match.state !== 'done' && forceWatching === null) {
      return <ForceWatchingModal
        isOpen={forceWatching !== true}
        close={() => this.setState({forceWatching: true})}
        move={() => this.setState({forceWatching: false})}/>
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

    const innings1 = match.innings1 || { overs: [] }; // fallback if innings1 is undefined
    const innings2 = match.innings2 || { overs: [] }; // fallback if innings2 is undefined
    const { totalRun: innings1score, totalWicket: innings1wicket } = Score.getTotalScore(innings1);
    const { totalRun: innings2score, totalWicket: innings2wicket } = Score.getTotalScore(innings2);

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

    const { numOvers: numOfOvers1, numBowls: numOfBowls1 } = Score.getOverCount(innings1);
    const { numOvers: numOfOvers2, numBowls: numOfBowls2 } = Score.getOverCount(innings2);

    const overIndex = this.state.overIndex || 0;
    const innings = showSecondInnings ? innings2 : innings1;
    const bowlerName = bowlingTeamPlayers[innings.overs[overIndex]?.bowledBy]?.name;

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
                <button
                  onClick={this._copySharableLinkAndShowConfirmation}
                  className="btn btn-outline-primary text-white btn-block">
                  Copy Sharable Link
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-1 col-sm">
          <Overs overs={innings.overs} bowlingTeam={bowlingTeamPlayers} activeIndex={overIndex}
                 onOverClick={(index) => this.setState({ overIndex: index })}/>
        </div>
        <div className="pt-1 col-sm">
          {innings.overs[overIndex]?.bowls && <CurrentOver bowls={innings.overs[overIndex].bowls}
                       title={`${toTitleCase(bowlerName)} bowled (Over ${overIndex + 1})`}
                       battingTeam={battingTeamPlayers}/>}
        </div>

      </div>
      <footer className="py-3 py-sm-0"/>

      <ScoreModal isOpen={this.state.showModal} toggle={() => this.setState({ showModal: false })}
                  innings={innings} battingTeamPlayers={battingTeamPlayers} bowlingTeamPlayers={bowlingTeamPlayers}
                  battingTeamName={battingTeamName} bowlingTeamName={bowlingTeamName}/>

    </main>;
  }

  render() {
    return <>
      {this.getUI()}

      <ErrorModal isOpen={this.state.showErrorModal} close={() => this.setState({ showErrorModal: false })}/>
    </>;
  }

}

MatchDetail.propTypes = {
  matchId: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool,
};

function ForceWatchingModal(props) {
  return <Modal isOpen={props.isOpen}>
    <ModalHeader className="text-primary border-0">
      Are You On The Right Page?
    </ModalHeader>
    <ModalBody>
      This match is still running. Are you sure you want to watch score rather than entering score?
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={props.close}>Yes, Keep Me Here</Button>
      <Button color="primary" onClick={props.move}>Bring Me To Scoring</Button>
    </ModalFooter>
  </Modal>;
}

ForceWatchingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
};
