import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  bindMethods,
  copySharableLink,
  optional,
  toTitleCase,
} from '../lib/utils';
import fetcher from '../lib/fetcher';

import CurrentOver from './over/CurrentOver';
import Overs from './over/Overs';
import ScoreCreate from './score/ScoreCreate';
import Score from './score/Score';
import BatsmanSelectModal from './modal/BatsmanSelectModal';
import OverModal from './modal/OverModal';
import ScoreCard from './score/ScoreCard';
import BowlerSelectModal from './modal/BowlerSelectModal';
import ScoreEditModal from './modal/ScoreEditModal';
import ErrorModal from './modal/ErrorModal';
import { MatchType } from '../types';
import { UNCERTAIN_WICKETS } from './score/ScoreInput';

class Running extends Component {
  /**
   * Event handler for bowl input
   * Basically pushes / updates bowl into current over
   * and updates batsmen in crease, if necessary
   *
   * *** This method is only called from `ScoreCreate` component
   * *** and not `ScoreEdit` component. Only `ScoreInput` component
   * *** might set `isUpdate` to true and not `ScoreInputV2` component.
   * @param inputEvent
   * @param inputEvent.bowl
   * @param {boolean} inputEvent.isUpdate
   * @param innings
   * @param batsman1Index
   * @param batsman2Index
   * @param singleBatsman
   * @return {[Number|null, Number|null]}
   * @private
   */
  static _onBowlEvent(
    inputEvent,
    innings,
    batsman1Index,
    batsman2Index,
    singleBatsman
  ) {
    const { bowl } = inputEvent;
    const { bowls: bowlsOfLastOver } = innings.overs[innings.overs.length - 1];
    let _batsman1Index = batsman1Index;
    let _batsman2Index = batsman2Index;

    // push or update bowl into the last over
    if (inputEvent.isUpdate) {
      const lastBowl = bowlsOfLastOver[bowlsOfLastOver.length - 1];
      bowlsOfLastOver[bowlsOfLastOver.length - 1] = { ...lastBowl, ...bowl };
    } else {
      bowlsOfLastOver.push(bowl);
    }

    // if it is an out, make corresponding batsman null
    if (optional(bowl.isWicket).kind) {
      if (UNCERTAIN_WICKETS.includes(bowl.isWicket.kind)) {
        if (bowl.isWicket.player === _batsman1Index) {
          _batsman1Index = null;
        } else if (bowl.isWicket.player === _batsman2Index) {
          _batsman2Index = null;
        } else {
          throw Error(`Invalid batsman run out ${bowl.isWicket.player}`);
        }
      } else {
        _batsman1Index = null;
      }
    }

    // if it is in single batsman mode, there is no crease switching involved
    if (singleBatsman) {
      return [_batsman1Index, _batsman2Index];
    }

    if (inputEvent.isUpdate && bowl.by % 2) {
      // TODO: check `ScoreInput` component to be sure why only `by` value is checked
      [_batsman1Index, _batsman2Index] = [_batsman2Index, _batsman1Index];
    } else {
      // if undefined, add 0 instead
      const run = (bowl.singles || 0) + (bowl.by || 0) + (bowl.legBy || 0);
      if (run % 2) {
        [_batsman1Index, _batsman2Index] = [_batsman2Index, _batsman1Index];
      }
    }
    return [_batsman1Index, _batsman2Index];
  }

  static _getIndexOfBatsman(battingTeamPlayers, batsman1) {
    return battingTeamPlayers.reduce((i, player, playerI) => {
      if (i !== -1) {
        return i;
      }
      return player._id === batsman1 ? playerI : -1;
    }, -1);
  }

