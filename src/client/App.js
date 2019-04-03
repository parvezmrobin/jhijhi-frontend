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

        <Route path="/" exact component={Home}/>
        <Route path="/contact" component={Contact} />
        <Route path="/register" component={Registration} />
        <Route path="/login" component={Login}/>
      </Router>
    );
  }
}

export default App;
