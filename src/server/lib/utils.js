/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 10, 2019
 */


module.exports.sendErrorResponse = function (response, err, message) {
  response.status(err.statusCode || err.status || 500);
  response.json({
    success: false,
    message: message,
    err: err.error || err.errors || err,
  });
};

module.exports.send404Response = function (response, message) {
  response.status(404);
  response.json({
    success: false,
    message: message,
    err: [message],
  });
};

module.exports.nullEmptyValues = function (request, container = 'body') {
  const params = Object.assign({}, request[container]);
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      if (!params[key]) {
        params[key] = null;
      }
    }
  }
  return params;
};
