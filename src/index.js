/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */

import { Suspense, createElement, lazy as lazyLoad } from 'react';
import { render } from 'react-dom';
import Loading from './pages/Loading';
import * as serviceWorker from './registerServiceWorker';

const App = lazyLoad(() => import(/* webpackChunkName: "App" */ './App'));
const app = createElement(App);
const loading = createElement(Loading);
const suspense = createElement(Suspense, { fallback: loading }, app);
render(suspense, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
