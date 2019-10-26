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
const { Error400, Error404 } = require('../lib/errors');


const matchCreateValidations = [
  check('name', 'A unique match name is required')
    .trim()
    .exists({ checkFalsy: true }),
  check('name')
    .custom((name, { req }) => {
      return Match
        .findOne({
          creator: req.user._id,
          name: name,
        })
        .exec()
        .then(match => {
          if (match) {
            throw new Error('Match Name already taken.');
          }
          return true;
        });
    }),
  check('team1', 'Select a team')
    .isMongoId(),
  check('team2', 'Select a team')
    .isMongoId(),
  check('team1')
    .custom((team1, { req }) => {
      if (team1 === req.body.team2) {
        throw new Error('Team 1 and Team 2 should be different.');
      }
      return true;
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
    .isMongoId(),
  check('team1Captain', 'Must have at least two players')
    .custom((_, { req }) => {
      const team1Players = req.body.team1Players;
      return team1Players && team1Players.length > 1;
    }),
  check('team1Captain', 'Captain should be a player from same team')
    .custom((team1Captain, { req }) => {
      return req.body.team1Players && req.body.team1Players.indexOf(team1Captain) !== -1;
    }),
  check('team2Captain', 'No captain selected')
    .isMongoId(),
  check('team2Captain', 'Must have at least two players')
    .custom((_, { req }) => {
      const team2Players = req.body.team2Players;
      return team2Players && team2Players.length > 1;
    }),
  check('team2Captain', 'Captain should be a player from same team')
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
          if (!(won === match.team1.toString() || won === match.team2.toString())) {
            throw new Error('Select a team');
          }
          return true;
        });
    }),
  check('choice')
    .isIn(['Bat', 'Bawl']),
];

const uncertainOutValidations = [
  check('batsman')
    .isInt({ min: 0 }),
  check('batsman')
    .custom((batsman, { req }) => {
      return Match
        .findById(req.params.id)
        .lean()
        .exec()
        .then(match => {
          if (!match) {
            throw new Error('Invalid match id');
          }
          if (['innings1', 'innings2'].indexOf(match.state) === -1) {
            throw new Error('No runout happens before or after match.');
          }

          const overs = match[match.state].overs;
          const lastOver = overs[overs.length - 1].bowls;
          const lastBowl = lastOver[lastOver.length - 1];

          if (lastBowl.isWicket && lastBowl.isWicket.kind) {
            const message = `Already a ${lastBowl.isWicket.kind} in this bowl. ` +
              'To input a bowl with only a run out or obstructing the field, ' +
              'input a bowl with 0 run first.';
            throw new Error(message);
          }

          return true;
        });
    }),
  check('kind', '`kind` should be either run out or obstructing the field')
    .isIn(['Run out', 'Obstructing the field']),
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
      return Match
        .findOne({
          _id: id,
          creator: request.user._id,
        })
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

      return match.save();
    })
    .then((match) => {
      return match.populate('team1Captain')
        .populate('team2Captain')
        .populate('team1Players')
        .populate('team2Players')
        .execPopulate();
    })
    .then((match) => {
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
    })
    .catch(err => sendErrorResponse(response, err, responses.matches.begin.err, request.user));
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
      return Match
        .findOne({
          _id: id,
          creator: request.user._id,
        })
        .exec();
    })
    .then(match => {
      if (!match) {
        throw new Error404(responses.matches.e404);
      }
      match.team1WonToss = match.team1.toString() === won;
      match.team1BatFirst = (match.team1WonToss && choice === 'Bat') || (!match.team1WonToss && choice === 'Bawl');
      match.state = state;
      match.innings1 = { overs: [] };
      return match.save();
    })
    .then((match) => {
      return response.json({
        success: true,
        message: responses.matches.toss.ok,
        match: {
          team1WonToss: match.team1WonToss,
          team1BatFirst: match.team1BatFirst,
          state: 'innings1',
          innings1: { overs: [] },
        },
      });
    })
    .catch(err => sendErrorResponse(response, err, responses.matches.toss.err, request.user));
});

