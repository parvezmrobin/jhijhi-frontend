/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import TeamForm from '../components/TeamForm';
import fetcher from '../lib/fetcher';
import { bindMethods, formatValidationFeedback } from '../lib/utils';
import cloneDeep from 'lodash/cloneDeep';
import { Alert } from 'reactstrap';
import ErrorModal from '../components/ErrorModal';
import Notification from "../components/Notification";
import TeamSidebar from "../components/TeamSidebar";


class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...cloneDeep(Team.initialValues),
      teams: [],
      message: null,
      showErrorModal: false,
      redirected: this.props.location.search.startsWith('?redirected=1'),
    };
    bindMethods(this);
  }

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
      this.setState(prevState => {
        return { team: { ...prevState.team, ...newValues } };
      });
    },

    onSubmit() {
      let submission;
      if (this.state.team._id) {
        submission = this._updateTeam();
      } else {
        submission = this._createTeam();
      }

      submission
        .catch(err => {
          const { isValid, feedback } = formatValidationFeedback(err);

          this.setState({
            isValid,
            feedback,
          });
        })
        .catch(() => this.setState({ showErrorModal: true }));
    },
  };

  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      const teamId = location.pathname.substr("/team@".length);
      this._loadTeamIfNecessary(teamId);
    });

    this._loadTeams();
  }

  _loadTeams = (keyword = '') => {
    fetcher
      .get(`teams?search=${keyword}`)
      .then(response => {
        if (this.props.match.params.id) {
          this._loadTeam(response.data, this.props.match.params.id);
        }
        return this.setState({ teams: response.data });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  };

  componentWillUnmount() {
    this.unlisten(); // unlisten to route change events
    fetcher.cancelAll();
  }

  /**
   * Called when route is changed.
   * Loads `team` state if `teamId` is truthy for editing purpose.
   * @param teamId
   * @private
   */
  _loadTeamIfNecessary(teamId) {
    const teams = this.state.teams;
    if (teams.length && teamId) {
      this._loadTeam(teams, teamId);
    } else {
      this.setState(cloneDeep(Team.initialValues));
    }
  }

  _loadTeam(teams, teamId) {
    const team = teams.find(_team => _team._id === teamId);
    team && this.setState({
      team: team, ...cloneDeep(Team.initialValidationFeedback),
    });
  }

  _createTeam() {
    const postData = { ...this.state.team };

    return fetcher
      .post('teams', postData)
      .then(response => {
        return this.setState(prevState => ({
          ...prevState,
          teams: prevState.teams.concat(response.data.team),
          message: response.data.message,
          ...cloneDeep(Team.initialValues),
        }));
      });
  }

  _updateTeam() {
    const { team } = this.state;
    const postData = { ...team };

    return fetcher
      .put(`teams/${team._id}`, postData)
      .then(response => {
        return this.setState(prevState => {
          const teamIndex = prevState.teams.findIndex(_team => _team._id === team._id);
          if (teamIndex !== -1) {
            prevState.teams[teamIndex] = response.data.team;
          }

          return {
            ...prevState,
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
        });
      });
  }

  render() {
    const message = this.state.message;
    const teamId = this.props.match.params.id;
    return (
      <div className="container-fluid px-0">

        <Notification message={message} toggle={() => this.setState({ message: null })}/>

        <div className="row">
          <TeamSidebar editable teamId={teamId} teams={this.state.teams} onFilter={this._loadTeams}/>
          <main className="col pt-3 pt-sm-0">
            <CenterContent col="col-lg-8 col-md-10">
              {this.state.redirected && <Alert color="primary">
                <p className="lead mb-0">You need at least 2 teams to create a match.</p>
              </Alert>}

              <TeamForm players={this.state.players} onChange={this.onChange}
                        onSubmit={this.onSubmit}
                        team={this.state.team}
                        isValid={this.state.isValid} feedback={this.state.feedback}/>
            </CenterContent>
          </main>
        </div>

        <ErrorModal isOpen={this.state.showErrorModal} close={() => this.setState({ showErrorModal: false })}/>

      </div>
    );
  }

}

export default Team;
