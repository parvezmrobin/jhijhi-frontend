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
    name: 'Running Match 1',
    state: 'running',
    team1WonToss: Math.random() < .5,
    team1BatFirst: Math.random() < .5,
  }, {
    name: 'Running Match 2',
    state: 'running',
    team1WonToss: Math.random() < .5,
    team1BatFirst: Math.random() < .5,
  }, {
    name: 'On Toss Match 1',
    state: 'toss',
    team1WonToss: Math.random() < .5,
    team1BatFirst: Math.random() < .5,
  }, {
    name: 'On Toss Match 2',
    state: 'toss',
    team1WonToss: Math.random() < .5,
    team1BatFirst: Math.random() < .5,
  }, {
    name: 'To Begin Match 1',
    state: '',
    team1WonToss: Math.random() < .5,
    team1BatFirst: Math.random() < .5,
  }, {
    name: 'To Begin Match 2',
    state: '',
    team1WonToss: Math.random() < .5,
    team1BatFirst: Math.random() < .5,
  }];

  const lastOver = {
    bowledBy: 0,
    bowls: [{
      playedBy: 3,
      singles: 2,
    }, {
      playedBy: 3,
      singles: 3,
      by: 1,
    }, {
      playedBy: 3,
      legBy: 1,
      by: 1,
    }, {
      playedBy: 3,
      singles: 2,
      boundary: {
        run: 4,
        kind: 'by',
      },
    }, {
      playedBy: 3,
      singles: 2,
      by: 1,
      isNo: 'overStep',
    }, {
      playedBy: 4,
      boundary: {
        run: 6,
      },
    }, {
      playedBy: 4,
      isWide: true,
      by: 1,
    }, {
      playedBy: 3,
      singles: 1,
      isWicket: 'run out',
    }],
  };
  const secondOver = {
    bowledBy: 1,
    bowls: [{
      playedBy: 2,
      singles: 2,
    }, {
      playedBy: 2,
      singles: 3,
      by: 1,
    }, {
      playedBy: 2,
      legBy: 1,
      by: 1,
    }, {
      playedBy: 2,
      singles: 2,
      boundary: {
        run: 4,
        kind: 'by',
      },
    }, {
      playedBy: 2,
      boundary: {
        run: 6,
      },
    }, {
      playedBy: 0,
      isWicket: 'bold',
    }],
  };
  const firstOver = {
    bowledBy: 0,
    bowls: [{
      playedBy: 0,
    }, {
      playedBy: 0,
      by: 1,
    }, {
      playedBy: 1,
      isWicket: 'bold',
    }, {
      playedBy: 2,
      singles: 1,
      boundary: {
        run: 4,
        kind: 'by',
      },
    }, {
      playedBy: 0,
      boundary: {
        run: 6,
      },
    }, {
      playedBy: 0,
      isWicket: 'caught',
    }],
  };

  const users = await User.find({});
  const creatorWiseMatchPromises = users.map(
    creator => {
      const playersPromise = Player.find({ creator: creator._id }, '_id')
        .exec();
      const teamsPromise = Team.find({ creator: creator._id }, '_id')
        .exec();

      return Promise.all([playersPromise, teamsPromise])
        .then(([players, teams]) => {

          return matches.map(match => {
            [match.team1, match.team2] = chooseTeams(teams);
            [match.team1Players, match.team2Players] = dividePlayers(players);
            match.team1Captain = match.team1Players[0];
            match.team2Captain = match.team2Players[0];
            match.creator = creator._id;

            if (match.name.startsWith('Running')) {
              match.innings1 = { overs: [firstOver, secondOver, lastOver] };
            }

            return { ...match };
          });
        });
    },
  );

  const matchWithCreatorPromises = [].concat(...creatorWiseMatchPromises);
  const matchWithCreators = await Promise.all(matchWithCreatorPromises);
  const flattenedMatches = [].concat(...matchWithCreators);

  let createdMatches = [];
  try {
    createdMatches = await Match.insertMany(flattenedMatches);
  } catch (e) {
    console.log(e.errors.innings1);
  }
  return createdMatches;
};