router.put('/:id/declare', authenticateJwt(), (request, response) => {
  const id = request.params.id;
  const { state: nextState } = nullEmptyValues(request);

  Match
    .findOne({
      _id: id,
      creator: request.user._id,
    })
    .exec()
    .then(match => {
      if (!match) {
        throw new Error404(responses.matches.e404);
      }
      if (nextState && ['done', 'innings2'].indexOf(nextState) === -1) {
        throw new Error400(`Next state must be either 'done' or 'innings1'`);
      } else if (['innings1', 'innings2'].indexOf(match.state) === -1) {
        throw new Error400(`State must be either 'innings1' or 'innings1'`);
      }
      const updateState = {};
      if (nextState === 'innings2') {
        match.state = 'innings2';
        // prevent double initialization of `match.innings2`
        updateState.innings2 = match.innings2 ? match.innings2 : (match.innings2 = { overs: [] });
      } else if (nextState === 'done') {
        match.state = 'done';
      }
      // legacy option that deals request without state parameter
      // not recommended
      else if (match.state.toString() === 'innings1') {
        match.state = 'innings2';
        updateState.innings2 = match.innings2 = { overs: [] };
      } else {
        match.state = 'done';
      }
      updateState.state = match.state;
      return Promise.all([updateState, match.save()]);
    })
    .then(([updateState]) => response.json(updateState))
    .catch(err => sendErrorResponse(response, err, responses.matches.get.err, request.user));
});

router.post('/:id/bowl', authenticateJwt(), (request, response) => {
  const bowl = nullEmptyValues(request);
  const id = request.params.id;
  Match
    .findOne({
      _id: id,
      creator: request.user._id,
    })
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
        .exec();
    })
    .then(() => {
      return response.json({ success: true });
    })
    .catch(err => sendErrorResponse(response, err, 'Error while saving bowl', request.user));
});

router.put('/:id/bowl', authenticateJwt(), (request, response) => {
  const { bowl, overNo, bowlNo } = nullEmptyValues(request);
  const matchId = request.params.id;
  Match
    .findOne({
      _id: matchId,
      creator: request.user._id,
    })
    .lean()
    .exec()
    .then(match => _updateBowlAndSend(match, bowl, response, overNo, bowlNo))
    .catch((err) => sendErrorResponse(response, err, 'Error while updating bowl', request.user));
});

const _updateBowlAndSend = (match, bowl, response, overNo, bowlNo) => {
  const overExists = Number.isInteger(overNo);
  const bowlExists = Number.isInteger(bowlNo);
  if ((overExists || bowlExists) && !(overExists && bowlExists)) {
    // provided either `overNo` or `bowlNo` but not both.
    return sendErrorResponse(
      response,
      { statusCode: 400 },
      'Must provide either both `overNo` and `bowlNo` or none',
    );
  }
  let field,
    prevBowl;  // if `overNo` and `bowlNo` is not provided, then update the last bowl
  if (match.state === 'innings1') {
    const overs = match.innings1.overs;
    overNo = overExists ? overNo : overs.length - 1;
    const bowls = overs[overNo].bowls;
    bowlNo = bowlExists ? bowlNo : bowls.length - 1;
    prevBowl = bowls[bowlNo];
    field = `innings1.overs.${overNo}.bowls.${bowlNo}`;
  } else if (match.state === 'innings2') {
    const overs = match.innings2.overs;
    overNo = overExists ? overNo : overs.length - 1;
    const bowls = overs[overNo].bowls;
    bowlNo = bowlExists ? bowlNo : bowls.length - 1;
    prevBowl = bowls[bowlNo];
    field = `innings2.overs.${overNo}.bowls.${bowlNo}`;
  } else {
    return sendErrorResponse(response, { statusCode: 400 }, 'State should be either innings 1 or innings 2');
  }
  const updateQuery = { $set: { [field]: { ...prevBowl, ...bowl } } };

  return Match.findByIdAndUpdate(match._id, updateQuery)
    .exec()
    .then(() => {
      return response.json({
        success: true,
        bowl,
      });
    });
};

