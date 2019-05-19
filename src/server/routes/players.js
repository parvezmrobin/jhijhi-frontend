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
const responses = require('../responses');
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', { session: false });
const { check, validationResult } = require('express-validator/check');
const ObjectId = require('mongoose/lib/types/objectid');

const _formatPlayerName = function (name) {
  return name.split(' ')
    .filter(s => s)
    .map(s => s[0].toUpperCase() + s.substr(1))
    .join(' ');
};

const playerCreateValidations = [
  check('name')
    .exists({ checkFalsy: true })
    .custom((name, { req }) => {
      return new Promise(function (resolve, reject) {
        Player.findOne({
          name: _formatPlayerName(name),
          creator: req.user._id,
        })
          .exec()
          .then(player => {
            if (player) {
              reject('Player Name already taken.');
            } else {
              resolve();
            }
          })
          .catch(reject);
      });
    }),
  check('jerseyNo', 'Jersey number should be between 1 to 999')
    .isInt({
      min: 0,
      max: 999,
    }),
  check('jerseyNo')
    .custom((jerseyNo, { req }) => {
      return new Promise(function (resolve, reject) {
        Player.findOne({
          jerseyNo: jerseyNo,
          creator: req.user._id,
        })
          .exec()
          .then(player => {
            if (player) {
              reject('This jersey is already taken.');
            } else {
              resolve();
            }
          })
          .catch(reject);
      });
    }),
];
const playerEditValidations = [
  check('name')
    .exists({ checkFalsy: true })
    .custom((name, { req }) => {
      return new Promise(function (resolve, reject) {
        Player.findOne({
          name: _formatPlayerName(name),
          creator: req.user._id,
        })
          .lean()
          .exec()
          .then(player => {
            if (player && player._id.toString() !== req.params.id) {
              reject('Player Name already taken.');
            } else {
              resolve();
            }
          })
          .catch(reject);
      });
    }),
  check('jerseyNo', 'Jersey number should be between 1 to 999')
    .isInt({
      min: 0,
      max: 999,
    }),
  check('jerseyNo')
    .custom((jerseyNo, { req }) => {
      return new Promise(function (resolve, reject) {
        Player.findOne({
          jerseyNo: jerseyNo,
          creator: req.user._id,
        })
          .lean()
          .exec()
          .then(player => {
            if (player && player._id.toString() !== req.params.id) {
              reject('This jersey is already taken.');
            } else {
              resolve();
            }
          })
          .catch(reject);
      });
    }),
];

/* GET players listing. */
router.get('/', authenticateJwt(), (request, response) => {
  Player
    .find({ creator: request.user._id })
    .lean()
    .then(players => response.json(players))
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.players.index.err,
        err: err.error || err.errors || err,
      });
    });
});

router.post('/', authenticateJwt(), playerCreateValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const { name, jerseyNo } = request.body;

  promise
    .then(() => Player.create({
      name: _formatPlayerName(name),
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
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.players.create.err,
        err: err.error || err.errors || err,
      });
    });
});

router.put('/:id', authenticateJwt(), playerEditValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const { name, jerseyNo } = request.body;

  promise
    .then(() => Player.updateOne({ _id: ObjectId(request.params.id) }, {
      name: _formatPlayerName(name),
      jerseyNo,
      creator: request.user._id,
    }))
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
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.players.edit.err,
        err: err.error || err.errors || err,
      });
    });
});

module.exports = router;
