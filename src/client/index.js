/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './scss/App.scss';
import 'bootstrap';
import Loading from './pages/Loading';
// import * as serviceWorker from './serviceWorker';

const App = React.lazy(() => import(/* webpackChunkName: "App" */ './App'));

ReactDOM.render(<Suspense fallback={Loading}><App /></Suspense>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
