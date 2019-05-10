import React, { Component } from 'react';
import CheckBoxControl from './form/control/checkbox';
import { Tooltip } from 'reactstrap';
import SelectControl from './form/control/select';
import * as PropTypes from 'prop-types';
import { bindMethods } from '../lib/utils';
import fetcher from '../lib/fetcher';

export default class ScoreInput extends Component {
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
    };

    bindMethods(this);
  }

  _createBowlEvent() {
    return {
      playedBy: this.props.batsman1,
      by: this.state.isBy,
      legBy: this.state.isLegBy,
      isWide: this.state.isWide,
      isNo: this.state.isNo ? 'True' : null,
      boundary: {
        run: 0,
      },
    };
  }

  _makeServerRequest(bowlEvent, endPoint = 'bowl') {
    const isNewBowl = endPoint === 'bowl';
    const request = isNewBowl ? fetcher.post : fetcher.put;
    request(`matches/${this.props.matchId}/${endPoint}`, bowlEvent)
      .then(res => this.prepareForNextInput(isNewBowl ? bowlEvent : res.data.bowl, !isNewBowl));
  }

  prepareForNextInput(bowl, isUpdate) {
    this.props.onInput(bowl, isUpdate);
    this.setState(prevState => ({
      ...prevState,
      isBy: false,
      isLegBy: false,
      isWide: false,
      isNo: false,
      singles: 'Singles',
      wicket: 'Wicket',
    }));
  }

  handlers = {
    onStateUpdate(update) {
      this.setState(prevState => ({ ...prevState, ...update }));
    },
    onSingle(run) {
      const bowlEvent = this._createBowlEvent();
      if (bowlEvent.by) {
        return this._makeServerRequest({ run }, 'by');
      }
      if (bowlEvent.legBy) {
        bowlEvent.legBy = run;
      } else {
        bowlEvent.singles = run;
      }
      this._makeServerRequest(bowlEvent);
    },
    onBoundary(run) {
      const bowlEvent = this._createBowlEvent();
      if (bowlEvent.by) {
        return this._makeServerRequest({
          run,
          boundary: true,
        }, 'by');
      }
      bowlEvent.boundary = {
        run,
        kind: bowlEvent.legBy ? 'legBy' : 'regular',
      };
      delete bowlEvent.legBy;
      this._makeServerRequest(bowlEvent);
    },
    onWicket(wicket) {
      const bowlEvent = this._createBowlEvent();
      // TODO : handle runout
      // needs a popup to know, which player is out
      bowlEvent.isWicket = {
        kind: wicket,
      };
      delete bowlEvent.legBy;
      delete bowlEvent.by;
      this._makeServerRequest(bowlEvent);
    },
  };

  wickets = [
    'Wicket', 'Bowled', 'Caught', 'Leg before wicket', 'Run out', 'Stumped', 'Hit the ball twice',
    'Hit wicket', 'Obstructing the field', 'Timed out', 'Retired',
  ].map(wicket => ({
    _id: wicket,
    name: wicket,
  }));

  singles = ['Singles', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el) => ({
    _id: el,
    name: el,
  }));

  render() {
    const { isBy, isLegBy, isWide, isNo, singles, wicket } = this.state;
    return <section className="score-input rounded">

      <div className="col-6 col-md-3 col-lg-auto">
        <CheckBoxControl value={isBy} name="by"
                         onChange={e => this.onStateUpdate({ isBy: e.target.checked })}>
          By
        </CheckBoxControl>
        <Tooltip placement="top" isOpen={this.state.byRunTooltipOpen} target="by" autohide={false}
                 toggle={() => this.setState(prevState => ({ byRunTooltipOpen: !prevState.byRunTooltipOpen }))}>
          By runs will be added to previous bowl.
          Insert a zero run first to add bowl with only <em>by run</em>.
        </Tooltip>
      </div>

      <div className="col-6 col-md-3 col-lg-auto">
        <CheckBoxControl value={isLegBy} name="leg-by"
                         onChange={e => this.onStateUpdate({ isLegBy: e.target.checked })}>
          Leg By
        </CheckBoxControl>
      </div>

      <div className="col-6 col-md-3 col-lg-auto">
        <CheckBoxControl value={isWide} name="wide"
                         onChange={e => this.onStateUpdate({ isWide: e.target.checked })}>
          Wide
        </CheckBoxControl>
      </div>

      <div className="col-6 col-md-3 col-lg-auto">
        <CheckBoxControl value={isNo} name="no"
                         onChange={e => this.onStateUpdate({ isNo: e.target.checked })}>
          No Ball
        </CheckBoxControl>
      </div>

      <div className="d-block d-lg-none col-12">
        <hr className="border-primary my-2 mb-md-1"/>
      </div>

      <div className="col-12 col-md-4 col-lg-auto">
        <label className="sr-only" htmlFor="singles"/>
        <SelectControl value={singles} name="singles" className="form-control"
                       options={this.singles}
                       onChange={e => {
                         const run = e.target.value;
                         this.onStateUpdate({ singles: run });
                         this.onSingle(parseInt(run));
                       }}/>
      </div>

      <div className="col-6 col-md-2 col-lg-auto">
        <button type="button" className="btn btn-info btn-block btn-lg-regular my-2"
                onClick={() => this.onBoundary(4)}>
          Four
        </button>
      </div>

      <div className="col-6 col-md-2 col-lg-auto">
        <button type="button" className="btn btn-info btn-block btn-lg-regular my-2"
                onClick={() => this.onBoundary(6)}>
          Six
        </button>
      </div>

      <div className="col-12 col-md-4 col-lg-auto">
        <label className="sr-only" htmlFor="wicket"/>
        <SelectControl value={wicket} name="wicket" className="form-control text-danger"
                       options={this.wickets}
                       onChange={e => {
                         const wicket = e.target.value;
                         this.onStateUpdate({ wicket: wicket });
                         this.onWicket(wicket);
                       }}/>
        <Tooltip placement="top" isOpen={this.state.wicketTooltipOpen} autohide={false}
                 target="wicket"
                 toggle={() => this.setState(prevState => ({ wicketTooltipOpen: !prevState.wicketTooltipOpen }))}>
          Run out will be added to previous bowl.
          Insert a zero run first to add bowl with only <em>run out</em>.
        </Tooltip>
      </div>

    </section>;
  }
}

ScoreInput.propTypes = {
  batsman1: PropTypes.number,
  batsman2: PropTypes.number,
  matchId: PropTypes.string,
  onInput: PropTypes.func,
};
