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
import TeamPlayers from './pages/Team/Players';
import Player from "./pages/Player";
import Umpire from "./pages/Umpire";
import Match from "./pages/Match";
import {toTitleCase} from "./lib/utils";
import Live from "./pages/Live";
import History from "./pages/History";
import fetcher from "./lib/fetcher";
import ErrorBoundary from "./ErrorBoundary";
import Kidding from './pages/Kidding';
import Password from './pages/Password';


class App extends Component {
  state = {
    username: null,
  };

  componentDidMount() {
    fetcher.get('auth/user')
      .then(response => this.setState({username: toTitleCase(response.data.username)}));
  }

  render() {
    const {username} = this.state;
    return (
      <Router>
        <Navbar isLoggedIn={fetcher.isLoggedIn} username={username}/>

        <div className="container-fluid">

          <div className="row">
            <div className="col">
              <ErrorBoundary>
                <Route path="/" exact component={Home}/>
                <Route path="/contact" component={Contact}/>
                <Route path="/register" component={Register}/>
                <Route path="/login" component={Login}/>

                <Route path="/player" component={Player}/>
                <Route path="/team" exact component={Team}/>
                <Route path="/team/:id" component={TeamPlayers}/>
                <Route path="/umpire" component={Umpire}/>
                <Route path="/match" component={Match}/>
                <Route path="/live@:id" component={Live}/>
                <Route path="/history@:id" component={History}/>
                <Route path="/kidding" component={Kidding}/>
                <Route path="/password" component={Password}/>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
