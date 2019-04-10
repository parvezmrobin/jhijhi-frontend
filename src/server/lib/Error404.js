/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 10, 2019
 */


const Error404 = function (error) {
  this.error = Array.isArray(error)? error: [error];
  this.code = 404;
};

module.exports = Error404;