  handlers = {
    copySharableLinkAndShowConfirmation(e) {
      const { match } = this.props;
      copySharableLink(match._id);
      const button = e.target;
      button.innerHTML = 'Copied';
      setTimeout(() => {
        button.innerHTML = 'Copy Sharable Link';
      }, 500);
    },

    openOverModal(i) {
      this.setState({
        overModal: {
          open: true,
          overIndex: i,
          over: this._getCurrentInnings().overs[i],
        },
      });
    },

    closeOverModal() {
      this.setState((prevState) => ({
        overModal: {
          ...prevState.overModal,
          open: false,
        },
      }));
    },

    /**
     * @param batsmenValues
     * @param batsmenValues.batsman1Id
     * @param batsmenValues.batsman2Id
     * @returns {{batsman1: String|undefined, batsman2: String|undefined}}
     */
    onBatsmenSelect(batsmenValues) {
      const { errors, indices } =
        this._validateAndGetSelectedBatsmen(batsmenValues);
      if (errors) {
        return errors;
      }

      this.setState((prevState) => ({
        ...prevState,
        ...indices,
      }));

      // pass values to the modal
      return {
        batsman1: null,
        batsman2: null,
      };
    },
    switchBatsmen() {
      this.setState((prevState) => ({
        batsman1: prevState.batsman2,
        batsman2: prevState.batsman1,
      }));
    },

    /**
     * Event handler for score input
     * @param inputEvent
     * @param inputEvent.type either bowl or over
     * @param [inputEvent.bowl]
     * @param [inputEvent.bowler]
     * @param inputEvent.isUpdate
     */
    onInput(inputEvent) {
      const genUpdatedState = (prevState) => {
        let {
          batsman1: batsman1Index,
          batsman2: batsman2Index,
          bowlerModalIsOpen,
        } = prevState;
        const { singleBatsman } = prevState;
        const innings = this._getCurrentInnings();

        if (inputEvent.type === 'bowl') {
          // should be a static function since used inside a callback
          [batsman1Index, batsman2Index] = Running._onBowlEvent(
            inputEvent,
            innings,
            batsman1Index,
            batsman2Index,
            singleBatsman
          );
        } else if (inputEvent.type === 'over') {
          innings.overs.push({
            bowledBy: inputEvent.bowler,
            bowls: [],
          });
          if (!singleBatsman) {
            [batsman1Index, batsman2Index] = [batsman2Index, batsman1Index];
          }
          bowlerModalIsOpen = false;
        }

        return {
          match: {
            ...prevState.match,
            [prevState.match.state]: innings,
          },
          batsman1: batsman1Index,
          batsman2: batsman2Index,
          bowlerModalIsOpen,
        };
      };

      this.setState(genUpdatedState);
    },

    /**
     * Event handler for score update
     */
    onUpdate(bowl) {
      const {
        editModal: { overNo, bowlNo },
      } = this.state;
      if (overNo < 0 || bowlNo < 0) {
        throw new Error(
          "Can't update bowl without `overNo` and `bowlNo` initialized"
        );
      }

      const innings = this._getCurrentInnings();
      const prevBowl = innings.overs[overNo].bowls[bowlNo];
      innings.overs[overNo].bowls[bowlNo] = { ...prevBowl, ...bowl };
      this.setState((prevState) => ({
        match: {
          ...prevState.match,
          [prevState.match.state]: innings,
        },
      }));
    },

    onDeclare() {
      const {
        match: { state, _id },
        isDeclaring,
      } = this.state;
      if (isDeclaring || state === 'done') {
        return;
      }
      const updateState = () => {
        let nextState;
        if (state === 'innings1') {
          nextState = 'innings2';
        } else {
          nextState = state === 'innings2' ? 'done' : null;
        }
        if (!nextState) {
          return;
        }
        fetcher
          .put(`matches/${_id}/declare`, { state: nextState })
          .then((response) =>
            this.setState((prevState) => ({
              isDeclaring: false,
              match: {
                ...prevState.match,
                ...response.data,
              },
              batsman1: null,
              batsman2: null,
            }))
          )
          .catch(() => this.setState({ showErrorModal: true }));
      };

      this.setState({ isDeclaring: true }, updateState);
    },

    onEditClick(overNo, bowlNo) {
      this.setState({
        editModal: {
          show: true,
          overNo,
          bowlNo,
        },
      });
    },
    onOverModalEditClick(overNo, bowlNo) {
      this.setState({
        editModal: {
          show: false,
          overNo,
          bowlNo,
        },
      });
    },
  };

  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      overModal: {
        open: false,
        over: {},
      },
      match,
      batsman1: null,
      batsman2: null,
      singleBatsman: false,
      editModal: {
        show: false,
        overNo: -1,
        bowlNo: -1,
      },
      showSingleBatsmanModal: false,
      showErrorModal: false,
    };

    bindMethods(this);
  }

  componentDidMount() {
    let innings;
    try {
      innings = this._getCurrentInnings();
    } catch (e) {
      if (e.message === 'State is done in Running page') {
        return;
      }
      throw e;
    } finally {
      // finally block executes even if catch block throws or returns
      this.componentDidUpdate();
    }

    let { batsman1, batsman2 } = this.state;
    const outBatsmen = [];
    if (innings.overs.length > 0) {
      outer: for (let i = innings.overs.length - 1; i >= 0; i--) {
        const over = innings.overs[i];
        for (let j = over.bowls.length - 1; j >= 0; j--) {
          const bowl = over.bowls[j];

          const batsman = bowl.playedBy;
          if (bowl.isWicket) {
            const outBatsman = Number.isInteger(bowl.isWicket.player)
              ? bowl.isWicket.player
              : batsman;
            if (batsman1 == null && batsman === outBatsman) {
              batsman1 = -1; // indicating that, last on-crease batsman is out
            }
            outBatsmen.push(outBatsman);
          }

          // the loop is going from future to past
          // if `batsman` is out in the future, continue
          if (outBatsmen.includes(batsman)) {
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
        batsman1 = null;
      }

      const lastOver = innings.overs[innings.overs.length - 1];

      // if it's a new over
      if (innings.overs.length && !lastOver.bowls.length) {
        [batsman1, batsman2] = [batsman2, batsman1];
      } else {
        const lastBowl = lastOver.bowls[lastOver.bowls.length - 1];
        const lastBowlRuns =
          (lastBowl.singles || 0) + (lastBowl.by || 0) + (lastBowl.legBy || 0);
        if (lastBowlRuns % 2 === 1) {
          // if odd runs in the last bowl
          [batsman1, batsman2] = [batsman2, batsman1];
        }
      }
    }
    this.setState({
      batsman1,
      batsman2,
    });
  }

  componentDidUpdate() {
    let innings;
    const {
      bowlerModalIsOpen,
      match: { state, overs: numOvers },
      singleBatsman,
      showSingleBatsmanModal,
      batsman1,
      batsman2,
      isDeclaring,
    } = this.state;

    try {
      innings = this._getCurrentInnings();
    } catch (e) {
      if (e.message === 'State is done in Running page') {
        return;
      }
      throw e;
    }
    if (
      singleBatsman &&
      !Number.isInteger(batsman1) &&
      Number.isInteger(batsman2)
    ) {
      this.setState({
        batsman1: batsman2,
        batsman2: null,
      });
    }
    if (!bowlerModalIsOpen && this._shouldStartNewOver()) {
      this.setState({ bowlerModalIsOpen: true });
      if (
        state !== 'done' &&
        !isDeclaring &&
        innings.overs.length === numOvers
      ) {
        this.onDeclare();
        return;
      }
    }
    if (state !== 'done' && !isDeclaring && this._isAllOut()) {
      if (!singleBatsman) {
        if (!showSingleBatsmanModal) {
          this.setState({ showSingleBatsmanModal: true });
        }
        return;
      }
      this.onDeclare();
    }
  }

  componentWillUnmount() {
    fetcher.cancelAll();
  }

  _getBattingTeamPlayers() {
    const {
      match: { state, team1BatFirst, team1Players, team2Players },
    } = this.state;
    let battingTeamPlayers;
    if (state === 'innings1') {
      battingTeamPlayers = team1BatFirst ? team1Players : team2Players;
    } else {
      battingTeamPlayers = team1BatFirst ? team2Players : team1Players;
    }
    return battingTeamPlayers;
  }

  _getCurrentInnings() {
    const {
      match: { state, innings1, innings2 },
    } = this.state;
    if (['innings1', 'innings2'].indexOf(state) === -1) {
      throw new Error(`State is ${state} in Running page`);
    }
    return state === 'innings1' ? innings1 : innings2;
  }

  /**
   * @returns {{innings: Object, battingTeamPlayers: Array}}
   * @private
   */
  _getCurrentInningsDescription() {
    const innings = this._getCurrentInnings();
    const battingTeamPlayers = this._getBattingTeamPlayers();
    return {
      innings,
      battingTeamPlayers,
    };
  }

  /**
   * @param batsmenValues
   * @param batsmenValues.batsman1Id
   * @param batsmenValues.batsman2Id
   * @returns {{errors: {batsman1: String|undefined, batsman2: String|undefined}|undefined,
   *   indices: {}|undefined}}
   * @private
   */
  _validateAndGetSelectedBatsmen(batsmenValues) {
    const { batsman1Id, batsman2Id } = batsmenValues;

    const { innings, battingTeamPlayers } =
      this._getCurrentInningsDescription();
    const indices = {};
    if (batsman1Id) {
      indices.batsman1 = Running._getIndexOfBatsman(
        battingTeamPlayers,
        batsman1Id
      );
      if (indices.batsman1 === -1) {
        // Batsman is selected while match was transitioning from innings1 to innings2
        // and a batsman from innings1 is selected
        return {
          errors: { batsman1: 'Error while selecting batsman. Try again.' },
        };
      }
    }
    if (batsman2Id) {
      indices.batsman2 = Running._getIndexOfBatsman(
        battingTeamPlayers,
        batsman2Id
      );
      if (indices.batsman2 === -1) {
        // Batsman is selected while match was transitioning from innings1 to innings2
        // and a batsman from innings1 is selected
        return {
          errors: { batsman2: 'Error while selecting batsman. Try again.' },
        };
      }
    }

    const { batsman1, batsman2 } = this.state;
    if (!batsman1Id && indices.batsman2 === batsman1) {
      // if batsman1Id is selected and corresponding index is same as state's batsman1
      return { errors: { batsman2: 'Already Selected As Batsman1' } };
    }
    if (!batsman2Id && indices.batsman1 === batsman2) {
      // if batsman2Id is selected and corresponding index is same as state's batsman2
      return { errors: { batsman1: 'Already Selected As Batsman2' } };
    }

    // check if any out batsmen selected
    const errors = {};
    const { singleBatsman } = this.state;
    for (const over of innings.overs) {
      for (const bowl of over.bowls) {
        const batsman = battingTeamPlayers[bowl.playedBy]._id;
        if (!bowl.isWicket) {
          continue;
        }
        const outBatsman = bowl.isWicket.player
          ? battingTeamPlayers[bowl.isWicket.player]._id
          : batsman;
        if (outBatsman === batsman1Id) {
          errors.batsman1 = 'Already Out';
        } else if (!singleBatsman && outBatsman === batsman2Id) {
          errors.batsman2 = 'Already Out';
        }
        if (errors.batsman1 && (errors.batsman2 || singleBatsman)) {
          return { errors };
        }
      }
    }
    if (errors.batsman1 || errors.batsman2) {
      return { errors };
    }
    return { indices };
  }

  _shouldStartNewOver() {
    let innings;
    try {
      innings = this._getCurrentInnings();
    } catch (e) {
      return false;
    }

    if (!innings.overs.length) {
      return true;
    }
    const numBowls = innings.overs[innings.overs.length - 1].bowls.reduce(
      (numValidBowls, bowl) => {
        if (!(bowl.isWide || bowl.isNo)) {
          return numValidBowls + 1;
        }
        return numValidBowls;
      },
      0
    );
    return numBowls === 6;
  }

  /**
   * @return {boolean}
   * @private
   */
  _isAllOut() {
    const { innings, battingTeamPlayers } =
      this._getCurrentInningsDescription();
    const totalBattingTeamPlayers = battingTeamPlayers.length;
    const { singleBatsman } = this.state;
    let outCount = 0;
    const totalWickets = singleBatsman
      ? totalBattingTeamPlayers
      : totalBattingTeamPlayers - 1;
    for (const over of innings.overs) {
      for (const bowl of over.bowls) {
        if (optional(bowl.isWicket).kind) {
          outCount++;

          if (outCount === totalWickets) {
            return true;
          }
          if (outCount > totalWickets) {
            throw new Error(
              `Fallen wickets(${outCount}) are greater than actual wickets(${totalWickets})`
            );
          }
        }
      }
    }
    return false;
  }

  render() {
    const { match, overModal, batsman1, batsman2, editModal } = this.state;

    if (match.state === 'done') {
      return <Redirect to={`/history@${match._id}`} />;
    }

    const { overs } = this._getCurrentInnings();
    const { overs: numOvers } = match;
    const lastOver = overs.length ? overs[overs.length - 1] : { bowls: [] };

    const {
      name,
      team1,
      team2,
      team1WonToss,
      team1BatFirst,
      team1Players,
      team2Players,
      innings1,
      innings2,
      state,
    } = match;
    let battingTeamName;
    let battingTeamShortName;
    if (state === 'innings1') {
      [battingTeamName, battingTeamShortName] = team1BatFirst
        ? [team1.name, team1.shortName]
        : [team2.name, team2.shortName];
    } else {
      [battingTeamName, battingTeamShortName] = team1BatFirst
        ? [team2.name, team2.shortName]
        : [team1.name, team1.shortName];
    }
    const [innings, inningsNo] =
      state === 'innings1' ? [innings1, 1] : [innings2, 2];
    let tossOwnerChoice;
    if (team1WonToss) {
      tossOwnerChoice = team1BatFirst ? 'bat' : 'bowl';
    } else {
      tossOwnerChoice = team1BatFirst ? 'bowl' : 'bat';
    }

    const [battingTeamPlayers, bowlingTeamPlayers] =
      battingTeamName === team1.name
        ? [team1Players, team2Players]
        : [team2Players, team1Players];

    const onCreaseBatsmanName = toTitleCase(
      battingTeamPlayers[batsman1] && battingTeamPlayers[batsman1].name,
      ' '
    );
    const onBowlersEnd = toTitleCase(
      battingTeamPlayers[batsman2] && battingTeamPlayers[batsman2].name,
      ' '
    );
    const bowler = bowlingTeamPlayers[lastOver.bowledBy];
    const {
      singleBatsman,
      bowlerModalIsOpen,
      showSingleBatsmanModal,
      isDeclaring,
      showErrorModal,
    } = this.state;
    return (
      <div className="row">
        <aside className="col-md-3 d-none d-lg-block">
          <ScoreCard
            innings={innings}
            battingTeamName={battingTeamName}
            battingTeamPlayers={battingTeamPlayers}
          />
        </aside>
        <main className="col min-vh-100">
          <div className="row px-1">
            <header className="text-center text-white col-12 mt-5 pt-2">
              <h2 className="my-3">
                {name}
                <button
                  type="button"
                  className="btn btn-warning-light float-right"
                  onClick={this.onDeclare}
                >
                  Declare
                </button>
              </h2>
            </header>
            <hr />
            <ScoreCreate
              batsmen={[
                battingTeamPlayers[batsman1],
                battingTeamPlayers[batsman2],
              ]}
              batsmanIndices={[batsman1, batsman2]}
              matchId={match._id}
              onInput={(bowl, isUpdate = false) =>
                this.onInput({
                  type: 'bowl',
                  bowl,
                  isUpdate,
                })
              }
            />
            <div className="col-md-4 px-0">
              <Score
                battingTeamName={battingTeamShortName}
                numberOfOvers={numOvers}
                tossOwner={team1WonToss ? team1.name : team2.name}
                singleBatsman={singleBatsman}
                choice={tossOwnerChoice}
                innings={innings}
                inningsNo={inningsNo}
                firstInnings={innings1}
                matchId={match._id}
                onWinning={this.onDeclare}
              />

              <button
                onClick={this.copySharableLinkAndShowConfirmation}
                className="btn btn-outline-primary text-white btn-block"
                type="button"
              >
                Copy Sharable Link
              </button>
            </div>
            <div className="col-md-4">
              <CurrentOver
                overNo={overs.length - 1}
                bowls={lastOver.bowls}
                bowler={bowler}
                battingTeam={battingTeamPlayers}
                onCrease={onCreaseBatsmanName}
                onBowlersEnd={onBowlersEnd}
                onEdit={this.onEditClick}
                onSwitch={this.switchBatsmen}
              />
            </div>
            <div className="col-md-4 px-0">
              <Overs
                overs={overs.slice(0, -1)}
                bowlingTeam={bowlingTeamPlayers}
                onOverClick={this.openOverModal}
              />
            </div>
          </div>

          <footer className="py-3 py-sm-0" />
        </main>
        <BatsmanSelectModal
          showingSingleBatsmanPrompt={showSingleBatsmanModal}
          batsman1Index={batsman1}
          batsman2Index={batsman2}
          batsmanList={battingTeamPlayers}
          onSelect={this.onBatsmenSelect}
          singleBatsman={singleBatsman}
          onNumberOfBatsmenChange={(e) => {
            this.setState({ singleBatsman: e.target.checked });
          }}
        />
        <BowlerSelectModal
          open={bowlerModalIsOpen}
          bowlers={bowlingTeamPlayers}
          lastBowler={bowler}
          matchId={match._id}
          onSelect={(_bowler) =>
            this.onInput({
              type: 'over',
              bowler: _bowler,
            })
          }
        />
        <OverModal
          overModal={overModal}
          toggle={this.closeOverModal}
          batsmanIndices={[batsman1, batsman2]}
          bowlingTeamPlayers={bowlingTeamPlayers}
          battingTeamPlayers={battingTeamPlayers}
          matchId={match._id}
          onEditClick={this.onOverModalEditClick}
          onEdit={this.onUpdate}
        />
        {editModal.show && (
          <ScoreEditModal
            isOpen={editModal.show}
            overNo={editModal.overNo}
            bowlNo={editModal.bowlNo}
            bowl={innings.overs[editModal.overNo].bowls[editModal.bowlNo]}
            onInput={this.onUpdate}
            batsmanIndices={[batsman1, batsman2]}
            batsmen={battingTeamPlayers}
            matchId={match._id}
            close={() =>
              this.setState({
                editModal: {
                  show: false,
                  overNo: -1,
                  bowlNo: -1,
                },
              })
            }
          />
        )}
        <Modal isOpen={showSingleBatsmanModal} contentClassName="bg-dark">
          <ModalHeader>Want to play with single batsman?</ModalHeader>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() =>
                this.setState({
                  singleBatsman: true,
                  showSingleBatsmanModal: false,
                })
              }
            >
              Yeah
            </Button>
            <Button
              onClick={() => {
                this.setState({ showSingleBatsmanModal: false });
                this.onDeclare();
              }}
            >
              Nah
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          centered
          contentClassName="bg-transparent border-0"
          isOpen={isDeclaring}
        >
          <ModalBody>
            <div className="d-flex justify-content-center">
              <Spinner
                color="primary"
                style={{
                  width: '10rem',
                  height: '10rem',
                  borderWidth: '.75rem',
                }}
              >
                Initiating next innings...
              </Spinner>
            </div>
          </ModalBody>
        </Modal>

        <ErrorModal
          isOpen={showErrorModal}
          close={() => this.setState({ showErrorModal: false })}
        />
      </div>
    );
  }
}

Running.propTypes = {
  match: PropTypes.shape(MatchType),
};

export default Running;
