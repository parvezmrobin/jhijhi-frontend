/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


const Team = require('../models/team');
const User = require('../models/user');
const Player = require('../models/player');
const Match = require('../models/match');

const chooseTeams = function (teams) {
  const team1Index = Math.floor(Math.random() * teams.length);
  let team2Index = team1Index;
  while (team1Index === team2Index) {
    team2Index = Math.floor(Math.random() * teams.length);
  }

  return [teams[team1Index]._id, teams[team2Index]._id];
};

const dividePlayers = function (players) {
  const team1Players = [];
  const team2Players = [];
  for (let i = 0; i < players.length; i++) {
    if (Math.random() < .5) {
      team1Players.push(players[i]._id);
    } else {
      team2Players.push(players[i]._id);
    }
  }

  return [team1Players, team2Players];
};


module.exports = async function () {
  const matches = [{
    name: 'Running Match',
    state: 'running',
    team1WonToss: Math.random() < .5,
    team1BatFirst: Math.random() < .5,
  }, {
    name: 'On Toss Match',
    state: 'toss',
    team1WonToss: Math.random() < .5,
    team1BatFirst: Math.random() < .5,
  }, {
    name: 'To Begin Match',
    state: '',
    team1WonToss: Math.random() < .5,
    team1BatFirst: Math.random() < .5,
  }];

  const users = await User.find({});
  const creatorWiseMatchPromises = users.map(
    async creator => {
      const players = await Player.find({ creator: creator._id }, '_id');
      const teams = await Team.find({ creator: creator._id }, '_id');

      return matches.map(match => {
        [match.team1, match.team2] = chooseTeams(teams);
        [match.team1Players, match.team2Players] = dividePlayers(players);
        match.team1Captain = match.team1Players[0];
        match.team2Captain = match.team2Players[0];
        match.creator = creator._id;

        return match;
      });
    },
  );

  const matchWithCreatorPromises = [].concat(...creatorWiseMatchPromises);
  const matchWithCreators = await Promise.all(matchWithCreatorPromises);
  const flattenedMatches = [].concat(...matchWithCreators);
  console.log(flattenedMatches[0]);

  return Match.insertMany(flattenedMatches);
};
