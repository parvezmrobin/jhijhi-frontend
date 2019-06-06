const express = require('express');

/**
 * User router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const Team = require('../models/team');
const responses = require('../responses');
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', { session: false });
const { check, validationResult } = require('express-validator/check');
const { namify, sendErrorResponse } = require('../lib/utils');


function _getShortName(shortName) {
  return shortName.split(' ')
    .filter(s => s)
    .join('')
    .toUpperCase();
}

const teamCreateValidations = [
  check('name')
    .trim()
    .exists({ checkFalsy: true }),
  check('name')
    .custom((name, { req }) => {
      return Team
        .findOne({
          name: namify(name),
          creator: req.user._id,
        })
        .exec()
        .then(team => {
          if (team) {
            return Promise.reject('Team Name already taken.');
          }
          return true;
        });
    }),
  check('shortName', 'Short name should be at least 2 characters')
    .trim()
    .isLength({ min: 2 }),
  check('shortName')
    .custom((shortName, { req }) => {
      return Team
        .findOne({
          shortName: _getShortName(shortName),
          creator: req.user._id,
        })
        .exec()
        .then(team => {
          if (team) {
            return Promise.reject('This short name is already taken.');
          }
          return true;
        });
    }),
];

router.get('/:id', authenticateJwt(), (request, response) => {
  Team
    .findOne({
      _id: request.params.id,
      creator: request.user._id,
    })
    .lean()
    .populate('players')
    .then(teams => response.json(teams))
    .catch(err => sendErrorResponse(response, err, responses.teams.index.err));
});

/* GET teams listing. */
router.get('/', authenticateJwt(), (request, response) => {
  let query = { creator: request.user._id };
  if (request.query.search) {
    const regex = new RegExp(request.query.search, 'i');
    query = {
      $and: [
        query,
        {
          $or: [
            { name: regex },
            { shortName: regex },
          ],
        },
      ],
    };
  }

  Team
    .find(query)
    .lean()
    .then(teams => response.json(teams))
    .catch(err => sendErrorResponse(response, err, responses.teams.index.err));
});

router.post('/', authenticateJwt(), teamCreateValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const { name, shortName } = request.body;

  promise
    .then(() => Team.create({
      name: namify(name),
      shortName: _getShortName(shortName),
      creator: request.user._id,
    }))
    .then(createdTeam => {
      response.json({
        success: true,
        message: responses.teams.create.ok(createdTeam.name),
        team: createdTeam,
      });
    })
    .catch(err => sendErrorResponse(response, err, responses.teams.create.err));
});

module.exports = router;
