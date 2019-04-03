/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Sidebar from './components/sidebar';


class App extends Component {
  state = {
    username: null,
  };

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({ username: users[0].username }));
  }

  render() {
    const { username } = this.state;
    return (
      <Router>
        <Navbar username={username}/>

        <div className="container-fluid">
          <div className="row">
            <aside className="col-md-3 vh-100 bg-dark">
              <Sidebar/>
            </aside>
            <div className="col">
              <Route path="/" exact component={Home}/>
              <Route path="/contact" component={Contact}/>
              <Route path="/register" component={Registration}/>
              <Route path="/login" component={Login}/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
