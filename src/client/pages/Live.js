/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component } from 'react';
import $ from 'jquery';
import PreMatch from '../components/PreMatch';
import fetcher from '../lib/fetcher';
import { bindMethods } from '../lib/utils';
import Toss from '../components/Toss';
import { Running } from '../components/Running';

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: {
        state: 'loading',
      },
    };

    bindMethods(this);
  }

  handlers = {
    onStateChange(params) {
      this.setState(prevState => {
        return { match: { ...prevState.match, ...params } };
      });
      console.log(params);
    },
  };


  componentDidMount() {
    $('[title]')
      .tooltip();
    fetcher
      .get(`matches/${this.props.match.params.id}`)
      .then(response => {
        this.setState({ match: response.data });
      });
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
        {match.state === 'running' &&
        <Running name={match.name} players={match.team1Players} team1={match.team1} team2={match.team2}
                 team1WonToss={match.team1WonToss} team1BatFirst={match.team1BatFirst}/>}
      </div>
    );
  }

}

export default Live;