router.put('/:id/by', authenticateJwt(), (request, response) => {
  const { run, boundary, overNo, bowlNo } = nullEmptyValues(request);
  const id = request.params.id;
  Match
    .findOne({
      _id: id,
      creator: request.user._id,
    }, 'state innings1 innings2')
    .lean()
    .exec()
    .then(match => {
      const bowl = !boundary ? { by: run } : {
        boundary: {
          run,
          kind: 'by',
        },
      };
      return _updateBowlAndSend(match, bowl, response, overNo, bowlNo);
    })
    .catch((err) => sendErrorResponse(response, err, 'Error while updating bowl', request.user));
});

router.put('/:id/uncertain-out', uncertainOutValidations, authenticateJwt(), (request, response) => {
  const id = request.params.id;
  const errors = validationResult(request);
  const promise = errors.isEmpty()
    ? Match
      .findOne({
        _id: id,
        creator: request.user._id,
      })
      .lean()
      .exec()
    : Promise.reject({
      status: 400,
      errors: errors.array(),
    });

  promise
    .then(match => {
      const { batsman, kind, overNo, bowlNo } = nullEmptyValues(request);
      const bowl = {
        isWicket: {
          kind,
          player: batsman,
        },
      };
      return _updateBowlAndSend(match, bowl, response, overNo, bowlNo);
    })
    .catch(err => sendErrorResponse(response, err, 'Error while adding out', request.user));
});

router.post('/:id/over', authenticateJwt(), (request, response) => {
  const over = nullEmptyValues(request);
  over.bowls = [];
  const id = request.params.id;
  Match
    .findOne({
      _id: id,
      creator: request.user._id,
    })
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
        .exec();
    })
    .then(() => {
      return response.json({
        success: true,
      });
    })
    .catch((err) => sendErrorResponse(response, err, 'Error while saving over', request.user));
});

router.get('/done', authenticateJwt(), function (request, response) {
  const query = {
    creator: request.user._id,
    state: 'done',
  };
  if (request.query.search) {
    query.name = new RegExp(request.query.search, 'i');
  }
  Match
    .find(query)
    .lean()
    .then(matches => response.json(matches))
    .catch(err => sendErrorResponse(response, err, responses.matches.index.err, request.user));
});

/* GET tags listing. */
router.get('/tags', authenticateJwt(), (request, response) => {
  Match.aggregate()
    .group({
      "_id": 0,
      "tags": { "$push": "$tags" },
    })
    .project({
      "tags": {
        "$reduce": {
          "input": "$tags",
          "initialValue": [],
          "in": { "$setUnion": ["$$value", "$$this"] },
        },
      },
    })
    .exec()
    .then(([tags]) => {
      return response.json(tags.tags);
    })
    .catch(err => sendErrorResponse(response, err, responses.matches.tags.err, request.user))
});

router.get('/:id', (request, response) => {
  Match
    .findOne({ _id: request.params.id })
    .populate('team1')
    .populate('team2')
    .populate('team1Captain')
    .populate('team2Captain')
    .populate('team1Players')
    .populate('team2Players')
    .lean()
    .then(match => response.json(match))
    .catch(err => sendErrorResponse(response, err, responses.matches.get.err, request.user));
});

/* GET matches listing. */
router.get('/', authenticateJwt(), (request, response) => {
  const query = {
    creator: request.user._id,
    state: { $ne: 'done' },
  };
  if (request.query.search) {
    const regExp = new RegExp(request.query.search, 'i');
    query.$or = [{ name: regExp }, { tags: regExp }];
  }
  Match
    .find(query)
    .lean()
    .then(matches => response.json(matches))
    .catch(err => sendErrorResponse(response, err, responses.matches.index.err, request.user));
});

router.post('/', authenticateJwt(), matchCreateValidations, (request, response) => {
  const errors = validationResult(request);
  console.log(errors.array());

  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const params = nullEmptyValues(request);
  const { name, team1, team2, umpire1, umpire2, umpire3, overs, tags } = params;

  promise
    .then(() => Match.create({
      name,
      team1,
      team2,
      umpire1,
      umpire2,
      umpire3,
      overs,
      tags,
      creator: request.user._id,
    }))
    .then(createdMatch => {
      return response.json({
        success: true,
        message: responses.matches.create.ok(name),
        match: { _id: createdMatch._id },
      });
    })
    .catch(err => sendErrorResponse(response, err, responses.matches.create.err, request.user));
});

module.exports = router;
