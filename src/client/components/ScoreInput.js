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
      tooltipOpen: false,
      isBy: false,
      isLegBy: false,
      isWide: false,
      isNo: false,
      singles: 'Singles',
      wicket: 'Wicket',
    };

    bindMethods(this);
  }

  createBowlEvent() {
    return {
      playedBy: this.props.batsman1,
      legBy: this.state.isLegBy,
      isWide: this.state.isWide,
      isNo: this.state.isNo ? 'True' : null,
      boundary: {
        run: 0,
      },
    };
  }

  makeServerRequest(bowlEvent) {
    fetcher.post(`matches/${this.props.matchId}/bowl`, bowlEvent)
      .then(() => this.prepareForNextInput(bowlEvent))
  }

  prepareForNextInput(bowlEvent) {
    this.props.onInput(bowlEvent);
    this.setState(prevState => ({
      ...prevState,
      isBy: false,
      isLegBy: false,
      isWide: false,
      isNo: false,
      singles: 'Singles',
      wicket: 'Wicket',
    }))
  }

  handlers = {
    onStateUpdate(update) {
      this.setState(prevState => ({ ...prevState, ...update }));
    },
    onSingle(run) {
      console.log('singles', run);
      const bowlEvent = this.createBowlEvent();
      // TODO : handle by
      if (bowlEvent.legBy) {
        bowlEvent.legBy = run;
      } else {
        bowlEvent.singles = run;
      }
      this.makeServerRequest(bowlEvent);
    },
    onBoundary(run) {
      console.log('boundary', run);
      const bowlEvent = this.createBowlEvent();
      // TODO : handle by
      bowlEvent.boundary = {
        run,
        kind: bowlEvent.legBy ? 'legBy' : 'regular',
      };
      delete bowlEvent.legBy;
      this.makeServerRequest(bowlEvent);
    },
    onWicket(wicket) {
      console.log('wicket', wicket);
      const bowlEvent = this.createBowlEvent();
      // TODO : handle runout
      bowlEvent.isWicket = {
        kind: wicket,
      };
      delete bowlEvent.legBy;
      this.makeServerRequest(bowlEvent);
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

      <div>
        <CheckBoxControl value={isBy} name="by"
                         onChange={e => this.onStateUpdate({ isBy: e.target.checked })}>
          By
        </CheckBoxControl>
        <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="by" autohide={false}
                 toggle={() => this.setState(prevState => ({ tooltipOpen: !prevState.tooltipOpen }))}>
          By runs will be added to previous bawl. Insert a zero run first to add bawl with
          only by run.
        </Tooltip>
      </div>

      <CheckBoxControl value={isLegBy} name="leg-by"
                       onChange={e => this.onStateUpdate({ isLegBy: e.target.checked })}>
        Leg By
      </CheckBoxControl>

      <CheckBoxControl value={isWide} name="wide"
                       onChange={e => this.onStateUpdate({ isWide: e.target.checked })}>
        Wide
      </CheckBoxControl>

      <CheckBoxControl value={isNo} name="no"
                       onChange={e => this.onStateUpdate({ isNo: e.target.checked })}>
        No Ball
      </CheckBoxControl>

      <div>
        <label htmlFor="singles"/>
        <SelectControl value={singles} name="singles" className="form-control"
                       options={this.singles}
                       onChange={e => {
                         const run = e.target.value;
                         this.onStateUpdate({ singles: run });
                         this.onSingle(parseInt(run));
                       }}/>
      </div>

      <button type="button" className="btn btn-info m-2" onClick={() => this.onBoundary(4)}>
        Four
      </button>

      <button type="button" className="btn btn-info m-2" onClick={() => this.onBoundary(6)}>
        Six
      </button>

      <div className="rounded">
        <label htmlFor="wicket"/>
        <SelectControl value={wicket} name="wicket" className="form-control text-danger"
                       options={this.wickets}
                       onChange={e => {
                         const wicket = e.target.value;
                         this.onStateUpdate({ wicket: wicket });
                         this.onWicket(wicket);
                       }}/>
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
