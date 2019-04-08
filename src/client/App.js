/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Register from './pages/Register';
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
import fetcher from "./lib/fetcher";


class App extends Component {
  state = {
    username: null,
  };

  componentDidMount() {
    fetcher.get('users')
      .then(response => this.setState({username: toTitleCase(response.data[0].username)}));
  }

  render() {
    const {username} = this.state;
    return (
      <Router>
        <Navbar isLoggedIn={fetcher.isLoggedIn} username={username}/>

        <div className="container-fluid">

          <div className="row">
            <div className="col">
              <Route path="/" exact component={Home}/>
              <Route path="/contact" component={Contact}/>
              <Route path="/register" component={Register}/>
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
