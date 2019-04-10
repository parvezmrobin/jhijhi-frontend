/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import CheckBoxControl from '../components/form/control/checkbox';
import SelectControl from '../components/form/control/select';
import CurrentOver from '../components/CurrentOver';
import PreviousOvers from '../components/PreviousOvers';
import $ from 'jquery';
import PreMatch from "../components/PreMatch";
import fetcher from "../lib/fetcher";
import {bindMethods} from "../lib/utils";
import Toss from "../components/Toss";

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: null,
      match: {},
    };

    bindMethods(this);
  }

  handlers = {
    onMatchBegin(params) {
      this.setState({state: "toss"});
      console.log(params);
    },
  };


  componentDidMount() {
    $('[title]').tooltip();
    fetcher
      .get(`matches/${this.props.match.params.id}`)
      .then(response => {
        this.setState({match: response.data, state: "pre"});
      });
  }

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
    ].map(wicket => ({_id: wicket, name: wicket}));

    const singles = [{_id: null, name: 'Run'}]
      .concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el, i) => ({_id: i, name: i})));

    const balls = [
      {batsman: "Player 5", run: 1},
      {batsman: "Player 4", boundary: 4},
      {batsman: "Player 4", boundary: 6},
      {batsman: "Player 4", isWide: true},
      {batsman: "Player 4", isWicket: "bold"},
    ];

    const overs = [
      {bowler: 'Bowler 2', runs: 17, wickets: []},
      {bowler: 'Bowler 3', runs: 5, wickets: ["run out"]},
      {bowler: 'Bowler 2', runs: 9, wickets: ["bold", "caught"]},
    ];

    return (
      <div className="container-fluid pl-0 pr-1">
        {this.state.state === "pre" &&
        <PreMatch team1={this.state.match.team1} team2={this.state.match.team2} name={this.state.match.name}
                  matchId={this.props.match.params.id} onMatchBegin={this.onMatchBegin}/>}
        {this.state.state === "toss" && <Toss teams={[this.state.match.team1, this.state.match.team2]}/>}
        {this.state.state === "running" &&
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
                  <SelectControl name="wicket" className="form-control text-danger" options={wickets}/>
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
                    <small>Team 1 won the toss & chose to <span className="font-weight-bold">bat</span></small>
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
        </div>}
      </div>
    );
  }

}

export default Live;
