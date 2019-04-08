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


/* GET users listing. */
router.get('/', (request, response) => {
  Player
    .find({})
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
