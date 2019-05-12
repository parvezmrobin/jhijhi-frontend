import React, { Component } from 'react';
import CurrentOver from './CurrentOver';
import PreviousOvers from './PreviousOvers';
import ScoreInput from './ScoreInput';
import { bindMethods, optional, toTitleCase } from '../lib/utils';
import Score from './Score';
import BatsmanSelectModal from './BatsmanSelectModal';
import PreviousOverModal from './PreviousOverModal';
import ScoreCard from './ScoreCard';
import BowlerSelectModal from './BowlerSelectModal';
import { Modal, ModalBody, Spinner } from 'reactstrap';
import fetcher from '../lib/fetcher';

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
      const [errors, indices] = this._validateAndGetSelectedBatsmen(batsmenValues);
      if (errors) {
        return errors;
      }

      this.setState(prevState => ({
        ...prevState,
        ...indices,
      }));
      return {
        batsman1: null,
        batsman2: null,
      };
    },
    /**
     * Event handler for score input
     * @param inputEvent
     * @param inputEvent.type
     * @param [inputEvent.bowl]
     * @param [inputEvent.bowler]
     * @param inputEvent.isUpdate
     */
    onInput(inputEvent) {
      const genUpdatedState = prevState => {
        let { batsman1, batsman2, bowlerModalIsOpen } = prevState;
        const { state } = prevState.match;
        const innings = (state === 'innings1') ? prevState.match.innings1 : prevState.match.innings2;
        if (inputEvent.type === 'bowl') {
          [batsman1, batsman2] = Running._onBowlEvent(inputEvent, innings, batsman1, batsman2);
        } else if (inputEvent.type === 'over') {
          innings.overs.push({
            bowledBy: inputEvent.bowler,
            bowls: [],
          });
          [batsman1, batsman2] = [batsman2, batsman1];
          bowlerModalIsOpen = false;
        }

        return {
          match: {
            ...prevState.match,
            [prevState.match.state]: innings,
          },
          batsman1,
          batsman2,
          bowlerModalIsOpen,
        };
      };

      const onUpdateCallback = () => {
        if (this._isNewOver()) {
          const innings = this._getCurrentInnings();
          if (innings.overs.length === this.state.match.overs) {
            return this.onDeclare();
          }
          return this.setState({ bowlerModalIsOpen: true });
        }
      };

      this.setState(genUpdatedState, onUpdateCallback);
    },
    onDeclare() {
      this.setState({ isDeclaring: true });
      fetcher
        .put(`matches/${this.state.match._id}/declare`)
        .then(response => {
          this.setState(prevState => {
            return {
              isDeclaring: false,
              match: {
                ...prevState.match,
                ...response.data,
              },
              batsman1: null,
              batsman2: null,
            };
          }, () => this._isNewOver() && this.setState({ bowlerModalIsOpen: true }));
        });
    },
  };

  static _onBowlEvent(inputEvent, innings, batsman1, batsman2) {
    const bowl = inputEvent.bowl;
    const bowls = innings.overs[innings.overs.length - 1].bowls;

    if (inputEvent.isUpdate) {
      const lastBowl = bowls[bowls.length - 1];
      bowls[bowls.length - 1] = { ...lastBowl, ...bowl };
      console.log('lastBowl', bowls[bowls.length - 1]);
    } else {
      bowls.push(bowl);
    }

    if (optional(bowl.isWicket).kind) {
      if (bowl.isWicket.kind.toLowerCase() === 'run out') {
        if (bowl.isWicket.player === batsman1) {
          batsman1 = null;
        } else if (bowl.isWicket.player === batsman2) {
          batsman2 = null;
        } else {
          // throw Error(`Invalid batsman run out ${bowl.isWicket.player}`);
        }
      } else {
        batsman1 = null;
      }
    }

    if (inputEvent.isUpdate) {
      if (bowl.by % 2) {
        [batsman1, batsman2] = [batsman2, batsman1];
      }
    } else {
      if ((bowl.singles + bowl.legBy) % 2) {
        [batsman1, batsman2] = [batsman2, batsman1];
      }
    }
    return [batsman1, batsman2];
  }

  _isNewOver() {
    const innings = this._getCurrentInnings();

    if (!innings.overs.length) {
      return true;
    }
    const numBowls = innings.overs[innings.overs.length - 1].bowls.reduce((numValidBowls, bowl) => {
      if (!(bowl.isWide || bowl.isNo)) {
        return numValidBowls + 1;
      }
      return numValidBowls;
    }, 0);
    return numBowls === 6;
  }

  _validateAndGetSelectedBatsmen(batsmenValues) {
    const { batsman1, batsman2 } = batsmenValues;

    const { innings, battingTeamPlayers } = this._getCurrentInningsDescription();
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
      return [{ batsman2: 'Already Selected As Batsman1' }];
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

  _getCurrentInningsDescription() {
    const innings = this._getCurrentInnings();
    const battingTeamPlayers = this._getBattingTeamPlayers();
    return {
      innings,
      battingTeamPlayers,
    };
  }

  _getCurrentInnings() {
    const { state, innings1, innings2 } = this.state.match;
    if (['innings1', 'innings2'].indexOf(state) === -1) {
      throw new Error(`State is ${state} in Running page`);
    }
    const innings = (state === 'innings1') ? innings1 : innings2;
    return innings;
  }

  _getBattingTeamPlayers() {
    const { state, team1BatFirst, team1Players, team2Players } = this.state.match;
    const battingTeamPlayers = (state === 'innings1')
      ? (team1BatFirst ? team1Players : team2Players)
      : (team1BatFirst ? team2Players : team1Players);
    return battingTeamPlayers;
  }

  componentDidMount() {
    let { batsman1, batsman2 } = this.state;
    const innings = this._getCurrentInnings();
    const outBatsmen = [];

    outer: for (let i = innings.overs.length - 1; i >= 0; i--) {
      const over = innings.overs[i];
      for (let j = over.bowls.length - 1; j >= 0; j--) {
        const bowl = over.bowls[j];

        const batsman = bowl.playedBy;
        if (bowl.isWicket) {
          const outBatsman = (typeof bowl.isWicket.player === 'number') ? bowl.isWicket.player : batsman;
          if (batsman1 == null && batsman === outBatsman) {
            batsman1 = -1;
          }
          outBatsmen.push(outBatsman);

          // if it's not runout then, no run, by or legBy is present
          if (typeof bowl.isWicket.player !== 'number') {
            continue;
          }
        }

        if (outBatsmen.indexOf(batsman) !== -1) {
          continue;
        }

        if (batsman1 == null) {
          batsman1 = batsman;
        } else if (batsman1 !== batsman) {
          batsman2 = batsman;
          break outer;
        }
      }
    }
    if (batsman1 === -1) {
      console.log('HERE');

      batsman1 = null;
    }

    // if its a new over
    if (innings.overs.length && !innings.overs[innings.overs.length - 1].bowls.length) {
      [batsman1, batsman2] = [batsman2, batsman1];
    }

    this.setState(({
      batsman1,
      batsman2,
    }), () => this._isNewOver() && this.setState({ bowlerModalIsOpen: true }));
  }


  render() {
    const { match, overModal, batsman1, batsman2 } = this.state;
    const overs = match.state === 'innings1' ? match.innings1.overs : match.innings2.overs;

    const { overs: numOvers } = match;
    const lastOver = overs.length ? overs[overs.length - 1] : { bowls: [] };

    const { name, team1, team2, team1WonToss, team1BatFirst, team1Players, team2Players, innings1, innings2, state } = match;
    const [battingTeamName, battingTeamShortName] = (state === 'innings1')
      ? (team1BatFirst ? [team1.name, team1.shortName] : [team2.name, team2.shortName])
      : (team1BatFirst ? [team2.name, team2.shortName] : [team1.name, team1.shortName]);
    const [innings, inningsNo] = (state === 'innings1') ? [innings1, 1] : [innings2, 2];
    const tossOwnerChoice = team1WonToss ? (team1BatFirst ? 'bat' : 'bowl')
      : (team1BatFirst ? 'bowl' : 'bat');

    const [battingTeamPlayers, bowlingTeamPlayers] = (battingTeamName === team1.name)
      ? [team1Players, team2Players] : [team2Players, team1Players];


    const onCreaseBatsmanName = toTitleCase(battingTeamPlayers[batsman1] && battingTeamPlayers[batsman1].name, ' ');
    const onBowlersEnd = toTitleCase(battingTeamPlayers[batsman2] && battingTeamPlayers[batsman2].name, ' ');
    const bowler = bowlingTeamPlayers[lastOver.bowledBy];
    return <div className="row">
      <aside className="col-md-3 d-none d-lg-block">
        <ScoreCard innings={innings} battingTeamName={battingTeamName}
                   battingTeamPlayers={battingTeamPlayers}/>
      </aside>
      <main className="col bg-success min-vh-100">
        <div className="row px-1">
          <header className="text-center text-white col-12 mt-5 pt-2">
            <h2 className="my-3">
              {name}
              <button type="button" className="btn btn-warning-light float-right"
                      onClick={this.onDeclare}>
                Declare
              </button>
            </h2>
          </header>
          <hr/>
          <ScoreInput batsmen={[battingTeamPlayers[batsman1], battingTeamPlayers[batsman2]]}
                      batsmanIndices={[batsman1, batsman2]} matchId={match._id}
                      onInput={(bowl, isUpdate = false) => this.onInput({
                        type: 'bowl',
                        bowl,
                        isUpdate,
                      })}/>
          <div className="col-md-4 px-0">
            <Score battingTeamName={battingTeamShortName} numberOfOvers={numOvers}
                   tossOwner={team1WonToss ? team1.name : team2.name}
                   choice={tossOwnerChoice} innings={innings} inningsNo={inningsNo}
                   firstInnings={innings1}/>
          </div>
          <div className="col-md-4">
            <CurrentOver balls={lastOver.bowls} bowler={bowler} battingTeam={battingTeamPlayers}
                         onCrease={onCreaseBatsmanName} onBowlersEnd={onBowlersEnd}/>
          </div>
          <div className="col-md-4 px-0">
            <PreviousOvers overs={overs.slice(0, -1)} bowlingTeam={bowlingTeamPlayers}
                           onOverClick={this.openOverModal}/>
          </div>
        </div>
      </main>
      <PreviousOverModal overModal={overModal} toggle={this.closeOverModal}
                         bowlingTeamPlayers={bowlingTeamPlayers}
                         battingTeamPlayers={battingTeamPlayers}/>
      <BatsmanSelectModal
        isOpen={!Number.isInteger(this.state.batsman1) || !Number.isInteger(this.state.batsman2)}
        batsman1={batsman1} batsman2={batsman2} options={battingTeamPlayers}
        onSelect={this.onBatsmenSelect}/>
      <BowlerSelectModal open={this.state.bowlerModalIsOpen} bowlers={bowlingTeamPlayers}
                         lastBowler={bowler} matchId={match._id}
                         onSelect={bowler => this.onInput({
                           type: 'over',
                           bowler: bowler,
                         })}/>
      <Modal centered={true} contentClassName="bg-transparent border-0"
             isOpen={this.state.isDeclaring}>
        <ModalBody>
          <div className="d-flex justify-content-center">
            <Spinner color="primary" style={{
              width: '10rem',
              height: '10rem',
              borderWidth: '.75rem',
            }}>
              Initiating next innings...
            </Spinner>
          </div>
        </ModalBody>
      </Modal>
    </div>;
  }
}
