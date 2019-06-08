const express = require('express');

/**
 * User router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const Player = require('../models/player');
const Match = require('../models/match');
const responses = require('../responses');
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', { session: false });
const { check, validationResult } = require('express-validator/check');
const ObjectId = require('mongoose/lib/types/objectid');
const { send404Response } = require('../lib/utils');
const { namify, sendErrorResponse } = require('../lib/utils');


const playerCreateValidations = [
  check('name')
    .trim()
    .exists({ checkFalsy: true }),
  check('name')
    .custom((name, { req }) => {
      return Player
        .findOne({
          name: namify(name),
          creator: req.user._id,
        })
        .exec()
        .then(player => {
          return player ? Promise.reject('Player Name already taken.') : true;
        });
    }),
  check('jerseyNo', 'Jersey number should be between 0 to 999')
    .isInt({
      min: 0,
      max: 999,
    }),
  check('jerseyNo')
    .custom((jerseyNo, { req }) => {
      return Player
        .findOne({
          jerseyNo: jerseyNo,
          creator: req.user._id,
        })
        .exec()
        .then(player => {
          return player ? Promise.reject('This jersey is already taken.') : true;
        });
    }),
];
const playerEditValidations = [
  check('name')
    .trim()
    .exists({ checkFalsy: true })
    .custom((name, { req }) => {
      return Player.findOne({
        name: namify(name),
        creator: req.user._id,
      })
        .lean()
        .exec()
        .then(player => {
          if (player && player._id.toString() !== req.params.id) {
            throw new Error('Player Name already taken.');
          }
          return true;
        });
    }),
  check('jerseyNo', 'Jersey number should be between 1 to 999')
    .isInt({
      min: 0,
      max: 999,
    }),
  check('jerseyNo')
    .custom((jerseyNo, { req }) => {
      return Player
        .findOne({
          jerseyNo: jerseyNo,
          creator: req.user._id,
        })
        .lean()
        .exec()
        .then(player => {
          if (player && player._id.toString() !== req.params.id) {
            throw new Error('This jersey is already taken.');
          }
          return true;
        });
    }),
];
const playerGetValidations = [
  check('id', 'Must be a valid id')
    .isMongoId(),
];

/* GET players listing. */
router.get('/', authenticateJwt(), (request, response) => {
  let query;
  if (request.query.search) {
    const regExp = new RegExp(request.query.search, 'i');
    query = Player.aggregate([
      { $match: { creator: request.user._id } },
      { $addFields: { jerseyString: { $toLower: '$jerseyNo' } } },
      {
        $match: {
          $or: [
            { name: regExp },
            { jerseyString: regExp },
          ],
        },
      },
    ])
      .exec();
  } else {
    query = Player.find({ creator: request.user._id })
      .lean()
      .exec();
  }

  query
    .then(players => response.json(players))
    .catch(err => sendErrorResponse(response, err, responses.players.index.err));
});

function _getBattingInningsStats(battingInningses) {
  return battingInningses.map(bowls => {
    const run = bowls.reduce((run, bowl) => {
      run += bowl.singles;
      if (bowl.boundary.kind === 'regular' && Number.isInteger(bowl.boundary.run)) {
        run += bowl.boundary.run;
      }
      return run;
    }, 0);
    const numBowl = bowls.length;
    const strikeRate = run / numBowl;
    return {
      run,
      numBowl,
      strikeRate,
    };
  });
}

function _getBowlingInningsStats(bowlingInningses) {
  return bowlingInningses.map(overs => {
    const { run, wicket, totalBowl } = overs.reduce(({ run, wicket, totalBowl }, over) => {
      const { overRun, overWicket } = over.bowls.reduce(({ overRun, overWicket }, bowl) => {
        // assuming bowling strike rate counts wide and no bowls
        const isWicket = bowl.isWicket && bowl.isWicket.kind
          && (bowl.isWicket.kind.toLowerCase() !== 'run out')
          && (bowl.isWicket.kind.toLowerCase() !== 'run-out');
        if (isWicket) {
          overWicket++;
        }
        if (bowl.singles) {
          overRun += bowl.singles;
        }
        if (bowl.by) {
          overRun += bowl.by;
        }
        if (bowl.legBy) {
          overRun += bowl.legBy;
        }
        if (bowl.boundary.run) {
          overRun += bowl.boundary.run;
        }
        if (bowl.isWide || bowl.isNo) {
          overRun++;
        }

        return {
          overRun,
          overWicket,
        };
      }, {
        overRun: 0,
        overWicket: 0,
      });
      return {
        run: run + overRun,
        wicket: wicket + overWicket,
        totalBowl: totalBowl + over.bowls.length,
      };
    }, {
      run: 0,
      wicket: 0,
      totalBowl: 0,
    });
    return {
      run,
      wicket,
      totalBowl,
    };
  });
}

