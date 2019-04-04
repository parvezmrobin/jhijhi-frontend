/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Team from './pages/Team';
import Player from "./pages/Player";
import Umpire from "./pages/Umpire";
import Match from "./pages/Match";
import {toTitleCase} from "./lib/utils";
import Live from "./pages/Live";


class App extends Component {
  state = {
    username: null,
  };

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({username: toTitleCase(users[0].username)}));
  }

  render() {
    const {username} = this.state;
    return (
      <Router>
        <Navbar username={username}/>

        <div className="container-fluid">

          <div className="row">
            <div className="col">
              <Route path="/" exact component={Home}/>
              <Route path="/contact" component={Contact}/>
              <Route path="/register" component={Registration}/>
              <Route path="/login" component={Login}/>

              <Route path="/team" component={Team}/>
              <Route path="/player" component={Player}/>
              <Route path="/umpire" component={Umpire}/>
              <Route path="/match" component={Match}/>
              <Route path="/live" component={Live}/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
