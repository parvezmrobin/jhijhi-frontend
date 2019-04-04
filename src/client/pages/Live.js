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

    return (
      <div className="container-fluid pl-0">
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
          <main className="col">
            <CenterContent col="col">
              <header className="text-center">
                <h2><span className="font-italic">CricPlatoon</span> Friendly</h2>
              </header>
              <hr/>
              <div
                className="d-flex pl-3 justify-content-between align-items-center bg-info text-white rounded">

                <CheckBoxControl name="by">By</CheckBoxControl>

                <CheckBoxControl name="leg-by">Leg By</CheckBoxControl>

                <button type="button" className="btn btn-primary m-2">Four</button>

                <button type="button" className="btn btn-primary m-2">Six</button>

                <div>
                  <SelectControl name="singles" className="form-control" options={[...Array(11)
                    .keys()]}/>
                </div>

                <div className="bg-danger py-2 px-3 rounded">
                  <SelectControl name="wicket" className="form-control" options={wickets}/>
                </div>

              </div>
              <div className="col-md-4 pl-0">
                <CurrentOver balls={balls} bowler="Bowler 1" onCrease="Player 6"/>
              </div>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Live;
