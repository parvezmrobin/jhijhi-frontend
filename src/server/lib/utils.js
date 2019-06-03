/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 10, 2019
 */

/**
 * @param response
 * @param err
 * @param [err.statusCode]
 * @param [err.status]
 * @param [err.error]
 * @param [err.errors]
 * @param message
 * @param suppressError
 */
module.exports.sendErrorResponse = function (response, err, message, suppressError = false) {
  console.log(err);

  response.status(err.statusCode || err.status || 500);
  const errorDescription = {
    success: false,
    message: message,
  };
  if (!suppressError) {
    errorDescription.err = err.error || err.errors || err;
  }
  response.json(errorDescription);
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
      if (params[key] === '' || params[key] === undefined) {
        params[key] = null;
      }
    }
  }
  return params;
};

/**
 * @param {String} str
 * @param {Boolean} smallCase
 * @return {String}
 */
module.exports.namify = function (str, smallCase = false) {
  return str.split(' ')
    .filter(s => s)
    .map(s => {
      const fistLetter = s[0].toUpperCase();
      let rest = s.substr(1);
      if (smallCase) {
        rest = rest.toLowerCase();
      }
      return fistLetter + rest;
    })
    .join(' ');
};

module.exports.isSameName = function (str1, str2) {
  const namify = module.exports.namify;
  return namify(str1, true) === module.exports.namify(str2, true);
};
