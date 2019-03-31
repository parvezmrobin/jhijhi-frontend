/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Navbar from './components/Navbar';


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

        <Route path="/registration/" component={Registration} />
        <Route path="/login/" component={Login}/>
      </Router>
    );
  }
}

export default App;
