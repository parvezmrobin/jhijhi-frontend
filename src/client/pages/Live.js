/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import CheckBoxControl from '../components/form/control/checkbox';
import SelectControl from '../components/form/control/select';
import CurrentOver from '../components/CurrentOver';
import PreviousOvers from '../components/PreviousOvers';

class Live extends Component {

  render() {
    const playerItemMapper = (item, i) => {
      if (i < 4) {
        return <span className="text-secondary">{item}</span>;
      } else if (i < 6) {
        return <span>{item} <span className="text-info">(Playing)</span></span>;
      } else {
        return item;
      }
    };
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
    ];

    const balls = [
      { batsman: "Player 5", run: 1 },
      { batsman: "Player 4",boundary: 4 },
      { batsman: "Player 4",boundary: 6 },
      { batsman: "Player 4",isWide: true },
      { batsman: "Player 4", isWicket: "bold" },
    ];

    const overs = [
      {bowler: 'Bowler 2', runs: 17, wickets: []},
      {bowler: 'Bowler 3', runs: 5, wickets: ["run out"]},
      {bowler: 'Bowler 2', runs: 9, wickets: ["bold", "caught"]},
    ];

    return (
        <div className="container-fluid pl-0 pr-1">
          <div className="row">
            <aside className="col-md-3">
              <CenterContent col="col">
                <SidebarList
                    title="Players of Team"
                    itemClass="text-white"
                    itemMapper={playerItemMapper}
                    list={Array(11)
                        .fill(0)
                        .map((n, i) => `Player ${i + 1}`)}/>
              </CenterContent>
            </aside>
            <main className="col bg-success">
              <div className="row pl-1">
                <header className="text-center text-white col-12 mt-5 pt-2">
                  <h2><span className="font-italic">CricPlatoon</span> Friendly</h2>
                </header>
                <hr/>
                <div
                    className="col-12 d-flex pl-3 justify-content-between align-items-center bg-dark text-white rounded">

                  <CheckBoxControl name="by">By</CheckBoxControl>

                  <CheckBoxControl name="leg-by">Leg By</CheckBoxControl>

                  <button type="button" className="btn btn-info m-2">Four</button>

                  <button type="button" className="btn btn-info m-2">Six</button>

                  <div>
                    <SelectControl name="singles" className="form-control" options={[...Array(11)
                        .keys()]}/>
                  </div>

                  <div className="rounded">
                    <SelectControl name="wicket" className="form-control text-danger" options={wickets}/>
                  </div>

                </div>
                <div className="col-md-4">
                  <h4 className="mt-3 text-white">Team 1</h4>
                  <div className='bg-dark text-info pr-2 pl-2 pb-2'>
                    <h4 className="text-white">43/4</h4>
                    <h5><small>After</small> 3 overs 4 bawls</h5>
                    <h6>Innings 1</h6>
                  </div>
                  <div className="mt-3 text-white">
                    <h5><small>Team 1 won the toss <br/> & chose to bat first</small></h5>

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
            {/*<main className="col">*/}
            {/*  <CenterContent col="row pl-1">*/}
            {/*    <header className="text-center col-12">*/}
            {/*      <h2><span className="font-italic">CricPlatoon</span> Friendly</h2>*/}
            {/*    </header>*/}
            {/*    <hr/>*/}
            {/*    <div*/}
            {/*      className="col-12 d-flex pl-3 justify-content-between align-items-center bg-info text-white rounded">*/}

            {/*      <CheckBoxControl name="by">By</CheckBoxControl>*/}

            {/*      <CheckBoxControl name="leg-by">Leg By</CheckBoxControl>*/}

            {/*      <button type="button" className="btn btn-primary m-2">Four</button>*/}

            {/*      <button type="button" className="btn btn-primary m-2">Six</button>*/}

            {/*      <div>*/}
            {/*        <SelectControl name="singles" className="form-control" options={[...Array(11)*/}
            {/*          .keys()]}/>*/}
            {/*      </div>*/}

            {/*      <div className="bg-danger py-2 px-3 rounded">*/}
            {/*        <SelectControl name="wicket" className="form-control" options={wickets}/>*/}
            {/*      </div>*/}

            {/*    </div>*/}
            {/*    <div className="col-md-4">*/}
            {/*      <h3 className="mt-3 text-primary">Team 1</h3>*/}
            {/*      <h4>43/4</h4>*/}
            {/*      <h5><small>After</small> 3 overs 4 bawls</h5>*/}
            {/*    </div>*/}
            {/*    <div className="col-md-4">*/}
            {/*      <CurrentOver balls={balls} bowler="Bowler 1" onCrease="Player 6"/>*/}
            {/*    </div>*/}
            {/*    <div className="col-md-4">*/}
            {/*      <PreviousOvers overs={overs}/>*/}
            {/*    </div>*/}
            {/*  </CenterContent>*/}
            {/*</main>*/}
          </div>
        </div>
    );
  }

}

export default Live;
