import React, { Component } from 'react';
import CenterContent from './layouts/CenterContent';
import SidebarList from './SidebarList';
import CurrentOver from './CurrentOver';
import PreviousOvers from './PreviousOvers';
import ScoreInput from './ScoreInput';
import { toTitleCase } from '../lib/utils';
import Score from './Score';

export class Running extends Component {

  render() {
    const { match } = this.props;
    const { innings1: { overs } } = match;
    const lastOver = overs[overs.length - 1];

    const { name, team1, team2, team1WonToss, team1BatFirst, team1Players, team2Players, innings1, state } = match;
    const battingTeamName = (state === 'running')
      ? (team1BatFirst ? team1.name : team2.name)
      : (team1BatFirst ? team2.name : team1.name);
    const tossOwnerChoice = team1WonToss ? (team1BatFirst ? 'bat' : 'bowl') : (team1BatFirst ? 'bowl' : 'bat');

    return <div className="row">
      <aside className="col-md-3 d-none d-lg-block">
        <CenterContent col="col">
          <SidebarList
            title="Players of Team"
            itemClass="text-white"
            itemMapper={player => toTitleCase(player.name)}
            list={match.team1Players}/>
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
            <Score battingTeamName={battingTeamName}
                   tossOwner={team1WonToss ? team1.name : team2.name}
                   choice={tossOwnerChoice} innings={innings1} inningsNo={1}/>
          </div>
          <div className="col-md-4">
            <CurrentOver balls={lastOver.bowls} bowler={team2Players[lastOver.bowledBy]}
                         battingTeam={team1Players} onCrease="Player 6"/>
          </div>
          <div className="col-md-4">
            <PreviousOvers overs={overs.slice(0, -1)} bowlingTeam={team2Players}/>
          </div>
        </div>
      </main>
    </div>;
  }
}
