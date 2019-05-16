import React, { Component } from 'react';
import fetcher from '../lib/fetcher';
import PreviousOvers from '../components/PreviousOvers';
import CurrentOver from '../components/CurrentOver';
import { CustomInput } from 'reactstrap';
import { Redirect } from 'react-router-dom';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: null,
      overIndex: null,
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
    const { match } = this.state;
    if (match === null) {
      return <div>loading...</div>;
    }
    if (match.state !== 'done') {
      return <Redirect to={`/live@${this.props.match.params.id}`}/>;
    }
    let winningTeam;
    let type;
    let bowlingTeamPlayers;
    let battingTeamPlayers;

    let tossWinningTeamName;
    let choice;
    if (match.team1WonToss) {
      if (match.team1BatFirst) {
        choice = 'bat';
      } else {
        choice = 'bowl';
      }
      tossWinningTeamName = match.team1.name;
    } else {
      if (match.team1BatFirst) {
        choice = 'bowl';
      } else {
        choice = 'bat';
        bowlingTeamPlayers = match.team2.players;
      }
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
      bowlingTeamPlayers = match.team2Players;
      battingTeamPlayers = match.team1Players;
    } else {
      bowlingTeamPlayers = match.team1Players;
      battingTeamPlayers = match.team2Players;
    }

    const overIndex = this.state.overIndex || 0;
    return (
      <div className="container-fluid px-0 mt-5">
        <div className=" mt-10 pt-4 pb-4 col-8 offset-2 bg-dark text-white text-center">
          {winningTeam} won the match {type}. <br/>
          {tossWinningTeamName} won the toss and chose to {choice} first. <br/>
          <button className="btn btn-rounded btn-info mr-2">View 1st innings</button>
          <CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch"/>
          <button className="btn btn-rounded btn-info ml-2">View 2nd innings</button>

        </div>
        <div className=" mt-2 pt-1 pb-4 col-8 offset-2 bg-dark">
          <PreviousOvers overs={match.innings1.overs} bowlingTeam={bowlingTeamPlayers}
                         onOverClick={(index) => this.setState({ overIndex: index })}/>
          <CurrentOver balls={match.innings1.overs[overIndex].bowls}
                       bowler={bowlingTeamPlayers[match.innings1.overs[overIndex].bowledBy]}
                       battingTeam={battingTeamPlayers}/>
        </div>
        <pre>
                    {JSON.stringify(match, null, 2)}
                </pre>
      </div>
    );
  }

}

export default History;
