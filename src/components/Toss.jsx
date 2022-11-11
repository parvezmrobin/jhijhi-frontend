/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 10, 2019
 */

import React, { Component } from 'react';
import { arrayOf, func, shape, string } from 'prop-types';
import CenterContent from './layouts/CenterContent';
import SelectControl from './form/control/select';
import { bindMethods, formatValidationFeedback } from '../lib/utils';
import fetcher from '../lib/fetcher';
import { TeamType } from '../types';

class Toss extends Component {
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
      this.setState((prevState) => ({
        values: { ...prevState.values, ...action },
      }));
    },
    onClick() {
      const { values } = this.state;
      const postData = {
        won: values.won,
        choice: values.choice,
        state: 'innings1',
      };
      const { onToss, matchId } = this.props;
      fetcher
        .put(`matches/${matchId}/toss`, postData)
        .then((response) => onToss(response.data.match, response.data.message))
        .catch((err) => {
          const { isValid, feedback } = formatValidationFeedback(err);

          this.setState({
            isValid,
            feedback,
          });
        });
    },
  };

  componentWillUnmount() {
    fetcher.cancelAll();
  }

  render() {
    const { name } = this.props;
    const { feedback } = this.state;
    const { teams: teamsProp } = this.props;
    const teams = [{ _id: '', name: 'None' }].concat(teamsProp);
    const options = ['Bat', 'Bowl'].map((el) => ({ _id: el, name: el }));
    const { values, isValid } = this.state;
    const ownControl = (
      <SelectControl
        options={teams}
        id="own"
        name="own"
        onChange={(e) => this.onChange({ won: e.target.value })}
        value={values.won}
        isValid={isValid.won}
      />
    );
    const choiceControl = (
      <SelectControl
        options={options}
        id="choice"
        name="choice"
        onChange={(e) => this.onChange({ choice: e.target.value })}
        value={values.choice}
        isValid={isValid.choice}
      />
    );
    return (
      <CenterContent>
        <h2 className="text-center text-white bg-success py-3 mb-5 rounded">
          {name}
        </h2>
        <div className="form-group row justify-content-center">
          <label htmlFor="won" className="col-form-label col-auto">
            <h5>Toss Won By</h5>
          </label>
          <div className="col-auto">
            {ownControl}
            <div className="invalid-feedback">{feedback.won}</div>
          </div>
          <label htmlFor="choice" className="col-form-label col-auto">
            <h5>and chose to</h5>
          </label>
          <div className="col-auto">
            {choiceControl}
            <div className="invalid-feedback">{feedback.choice}</div>
          </div>
          <div className="col-auto">
            <input
              type="button"
              className="btn btn-outline-primary"
              value="Continue"
              onClick={this.onClick}
            />
          </div>
        </div>
      </CenterContent>
    );
  }
}

Toss.propTypes = {
  onToss: func.isRequired,
  matchId: string.isRequired,
  name: string.isRequired,
  teams: arrayOf(shape(TeamType)),
};

export default Toss;
