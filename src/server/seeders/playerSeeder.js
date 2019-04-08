/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


const Player = require("../models/player");


module.exports = function () {
  const players = [
    {name: 'robin', jerseyNo: 4},
    {name: 'geshnu', jerseyNo: 5},
    {name: 'pacada', jerseyNo: 6},
    {name: 'akib', jerseyNo: 7},
    {name: 'mati', jerseyNo: 8},
    {name: 'dibyo', jerseyNo: 9},
    {name: 'tanin', jerseyNo: 1},
    {name: 'purnam', jerseyNo: 420},
    {name: 'sahad', jerseyNo: 12},
    {name: 'buira', jerseyNo: 2},
  ];

  return Player.insertMany(players);
};
