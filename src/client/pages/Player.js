/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component, Fragment} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import PlayerForm from "../components/PlayerForm";
import fetcher from "../lib/fetcher";
import {bindMethods, toTitleCase} from "../lib/utils";
import {Link} from "react-router-dom";


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
    };

    bindMethods(this);
  }

  componentDidMount() {
    fetcher.get('players')
      .then(response => {
        this.setState({players: response.data});
      });
  }

  handlers = {
    onSubmit() {
      const postData = {...this.state.player};

      fetcher
        .post('players', postData)
        .then(response => {
          console.log(response.data);
        })
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

          this.setState({isValid, feedback});
        });
    },

    onChange(newValues) {
      this.setState(prevState => ({player: {...prevState.player, ...newValues}}));
    },
  };

  render() {
    const renderPlayer = player => {
      const playerText = `${toTitleCase(player.name)} (${player.jerseyNo})`;
      const editButton = <Link to={"player/edit/" + player._id} className="float-right"><kbd>Edit</kbd></Link>;
      return <Fragment>{playerText} {editButton}</Fragment>;
    };
    return (
      <div className="container-fluid pl-0">
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
              <PlayerForm values={this.state.player} onChange={this.onChange} onSubmit={this.onSubmit}
                          isValid={this.state.isValid} feedback={this.state.feedback}/>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Player;
