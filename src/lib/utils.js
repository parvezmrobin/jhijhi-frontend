/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


/**
 * Changes a string to title case
 * @param str
 * @param [delimiter]
 * @return {string}
 */
export function toTitleCase(str, delimiter = '-') {
  if (typeof str !== 'string') {
    return str;
  }
  return str
    .split(delimiter)
    .map(word => word[0].toUpperCase() + word.substr(1)
      .toLowerCase())
    .join(' ');
}

/**
 * Prevents access to property of undefined
 * by changing undefined variable by {}
 * @param object
 * @returns {*}
 */
export function optional(object) {
  return object || {};
}

/**
 * Binds all methods of `object.property` to `object`
 * @param {Object} object - the object to which methods will be bound
 * @param {String} property - propertyName that contains the methods to be bound
 */
export function bindMethods(object, property = 'handlers') {
  for (const methodName in object[property]) {
    if (object[property].hasOwnProperty(methodName)) {
      if (typeof object[property][methodName] !== 'function') {
        continue;
      }
      object[methodName] = object[property][methodName].bind(object);
    }
  }
}

/**
 * Subtract subtrahend from from
 * @param {Array} from
 * @param {Array} subtrahend
 * @param {Function} [matcher]
 */
export function subtract(from, subtrahend, matcher = ((el1, el2) => el1 === el2)) {
  return from.filter(el1 => {
    for (const el2 of subtrahend) {
      if (matcher(el1, el2)) {
        return false;
      }
    }
    return true;
  });
}

export function ordinal(number) {
  if (number < 1) {
    return 'th';
  }
  if (number === 11) {
    return 'th';
  }
  if (number === 12) {
    return 'th';
  }
  if (number % 10 === 1) {
    return 'st';
  }
  if (number % 10 === 2) {
    return 'nd';
  }
  return 'th';
}

export const formatValidationFeedback = err => {
  if (err.response.status !== 400) {
    throw err;
  }

  const isValid = {};
  const feedback = {};
  for (const error of err.response.data.err) {
    if (isValid[error.param] === undefined) {
      isValid[error.param] = false;
    }
    if (!feedback[error.param]) {
      feedback[error.param] = error.msg;
    }
  }
  return { isValid, feedback };
};

/**
 * Copy sharable link of a match to clipboard
 * @param matchId
 */
export function copySharableLink(matchId) {
  const url = `${window.location.origin}#/public@${matchId}`;
  const el = document.createElement('textarea');
  el.value = url;
  el.setAttribute('readonly', '');
  el.style.display = null;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export function logout() {
  window.localStorage.removeItem('token');
  window.location.hash = 'login';
  window.location.reload();
}

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
