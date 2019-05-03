/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import TeamForm from '../components/TeamForm';
import fetcher from "../lib/fetcher";
import {bindMethods} from "../lib/utils";
import {Toast, ToastBody, ToastHeader} from "reactstrap";


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
        return {team: {...prevState.team, ...action}};
      });
    },

    onSubmit() {
      const postData = {...this.state.team};

      fetcher
        .post('teams', postData)
        .then(response => {
          this.setState(prevState => ({
            ...prevState,
            teams: prevState.teams.concat({
              ...prevState.team,
              _id: response.data.team._id,
            }),
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
          const isValid = {
            name: true,
            shortName: true,
          };
          const feedback = {
            name: null,
            shortName: null,
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

  componentDidMount() {
    fetcher
      .get('teams')
      .then(response => {
        this.setState({teams: response.data})
      });
  }

  render() {
    const message = this.state.message;
    return (
      <div className="container-fluid px-0">

        <Toast isOpen={!!message}>
          <ToastHeader icon="primary" toggle={() => this.setState({message: null})}>
            Jhijhi
          </ToastHeader>
          <ToastBody>
            {message}
          </ToastBody>
        </Toast>

        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Existing Teams"
                itemClass="text-white"
                itemMapper={(team) => `${team.name} (${team.shortName})`}
                list={this.state.teams}/>
            </CenterContent>
          </aside>
          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              <TeamForm players={this.state.players} onChange={this.onChange} onSubmit={this.onSubmit}
                        team={this.state.team}
                        isValid={this.state.isValid} feedback={this.state.feedback}/>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Team;
