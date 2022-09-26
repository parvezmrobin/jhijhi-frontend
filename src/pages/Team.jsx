/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { Alert } from 'reactstrap';
import CenterContent from '../components/layouts/CenterContent';
import TeamForm from '../components/team/TeamForm';
import fetcher from '../lib/fetcher';
import { bindMethods, formatValidationFeedback } from '../lib/utils';
import ErrorModal from '../components/modal/ErrorModal';
import Notification from '../components/Notification';
import TeamSidebar from '../components/team/TeamSidebar';
import { Location, MatchParamId } from '../types';


class Team extends Component {
  static initialValidationFeedback = {
    isValid: {
      name: null,
      shortName: null,
    },
    feedback: {
      name: null,
      shortName: null,
    },
  };

  static initialValues = {
    team: {
      name: '',
      shortName: '',
    },
    ...cloneDeep(Team.initialValidationFeedback),
  };

  handlers = {
    /**
     * change event handler
     * @param newValues
     */
    onChange(newValues) {
      this.setState((prevState) => ({ team: { ...prevState.team, ...newValues } }));
    },

    onSubmit() {
      let submission;
      const { team } = this.state;
      if (team._id) {
        submission = this._updateTeam();
      } else {
        submission = this._createTeam();
      }

      submission
        .catch((err) => {
          const {
            isValid,
            feedback,
          } = formatValidationFeedback(err);

          this.setState({
            isValid,
            feedback,
          });
        })
        .catch(() => this.setState({ showErrorModal: true }));
    },
  };

  constructor(props) {
    super(props);
    const { location } = this.props;
    this.state = {
      ...cloneDeep(Team.initialValues),
      teams: [],
      message: null,
      showErrorModal: false,
      redirected: location.search.startsWith('?redirected=1'),
    };
    bindMethods(this);
  }

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen((location) => {
      const teamId = location.pathname.substring('/team@'.length);
      this._loadTeamIfNecessary(teamId);
    });

    this._loadTeams();
  }

  componentWillUnmount() {
    this.unlisten(); // unlisten to route change events
    fetcher.cancelAll();
  }

  _loadTeams = (keyword = '') => {
    const { match } = this.props;
    fetcher
      .get(`teams?search=${keyword}`)
      .then((response) => {
        if (match.params.id) {
          this._loadTeam(response.data, match.params.id);
        }
        return this.setState({ teams: response.data });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  };

  /**
   * Called when route is changed.
   * Loads `team` state if `teamId` is truthy for editing purpose.
   * @param teamId
   * @private
   */
  _loadTeamIfNecessary(teamId) {
    const { teams } = this.state;
    if (teams.length && teamId) {
      this._loadTeam(teams, teamId);
    } else {
      this.setState(cloneDeep(Team.initialValues));
    }
  }

  _loadTeam(teams, teamId) {
    const team = teams.find((_team) => _team._id === teamId);
    if (team) {
      this.setState({
        team, ...cloneDeep(Team.initialValidationFeedback),
      });
    }
  }

  _createTeam() {
    const { team } = this.state;

    return fetcher
      .post('teams', { ...team })
      .then((response) => this.setState((prevState) => ({
        ...prevState,
        teams: prevState.teams.concat(response.data.team),
        message: response.data.message,
        ...cloneDeep(Team.initialValues),
      })));
  }

  _updateTeam() {
    const { team } = this.state;
    const postData = { ...team };

    return fetcher
      .put(`teams/${team._id}`, postData)
      .then((response) => this.setState((prevState) => {
        const teams = [...prevState.teams];
        const teamIndex = teams.findIndex((_team) => _team._id === team._id);
        if (teamIndex !== -1) {
          teams[teamIndex] = response.data.team;
        }

        return {
          ...prevState,
          teams,
          isValid: {
            name: null,
            shortName: null,
          },
          feedback: {
            name: null,
            shortName: null,
          },
          message: response.data.message,
        };
      }));
  }

  render() {
    const {
      teams, team, players, isValid, feedback, message, redirected, showErrorModal,
    } = this.state;
    const { match } = this.props;
    const teamId = match.params.id;
    return (
      <div className="container-fluid px-0">

        <Notification message={message} toggle={() => this.setState({ message: null })} />

        <div className="row">
          <TeamSidebar
            editable
            teamId={teamId}
            teams={teams}
            onFilter={this._loadTeams}
          />
          <main className="col pt-3 pt-sm-0">
            <CenterContent col="col-lg-8 col-md-10">
              {redirected && (
                <Alert color="primary">
                  <p className="lead mb-0">You need at least 2 teams to create a match.</p>
                </Alert>
              )}

              <TeamForm
                players={players}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                team={team}
                isValid={isValid}
                feedback={feedback}
              />
            </CenterContent>
          </main>
        </div>

        <ErrorModal
          isOpen={showErrorModal}
          close={() => this.setState({ showErrorModal: false })}
        />

      </div>
    );
  }
}

Team.propTypes = {
  ...Location,
  match: MatchParamId,
};

export default Team;
