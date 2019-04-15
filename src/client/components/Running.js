import React, { Component } from 'react';
import CenterContent from './layouts/CenterContent';
import SidebarList from './SidebarList';
import CheckBoxControl from './form/control/checkbox';
import SelectControl from './form/control/select';
import CurrentOver from './CurrentOver';
import PreviousOvers from './PreviousOvers';

export class Running extends Component {

  render() {

    const wickets = [
      'Wicket',
      'Bowled',
      'Caught',
      'Leg before wicket',
      'Run out',
      'Stumped',
      'Hit the ball twice',
      'Hit wicket',
      'Obstructing the field',
      'Timed out',
      'Retired',
    ].map(wicket => ({
      _id: wicket,
      name: wicket,
    }));

    const singles = [{
      _id: null,
      name: 'Run',
    }]
      .concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el, i) => ({
        _id: i,
        name: i,
      })));

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
        <div className="row pl-1">
          <header className="text-center text-white col-12 mt-5 pt-2">
            <h2 className="my-3"><span className="font-italic">CricPlatoon</span> Friendly</h2>
          </header>
          <hr/>
          <div
            className="col-12 d-flex pl-3 justify-content-between align-items-center bg-dark text-white rounded">

            <div
              title="By runs will be added to previous bawl. Insert a zero run first to add bawl with only by run.">
              <CheckBoxControl name="by">By</CheckBoxControl>
            </div>

            <CheckBoxControl name="leg-by">Leg By</CheckBoxControl>

            <CheckBoxControl name="wide">Wide</CheckBoxControl>

            <CheckBoxControl name="no">No Ball</CheckBoxControl>

            <div>
              <SelectControl name="singles" className="form-control" options={singles}/>
            </div>

            <button type="button" className="btn btn-info m-2">Four</button>

            <button type="button" className="btn btn-info m-2">Six</button>

            <div className="rounded">
              <SelectControl name="wicket" className="form-control text-danger"
                             options={wickets}/>
            </div>
          </div>
          <div className="col-md-4">
            <div className='bg-dark text-info p-2 mt-5'>
              <h4 className="mt-3 text-white">Team 1 - 43 / 4</h4>
              <h5>
                <small>After</small>
                &nbsp;3 overs 4 bawls
              </h5>
              <h6>Innings 1</h6>
            </div>
            <div className="mt-3 text-white">
              <h5>
                <small>Team 1 won the toss & chose to <span className="font-weight-bold">bat</span>
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
