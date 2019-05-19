/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 09, 2019
 */


import React, { Component } from 'react';
import CenterContent from './layouts/CenterContent';
import CheckBoxControl from './form/control/checkbox';
import { bindMethods, subtract, toTitleCase } from '../lib/utils';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';
import fetcher from '../lib/fetcher';
import * as PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';


export default class PreMatch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      players: [],
      team1Players: [],
      team2Players: [],
      team1Captain: '',
      team2Captain: '',
      isValid: {
        team1Players: null,
        team2Players: null,
        team1Captain: null,
        team2Captain: null,
      },
      feedback: {
        team1Players: null,
        team2Players: null,
        team1Captain: null,
        team2Captain: null,
      },
    };
    bindMethods(this);
  }

  handlers = {
    onButtonClick() {
      const postData = {
        team1Players: this.state.team1Players,
        team2Players: this.state.team2Players,
        team1Captain: this.state.team1Captain,
        team2Captain: this.state.team2Captain,
        state: 'toss',
      };

      fetcher
        .put(`matches/${this.props.matchId}/begin`, postData)
        .then(response => {
          this.props.onMatchBegin(response.data.match, response.data.message);
        })
        .catch(err => {
          const isValid = {
            team1Players: true,
            team2Players: true,
            team1Captain: true,
            team2Captain: true,
          };
          const feedback = {
            team1Players: null,
            team2Players: null,
            team1Captain: null,
            team2Captain: null,
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
    onChange(action) {
      this.setState({ ...action });
    },
    /**
     * @param action
     * @param action.select
     * @param action.unselect
     */
    onTeam1PlayerChange(action) {

      this.setState(prevState => {
        if (action.select) {
          if (prevState.team1Players.indexOf(action.select) === -1) {
            return { team1Players: prevState.team1Players.concat(action.select) };
          }
          return { team1Players: prevState.team1Players };
        } else if (action.unselect) {
          return { team1Players: prevState.team1Players.filter(player => player !== action.unselect) };
        } else {
          throw new Error('Unknown Action');
        }
      }, () => {
        if (this.state.team1Players.length === 1) {
          this.setState({ team1Captain: this.state.team1Players[0] });
        } else if (!this.state.team1Players.length) {
          this.setState({ team1Captain: '' });
        }

        // if the selected captain is removed from the team
        if (action.unselect === this.state.team1Captain && this.state.team1Players.length) {
          this.setState({ team1Captain: this.state.team1Players[0] });
        }
      });
    },
    onTeam2PlayerChange(action) {
      this.setState(prevState => {
        if (action.select) {
          if (prevState.team2Players.indexOf(action.select) === -1) {
            return { team2Players: prevState.team2Players.concat(action.select) };
          }
          return { team2Players: prevState.team2Players };
        } else if (action.unselect) {
          return { team2Players: prevState.team2Players.filter(player => player !== action.unselect) };
        } else {
          throw new Error('Unknown Action');
        }
      }, () => {
        if (this.state.team2Players.length === 1) {
          this.setState({ team2Captain: this.state.team2Players[0] });
        } else if (!this.state.team2Players.length) {
          this.setState({ team2Captain: '' });
        }

        // if the selected captain is removed from the team
        if (action.unselect === this.state.team2Captain && this.state.team2Players.length) {
          this.setState({ team2Captain: this.state.team2Players[0] });
        }
      });
    },
  };


  componentDidMount() {
    fetcher
      .get('players')
      .then(response => {
        this.setState({ players: response.data });
      });
  }


  render() {
    const {players} = this.state;
    if (players.length && players.length < 5) {
      return <Redirect to="/player?redirected=1"/>
    }
    const getCheckboxOnChangeForTeam = (team, id) => {
      // if checkbox is checked, key is 'select' and 'unselect otherwise. value is the index
      if (team === 1) {
        return (e) => this.onTeam1PlayerChange({
          [e.target.checked ? 'select' : 'unselect']: id,
        });
      } else if (team === 2) {
        return (e) => this.onTeam2PlayerChange({
          [e.target.checked ? 'select' : 'unselect']: id,
        });
      } else {
        throw new Error('Unknown Team');
      }
    };

    const matcher = (el1, el2) => el1._id === el2;

    const getListItemMapperForTeam = team => (player) => (
      <li key={player._id} className="list-group-item bg-transparent flex-fill">
        <CheckBoxControl name={`cb-${player.jerseyNo}-${team}`}
                         onChange={getCheckboxOnChangeForTeam(team, player._id)}>
          {`${toTitleCase(player.name)} (${player.jerseyNo})`}
        </CheckBoxControl>
      </li>
    );

    const team1CandidatePlayers = subtract(this.state.players, this.state.team2Players, matcher)
      .map(getListItemMapperForTeam(1));
    const team2CandidatePlayers = subtract(this.state.players, this.state.team1Players, matcher)
      .map(getListItemMapperForTeam(2));

    return (
      <CenterContent>
        <h2 className="text-center text-white bg-success py-3 rounded">{this.props.name}</h2>
        <div className="row">
          <div className="col">
            <h2 className="text-center text-primary">{this.props.team1.name}</h2>
            <hr/>
            <FormGroup label="Captain" type="select"
                       options={this.state.players.filter(
                         el => this.state.team1Players.indexOf(el._id) !== -1,
                       )}
                       name="team1-captain" value={this.state.team1Captain}
                       onChange={(e) => this.onChange({ team1Captain: e.target.value })}
                       isValid={this.state.isValid.team1Captain}
                       feedback={this.state.feedback.team1Captain}/>
            <div className="form-group row">
              <label className="col-form-label col-md-4 col-lg-3">
                Choose Players
              </label>
              <div className="col">
                <ul className="list-group-select">{team1CandidatePlayers}</ul>
              </div>
            </div>
          </div>
          <div className="col">
            <h2 className="text-center text-primary">{this.props.team2.name}</h2>
            <hr/>
            <FormGroup label="Captain" type="select"
                       options={this.state.players.filter(
                         el => this.state.team2Players.indexOf(el._id) !== -1,
                       )}
                       name="team2-captain" value={this.state.team2Captain}
                       onChange={(e) => this.onChange({ team2Captain: e.target.value })}
                       isValid={this.state.isValid.team2Captain}
                       feedback={this.state.feedback.team2Captain}/>
            <div className="form-group row">
              <label className="col-form-label col-md-4 col-lg-3">
                Choose Players
              </label>
              <div className="col">
                <ul className="list-group-select">{team2CandidatePlayers}</ul>
              </div>
            </div>
          </div>

        </div>
        <FormButton type="button" text="Begin Match" btnClass="outline-primary"
                    offsetCol="offset-0 text-center mt-3" onClick={this.onButtonClick}>
        </FormButton>
      </CenterContent>
    );
  }

}

PreMatch.propTypes = {
  team1: PropTypes.object,
  team2: PropTypes.object,
  matchId: PropTypes.string,
  name: PropTypes.string,
  onMatchBegin: PropTypes.func,
};
