/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { shape } from 'prop-types';
import CheckBoxControl from '../form/control/checkbox';
import SelectControl from '../form/control/select';
import { bindMethods } from '../../lib/utils';
import fetcher from '../../lib/fetcher';
import FormGroup from '../form/FormGroup';
import { PlayerType } from '../../types';

export function getIndexOfBatsman(batsmanId) {
  let selectedBatsmanIndex;
  const [{ _id: batsman1Id }, { _id: batsman2Id }] = this.props.batsmen;
  if (batsman1Id === batsmanId) {
    selectedBatsmanIndex = this.props.batsmanIndices[0];
  } else if (batsman2Id === batsmanId) {
    selectedBatsmanIndex = this.props.batsmanIndices[1];
  } else {
    throw new Error(
      `Invalid batsman selected for run out: ${this.state.batsman}`
    );
  }
  return selectedBatsmanIndex;
}

export default class ScoreInput extends Component {
  static RUN_OUT = 'Run out';

  static OBSTRUCTING_THE_FIELD = 'Obstructing the field';

  static UNCERTAIN_WICKETS = [
    ScoreInput.RUN_OUT,
    ScoreInput.OBSTRUCTING_THE_FIELD,
  ];

  _getIndexOfBatsman = getIndexOfBatsman;

  wickets = [
    'Wicket',
    'Bowled',
    'Caught',
    'Leg before wicket',
    'Run out',
    'Stumped',
    'Hit the ball twice',
    'Hit wicket',
    'Obstructing the field',
    /* 'Timed out', */ 'Retired',
  ].map((wicket) => ({
    _id: wicket,
    name: wicket,
  }));

