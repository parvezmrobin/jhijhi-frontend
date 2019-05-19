/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component, Fragment } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import PlayerForm from '../components/PlayerForm';
import fetcher from '../lib/fetcher';
import { bindMethods, toTitleCase } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Alert, Toast, ToastBody, ToastHeader } from 'reactstrap';


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
      redirected: this.props.location.search.startsWith('?redirected=1'),
    };

    bindMethods(this);
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      const matchId = location.pathname.substr(9);
      this._loadPlayerIfNecessary(matchId);
    });

    fetcher.get('players')
      .then(response => {
        this.setState({ players: response.data });
        if (this.props.match.params.id) {
          this._loadPlayer(response.date);
        }
      });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  _loadPlayerIfNecessary() {
    const players = this.state.players;
    if (players.length && this.props.match.params.id) {
      this._loadPlayer(players);
    }
  }

  _loadPlayer(players) {
    const player = players.find(player => player._id === this.props.match.params.id);
    if (player) {
      this.setState({ player });
    }
  }

  createPlayer() {
    const postData = { ...this.state.player };

    return fetcher
      .post('players', postData)
      .then(response => {
        this.setState(prevState => ({
          ...prevState,
          players: prevState.players.concat({
            ...prevState.player,
            _id: response.data.player._id,
          }),
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

  updatePlayer() {
    const { player } = this.state;
    const postData = {
      name: player.name,
      jerseyNo: player.jerseyNo,
    };

    return fetcher
      .put(`players/${player._id}`, postData)
      .then(response => {
        this.setState(prevState => {
          const playerIndex = prevState.players.findIndex(_player => _player._id === player._id);
          if (playerIndex !== -1) {
            prevState.players[playerIndex] = prevState.player;
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
        submission = this.updatePlayer();
      } else {
        submission = this.createPlayer();
      }

      submission
        .catch(err => {
          const isValid = {
            name: true,
            jerseyNo: true,
          };
          const feedback = {
            name: null,
            jerseyNo: null,
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

    onChange(newValues) {
      this.setState(prevState => ({ player: { ...prevState.player, ...newValues } }));
    },
  };

  render() {
    const renderPlayer = player => {
      const playerText = `${toTitleCase(player.name)} (${player.jerseyNo})`;
      const editButton = <Link to={'player@' + player._id}
                               className="float-right"><kbd>Edit</kbd></Link>;
      return <Fragment>{playerText} {editButton}</Fragment>;
    };
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
                title="Existing Players"
                itemClass="text-white"
                itemMapper={renderPlayer}
                list={this.state.players}/>
            </CenterContent>
          </aside>
          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              {this.state.redirected && <Alert color="info">
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
      </div>
    );
  }

}

export default Player;
