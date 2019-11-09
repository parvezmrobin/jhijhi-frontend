/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';
import PreMatch from '../components/PreMatch';
import fetcher from '../lib/fetcher';
import { bindMethods } from '../lib/utils';
import Toss from '../components/Toss';
import { Running } from '../components/Running';
import { Redirect } from 'react-router-dom';
import ErrorModal from "../components/modal/ErrorModal";

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: {
        state: 'loading',
      },
      showErrorModal: false,
    };

    bindMethods(this);
  }

  handlers = {
    onStateChange(params) {
      this.setState(prevState => {
        return { match: { ...prevState.match, ...params } };
      });
    },
  };


  componentDidMount() {
    return fetcher
      .get(`matches/${this.props.match.params.id}`)
      .then(response => {
        return this.setState({ match: response.data });
      })
      .catch(() => this.setState({showErrorModal: true}));
  }


  componentWillUnmount() {
    fetcher.cancelAll();
  }


  render() {
    const { match } = this.state;
    return (
      <div className="container-fluid px-0">
        {!match.state && <PreMatch team1={match.team1} team2={match.team2} name={match.name}
                                   matchId={this.props.match.params.id}
                                   onMatchBegin={this.onStateChange}/>}

        {match.state === 'toss' &&
        <Toss teams={[match.team1, match.team2]} name={match.name}
              matchId={this.props.match.params.id} onToss={this.onStateChange}/>}

        {((match.state === 'innings1') || (match.state === 'innings2')) &&
        <Running match={match}/>}

        {(match.state === 'done') && <Redirect to={`/history@${match._id}`}/>}

        <ErrorModal isOpen={this.state.showErrorModal} close={() => this.setState({ showErrorModal: false })}/>
      </div>
    );
  }

}

export default Live;
