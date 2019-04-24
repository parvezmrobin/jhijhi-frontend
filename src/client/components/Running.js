import React, {Component} from 'react';
import CenterContent from './layouts/CenterContent';
import SidebarList from './SidebarList';
import CurrentOver from './CurrentOver';
import PreviousOvers from './PreviousOvers';
import ScoreInput from './ScoreInput';
import {bindMethods, optional, toTitleCase} from '../lib/utils';
import Score from './Score';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import BatsmanSelectModal from './BatsmanSelectModal';


export class Running extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overModal: {
        open: false,
        over: {},
      },
      match: this.props.match,
    };

    bindMethods(this);
  }

  handlers = {
    openOverModal(i) {
      this.setState({
        overModal: {
          open: true,
          overNo: i + 1,
          over: this.props.match.innings1.overs[i],
        },
      });
    },
    closeOverModal() {
      this.setState(prevState => ({
        overModal: {
          ...prevState.overModal,
          open: false,
        },
      }));
    },
    onBatsmenSelect(batsmenValues) {
      const [errors, indices] = this.validateAndGetSelectedBatsmen(batsmenValues);
      if (errors) {
        return errors;
      }

      this.setState(prevState => ({
        ...prevState,
        ...indices,
      }));
      return {batsman1: null, batsman2: null};
    },
  };


  validateAndGetSelectedBatsmen(batsmenValues) {
    const {batsman1, batsman2} = batsmenValues;

    const {innings, battingTeamPlayers} = this.getCurrentInningsDescription();
    const indices = {};
    if (batsman1) {
      indices.batsman1 = battingTeamPlayers.reduce((i, player, playerI) => {
        return (i !== -1) ? i : (player._id === batsman1) ? playerI : -1;
      }, -1);
    }
    if (batsman2) {
      indices.batsman2 = battingTeamPlayers.reduce((i, player, playerI) => {
        return (i !== -1) ? i : (player._id === batsman2) ? playerI : -1;
      }, -1);
    }

    if (!batsman1 && (indices.batsman2 === this.state.batsman1)) {
      return [{batsman2: 'Already Selected As Batsman1'}]
    }

    const errors = {};


    for (const over of innings.overs) {
      for (const bowl of over.bowls) {
        const batsman = battingTeamPlayers[bowl.playedBy]._id;
        if (bowl.isWicket) {
          const outBatsman = bowl.isWicket.player ? battingTeamPlayers[bowl.isWicket.player]._id : batsman;
          if (outBatsman === batsman1) {
            errors.batsman1 = 'Already Out';
          } else if (outBatsman === batsman2) {
            errors.batsman2 = 'Already Out';
          }

          if (errors.batsman1 && errors.batsman2) {
            return [errors];
          }
        }
      }
    }
    if (errors.batsman1 || errors.batsman2) {
      return [errors];
    }
    return [null, indices];
  }

  getCurrentInningsDescription() {
    const innings = this.getCurrentInnings();
    const battingTeamPlayers = this.getBattingTeamPlayers();
    return {innings, battingTeamPlayers};
  }

  getCurrentInnings() {
    const {state, innings1, innings2} = this.state.match;
    const innings = (state === 'running') ? innings1 : innings2;
    return innings;
  }

  getBattingTeamPlayers() {
    const {state, team1BatFirst, team1Players, team2Players} = this.state.match;
    const battingTeamPlayers = (state === 'running')
      ? (team1BatFirst ? team1Players : team2Players)
      : (team1BatFirst ? team2Players : team1Players);
    return battingTeamPlayers;
  }

  componentDidMount() {
    let {batsman1, batsman2} = this.state;
    const innings = this.getCurrentInnings();
    const outBatsmen = [];

    outer: for (let i = innings.overs.length - 1; i >= 0; i--) {
      const over = innings.overs[i];
      for (let j = over.bowls.length - 1; j >= 0; j--) {
        const bowl = over.bowls[j];

        if (bowl.isWicket) {
          outBatsmen.push((typeof bowl.isWicket.player === 'number') ? bowl.isWicket.player : bowl.playedBy);
          continue;
        }

        const batsman = bowl.playedBy;
        if (outBatsmen.indexOf(batsman) !== -1) {
          continue
        }

        if (batsman1 == null) {
          batsman1 = batsman;
        } else if (batsman1 !== batsman) {
          batsman2 = batsman;
          break outer;
        }
      }
    }

    this.setState(prevState => ({
      ...prevState,
      batsman1,
      batsman2,
    }));
  }


  render() {
    const {match, overModal, batsman1, batsman2} = this.state;
    const {innings1: {overs}} = match;
    const lastOver = overs[overs.length - 1];

    const {name, team1, team2, team1WonToss, team1BatFirst, team1Players, team2Players, innings1, innings2, state} = match;
    const battingTeamName = (state === 'running')
      ? (team1BatFirst ? team1.name : team2.name)
      : (team1BatFirst ? team2.name : team1.name);
    const [innings, inningsNo] = (state === 'running') ? [innings1, 1] : [innings2, 2];
    const tossOwnerChoice = team1WonToss ? (team1BatFirst ? 'bat' : 'bowl') : (team1BatFirst ? 'bowl' : 'bat');

    const [battingTeamPlayers, bowlingTeamPlayers] = (battingTeamName === team1.name)
      ? [team1Players, team2Players] : [team2Players, team1Players];

    const sidebarPlayerMapper = this.genSidebarPlayerMapper(innings, battingTeamPlayers);

    const sidebarPlayerList = battingTeamPlayers
      .map(({_id, name}) => ({
        _id,
        name,
      }));

    const onCreaseBatsmanName = toTitleCase(battingTeamPlayers[batsman1] && battingTeamPlayers[batsman1].name, ' ');
    const onBowlersEnd = toTitleCase(battingTeamPlayers[batsman2] && battingTeamPlayers[batsman2].name, ' ');
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
                         battingTeam={battingTeamPlayers} onCrease={onCreaseBatsmanName}
                         onBowlersEnd={onBowlersEnd}/>
          </div>
          <div className="col-md-4">
            <PreviousOvers overs={overs.slice(0, -1)} bowlingTeam={bowlingTeamPlayers}
                           onOverClick={this.openOverModal}/>
          </div>
        </div>
      </main>
      <Modal isOpen={this.state.overModal.open} toggle={this.closeOverModal}>
        <ModalHeader toggle={this.closeOverModal} className="text-primary">
          Bowled by&nbsp;
          <span className="font-italic">
            {toTitleCase(optional(bowlingTeamPlayers[overModal.over.bowledBy]).name)}
          </span>
          (Over {overModal.overNo})
        </ModalHeader>
        <ModalBody>
          <CurrentOver balls={overModal.over.bowls} battingTeam={battingTeamPlayers}/>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.closeOverModal}>Close</Button>
        </ModalFooter>
      </Modal>
      <BatsmanSelectModal isOpen={!this.state.batsman1 || !this.state.batsman2} batsman1={batsman1} batsman2={batsman2}
                          options={battingTeamPlayers} onSelect={this.onBatsmenSelect}/>
    </div>;
  }

  genSidebarPlayerMapper(innings, battingTeamPlayers) {
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

    const sidebarPlayerMapper = ({name}) => {
      if (!sidebarContent[name]) {
        return toTitleCase(name, ' ');
      }

      const isOut = sidebarContent[name].isOut;
      const className = isOut ? 'text-secondary' : 'text-primary';
      return <span className={className}>
        {toTitleCase(name, ' ')} ({sidebarContent[name].run}) - {isOut ? toTitleCase(isOut, ' ') : 'Playing'}
      </span>;
    };
    return sidebarPlayerMapper;
  }
}