function _getBattingCareerStat(battingInningsStats, numOuts) {
  const numInningsBatted = battingInningsStats.length;
  const highestRun = battingInningsStats.reduce((hr, innings) => (hr > innings.run) ? hr : innings.run, 0);
  const totalRun = battingInningsStats.reduce((tr, innings) => tr + innings.run, 0);
  const avgRun = totalRun / numOuts;
  const battingStrikeRate = battingInningsStats.reduce((sr, innings) => sr + innings.strikeRate, 0) / numInningsBatted * 100;
  return {
    numInningsBatted,
    highestRun,
    totalRun,
    avgRun,
    battingStrikeRate,
  };
}

function _getBowlingCareerStat(bowlingInningsStats) {
  const numInningsBowled = bowlingInningsStats.length;
  const bestFigure = bowlingInningsStats.reduce(([wicket, run], innings) => {
    if (innings.wicket > wicket) {
      return [innings.wicket, innings.run];
    }
    if ((innings.wicket === wicket) && (innings.run < run)) {
      return [innings.wicket, innings.run];
    }
    return [wicket, run];
  }, [0, Number.POSITIVE_INFINITY]);
  const totalWickets = bowlingInningsStats.reduce((tw, innings) => tw + innings.wicket, 0);
  const totalConcededRuns = bowlingInningsStats.reduce((tcr, innings) => tcr + innings.run, 0);
  const totalBowls = bowlingInningsStats.reduce((tb, innings) => tb + innings.totalBowl, 0);
  const avgWicket = totalConcededRuns / totalWickets;
  const bowlingStrikeRate = totalBowls / totalWickets;
  return {
    numInningsBowled,
    bestFigure,
    totalWickets,
    avgWicket,
    bowlingStrikeRate,
  };
}

