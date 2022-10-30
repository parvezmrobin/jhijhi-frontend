/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Date: Nov 09, 2019
 */

import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import CheckBoxControl from '../form/control/checkbox';
import SelectControl from '../form/control/select';
import { bindMethods } from '../../lib/utils';
import fetcher from '../../lib/fetcher';
import FormGroup from '../form/FormGroup';
import {
  getIndexOfBatsman,
  UNCERTAIN_WICKETS,
  WICKET_TYPES,
  wicketOptions,
} from './ScoreInput';
import { PlayerType } from '../../types';

export default class ScoreInputV2 extends Component {
  static NO_BOWL_TYPES = [
    'No Bowl',
    'Front foot',
    'Above head height',
    'High full toss',
    'Change of action',
    'Fielding restrictions',
    'Back foot',
    'Throwing',
    'Underarm',
    'Double bounce',
  ];

  static BOUNDARY_TYPES = [
    'Boundary',
    'Four',
    'Six',
    'Four (By)',
    'Six (By)',
    'Four (Leg By)',
    'Six (Leg By)',
  ];

  static INITIAL_STATE = {
    by: 'By',
    legBy: 'Leg By',
    isWide: false,
    isNo: 'No Bowl',
    singles: 'Singles',
    wicket: 'Wicket',
    boundary: 'Boundary',
    uncertainBatsmanId: '', // selected batsman on uncertain outs
  };

  static boundaryOptions = ScoreInputV2.BOUNDARY_TYPES.map((boundary) => ({
    _id: boundary,
    name: boundary,
  }));

  static singleOptions = ['Singles', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
    (el) => ({
      _id: el.toString(),
      name: el.toString(),
    })
  );

