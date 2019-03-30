import React, { Component } from 'react';
import './scss/App.scss';

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
      <div >
        <h2 className="vw-100 text-center text-primary mt-5 position-absolute">{username ? `Welcome, ${username}` : 'Loading...'}</h2>
        <main className="vh-100 d-flex align-items-center justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2>Register a new user</h2>
            <hr/>
            <form action="">
              <div className="form-group row">
                <label htmlFor="username" className="col-md-4 col-lg-2 col-form-label">
                  Username
                </label>
                <div className="col">
                  <input type="text" className="form-control" name="username" id="username"/>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="password" className="col-md-4 col-lg-2 col-form-label">
                  Password
                </label>
                <div className="col">
                  <input type="password" className="form-control" name="password" id="password"/>
                </div>
              </div>
              <div className="form-group row">
                <div className="offset-md-4 offset-lg-2 col">
                  <input type="submit" className="btn btn-outline-primary" value="Register"/>

                  <label className="col-form-label float-right">
                    Already Registered? <a href="/login">Login</a>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
