import React, { Component } from 'react';
import CenterContent from './layouts/CenterContent';
import SidebarList from './SidebarList';
import CurrentOver from './CurrentOver';
import PreviousOvers from './PreviousOvers';
import ScoreInput from './ScoreInput';

export class Running extends Component {

  render() {

    const balls = [
      {
        batsman: 'Player 5',
        run: 1,
      },
      {
        batsman: 'Player 4',
        boundary: 4,
      },
      {
        batsman: 'Player 4',
        boundary: 6,
      },
      {
        batsman: 'Player 4',
        isWide: true,
      },
      {
        batsman: 'Player 4',
        isWicket: 'bold',
      },
    ];

    const overs = [
      {
        bowler: 'Bowler 2',
        runs: 17,
        wickets: [],
      },
      {
        bowler: 'Bowler 3',
        runs: 5,
        wickets: ['run out'],
      },
      {
        bowler: 'Bowler 2',
        runs: 9,
        wickets: ['bold', 'caught'],
      },
    ];

    const { name, team1, team2, team1WonToss, team1BatFirst } = this.props;


    return <div className="row">
      <aside className="col-md-3">
        <CenterContent col="col">
          <SidebarList
            title="Players of Team"
            itemClass="text-white"
            itemMapper={player => player.name}
            list={this.props.players}/>
        </CenterContent>
      </aside>
      <main className="col bg-success">
        <div className="row px-1">
          <header className="text-center text-white col-12 mt-5 pt-2">
            <h2 className="my-3">{name}</h2>
          </header>
          <hr/>
          <ScoreInput/>
          <div className="col-md-4">
            <div className='bg-dark text-info p-2 mt-5'>
              <h4 className="mt-3 text-white">{team1.name} - 43 / 4</h4>
              <h5>
                <small>After</small>
                &nbsp;3 overs 4 bawls
              </h5>
              <h6>Innings 1</h6>
            </div>
            <div className="mt-3 text-white">
              <h5>
                <small>
                  {team1WonToss ? team1.name : team2.name} won the toss. <br/>
                  {team1BatFirst ? team1.name : team2.name} will bat first.
                </small>
              </h5>

            </div>
          </div>
          <div className="col-md-4">
            <CurrentOver balls={balls} bowler="Bowler 1" onCrease="Player 6"/>
          </div>
          <div className="col-md-4">
            <PreviousOvers overs={overs}/>
          </div>
        </div>
      </main>
    </div>;
  }
}
