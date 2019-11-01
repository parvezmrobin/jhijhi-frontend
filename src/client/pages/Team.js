/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import TeamForm from '../components/TeamForm';
import fetcher from '../lib/fetcher';
import { bindMethods, formatValidationFeedback } from '../lib/utils';
import { Alert } from 'reactstrap';
import debounce from 'lodash/debounce';
import ErrorModal from '../components/ErrorModal';
import Notification from "../components/Notification";


class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: {
        name: '',
        shortName: '',
      },
      teams: [],
      isValid: {
        name: null,
        shortName: null,
      },
      feedback: {
        name: null,
        shortName: null,
      },
      message: null,
      showErrorModal: false,
      redirected: this.props.location.search.startsWith('?redirected=1'),
    };
    bindMethods(this);
  }

  handlers = {
    /**
     * change event handler
     * @param action
     */
    onChange(action) {
      this.setState(prevState => {
        return { team: { ...prevState.team, ...action } };
      });
    },

    onSubmit() {
      const postData = { ...this.state.team };

      fetcher
        .post('teams', postData)
        .then(response => {
          return this.setState(prevState => ({
            ...prevState,
            teams: prevState.teams.concat(response.data.team),
            team: {
              name: '',
              shortName: '',
            },
            message: response.data.message,
            isValid: {
              name: null,
              shortName: null,
            },
            feedback: {
              name: null,
              shortName: null,
            },
          }));
        })
        .catch(err => {
          const { isValid, feedback } = formatValidationFeedback(err);

          this.setState({
            isValid,
            feedback,
          });
        });
    },
  };

  componentDidMount() {
    this._loadTeams();
  }

  _loadTeams = (keyword = '') => {
    fetcher
      .get(`teams?search=${keyword}`)
      .then(response => {
    return     this.setState({ teams: response.data });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  };

  componentWillUnmount() {
    fetcher.cancelAll();
  }

  render() {
    const message = this.state.message;
    return (
      <div className="container-fluid px-0">

        <Notification message={message} toggle={() => this.setState({ message: null })}/>

        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Existing Teams"
                itemClass="text-white"
                itemMapper={(team) => `${team.name} (${team.shortName})`}
                list={this.state.teams}
                onFilter={debounce(this._loadTeams, 1000)}/>
            </CenterContent>
          </aside>
          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              {this.state.redirected && <Alert color="primary">
                <p className="lead mb-0">
                  You need at least 2 teams to create a match.
                </p>
              </Alert>}
              <TeamForm players={this.state.players} onChange={this.onChange}
                        onSubmit={this.onSubmit}
                        team={this.state.team}
                        isValid={this.state.isValid} feedback={this.state.feedback}/>
            </CenterContent>
          </main>
        </div>
        <ErrorModal isOpen={this.state.showErrorModal}
                    close={() => this.setState({ showErrorModal: false })}/>
      </div>
    );
  }

}

export default Team;
