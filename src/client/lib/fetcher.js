/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


import * as axios from "axios";

const fetcher = {
  get token() {
    return window.localStorage.getItem('token');
  },
  get isLoggedIn() {
    return !!this.token;
  },
};

fetcher.baseAxios = axios.create({
  baseURL: '/api/',
  headers: {Authorization: `Bearer ${fetcher.token}`},
});

fetcher.get = (...args) => fetcher.baseAxios.get(...args);
fetcher.post = (...args) => fetcher.baseAxios.post(...args);

export default fetcher;
