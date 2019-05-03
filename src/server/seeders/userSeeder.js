/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


const User = require("../models/user");
const {hashSync} = require("bcrypt");


module.exports = function () {
  const users = [
    {username: 'robin', password: hashSync('robin', 10)},
    {username: 'mim', password: hashSync('mim', 10)},
    {username: 'oishie', password: hashSync('oishie', 10)},
    {username: 'geshnu', password: hashSync('geshnu', 10)},
    {username: 'pacada', password: hashSync('pacada', 10)},
  ];

  return User.insertMany(users);
};
