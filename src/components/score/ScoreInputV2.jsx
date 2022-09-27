/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Date: Nov 09, 2019
 */

import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as PropTypes from 'prop-types';
import { shape } from 'prop-types';
import CheckBoxControl from '../form/control/checkbox';
import SelectControl from '../form/control/select';
import { bindMethods } from '../../lib/utils';
import fetcher from '../../lib/fetcher';
import FormGroup from '../form/FormGroup';
import { getIndexOfBatsman } from './ScoreInput';
import { Player as PlayerType } from '../../types';

export default class ScoreInputV2 extends Component {
  static RUN_OUT = 'Run out';

  static OBSTRUCTING_THE_FIELD = 'Obstructing the field';

  static UNCERTAIN_WICKETS = [
    ScoreInputV2.RUN_OUT,
    ScoreInputV2.OBSTRUCTING_THE_FIELD,
  ];

  static WICKET_TYPES = [
    'Wicket',
    'Bowled',
    'Caught',
    'Leg before wicket',
    ScoreInputV2.RUN_OUT,
    'Stumped',
    'Hit the ball twice',
    'Hit wicket',
    ScoreInputV2.OBSTRUCTING_THE_FIELD,
    // 'Timed out', // Timed out takes place even before playing a bowl, hence needed to handle exceptionally
    'Retired',
  ];

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
    batsman: '', // selected batsman on uncertain outs
  };

  static wicketOptions = ScoreInputV2.WICKET_TYPES.map((wicket) => ({
    _id: wicket,
    name: wicket,
  }));

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

  _getIndexOfBatsman = getIndexOfBatsman;

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
        batsman: '',
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
      const { by, legBy, isWide, isNo, boundary, singles, wicket, batsman } =
        this.state;
      const { batsmen } = this.props;

      const bowlEvent = {
        playedBy: this._getIndexOfBatsman(batsmen[0]._id), // by default, the on-crease batsman is out
        singles: singles === 'Singles' ? 0 : singles,
        by: by === 'By' ? 0 : by,
        legBy: legBy === 'Leg By' ? 0 : legBy,
        isWide,
        isNo: isNo === ScoreInputV2.NO_BOWL_TYPES[0] ? null : isNo,
      };

      if (wicket !== ScoreInputV2.WICKET_TYPES[0]) {
        bowlEvent.isWicket = {
          kind: wicket,
        };

        if (ScoreInputV2.UNCERTAIN_WICKETS.includes(wicket)) {
          bowlEvent.isWicket.player = this._getIndexOfBatsman(batsman);
        }
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

  _makeServerRequest(bowlEvent, isUpdate = false) {
    const {
      matchId,
      onInput,
      injectBowlEvent,
      shouldResetAfterInput,
      httpVerb,
    } = this.props;
    const _bowlEvent = injectBowlEvent(bowlEvent, isUpdate);
    const request = fetcher[httpVerb];
    request(`matches/${matchId}/bowl`, _bowlEvent)
      .then((res) => {
        onInput(isUpdate ? res.data.bowl : _bowlEvent, isUpdate);
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
      batsman,
      errorMessage,
    } = this.state;
    const { batsmen, actionText } = this.props;
    // prevent error while any of the batsmen changed to null
    batsmen[0] = batsmen[0] || { _id: null };
    batsmen[1] = batsmen[1] || { _id: null };

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
            options={ScoreInputV2.wicketOptions}
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

        {/* Show modal if `wicket` is of uncertain type and batsman is not selected */}
        <Modal
          isOpen={ScoreInputV2.UNCERTAIN_WICKETS.includes(wicket) && !batsman}
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
              value={batsman}
              onChange={(e) => this.setState({ batsman: e.target.value })}
              options={batsmen}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onBatsmanSelectModalClose}>
              Select
            </Button>
          </ModalFooter>
        </Modal>

        {/* Error Modal */}
        <Modal isOpen={!!errorMessage}>
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
  batsmen: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  matchId: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired,
  injectBowlEvent: PropTypes.func.isRequired, // to support injecting over and bowl number while editing
  shouldResetAfterInput: PropTypes.bool.isRequired,
  actionText: PropTypes.string.isRequired,
  httpVerb: PropTypes.string.isRequired,
};
