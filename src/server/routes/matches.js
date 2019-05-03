const express = require('express');

/**
 * User router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const Match = require('../models/match');
const responses = require('../responses');
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', { session: false });
const { check, validationResult } = require('express-validator/check');
const { sendErrorResponse, send404Response, nullEmptyValues } = require('../lib/utils');
const {Error400, Error404} = require('../lib/errors');


const matchCreateValidations = [
  check('name')
    .exists({ checkFalsy: true })
    .custom((name, { req }) => {
      return Match
        .findOne({
          creator: req.user._id,
          name: name,
        })
        .exec()
        .then(match => {
          if (match) {
            return Promise.reject('Match Name already taken.');
          }
          return Promise.resolve();
        });
    }),
  check('team1')
    .isMongoId(),
  check('team2')
    .isMongoId(),
  check('team1')
    .custom((team1, { req }) => {
      if (team1 === req.body.team2) {
        // trow error if passwords do not match
        throw new Error('Team 1 and Team 2 should be different.');
      }
      return team1;
    }),
  check('overs', 'Overs must be greater than 0')
    .isInt({ min: 1 }),
];

const matchBeginValidations = [
  check('team1Players')
    .isArray(),
  check('team2Players')
    .isArray(),
  check('team1Captain', 'No captain selected')
    .exists({ checkFalsy: true }),
  check('team1Captain', 'Team 1 captain should be a team 1 player')
    .custom((team1Captain, { req }) => {
      return req.body.team1Players && req.body.team1Players.indexOf(team1Captain) !== -1;
    }),
  check('team2Captain', 'No captain selected')
    .exists({ checkFalsy: true }),
  check('team2Captain', 'Team 2 captain should be a team 2 player')
    .custom((team2Captain, { req }) => {
      return req.body.team2Players && req.body.team2Players.indexOf(team2Captain) !== -1;
    }),
];

const matchTossValidations = [
  check('won')
    .custom((won, { req }) => {
      return Match
        .findById(req.params.id)
        .exec()
        .then(match => {
          if (won === match.team1.toString() || won === match.team2.toString()) {
            return Promise.resolve('Select a team');
          }
          return Promise.reject();
        });
    }),
  check('choice')
    .isIn(['Bat', 'Bawl']),
];

router.put('/:id/begin', authenticateJwt(), matchBeginValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const params = nullEmptyValues(request);
  const { team1Players, team1Captain, team2Players, team2Captain, state = 'toss' } = params;
  const id = request.params.id;

  promise
    .then(() => {
      return Match.findById(id)
        .exec();
    })
    .then((match) => {
      if (!match) {
        return send404Response(response, responses.matches.e404);
      }

      match.set({
        team1Captain,
        team2Captain,
        team1Players,
        team2Players,
        state,
      });

      return match.save()
        .then(() => {
          console.log(match.toObject());
          return match.populate('team1Captain')
            .populate('team2Captain')
            .populate('team1Players')
            .populate('team2Players')
            .execPopulate();
        })
        .then(() => {
          return response.json({
            success: true,
            message: responses.matches.begin.ok,
            match: {
              team1Captain: match.team1Captain,
              team2Captain: match.team2Captain,
              team1Players: match.team1Players,
              team2Players: match.team2Players,
              state: 'toss',
            },
          });
        });
    })
    .catch(err => sendErrorResponse(response, err, responses.matches.begin.err));
});

router.put('/:id/toss', authenticateJwt(), matchTossValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const params = nullEmptyValues(request);

  const { won, choice, state = 'innings1' } = params;
  const id = request.params.id;

  promise
    .then(() => {
      return Match.findById(id)
        .exec();
    })
    .then(match => {
      if (!match) {
        throw new Error404(responses.matches.e404);
      }
      match.team1WonToss = match.team1 === won;
      match.team1BatFirst = (match.team1WonToss && choice === 'Bat') || (!match.team1WonToss && choice === 'Bawl');
      match.state = state;
      match.innings1 = {overs: []};
      return match.save()
        .then(() => {
          response.json({
            success: true,
            message: responses.matches.toss.ok,
            match: {
              team1WonToss: match.team1WonToss,
              team1BatFirst: match.team1BatFirst,
              state: 'innings1',
              innings1: {overs: []},
            },
          });
        });
    })
    .catch(err => sendErrorResponse(response, err, responses.matches.toss.err));
});

router.put('/:id/declare', authenticateJwt(), (request, response) => {
  const id = request.params.id;

  Match.findById(id)
    .exec()
    .then(match => {
      if (!match) {
        throw new Error404(responses.matches.e404);
      }
      if (['innings1', 'innings2'].indexOf(match.state) === -1) {
        throw new Error400(`State must be either 'innings1' or 'innings1'`)
      }
      const updateState = {};
      if (match.state.toString() === 'innings1') {
        match.state = 'innings2';
        updateState.innings2 = match.innings2 = {overs: []};
      } else {
        match.state = 'done';
      }
      updateState.state = match.state;
      return match.save()
        .then(() => response.json(updateState));
    })
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.matches.get.err,
        err: err.error || err.errors || err,
      });
    });
});

router.post('/:id/bowl', authenticateJwt(), (request, response) => {
  const bowl = nullEmptyValues(request);
  const id = request.params.id;
  Match.findById(id)
    .then(match => {
      let updateQuery;
      if (match.state === 'innings1') {
        updateQuery = { $push: { [`innings1.overs.${match.innings1.overs.length - 1}.bowls`]: bowl } };
      } else if (match.state === 'innings2') {
        updateQuery = { $push: { [`innings2.overs.${match.innings2.overs.length - 1}.bowls`]: bowl } };
      } else {
        return response.status(400)
          .json({ success: false });
      }
      return match.update(updateQuery)
        .exec()
        .then(() => {
          response.json({
            success: true,
          });
        });
    });
});

router.post('/:id/over', authenticateJwt(), (request, response) => {
  const over = nullEmptyValues(request);
  over.bowls = [];
  const id = request.params.id;
  Match.findById(id)
    .then(match => {
      let updateQuery;
      if (match.state === 'innings1') {
        updateQuery = { $push: { [`innings1.overs`]: over } };
      } else if (match.state === 'innings2') {
        updateQuery = { $push: { [`innings2.overs`]: over } };
      } else {
        return response.status(400)
          .json({
            success: false,
            message: `Can't add over in state ${match.state}`,
          });
      }
      return match.update(updateQuery)
        .exec()
        .then(() => {
          response.json({
            success: true,
          });
        });
    });
});

router.get('/:id', authenticateJwt(), (request, response) => {
  Match
    .findOne({
      creator: request.user._id,
      _id: request.params.id,
    })
    .populate('team1')
    .populate('team2')
    .populate('team1Captain')
    .populate('team2Captain')
    .populate('team1Players')
    .populate('team2Players')
    .lean()
    .then(match => response.json(match))
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.matches.get.err,
        err: err.error || err.errors || err,
      });
    });
});

/* GET matches listing. */
router.get('/', authenticateJwt(), (request, response) => {
  Match
    .find({ creator: request.user._id })
    .lean()
    .then(matches => response.json(matches))
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.matches.index.err,
        err: err.error || err.errors || err,
      });
    });
});

router.post('/', authenticateJwt(), matchCreateValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const params = request.body;
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      if (!params[key]) {
        params[key] = null;
      }
    }
  }
  const { name, team1, team2, umpire1, umpire2, umpire3, overs } = params;

  promise
    .then(() => Match.create({
      name,
      team1,
      team2,
      umpire1,
      umpire2,
      umpire3,
      overs,
      creator: request.user._id,
    }))
    .then(createdMatch => {
      response.json({
        success: true,
        message: responses.matches.create.ok(name),
        match: { _id: createdMatch._id },
      });
    })
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.matches.create.err,
        err: err.error || err.errors || err,
      });
    });
});

module.exports = router;
