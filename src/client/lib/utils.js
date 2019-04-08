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
  return str
    .split(delimiter)
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
    .join(' ');
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

export function logout() {
  window.localStorage.removeItem('token');
  window.location.pathname = 'login';
}
