/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 10, 2019
 */


import React, {Component} from "react";
import CenterContent from "./layouts/CenterContent";
import SelectControl from "./form/control/select";
import {bindMethods} from "../lib/utils";

export default class Toss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        own: '',
        choice: '',
      },
      isValid: {
        own: null,
        choice: null,
      },
      feedback: {
        own: null,
        choice: null,
      },
    };

    bindMethods(this);
  }

  handlers = {
    onChange(action){
      this.setState(prevState => {
        return {values: {...prevState.values, ...action}}
      });
    },
  };

  render() {
    const teams = [{_id: '', name: 'None'}].concat(this.props.teams);
    const options = ['Bat', 'Bawl'].map(el => ({_id: el, name: el}));
    const ownControl = <SelectControl options={teams} id="own"
                                      onChange={(e) => this.onChange({own: e.target.value})}
                                      value={this.state.values.own} isValid={this.state.isValid.own}/>;
    const choiceControl = <SelectControl options={options} id="choice"
                                         onChange={(e) => this.onChange({choice: e.target.value})}
                                         value={this.state.values.choice} isValid={this.state.isValid.choice}/>;
    return (
      <CenterContent>
        <div className="form-group row justify-content-center">
          <label htmlFor="won" className="col-form-label col-auto">
            <h5>Toss Won By</h5>
          </label>
          <div className="col-auto">
            {ownControl}
            <div className="invalid-feedback">{this.state.feedback.own}</div>
          </div>
          <label htmlFor="choice" className="col-form-label col-auto">
            <h5>and chose to</h5>
          </label>
          <div className="col-auto">
            {choiceControl}
            <div className="invalid-feedback">{this.state.feedback.own}</div>
          </div>
          <div className="col-auto">
            <input type="button" className="btn btn-outline-primary" value="Continue" onClick={this.props.onClick}/>
          </div>
        </div>
      </CenterContent>
    );
  }

}
