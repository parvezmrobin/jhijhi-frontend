import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import "./assets/scss/material-kit-react.scss?v=1.8.0";

// pages for this product
import Components from "./views/Components/Components.js";
// import LandingPage from "./views/LandingPage/LandingPage.js";
// import ProfilePage from "./views/ProfilePage/ProfilePage.js";
// import LoginPage from "./views/LoginPage/LoginPage.js";


const App2 = () => (<Router>
  <Switch>
    {/*<Route path="/landing-page" component={LandingPage} />*/}
    {/*<Route path="/profile-page" component={ProfilePage} />*/}
    {/*<Route path="/login-page" component={LoginPage} />*/}
    <Route path="/components" component={Components} />
  </Switch>
</Router>);

export default App2;
