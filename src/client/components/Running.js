import React, { Component } from 'react';
import CenterContent from './layouts/CenterContent';
import SidebarList from './SidebarList';
import CurrentOver from './CurrentOver';
import PreviousOvers from './PreviousOvers';
import ScoreInput from './ScoreInput';
import { bindMethods, optional, toTitleCase } from '../lib/utils';
import Score from './Score';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export class Running extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        open: false,
        over: {},
      },
    };

    bindMethods(this);
  }

  handlers = {
    openModal(i) {
      this.setState({
        modal: {
          open: true,
          overNo: i + 1,
          over: this.props.match.innings1.overs[i],
        },
      });
    },
    closeModal() {
      this.setState(prevState => ({
        modal: {
          ...prevState.modal,
          open: false,
        },
      }));
    },
  };

  render() {
    const { match } = this.props;
    const { modal } = this.state;
    const { innings1: { overs } } = match;
    const lastOver = overs[overs.length - 1];

    const { name, team1, team2, team1WonToss, team1BatFirst, team1Players, team2Players, innings1, innings2, state } = match;
    const battingTeamName = (state === 'running')
      ? (team1BatFirst ? team1.name : team2.name)
      : (team1BatFirst ? team2.name : team1.name);
    const [innings, inningsNo] = (state === 'running') ? [innings1, 1] : [innings2, 2];
    const tossOwnerChoice = team1WonToss ? (team1BatFirst ? 'bat' : 'bowl') : (team1BatFirst ? 'bowl' : 'bat');

    const [battingTeamPlayers, bowlingTeamPlayers] = (battingTeamName === team1.name)
      ? [team1Players, team2Players] : [team2Players, team1Players];

    const sidebarContent = {};
    for (const over of innings.overs) {
      for (const bowl of over.bowls) {
        const batsmanName = battingTeamPlayers[bowl.playedBy].name;
        if (!sidebarContent[batsmanName]) {
          sidebarContent[batsmanName] = {
            run: 0,
            isOut: null,
          };
        }

        if (bowl.singles) {
          sidebarContent[batsmanName].run += bowl.singles;
        } else if (bowl.boundary.run && bowl.boundary.kind === 'regular') {
          sidebarContent[batsmanName].run += bowl.boundary.run;
        }
        if (bowl.isWicket) {

          const outBatsmanName = bowl.isWicket.player ? battingTeamPlayers[bowl.isWicket.player].name : batsmanName;
          sidebarContent[outBatsmanName].isOut = bowl.isWicket.kind;
        }
      }
    }

    const sidebarPlayerMapper = ({ name }) => {
      if (!sidebarContent[name]) {
        return toTitleCase(name, ' ');
      }

      const isOut = sidebarContent[name].isOut;
      const className = isOut ? 'text-secondary' : 'text-primary';
      return <span className={className}>
        {toTitleCase(name, ' ')} ({sidebarContent[name].run}) - {isOut ? toTitleCase(isOut, ' ') : 'Playing'}
      </span>;
    };

    const sidebarPlayerList = battingTeamPlayers
      .map(({ _id, name }) => ({
        _id,
        name,
      }));

    return <div className="row">
      <aside className="col-md-3 d-none d-lg-block">
        <CenterContent col="col">
          <SidebarList title={battingTeamName} itemClass="text-white"
                       itemMapper={sidebarPlayerMapper} list={sidebarPlayerList}/>
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
                   choice={tossOwnerChoice} innings={innings} inningsNo={inningsNo}/>
          </div>
          <div className="col-md-4">
            <CurrentOver balls={lastOver.bowls} bowler={bowlingTeamPlayers[lastOver.bowledBy]}
                         battingTeam={battingTeamPlayers} onCrease="Player 6"/>
          </div>
          <div className="col-md-4">
            <PreviousOvers overs={overs.slice(0, -1)} bowlingTeam={bowlingTeamPlayers}
                           onOverClick={this.openModal}/>
          </div>
        </div>
      </main>
      <Modal isOpen={this.state.modal.open} toggle={this.closeModal}>
        <ModalHeader toggle={this.closeModal} className="text-primary">
          Bowled by&nbsp;
          <span className="font-italic">
            {toTitleCase(optional(bowlingTeamPlayers[modal.over.bowledBy]).name)}
          </span>
          (Over {modal.overNo})
        </ModalHeader>
        <ModalBody>
          <CurrentOver balls={modal.over.bowls} battingTeam={battingTeamPlayers}/>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.closeModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>;
  }
}
