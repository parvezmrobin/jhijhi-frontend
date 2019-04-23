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
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
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
export function bindMethods(object, property = "handlers") {
  for (const methodName in object[property]) {
    if (object[property].hasOwnProperty(methodName)) {
      if (typeof object[property][methodName] !== "function") {
        continue;
      }
      object[methodName] = object[property][methodName].bind(object);
    }
  }
}

/**
 * Subtract array2 from array1
 * @param array1
 * @param array2
 * @param matcher
 */
export function subtract(array1, array2, matcher = ((el1, el2) => el1 === el2)) {
  return array1.filter(el1 => {
    for (const el2 of array2) {
      if (matcher(el1, el2)) {
        return false;
      }
    }
    return true;
  })
}

export function logout() {
  window.localStorage.removeItem('token');
  window.location.pathname = 'login';
}
