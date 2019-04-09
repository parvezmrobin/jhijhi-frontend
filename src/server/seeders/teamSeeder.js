/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


const Team = require("../models/team");
const User = require("../models/user");


module.exports = function () {
  const teams = [
    {name: 'Dhaka Gladiators', shortName: 'DG'},
    {name: 'Khulna Titans', shortName: 'KT'},
    {name: 'CricPlatoon CC', shortName: 'CCC'},
  ];

  return User.find({})
    .then(users => {
      const creatorWiseTeams = users.map(
        creator => teams.map(team => ({...team, creator: creator._id})),
      );
      const teamsWithCreators = [].concat(...creatorWiseTeams);
      return Team.insertMany(teamsWithCreators);
    })
};
