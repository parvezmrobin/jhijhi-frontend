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
  Player
    .find({ creator: request.user._id })
    .lean()
    .then(players => response.json(players))
    .catch(err => sendErrorResponse(response, err, responses.players.index.err));
});

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
          return {
            innings: match.team1BatFirst ? match.innings1 : match.innings2,
            playerIndex: team1Index,
          };
        } else {
          const team2Index = match.team2Players.map(playerId => playerId.toString())
            .indexOf(playerId);
          if (team2Index === -1) {
            throw new Error('Error in player stat query');
          }
          return {
            innings: match.team1BatFirst ? match.innings2 : match.innings1,
            playerIndex: team2Index,
          };
        }
      });
    })
    // get the innings he/she played
    .then(matches => {
      return matches.map((match) => {
        return match.innings.overs.reduce((bowls, over) => {
          const filteredBowls = over.bowls.filter(bowl => bowl.playedBy === match.playerIndex);
          bowls.push(...filteredBowls);
          return bowls;
        }, []);
      });
    })
    // filter inningses whether he/she played
    .then(inningses => inningses.filter(innings => innings.length))
    // calculate stat of each innings
    .then(inningses => {
      return inningses.map(bowls => {
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
    })
    // generate the stat
    .then(inningses => {
      const numMatches = inningses.length;
      const highestRun = inningses.reduce((hr, innings) => (hr > innings.run) ? hr : innings.run, 0);
      const totalRun = inningses.reduce((tr, innings) => tr + innings.run, 0);
      const strikeRate = inningses.reduce((sr, innings) => sr + innings.strikeRate, 0) / numMatches * 100;

      return response.json({
        success: true,
        message: 'Successfully generated stat',
        stat: {
          numMatches,
          totalRun,
          highestRun,
          strikeRate,
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
      response.json({
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
    .then(() => Player.findOneAndUpdate({ _id: ObjectId(request.params.id) }, {
      name: namify(name),
      jerseyNo,
      creator: request.user._id,
    }, { new: true }))
    .then(createdPlayer => {
      response.json({
        success: true,
        message: responses.players.edit.ok(name),
        player: {
          _id: createdPlayer._id,
          name: createdPlayer.name,
          jerseyNo: createdPlayer.jerseyNo,
        },
      });
    })
    .catch(err => sendErrorResponse(response, err, responses.players.edit.err));
});

module.exports = router;
