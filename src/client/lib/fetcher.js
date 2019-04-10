/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


import * as axios from "axios/index";

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
fetcher.put = (...args) => fetcher.baseAxios.put(...args);
fetcher.delete = (...args) => fetcher.baseAxios.delete(...args);

export default fetcher;