  singles = ['Singles', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el) => ({
    _id: el,
    name: el,
  }));

  constructor(props) {
    super(props);
    this.state = {
      byRunTooltipOpen: false,
      wicketTooltipOpen: false,
      isBy: false,
      isLegBy: false,
      isWide: false,
      isNo: false,
      singles: 'Singles',
      wicket: 'Wicket',
      uncertainWicket: null,
      batsman: '',
      errorMessage: null,
    };

    bindMethods(this);
  }

  handlers = {
    onStateUpdate(update) {
      this.setState((prevState) => ({ ...prevState, ...update }));
    },
    onSingle(run) {
      const bowlEvent = this._createBowlEvent();
      if (bowlEvent.by) {
        this._makeServerRequest({ run }, 'by');
        return;
      }
      delete bowlEvent.by;
      if (bowlEvent.legBy) {
        bowlEvent.legBy = run;
      } else {
        delete bowlEvent.legBy;
        bowlEvent.singles = run;
      }
      this._makeServerRequest(bowlEvent);
    },
    onBoundary(run) {
      const bowlEvent = this._createBowlEvent();
      if (bowlEvent.by) {
        this._makeServerRequest(
          {
            run,
            boundary: true,
          },
          'by'
        );
        return;
      }
      bowlEvent.boundary = {
        run,
        kind: bowlEvent.legBy ? 'legBy' : 'regular',
      };
      delete bowlEvent.by;
      delete bowlEvent.legBy;
      this._makeServerRequest(bowlEvent);
    },
    onWicket(wicket) {
      const { batsmen } = this.props;
      if (ScoreInput.UNCERTAIN_WICKETS.includes(wicket)) {
        this.setState({
          uncertainWicket: wicket,
          batsman: batsmen[0]._id,
        });
        return;
      }
      const bowlEvent = this._createBowlEvent();
      bowlEvent.isWicket = {
        kind: wicket,
      };
      delete bowlEvent.by;
      delete bowlEvent.legBy;
      this._makeServerRequest(bowlEvent);
    },
    onUncertainWicket() {
      const { batsman, uncertainWicket } = this.state;
      const selectedBatsmanIndex = this._getIndexOfBatsman(batsman);
      const bowlEvent = {
        batsman: selectedBatsmanIndex,
        kind: uncertainWicket,
      };
      this._makeServerRequest(bowlEvent, 'uncertain-out');
    },
  };

  _createBowlEvent() {
    const { batsmen } = this.props;
    const { isBy, isLegBy, isWide, isNo } = this.state;
    return {
      playedBy: this._getIndexOfBatsman(batsmen[0]._id),
      by: isBy,
      legBy: isLegBy,
      isWide,
      isNo: isNo ? 'True' : null, // later can be replaced by reason of no
      boundary: {
        run: 0,
      },
    };
  }

  _makeServerRequest(bowlEvent, endPoint = 'bowl') {
    const {
      matchId,
      onInput,
      defaultHttpVerb,
      injectBowlEvent,
      shouldResetAfterInput,
    } = this.props;
    const _bowlEvent = injectBowlEvent(bowlEvent, endPoint);
    const isNewBowl = endPoint === 'bowl';
    const request = isNewBowl
      ? fetcher[defaultHttpVerb.toLowerCase()]
      : fetcher.put;
    request(`matches/${matchId}/${endPoint}`, _bowlEvent)
      .then((res) => {
        onInput(isNewBowl ? _bowlEvent : res.data.bowl, !isNewBowl);
        return shouldResetAfterInput && this.resetInputFields();
      })
      .catch((err) => {
        if (shouldResetAfterInput) {
          this.resetInputFields();
        }
        this.setState({ errorMessage: err.response.data.err[0].msg });
      });
  }

  resetInputFields() {
    this.setState((prevState) => ({
      ...prevState,
      isBy: false,
      isLegBy: false,
      isWide: false,
      isNo: false,
      singles: 'Singles',
      wicket: 'Wicket',
      uncertainWicket: null,
      batsman: '',
    }));
  }

  render() {
    const {
      batsman,
      isBy,
      isLegBy,
      isWide,
      isNo,
      singles,
      wicket,
      uncertainWicket,
      byRunTooltipOpen,
      wicketTooltipOpen,
      errorMessage,
    } = this.state;
    const { batsmen } = this.props;
    // prevent error while any of the batsmen changed to null
    batsmen[0] = batsmen[0] || { _id: 0 };
    batsmen[1] = batsmen[1] || { _id: 1 };

    return (
      <section className="score-input rounded">
        <div className="col-6 col-md-3 col-lg-auto">
          <CheckBoxControl
            value={isBy}
            name="by"
            onChange={(e) => this.onStateUpdate({ isBy: e.target.checked })}
          >
            By
          </CheckBoxControl>
          <Tooltip
            placement="top"
            isOpen={byRunTooltipOpen}
            target="by"
            autohide={false}
            toggle={() =>
              this.setState((prevState) => ({
                byRunTooltipOpen: !prevState.byRunTooltipOpen,
              }))
            }
          >
            By runs will be added to previous bowl. Insert a zero run first to
            add bowl with only <em>by run</em>.
          </Tooltip>
        </div>

        <div className="col-6 col-md-3 col-lg-auto">
          <CheckBoxControl
            value={isLegBy}
            name="leg-by"
            onChange={(e) => this.onStateUpdate({ isLegBy: e.target.checked })}
          >
            Leg By
          </CheckBoxControl>
        </div>

        <div className="col-6 col-md-3 col-lg-auto">
          <CheckBoxControl
            value={isWide}
            name="wide"
            onChange={(e) => this.onStateUpdate({ isWide: e.target.checked })}
          >
            Wide
          </CheckBoxControl>
        </div>

        <div className="col-6 col-md-3 col-lg-auto">
          <CheckBoxControl
            value={isNo}
            name="no"
            onChange={(e) => this.onStateUpdate({ isNo: e.target.checked })}
          >
            No Ball
          </CheckBoxControl>
        </div>

        <div className="d-block d-lg-none col-12">
          <hr className="border-primary my-2 mb-md-1" />
        </div>

        <div className="col-12 col-md-4 col-lg-auto">
          <label className="sr-only" htmlFor="singles" />
          <SelectControl
            value={singles}
            name="singles"
            className="form-control"
            options={this.singles}
            onChange={(e) => {
              const run = e.target.value;
              this.onStateUpdate({ singles: run });
              this.onSingle(Number.parseInt(run, 10));
            }}
          />
        </div>

        <div className="col-6 col-md-2 col-lg-auto">
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg-regular my-2"
            onClick={() => this.onBoundary(4)}
          >
            Four
          </button>
        </div>

        <div className="col-6 col-md-2 col-lg-auto">
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg-regular my-2"
            onClick={() => this.onBoundary(6)}
          >
            Six
          </button>
        </div>

        <div className="col-12 col-md-4 col-lg-auto">
          <label className="sr-only" htmlFor="wicket" />
          <SelectControl
            value={wicket}
            id="wicket"
            name="wicket"
            className="form-control text-danger"
            options={this.wickets}
            onChange={(e) => {
              this.onStateUpdate({ wicket: e.target.value });
              this.onWicket(e.target.value);
            }}
          />
          <Tooltip
            placement="top"
            isOpen={wicketTooltipOpen}
            autohide={false}
            target="wicket"
            toggle={() =>
              this.setState((prevState) => ({
                wicketTooltipOpen: !prevState.wicketTooltipOpen,
              }))
            }
          >
            Run out will be added to previous bowl. Insert a zero run first to
            add bowl with only <em>run out</em>.
          </Tooltip>
        </div>
        <Modal isOpen={!!uncertainWicket}>
          <ModalHeader
            className="text-primary"
            toggle={() =>
              this.setState({
                wicket: 'Wicket',
                uncertainWicket: null,
                batsman: '',
              })
            }
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
            <Button color="primary" onClick={this.onUncertainWicket}>
              Select
            </Button>
          </ModalFooter>
        </Modal>

        {/* Error Modal */}
        <Modal isOpen={errorMessage}>
          <ModalHeader
            className="text-danger"
            toggle={() => this.setState({ errorMessage: null })}
          >
            Error!
          </ModalHeader>
          <ModalBody className="text-danger">{errorMessage}</ModalBody>
        </Modal>
      </section>
    );
  }
}

ScoreInput.propTypes = {
  batsmen: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  matchId: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired,
  defaultHttpVerb: PropTypes.oneOf(['post', 'put']).isRequired,
  injectBowlEvent: PropTypes.func.isRequired, // to support injecting over and bowl number while editing
  shouldResetAfterInput: PropTypes.bool.isRequired,
};
