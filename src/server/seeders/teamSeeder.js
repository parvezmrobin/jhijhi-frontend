/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


const Team = require("../models/team");
const User = require("../models/user");

module.exports = async function () {
  const teams = [
    {name: 'Dhaka Gladiators', shortName: 'DG'},
    {name: 'Khulna Titans', shortName: 'KT'},
    {name: 'CricPlatoon CC', shortName: 'CCC'},
  ];

  const users = await User.find({});
  const creatorWiseTeamPromises = users.map(
    async creator => {

      return teams.map(team => {
        return ({...team, creator: creator._id});
      });
    },
  );
  const teamsWithCreatorPromises = [].concat(...creatorWiseTeamPromises);
  const teamsWithCreators = await Promise.all(teamsWithCreatorPromises);
  const flattenedTeams = [].concat(...teamsWithCreators);
  return Team.insertMany(flattenedTeams);
};
