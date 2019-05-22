import React, { Component } from 'react';
import fetcher from '../lib/fetcher';
import PreviousOvers from '../components/PreviousOvers';
import CurrentOver from '../components/CurrentOver';
import { CustomInput } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { toTitleCase } from '../lib/utils';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import Score from '../components/Score';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      match: null,
      overIndex: null,
      showSecondInnings: false,
    };

  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      const matchId = location.pathname.substr(9);
      this._loadMatchIfNecessary(matchId);
    });

    fetcher
      .get('/matches/done')
      .then(response => this.setState({ matches: response.data }));

    const matchId = this.props.match.params.id;
    this._loadMatchIfNecessary(matchId);
  }

  _loadMatchIfNecessary(matchId) {
    if (matchId && matchId !== 'null') {
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

  componentWillUnmount() {
    this.unlisten();
  }

  static calculateOver(overs) {
    let lastOverNumber = overs.length - 1,
      lastOver = overs[lastOverNumber],
      bowls = lastOver.bowls,
      lastOverLength = bowls.length,
      numOfOvers,
      numOfBowls;
    for (let i = 0; i < bowls.length; i++) {
      const bowl = bowls[i];
      if (bowl.isWide || bowl.isNo) {
        lastOverLength--;
      }
    }
    if (lastOverLength === 6) {
      numOfOvers = lastOverNumber + 1;
      numOfBowls = 0;
    } else {
      numOfOvers = lastOverNumber;
      numOfBowls = lastOverLength;
    }
    return [numOfOvers, numOfBowls];
  }

  render() {
    const { match, showSecondInnings } = this.state;
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
    if (match === null) {
      const text = (matchId === 'null') ? 'Select a Match' : 'Loading...';
      const loading = <div className="col"><CenterContent><h2 className="text-center">
        {text}
      </h2></CenterContent></div>;
      return <div className="row">{sidebar}{loading}</div>;
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
      } else {
        bowlingTeamPlayers = match.team2Players;
        battingTeamPlayers = match.team1Players;
      }
      innings1TeamName = match.team1.name;
      innings2TeamName = match.team2.name;
    } else {
      if (showSecondInnings) {
        bowlingTeamPlayers = match.team2Players;
        battingTeamPlayers = match.team1Players;
      } else {
        bowlingTeamPlayers = match.team1Players;
        battingTeamPlayers = match.team2Players;
      }
      innings2TeamName = match.team1.name;
      innings1TeamName = match.team2.name;
    }
    let innings1overs = match.innings1.overs,
      innings2overs = match.innings2.overs;

    const [numOfOvers1, numOfBowls1] = History.calculateOver(innings1overs),
      [numOfOvers2, numOfBowls2] = History.calculateOver(innings2overs);

    const overIndex = this.state.overIndex || 0;
    const bowlerName = bowlingTeamPlayers[match.innings1.overs[overIndex].bowledBy].name;
    const innings = showSecondInnings ? match.innings2 : match.innings1;

    return (
      <div className="row">
        {sidebar}
        <main className="col bg-success min-vh-100 pt-5">
          <h2 className="text-info bg-dark-trans pt-2 pb-3 mt-3 rounded text-center">
            {match.name}
          </h2>
          <div className="row mt-1">

            <div className="pt-3 col text-white">
              <h4 className="text-center">{winningTeam}</h4>
              <div className="bg-info shadow rounded pb-3 px-2">
                <h5 className="text-center">won the match {type}. </h5>
                <h5 className="d-flex justify-content-center my-3">
                  <label className={showSecondInnings ? 'badge' : 'badge badge-primary'}>
                    1st innings
                  </label>
                  <CustomInput className="mx-3" checked={showSecondInnings} type="switch"
                               id="innings"
                               name="innings"
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
              </div>
            </div>
            <div className="pt-1 col">
              <PreviousOvers overs={innings.overs} bowlingTeam={bowlingTeamPlayers}
                             onOverClick={(index) => this.setState({ overIndex: index })}/>
            </div>
            <div className="pt-1 col">
              <CurrentOver balls={innings.overs[overIndex].bowls}
                           title={`${toTitleCase(bowlerName)} bowled (Over ${overIndex + 1})`}
                           battingTeam={battingTeamPlayers}/>
            </div>

          </div>
        </main>
      </div>
    );
  }
}

export default History;
