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
        return {match: {...prevState.match, ...params}}
      });
      console.log(params);
    },
  };


  componentDidMount() {
    $('[title]').tooltip();
    fetcher
      .get(`matches/${this.props.match.params.id}`)
      .then(response => {
        this.setState({match: response.data});
      });
  }

  render() {
    return (
      <div className="container-fluid pl-0 pr-1">
        {!this.state.match.state &&
        <PreMatch team1={this.state.match.team1} team2={this.state.match.team2} name={this.state.match.name}
                  matchId={this.props.match.params.id} onMatchBegin={this.onStateChange}/>}
        {this.state.match.state === "toss" && <Toss teams={[this.state.match.team1, this.state.match.team2]}
                                              name={this.state.match.name}
                                              matchId={this.props.match.params.id} onToss={this.onStateChange}/>}
        {this.state.match.state === "running" &&
        <Running players={this.state.match.team1Players}/>}
      </div>
    );
  }

}

export default Live;
