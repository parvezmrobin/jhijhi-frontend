/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 09, 2019
 */

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { shape } from 'prop-types';
import { Redirect } from 'react-router-dom';
import CenterContent from './layouts/CenterContent';
import CheckBoxControl from './form/control/checkbox';
import { bindMethods, subtract, toTitleCase } from '../lib/utils';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';
import fetcher from '../lib/fetcher';
import { PlayerType, TeamType } from '../types';

const getListItemMapperForTeam = (onTeamPlayerChange) => {
  function listItemMapper({ _id, jerseyNo, name }) {
    return (
      <li key={_id} className="list-group-item bg-transparent flex-fill">
        <CheckBoxControl
          name={`cb-${jerseyNo}-${onTeamPlayerChange.name}`}
          onChange={(e) => {
            onTeamPlayerChange({
              [e.target.checked ? 'select' : 'unselect']: _id,
            });
          }}
        >
          {`${toTitleCase(name)} (${jerseyNo})`}
        </CheckBoxControl>
      </li>
    );
  }
  listItemMapper.propTypes = PlayerType;

  return listItemMapper;
};

export default class PreMatch extends Component {
  static makeCaptainForm(
    teamNo,
    players,
    playerIds,
    captain,
    onChange,
    isValid,
    feedback
  ) {
    const selectOptions = players.filter(
      (el) => playerIds.indexOf(el._id) !== -1
    );
    let captainForm;
    if (selectOptions.length) {
      captainForm = (
        <FormGroup
          label="Captain"
          type="select"
          options={selectOptions}
          name={`team${teamNo}-captain`}
          value={captain}
          onChange={onChange}
          isValid={isValid}
          feedback={feedback}
        />
      );
    } else {
      captainForm = (
        <FormGroup
          label="Captain"
          type="select"
          options={[
            { _id: '-1', name: 'Choose players first to select captain' },
          ]}
          disabled
          name={`team${teamNo}-captain`}
          value={captain}
          onChange={onChange}
          isValid={isValid}
          feedback={feedback}
        />
      );
    }

    return captainForm;
  }

  constructor(props) {
    super(props);
    this.state = {
      players: null,
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
      const { team2Captain, team1Players, team2Players, team1Captain } =
        this.state;
      const postData = {
        team1Players,
        team2Players,
        team1Captain,
        team2Captain,
        state: 'toss',
      };

      const { onMatchBegin, matchId } = this.props;
      fetcher
        .put(`matches/${matchId}/begin`, postData)
        .then((response) =>
          onMatchBegin(response.data.match, response.data.message)
        )
        .catch((err) => {
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
      this.setState(
        (prevState) => {
          if (action.select) {
            if (prevState.team1Players.indexOf(action.select) === -1) {
              return {
                team1Players: prevState.team1Players.concat(action.select),
              };
            }
            return { team1Players: prevState.team1Players };
          }
          if (action.unselect) {
            return {
              team1Players: prevState.team1Players.filter(
                (player) => player !== action.unselect
              ),
            };
          }
          throw new Error('Unknown Action');
        },
        () => {
          const { team1Players, team1Captain } = this.state;
          if (team1Players.length === 1) {
            this.setState({ team1Captain: team1Players[0] });
          } else if (!team1Players.length) {
            this.setState({ team1Captain: '' });
          }

          // if the selected captain is removed from the team
          if (action.unselect === team1Captain && team1Players.length) {
            this.setState({ team1Captain: team1Players[0] });
          }
        }
      );
    },
    onTeam2PlayerChange(action) {
      this.setState(
        (prevState) => {
          if (action.select) {
            if (prevState.team2Players.indexOf(action.select) === -1) {
              return {
                team2Players: prevState.team2Players.concat(action.select),
              };
            }
            return { team2Players: prevState.team2Players };
          }
          if (action.unselect) {
            return {
              team2Players: prevState.team2Players.filter(
                (player) => player !== action.unselect
              ),
            };
          }
          throw new Error('Unknown Action');
        },
        () => {
          const { team2Captain, team2Players } = this.state;
          if (team2Players.length === 1) {
            this.setState({ team2Captain: team2Players[0] });
          } else if (!team2Players.length) {
            this.setState({ team2Captain: '' });
          }

          // if the selected captain is removed from the team
          if (action.unselect === team2Captain && team2Players.length) {
            this.setState({ team2Captain: team2Players[0] });
          }
        }
      );
    },
  };

  componentDidMount() {
    return fetcher
      .get('players')
      .then((response) => this.setState({ players: response.data }));
  }

  componentWillUnmount() {
    fetcher.cancelAll();
  }

  render() {
    let { players } = this.state;
    if (players && players.length < 4) {
      return <Redirect to="/player?redirected=1" />;
    }
    players = players || [];

    const matcher = (el1, el2) => el1._id === el2;

    const {
      isValid,
      team2Players,
      team1Captain,
      team1Players,
      feedback,
      team2Captain,
    } = this.state;
    const team1CandidatePlayers = subtract(players, team2Players, matcher).map(
      getListItemMapperForTeam(this.onTeam1PlayerChange)
    );
    const team2CandidatePlayers = subtract(players, team1Players, matcher).map(
      getListItemMapperForTeam(this.onTeam2PlayerChange)
    );

    const team1CaptainForm = PreMatch.makeCaptainForm(
      1,
      players,
      team1Players,
      team1Captain,
      (e) => this.onChange({ team1Captain: e.target.value }),
      isValid.team1Captain,
      feedback.team1Captain
    );

    const team2CaptainForm = PreMatch.makeCaptainForm(
      2,
      players,
      team2Players,
      team2Captain,
      (e) => this.onChange({ team2Captain: e.target.value }),
      isValid.team2Captain,
      feedback.team2Captain
    );

    const { team2, team1, name } = this.props;
    return (
      <CenterContent>
        <h2 className="text-center text-white bg-success py-3 rounded">
          {name}
        </h2>
        <div className="row">
          <div className="col-12 col-sm">
            <h2 className="text-center text-primary">{team1.name}</h2>
            <hr />
            {team1CaptainForm}
            <div className="form-group row">
              <label
                htmlFor="choose-players"
                className="col-form-label col-lg-3"
              >
                Choose Players
              </label>
              <div className="col">
                <ul id="choose-players" className="list-group-select">
                  {team1CandidatePlayers}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm">
            <h2 className="text-center text-primary">{team2.name}</h2>
            <hr />
            {team2CaptainForm}
            <div className="form-group row">
              <label htmlFor="select-group" className="col-form-label col-lg-3">
                Choose Players
              </label>
              <div className="col">
                <ul id="select-group" className="list-group-select">
                  {team2CandidatePlayers}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <FormButton
          type="button"
          text="Begin Match"
          btnClass="outline-primary"
          offsetCol="offset-0 text-center mt-3"
          onClick={this.onButtonClick}
        />
      </CenterContent>
    );
  }
}

PreMatch.propTypes = {
  team1: shape(TeamType),
  team2: shape(TeamType),
  matchId: PropTypes.string,
  name: PropTypes.string,
  onMatchBegin: PropTypes.func,
};
