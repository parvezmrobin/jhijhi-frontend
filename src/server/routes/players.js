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

/* GET players listing. */
router.get('/', authenticateJwt(), (request, response) => {
  Player
    .find({ creator: request.user._id })
    .lean()
    .then(players => response.json(players))
    .catch(err => sendErrorResponse(response, err, responses.players.index.err));
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
