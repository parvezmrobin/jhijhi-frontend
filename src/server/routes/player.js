const express = require('express');

/**
 * User router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const Player = require("../models/player");
const responses = require("../responses");
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', {session: false});


/* GET players listing. */
router.get('/', authenticateJwt(), (request, response) => {
  Player
    .find({creator: request.user._id})
    .lean()
    .then(players => response.json(players))
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.players.index.err,
        err: err.error || err.errors || err,
      });
    })
});

module.exports = router;
