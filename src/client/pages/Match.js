/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import MatchForm from '../components/MatchForm';
import { bindMethods, formatValidationFeedback } from '../lib/utils';
import cloneDeep from "lodash/cloneDeep";
import fetcher from '../lib/fetcher';
import { Redirect } from 'react-router-dom';
import ErrorModal from '../components/ErrorModal';
import Notification from "../components/Notification";
import MatchSidebar from "../components/MatchSidebar";


class Match extends Component {
  static initialValidationFeedback = {
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
      overs: '',
    },
  };

  static initialValues = {
    match: {
      name: '',
      team1: '',
      team2: '',
      umpire1: '',
      umpire2: '',
      umpire3: '',
      overs: '',
      tags: [],
    },
    ...cloneDeep(Match.initialValidationFeedback),
  };

  constructor(props) {
    super(props);
    this.state = {
      ...cloneDeep(Match.initialValues),
      teams: null, // indicates that `teams` are not loaded yet
      matches: [],
      umpires: [],
      tags: [],
      message: null,
      showErrorModal: false,
      searchKeyword: '', // if `searchKeyword` is not empty, then matched tags will be shown
    };
    bindMethods(this);
  }

  handlers = {
    onChange(newValues) {
      this.setState(prevState => {
        return { match: { ...prevState.match, ...newValues } };
      });
    },

    onSubmit() {
      const submission = this.state.match._id ? this._updateMatch() : this._createMatch();
      submission
        .catch(err => {
          const { isValid, feedback } = formatValidationFeedback(err);

          this.setState({
            isValid,
            feedback,
          });
        })
        .catch(this.onError);
    },

    onError(_) {
      this.setState({ showErrorModal: true });
    },
  };

  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      const matchId = location.pathname.substr('/match@'.length);
      this._loadMatchIfNecessary(matchId);
    });

    this._loadMatches();

    this._loadAuxiliaryLists();
  }

  _loadAuxiliaryLists() {
    fetcher
      .get('teams')
      .then(response => {
        return this.setState({
          teams: [{
            _id: null,
            name: 'None',
          }].concat(response.data),
        });
      })
      .catch(this.onError);
    fetcher
      .get('umpires')
      .then(response => {
        return this.setState({
          umpires: [{
            _id: null,
            name: 'None',
          }].concat(response.data),
        });
      })
      .catch(this.onError);
    fetcher
      .get('matches/tags')
      .then(response => this.setState({ tags: response.data }))
      .catch(this.onError);
  }

  _loadMatches = (keyword = '') => {
    fetcher
      .get(`matches?search=${keyword}`)
      .then(response => {
        if (this.props.match.params.id) {
          this._loadMatch(response.data, this.props.match.params.id);
        }
        return this.setState({ matches: response.data, searchKeyword: keyword });
      })
      .catch(this.onError);
  };

  componentWillUnmount() {
    this.unlisten(); // unlisten to route change events
    fetcher.cancelAll();
  }

  /**
   * Called when route is changed.
   * Loads `match` state if `matchId` is truthy for editing purpose.
   * @param matchId
   * @private
   */
  _loadMatchIfNecessary(matchId) {
    const matches = this.state.matches;
    if (matches.length && matchId) {
      this._loadMatch(matches, matchId);
    } else {
      this.setState(cloneDeep(Match.initialValues));
    }
  }

  _loadMatch(matches, matchId) {
    const match = matches.find(_match => _match._id === matchId);
    match && this.setState({ match, ...cloneDeep(Match.initialValidationFeedback) });
  }

  _createMatch() {
    const postData = { ...this.state.match };

    return fetcher
      .post('matches', postData)
      .then((response) => {
        return this.setState(prevState => ({
          ...prevState,
          ...cloneDeep(Match.initialValues),
          matches: prevState.matches.concat({
            ...prevState.match,
            _id: response.data.match._id,
          }),
          tags: prevState.tags.concat(prevState.match.tags),
          message: response.data.message,
        }));
      });
  }

  _updateMatch() {
    const { match } = this.state;
    const postData = { ...match };

    return fetcher
      .put(`matches/${match._id}`, postData)
      .then(response => {
        return this.setState(prevState => {
          const matchIndex = prevState.matches.findIndex(_match => _match._id === match._id);
          if (matchIndex !== -1) {
            prevState.matches[matchIndex] = response.data.match;
          }

          return {
            ...prevState,
            ...cloneDeep(Match.initialValidationFeedback),
            message: response.data.message,
          };
        });
      });
  }

  render() {
    const { message, teams, searchKeyword, matches, match, tags, showErrorModal, umpires, isValid, feedback } = this.state;
    if (teams && teams.length < 2) { // if `teams` are loaded but has less than 2 teams
      return <Redirect to="/team?redirected=1"/>;
    }

    const matchId = this.props.match.params.id;

    return (
      <div className="container-fluid pl-0">
        <Notification message={message} toggle={() => this.setState({ message: null })}/>

        <div className="row">
          <MatchSidebar editable searchKeyword={searchKeyword} matchId={matchId} matches={matches}
                        onFilter={this._loadMatches}/>

          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              <MatchForm teams={teams || []} umpires={umpires} values={match} tags={tags}
                         onChange={this.onChange} onSubmit={this.onSubmit}
                         isValid={isValid} feedback={feedback}/>
            </CenterContent>
          </main>
        </div>

        <ErrorModal isOpen={showErrorModal} close={() => this.setState({ showErrorModal: false })}/>
      </div>
    );
  }

}

export default Match;
