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
export function toTitleCase(str, delimiter='-') {
  return str
    .split(delimiter)
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
    .join(' ');
}
