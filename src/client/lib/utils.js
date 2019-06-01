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
    return `${number}th`;
  }
  if (number === 11) {
    return '11th';
  }
  if (number === 12) {
    return '12th';
  }
  if (number % 10 === 1) {
    return `${number}st`;
  }
  if (number % 10 === 2) {
    return `${number}nd`;
  }
  return `${number}th`;
}

export function logout() {
  window.localStorage.removeItem('token');
  window.location.pathname = 'login';
}
