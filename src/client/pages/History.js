import React, { Component } from 'react';
import fetcher from '../lib/fetcher';
import PreviousOvers from '../components/PreviousOvers';
import CurrentOver from '../components/CurrentOver';
import { CustomInput } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { toTitleCase } from '../lib/utils';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: null,
      overIndex: null,
      showSecondInnings: false,
    };

  }

  componentDidMount() {
    fetcher
      .get(`matches/${this.props.match.params.id}`)
      .then(response => {
        this.setState({ match: response.data });
        console.log(response.data);
      });
  }

  static calculateScore(innings) {
    let score = 0;
    let wicket = 0;
    for (const over of innings.overs) {
      for (const bowl of over.bowls) {
        if (typeof (bowl.singles) === 'number') {
          score += bowl.singles;
        }
        if (typeof (bowl.by) === 'number') {
          score += bowl.by;
        }
        if (typeof (bowl.legBy) === 'number') {
          score += bowl.legBy;
        }
        if (bowl.boundary && typeof (bowl.boundary.run) === 'number') {
          score += bowl.boundary.run;
        }
        if (typeof (bowl.isWicket) === 'string') {
          wicket += 1;
        }
      }
    }
    return [score, wicket];
  }

  render() {
    const { match, showSecondInnings } = this.state;
    if (match === null) {
      return <div>loading...</div>;
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

    const [innings1score, innings1wicket] = History.calculateScore(match.innings1);
    const [innings2score, innings2wicket] = History.calculateScore(match.innings2);

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


    const overIndex = this.state.overIndex || 0;
    const bowlerName = bowlingTeamPlayers[match.innings1.overs[overIndex].bowledBy].name;
    const innings = showSecondInnings ? match.innings2 : match.innings1;

    return (
        <div className="row">
          <aside className="col-3">
            <CenterContent col="col">
              <SidebarList
                title="Completed Matches"
                itemClass="text-white"
                itemMapper={(match) => {
                  return <Link className="text-info" to={`history@${match._id}`}>{match.name}</Link>;
                }}
                list={[]}/>
            </CenterContent>
          </aside>
          <main className="col bg-success min-vh-100">
            <div className="row mt-5">

          <div className=" pt-4 pb-4 col text-white text-center">
            <strong className="text-dark">{winningTeam}</strong> won the match {type}. <br/>
            {tossWinningTeamName} won the toss and chose to {choice} first. <br/>
            {innings1TeamName} : {innings1score}-{innings1wicket} <br/>
            {innings2TeamName} : {innings2score}-{innings2wicket} <br/>
            {}
            <h5 className="d-flex justify-content-center mt-2">
                <label className={showSecondInnings? 'badge' : 'badge badge-info'}>1st innings</label>
                <CustomInput className="mx-3" checked={showSecondInnings} type="switch" id="innings" name="innings"
                             onChange={e => this.setState({
                                 showSecondInnings: e.target.checked,
                                 overIndex: 0,
                             })}  inline/>
                <label className={showSecondInnings? 'badge badge-info' : 'badge'}>2nd innings</label>
            </h5>

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
