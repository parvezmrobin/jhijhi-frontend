import React, { Component } from 'react';
import CheckBoxControl from './form/control/checkbox';
import { Tooltip } from 'reactstrap';
import SelectControl from './form/control/select';
import * as PropTypes from 'prop-types';

export default class ScoreInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
    };
  }

  render() {
    const wickets = [
      'Wicket',
      'Bowled',
      'Caught',
      'Leg before wicket',
      'Run out',
      'Stumped',
      'Hit the ball twice',
      'Hit wicket',
      'Obstructing the field',
      'Timed out',
      'Retired',
    ].map(wicket => ({
      _id: wicket,
      name: wicket,
    }));

    const singles = [{
      _id: null,
      name: 'Run',
    }]
      .concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el, i) => ({
        _id: i,
        name: i,
      })));

    return <div
      className="col-12 d-flex pl-3 justify-content-between align-items-center bg-dark text-white rounded">

      <div>
        <CheckBoxControl name="by">By</CheckBoxControl>
        <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="by" autohide={false}
                 toggle={() => this.setState(prevState => ({ tooltipOpen: !prevState.tooltipOpen }))}>
          By runs will be added to previous bawl. Insert a zero run first to add bawl with
          only by run.
        </Tooltip>
      </div>

      <CheckBoxControl name="leg-by">Leg By</CheckBoxControl>

      <CheckBoxControl name="wide">Wide</CheckBoxControl>

      <CheckBoxControl name="no">No Ball</CheckBoxControl>

      <div>
        <SelectControl name="singles" className="form-control" options={singles}/>
      </div>

      <button type="button" className="btn btn-info m-2">Four</button>

      <button type="button" className="btn btn-info m-2">Six</button>

      <div className="rounded">
        <SelectControl name="wicket" className="form-control text-danger" options={wickets}/>
      </div>
    </div>;
  }
}

ScoreInput.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
  singleOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.any,
  })),
  wicketOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  })),
};
