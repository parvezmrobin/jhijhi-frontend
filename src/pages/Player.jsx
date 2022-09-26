/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import CenterContent from '../components/layouts/CenterContent';
import PlayerForm from '../components/player/PlayerForm';
import fetcher from '../lib/fetcher';
import { bindMethods, formatValidationFeedback } from '../lib/utils';
import PlayerSidebar from '../components/player/PlayerSidebar';
import ErrorModal from '../components/modal/ErrorModal';
import Notification from '../components/Notification';

class Player extends Component {
  handlers = {
    onSubmit() {
      const { player } = this.state;
      let submission;
      if (player._id) {
        submission = this._updatePlayer();
      } else {
        submission = this._createPlayer();
      }

      submission
        .catch((err) => {
          const { isValid, feedback } = formatValidationFeedback(err);

          this.setState({
            isValid,
            feedback,
          });
        })
        .catch(() => this.setState({ showErrorModal: true }));
    },

    onChange(newValues) {
      this.setState((prevState) => ({ player: { ...prevState.player, ...newValues } }));
    },
  };

  constructor(props) {
    super(props);
    const { location } = this.props;
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
      redirected: location.search.startsWith('?redirected=1'),
    };

    bindMethods(this);
  }

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen((location) => {
      const playerId = location.pathname.substring(8);
      this._loadPlayerIfNecessary(playerId);
    });

    this._loadPlayers();
  }

  componentWillUnmount() {
    this.unlisten();
    fetcher.cancelAll();
  }

  _loadPlayers = (keyword = '') => {
    fetcher.get(`players?search=${keyword}`)
      .then((response) => {
        const { match } = this.props;
        if (match.params.id) {
          this._loadPlayer(response.data, match.params.id);
        }
        return this.setState({ players: response.data });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  };


  _loadPlayerIfNecessary(playerId) {
    const { players } = this.state;
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
    const player = players.find((_player) => _player._id === playerId);

    if (player) {
      this.setState({ player });
    }
  }

  async _createPlayer() {
    const { player } = this.state;
    const postData = { ...player };

    try {
      const response = await fetcher
        .post('players', postData);
      this.setState((prevState) => ({
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
    } catch (e) {
      if (e.response) {
        const serverErrors = e.response.data.err;

        const { feedback, isValid } = this.state;
        const newFeedback = { ...feedback };
        const newIsValid = { ...isValid };
        for (const serverError of serverErrors) {
          newFeedback[serverError.param] = serverError.msg;
          newIsValid[serverError.param] = false;
        }

        this.setState((prevState) => ({
          ...prevState, isValid: newIsValid, feedback: newFeedback,
        }));
      }
    }
  }

  _updatePlayer() {
    const { player } = this.state;
    const postData = {
      name: player.name,
      jerseyNo: player.jerseyNo,
    };

    return fetcher
      .put(`players/${player._id}`, postData)
      .then((response) => this.setState((prevState) => {
        const { players } = prevState;
        const playerIndex = players.findIndex((_player) => _player._id === player._id);
        if (playerIndex !== -1) {
          players[playerIndex] = response.data.player;
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
      }));
  }

  render() {
    const { match } = this.props;
    const playerId = match.params.id;

    const {
      players, message, redirected, player, isValid, feedback, showErrorModal,
    } = this.state;
    return (
      <div className="container-fluid px-0">
        <Notification message={message} toggle={() => this.setState({ message: null })} />

        <div className="row">
          <PlayerSidebar
            editable
            playerId={playerId}
            players={players}
            onFilter={this._loadPlayers}
          />
          <main className="col pt-3 pt-sm-0">
            <CenterContent col="col-lg-8 col-md-10">
              {redirected && (
              <Alert color="primary">
                <p className="lead mb-0">
                  You need at least 4 players to start a match.
                </p>
              </Alert>
              )}
              <PlayerForm
                values={player}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                isValid={isValid}
                feedback={feedback}
              />
            </CenterContent>
          </main>
        </div>
        <ErrorModal
          isOpen={showErrorModal}
          close={() => this.setState({ showErrorModal: false })}
        />
      </div>
    );
  }
}

Player.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    listen: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string }).isRequired,
  }).isRequired,
};

export default Player;
