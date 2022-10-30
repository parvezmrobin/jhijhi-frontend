/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */

import axios from 'axios';

const fetcher = {
  get token() {
    return window.localStorage.getItem('token');
  },
  get isLoggedIn() {
    return !!this.token;
  },
};

let cancelTokenSource = axios.CancelToken.source();

const baseAxios = axios.create({
  baseURL: `${process.env.SERVER_URL}/api/`,
  headers: { Authorization: `Bearer ${fetcher.token}` },
  cancelToken: cancelTokenSource.token,
});

fetcher.get = (url) => baseAxios.get(url);
fetcher.post = (url, data) => baseAxios.post(url, data);
fetcher.put = (url, data) => baseAxios.put(url, data);
fetcher.delete = (url, data) => baseAxios.delete(url, data);
fetcher.cancelAll = (cancelReason = 'unmount') => {
  cancelTokenSource.cancel(cancelReason);
  cancelTokenSource = axios.CancelToken.source();
  baseAxios.defaults.cancelToken = cancelTokenSource.token;
};

export default fetcher;
