/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 10, 2019
 */


import React, {Component} from "react";
import CenterContent from "./layouts/CenterContent";
import SelectControl from "./form/control/select";
import {bindMethods} from "../lib/utils";
import fetcher from "../lib/fetcher";

export default class Toss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        won: '',
        choice: 'Bat',
      },
      isValid: {
        won: null,
        choice: null,
      },
      feedback: {
        won: null,
        choice: null,
      },
    };

    bindMethods(this);
  }

  handlers = {
    onChange(action) {
      this.setState(prevState => {
        return {values: {...prevState.values, ...action}}
      });
    },
    onClick() {
      const postData = {
        won: this.state.values.won,
        choice: this.state.values.choice,
      };
      fetcher
        .put(`matches/${this.props.matchId}/toss`, postData)
        .then(response => {
          this.props.onToss(postData, response.data.message);
        })
        .catch(err => {
          const isValid = {
            won: true,
            choice: true,
          };
          const feedback = {
            won: null,
            choice: null,
          };
          for (const error of err.response.data.err) {
            if (isValid[error.param]) {
              isValid[error.param] = false;
            }
            if (!feedback[error.param]) {
              feedback[error.param] = error.msg;
            }
          }

          this.setState({
            isValid,
            feedback,
          });
        });

    },
  };

  render() {
    const teams = [{_id: '', name: 'None'}].concat(this.props.teams);
    const options = ['Bat', 'Bawl'].map(el => ({_id: el, name: el}));
    const ownControl = <SelectControl options={teams} id="own"
                                      onChange={(e) => this.onChange({won: e.target.value})}
                                      value={this.state.values.won} isValid={this.state.isValid.won}/>;
    const choiceControl = <SelectControl options={options} id="choice"
                                         onChange={(e) => this.onChange({choice: e.target.value})}
                                         value={this.state.values.choice} isValid={this.state.isValid.choice}/>;
    return (
      <CenterContent>
        <h2 className="text-center text-white bg-success py-3 mb-5 rounded">{this.props.name}</h2>
        <div className="form-group row justify-content-center">
          <label htmlFor="won" className="col-form-label col-auto">
            <h5>Toss Won By</h5>
          </label>
          <div className="col-auto">
            {ownControl}
            <div className="invalid-feedback">{this.state.feedback.won}</div>
          </div>
          <label htmlFor="choice" className="col-form-label col-auto">
            <h5>and chose to</h5>
          </label>
          <div className="col-auto">
            {choiceControl}
            <div className="invalid-feedback">{this.state.feedback.won}</div>
          </div>
          <div className="col-auto">
            <input type="button" className="btn btn-outline-primary" value="Continue" onClick={this.onClick}/>
          </div>
        </div>
      </CenterContent>
    );
  }

}
