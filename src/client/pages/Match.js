/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import MatchForm from "../components/MatchForm";
import {bindMethods} from "../lib/utils";
import fetcher from "../lib/fetcher";
import {Toast, ToastBody, ToastHeader} from "reactstrap";
import {Link} from "react-router-dom";


class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: {
        name: '',
        team1: '',
        team2: '',
        umpire1: '',
        umpire2: '',
        umpire3: '',
        overs: '',
      },
      teams: [],
      matches: [],
      umpires: [],
      isValid: {
        name: null,
        team1: null,
        team2: null,
        overs: '',
      },
      feedback: {
        name: null,
        team1: null,
        team2: null,
        overs: '',
      },
      message: null,
    };
    bindMethods(this);
  }

  handlers = {
    onChange(action) {
      this.setState(prevState => {
        return {match: {...prevState.match, ...action}};
      });
    },

    onSubmit() {
      // clone necessary data from `this.state`
      const postData = {...this.state.match};

      fetcher
        .post('matches', postData)
        .then((response) => {
          this.setState(prevState => ({
            ...prevState,
            match: {
              name: '',
              team1: '',
              team2: '',
              umpire1: '',
              umpire2: '',
              umpire3: '',
              overs: '',
            },
            matches: prevState.matches.concat({...prevState.match, _id: response.data.match._id}),
            isValid: {
              name: null,
              team1: null,
              team2: null,
              overs: null,
            },
            feedback: {
              name: null,
              team1: null,
              team2: null,
              overs: null,
            },
            message: response.data.message,
          }));
        })
        .catch(err => {
          const isValid = {
            name: true,
            team1: true,
            team2: true,
            overs: true,
          };
          const feedback = {
            name: null,
            team1: null,
            team2: null,
            overs: null,
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
        this.setState({
          teams: [{_id: null, name: 'None'}].concat(response.data),
        });
      });
    fetcher
      .get('umpires')
      .then(response => {
        this.setState({
          umpires: [{_id: null, name: 'None'}].concat(response.data),
        });
      });
    fetcher
      .get('matches')
      .then(response => {
        this.setState({matches: response.data})
      });
  }

  render() {
    return (
      <div className="container-fluid pl-0">
        <Toast isOpen={!!this.state.message}>
          <ToastHeader icon="primary" toggle={() => this.setState({ message: null })}>
            Jhijhi
          </ToastHeader>
          <ToastBody>
            {this.state.message}
          </ToastBody>
        </Toast>
        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Upcoming Matches"
                itemClass="text-white"
                itemMapper={(match) => <Link className="text-info" to={`live/${match._id}`}>{match.name}</Link>}
                list={this.state.matches}/>
            </CenterContent>
          </aside>
          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              <MatchForm teams={this.state.teams} umpires={this.state.umpires}
                         values={this.state.match}
                         onChange={this.onChange} onSubmit={this.onSubmit}
                         isValid={this.state.isValid} feedback={this.state.feedback}/>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Match;
