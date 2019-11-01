/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import PlayerForm from '../components/PlayerForm';
import fetcher from '../lib/fetcher';
import { bindMethods, formatValidationFeedback } from '../lib/utils';
import { Alert } from 'reactstrap';
import PlayerSidebar from '../components/PlayerSidebar';
import ErrorModal from '../components/ErrorModal';
import Notification from "../components/Notification";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      player: {
        name: '',
        jerseyNo: '',
      },
      isValid: {
        name: null,
        jerseyNo: null,
      },
      feedback: {
        name: null,
        jerseyNo: null,
      },
      message: null,
      showErrorModal: false,
      redirected: this.props.location.search.startsWith('?redirected=1'),
    };

    bindMethods(this);
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      const playerId = location.pathname.substr(8);
      this._loadPlayerIfNecessary(playerId);
    });

    this._loadPlayers();
  }

  _loadPlayers = (keyword = '') => {
    fetcher.get(`players?search=${keyword}`)
      .then(response => {
        if (this.props.match.params.id) {
          this._loadPlayer(response.data, this.props.match.params.id);
        }
        return this.setState({ players: response.data });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  };

  componentWillUnmount() {
    this.unlisten();
    fetcher.cancelAll();
  }


  _loadPlayerIfNecessary(playerId) {
    const players = this.state.players;
    if (players.length && playerId) {
      this._loadPlayer(players, playerId);
    } else {
      this.setState({
        player: {
          name: '',
          jerseyNo: '',
        },
      });
    }
  }

  _loadPlayer(players, playerId) {
    const player = players.find(_player => _player._id === playerId);

    if (player) {
      this.setState({ player });
    }
  }

  _createPlayer() {
    const postData = { ...this.state.player };

    return fetcher
      .post('players', postData)
      .then(response => {
        return this.setState(prevState => ({
          ...prevState,
          players: prevState.players.concat(response.data.player),
          player: {
            name: '',
            jerseyNo: '',
          },
          isValid: {
            name: null,
            jerseyNo: null,
          },
          feedback: {
            name: null,
            jerseyNo: null,
          },
          message: response.data.message,
        }));
      });
  }

  _updatePlayer() {
    const { player } = this.state;
    const postData = {
      name: player.name,
      jerseyNo: player.jerseyNo,
    };

    return fetcher
      .put(`players/${player._id}`, postData)
      .then(response => {
        return this.setState(prevState => {
          const playerIndex = prevState.players.findIndex(_player => _player._id === player._id);
          if (playerIndex !== -1) {
            prevState.players[playerIndex] = response.data.player;
          }
          return {
            ...prevState,
            isValid: {
              name: null,
              jerseyNo: null,
            },
            feedback: {
              name: null,
              jerseyNo: null,
            },
            message: response.data.message,
          };
        });
      });
  }

  handlers = {
    onSubmit() {
      let submission;
      if (this.state.player._id) {
        submission = this._updatePlayer();
      } else {
        submission = this._createPlayer();
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

    onChange(newValues) {
      this.setState(prevState => ({ player: { ...prevState.player, ...newValues } }));
    },
  };

  render() {
    const playerId = this.props.match.params.id;
    return (
      <div className="container-fluid px-0">
        <Notification message={this.state.message} toggle={() => this.setState({ message: null })}/>

        <div className="row">
          <PlayerSidebar editable playerId={playerId} players={this.state.players}
                         onFilter={this._loadPlayers}/>
          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              {this.state.redirected && <Alert color="primary">
                <p className="lead mb-0">
                  You need at least 4 players to start a match.
                </p>
              </Alert>}
              <PlayerForm values={this.state.player} onChange={this.onChange}
                          onSubmit={this.onSubmit}
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

export default Player;
