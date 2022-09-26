/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */

import React, { Component } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { toTitleCase, logout } from './lib/utils';
import fetcher from './lib/fetcher';
import ErrorBoundary from './ErrorBoundary';
import './styles/App.scss';

import Navbar from './components/Navbar';

const Home = React.lazy(() =>
  import(/* webpackChunkName: "Home" */ './pages/Home')
);
const Register = React.lazy(() =>
  import(/* webpackChunkName: "Register" */ './pages/Register')
);
const Login = React.lazy(() =>
  import(/* webpackChunkName: "Login" */ './pages/Login')
);
const Contact = React.lazy(() =>
  import(/* webpackChunkName: "Contact" */ './pages/Contact')
);
const Team = React.lazy(() =>
  import(/* webpackChunkName: "Team" */ './pages/Team')
);
const Player = React.lazy(() =>
  import(/* webpackChunkName: "Player" */ './pages/Player')
);
const PlayerDetails = React.lazy(() =>
  import(/* webpackChunkName: "Player" */ './pages/PlayerDetails')
);
const Umpire = React.lazy(() =>
  import(/* webpackChunkName: "Umpire" */ './pages/Umpire')
);
const Match = React.lazy(() =>
  import(/* webpackChunkName: "Match" */ './pages/Match')
);
const Live = React.lazy(() =>
  import(/* webpackChunkName: "Live" */ './pages/Live')
);
const History = React.lazy(() =>
  import(/* webpackChunkName: "History" */ './pages/History')
);
const Kidding = React.lazy(() =>
  import(/* webpackChunkName: "ChangePassword" */ './pages/Kidding')
);
const Password = React.lazy(() =>
  import(/* webpackChunkName: "Password" */ './pages/Password')
);
const Public = React.lazy(() =>
  import(/* webpackChunkName: "Public" */ './pages/Public')
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
    };
  }

  componentDidMount() {
    if (fetcher.isLoggedIn) {
      fetcher
        .get('auth/user')
        .then((response) =>
          this.setState({ username: toTitleCase(response.data.username) })
        )
        .catch((err) => {
          if (err.response.status === 401) {
            logout();
          }
        });
    }
  }

  render() {
    const { username } = this.state;
    const shouldRedirect = !fetcher.isLoggedIn;

    return (
      <Router>
        <Navbar isLoggedIn={fetcher.isLoggedIn} username={username} />

        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <ErrorBoundary>
                <Switch>
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route path="/public@:id" component={Public} />
                  {shouldRedirect && (
                    <Redirect
                      to={`/login?redirect=${window.location.hash.substring(
                        1
                      )}`}
                    />
                  )}
                  <Route path="/" exact component={Home} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/player-stat@:id" component={PlayerDetails} />
                  <Route path="/player@:id" component={Player} />
                  <Route path="/player" component={Player} />
                  <Route path="/team@:id" component={Team} />
                  <Route path="/team" component={Team} />
                  <Route path="/umpire@:id" component={Umpire} />
                  <Route path="/umpire" component={Umpire} />
                  <Route path="/match@:id" component={Match} />
                  <Route path="/match" component={Match} />
                  <Route path="/live@:id" component={Live} />
                  <Route path="/history@:id" component={History} />
                  <Route path="/kidding" component={Kidding} />
                  <Route path="/password" component={Password} />
                </Switch>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