  static byOptions = ['By', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el) => ({
    _id: el.toString(),
    name: el.toString(),
  }));

  static legByOptions = ScoreInputV2.byOptions.map((option, i) =>
    i === 0 ? { _id: 'Leg By', name: 'Leg By' } : { ...option }
  );

  static noBowlOptions = ScoreInputV2.NO_BOWL_TYPES.map((type) => ({
    _id: type,
    name: type,
  }));

  constructor(props) {
    super(props);
    this.state = {
      ...ScoreInputV2.INITIAL_STATE,
      errorMessage: null,
    };

    bindMethods(this);
  }

  handlers = {
    onStateUpdate(update) {
      this.setState(update);
    },

    onBatsmanSelectModalClose() {
      this.setState({
        wicket: 'Wicket',
        uncertainBatsmanId: '',
      });
    },

    makeOnCreaseBatsmanUncertain() {
      const { batsmen } = this.props;
      this.setState({
        uncertainBatsmanId: batsmen[0]._id,
      });
    },

    onScore() {
      /*
     BowlSchema = {
       playedBy: Number,
       isWicket: {
         kind: String,
         player: Number, // for uncertain outs like run-out where player other than `playedBy` can be out
       },
       singles: Number,
       by: Number,
       legBy: Number,
       boundary: {
         run: Number,
         kind: {
           type: String,
           enum: ['regular', 'by', 'legBy'],
           default: 'regular',
         },
       },
       isWide: Boolean,
       isNo: String, // containing the reason of no
     }
    */
      const {
        by,
        legBy,
        isWide,
        isNo,
        boundary,
        singles,
        wicket,
        uncertainBatsmanId,
      } = this.state;
      const { batsmen, batsmanIndices } = this.props;

      const bowlEvent = {
        // by default, the on-crease batsman is out
        playedBy: getIndexOfBatsman(batsmen[0]._id, batsmen, batsmanIndices),
        singles: singles === 'Singles' ? 0 : singles,
        by: by === 'By' ? 0 : by,
        legBy: legBy === 'Leg By' ? 0 : legBy,
        isWide,
        isNo: isNo === ScoreInputV2.NO_BOWL_TYPES[0] ? '' : isNo,
      };

      if (wicket !== WICKET_TYPES[0]) {
        bowlEvent.isWicket = {
          kind: wicket,
        };

        if (UNCERTAIN_WICKETS.includes(wicket)) {
          bowlEvent.isWicket.player = getIndexOfBatsman(
            uncertainBatsmanId,
            batsmen,
            batsmanIndices
          );
        }
        // else `bowlEvent.playedBy` is out
      } else {
        bowlEvent.isWicket = {};
      }

      if (boundary !== ScoreInputV2.BOUNDARY_TYPES[0]) {
        const run = boundary.startsWith('Four') ? 4 : 6;
        let kind;
        if (boundary.endsWith('(Leg By)')) {
          kind = 'legBy';
        } else {
          kind = boundary.endsWith('(By)') ? 'by' : 'regular';
        }
        bowlEvent.boundary = { run, kind };
      } else {
        bowlEvent.boundary = {};
      }
      this._makeServerRequest(bowlEvent);
    },
  };

  _makeServerRequest(bowlEvent) {
    const {
      matchId,
      onInput,
      injectBowlEvent,
      shouldResetAfterInput,
      httpVerb,
    } = this.props;
    const _bowlEvent = injectBowlEvent(bowlEvent);
    const request = fetcher[httpVerb];
    request(`matches/${matchId}/bowl`, _bowlEvent)
      .then((res) => {
        _bowlEvent._id = res.data._id;
        onInput(_bowlEvent);
        return shouldResetAfterInput && this.resetInputFields();
      })
      .catch((err) =>
        this.setState({ errorMessage: err.response.data.err[0].msg })
      );
  }

  resetInputFields() {
    this.setState(ScoreInputV2.INITIAL_STATE);
  }

  render() {
    const {
      by,
      legBy,
      isWide,
      isNo,
      boundary,
      singles,
      wicket,
      uncertainBatsmanId,
      errorMessage,
    } = this.state;
    const { batsmen, actionText } = this.props;
    // prevent error while any of the batsmen changed to null
    batsmen[0] = batsmen[0] || { _id: null };
    batsmen[1] = batsmen[1] || { _id: null };

    let uncertainBatsmanName = '';
    if (uncertainBatsmanId) {
      const uncertainBatsman = batsmen.find(
        (_batsman) => _batsman._id === uncertainBatsmanId
      );
      if (uncertainBatsman) {
        uncertainBatsmanName = `(${uncertainBatsman.name})`;
      }
    }

    return (
      <section className="score-input v2 rounded flex-grow-0">
        <div className="col-12 col-md-3 col-lg-auto">
          <label className="sr-only" htmlFor="by" />
          <SelectControl
            value={by}
            id="by"
            name="by"
            className="form-control"
            options={ScoreInputV2.byOptions}
            onChange={(e) => this.onStateUpdate({ by: Number(e.target.value) })}
          />
        </div>

        <div className="col-12 col-md-3 col-lg-auto">
          <label className="sr-only" htmlFor="legBy" />
          <SelectControl
            value={legBy}
            id="legBy"
            name="legBy"
            className="form-control"
            options={ScoreInputV2.legByOptions}
            onChange={(e) =>
              this.onStateUpdate({ legBy: Number(e.target.value) })
            }
          />
        </div>

        <div className="col-12 col-md-4 col-lg-auto">
          <label className="sr-only" htmlFor="isNo" />
          <SelectControl
            value={isNo}
            id="isNo"
            name="isNo"
            className="form-control"
            options={ScoreInputV2.noBowlOptions}
            onChange={(e) => this.onStateUpdate({ isNo: e.target.value })}
          />
        </div>

        <div className="col-12 col-md-2 col-lg-auto">
          <CheckBoxControl
            value={isWide}
            name="wide"
            onChange={(e) => this.onStateUpdate({ isWide: e.target.checked })}
          >
            Wide
          </CheckBoxControl>
        </div>

        <div className="col-12 py-1">
          <hr className="border-primary my-2 mb-md-1" />
        </div>

        <div className="col-12 col-md-3 col-lg-auto">
          <label className="sr-only" htmlFor="singles" />
          <SelectControl
            value={singles}
            id="singles"
            name="singles"
            className="form-control"
            options={ScoreInputV2.singleOptions}
            onChange={(e) =>
              this.onStateUpdate({ singles: Number(e.target.value) })
            }
          />
        </div>

        <div className="col-12 col-md-3 col-lg-auto">
          <label className="sr-only" htmlFor="boundary" />
          <SelectControl
            value={boundary}
            id="boundary"
            name="boundary"
            className="form-control"
            options={ScoreInputV2.boundaryOptions}
            onChange={(e) => this.onStateUpdate({ boundary: e.target.value })}
          />
        </div>

        <div className="col-12 col-md-4 col-lg-auto">
          <label className="sr-only" htmlFor="wicket" />
          <SelectControl
            value={wicket}
            id="wicket"
            name="wicket"
            className="form-control text-danger"
            options={wicketOptions}
            render={(opt) =>
              `${opt.name} ${
                UNCERTAIN_WICKETS.includes(opt.name) ? uncertainBatsmanName : ''
              }`
            }
            onChange={(e) => this.onStateUpdate({ wicket: e.target.value })}
          />
        </div>

        <div className="col-12 col-md-2 col-lg-auto">
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={this.onScore}
          >
            {actionText}
          </button>
        </div>

        {
          // Render modal only if `batsmen` has real batsman entries
          batsmen.every((_batsman) => _batsman._id) && (
            <Modal
              isOpen={
                // Show modal if `wicket` is of uncertain type and batsman is not selected
                UNCERTAIN_WICKETS.includes(wicket) && !uncertainBatsmanId
              }
              contentClassName="bg-dark"
            >
              <ModalHeader
                className="text-primary"
                toggle={this.onBatsmanSelectModalClose}
              >
                Which batsman is out?
              </ModalHeader>

              <ModalBody>
                <FormGroup
                  type="select"
                  name="batsman"
                  value={uncertainBatsmanId}
                  onChange={(e) =>
                    this.setState({ uncertainBatsmanId: e.target.value })
                  }
                  options={batsmen}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onClick={this.makeOnCreaseBatsmanUncertain}
                >
                  Select
                </Button>
              </ModalFooter>
            </Modal>
          )
        }

        {/* Error Modal */}
        <Modal isOpen={!!errorMessage} contentClassName="bg-dark">
          <ModalHeader
            className="text-warning border-0"
            toggle={() => this.setState({ errorMessage: null })}
          >
            Warning!
          </ModalHeader>
          <ModalBody className="text-warning">{errorMessage}</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.setState({ errorMessage: null })}
            >
              Got It
            </Button>
          </ModalFooter>
        </Modal>
      </section>
    );
  }
}

ScoreInputV2.propTypes = {
  batsmen: arrayOf(shape(PlayerType)).isRequired,
  batsmanIndices: arrayOf(number).isRequired,
  matchId: string.isRequired,
  onInput: func.isRequired,
  injectBowlEvent: func.isRequired, // to support injecting over and bowl number while editing
  shouldResetAfterInput: bool.isRequired,
  actionText: string.isRequired,
  httpVerb: string.isRequired,
};
