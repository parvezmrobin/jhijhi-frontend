const express = require('express');

/**
 * User router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const Umpire = require("../models/umpire");
const responses = require("../responses");
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', {session: false});


/* GET teams listing. */
router.get('/', authenticateJwt(), (request, response) => {
  Umpire
    .find({creator: request.user._id})
    .lean()
    .then(umpires => response.json(umpires))
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.teams.index.err,
        err: err.error || err.errors || err,
      });
    })
});

module.exports = router;