/* GET stat of a player */
router.get('/:id', authenticateJwt(), playerGetValidations, (request, response) => {
  const playerId = request.params.id;
  let player;
  const cond = {
    $and: [
      {
        $or: [
          { team1Players: playerId },
          { team2Players: playerId },
        ],
      },
      { state: 'done' },
      { creator: request.user._id },
    ],
  };
  Promise.all([
    Match.find(cond)
      .lean()
      .exec(),
    Player.findById(playerId)
      .lean()
      .exec(),
  ])
  // get the innings in which player with `playerId` has played
    .then(([matches, _player]) => {
      player = _player;
      return matches.map(match => {
        const team1Index = match.team1Players.map(playerId => playerId.toString())
          .indexOf(playerId);
        if (team1Index !== -1) {
          const [battingInnings, bowlingInnings] = match.team1BatFirst
            ? [match.innings1, match.innings2]
            : [match.innings2, match.innings1];
          return {
            battingInnings,
            bowlingInnings,
            playerIndex: team1Index,
          };
        } else {
          const team2Index = match.team2Players.map(playerId => playerId.toString())
            .indexOf(playerId);
          if (team2Index === -1) {
            throw new Error('Error in player stat query');
          }
          const [battingInnings, bowlingInnings] = match.team1BatFirst
            ? [match.innings2, match.innings1]
            : [match.innings1, match.innings2];
          return {
            battingInnings,
            bowlingInnings,
            playerIndex: team1Index,
          };
        }
      });
    })
    // get the bowls of inningses he/she played
    .then(matches => {
      let numOuts = 0;
      const matchWiseBattedBowls = matches.map((match) => {
        return match.battingInnings.overs.reduce((bowls, over) => {
          const filteredBowls = over.bowls.filter(bowl => bowl.playedBy === match.playerIndex);

          // `numOuts` needed to be calculated here
          // because a player can be out in a bowl he/she didn't played
          const isOut = over.bowls.find(bowl => {
            return bowl.isWicket && Number.isInteger(bowl.isWicket.player) && (bowl.isWicket.player === match.playerIndex);
          });
          if (isOut) {
            numOuts++;
          } else if (filteredBowls.find(bowl => bowl.isWicket && !Number.isInteger(bowl.isWicket.player))) {
            // it is a bowl where only on-crease batsman can get out
            numOuts++;
          }

          bowls.push(...filteredBowls);
          return bowls;
        }, []);
      });
      const matchWiseBowledOvers = matches.map(match => {
        return match.bowlingInnings.overs.filter(over => over.bowledBy === match.playerIndex);
      });
      return {
        numOuts,
        matchWiseBattedBowls,
        matchWiseBowledOvers,
      };
    })
    // calculate stat of each innings
    .then(({ numOuts, matchWiseBattedBowls, matchWiseBowledOvers }) => {
      // filter battingInningses whether he/she played
      const battingInningses = matchWiseBattedBowls.filter(innings => innings.length);
      const battingInningsStats = _getBattingInningsStats(battingInningses);

      const bowlingInningses = matchWiseBowledOvers.filter(innings => innings.length);
      const bowlingInningsStats = _getBowlingInningsStats(bowlingInningses);

      return {
        numMatch: matchWiseBattedBowls.length, // same as `matchWiseBowledOvers.length`
        numOuts,
        battingInningsStats,
        bowlingInningsStats,
      };
    })
    // generate the stat
    .then(({ numMatch, numOuts, battingInningsStats, bowlingInningsStats }) => {
      const { numInningsBatted, highestRun, totalRun, avgRun, battingStrikeRate } = _getBattingCareerStat(battingInningsStats, numOuts);

      const { numInningsBowled, bestFigure, totalWickets, avgWicket, bowlingStrikeRate } = _getBowlingCareerStat(bowlingInningsStats);

      return response.json({
        success: true,
        message: 'Successfully generated stat',
        stat: {
          numMatch,
          bat: {
            numInnings: numInningsBatted,
            totalRun,
            avgRun,
            highestRun,
            strikeRate: battingStrikeRate,
          },
          bowl: {
            numInnings: numInningsBowled,
            totalWickets,
            avgWicket,
            bestFigure: {
              wicket: bestFigure[0],
              run: bestFigure[1],
            },
            strikeRate: bowlingStrikeRate,
          },
        },
        player,
      });
    })
    .catch(err => sendErrorResponse(response, err));
});

/* Create a new player */
router.post('/', authenticateJwt(), playerCreateValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const { name, jerseyNo } = request.body;

  promise
    .then(() => Player.create({
      name: namify(name),
      jerseyNo,
      creator: request.user._id,
    }))
    .then(createdPlayer => {
      return response.json({
        success: true,
        message: responses.players.create.ok(name),
        player: {
          _id: createdPlayer._id,
          name: createdPlayer.name,
          jerseyNo: createdPlayer.jerseyNo,
        },
      });
    })
    .catch(err => sendErrorResponse(response, err, responses.players.create.err));
});

/* Edit an existing player */
router.put('/:id', authenticateJwt(), playerEditValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const { name, jerseyNo } = request.body;

  promise
    .then(() => {
      return Player
        .findOneAndUpdate({
          _id: ObjectId(request.params.id),
          creator: request.user._id,
        }, {
          name: namify(name),
          jerseyNo,
          creator: request.user._id,
        }, { new: true });
    })
    .then(editedPlayer => {
      if (!editedPlayer) {
        return send404Response(response, 'Player could not found');
      }
      return response.json({
        success: true,
        message: responses.players.edit.ok(name),
        player: {
          _id: editedPlayer._id,
          name: editedPlayer.name,
          jerseyNo: editedPlayer.jerseyNo,
        },
      });
    })
    .catch(err => sendErrorResponse(response, err, responses.players.edit.err));
});

module.exports = router;
