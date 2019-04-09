const express = require('express');

/**
 * User router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const Match = require("../models/match");
const responses = require("../responses");
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', {session: false});
const {check, validationResult} = require('express-validator/check');


const matchCreateValidations = [
  check('name').exists({checkFalsy: true})
    .custom((name, {req}) => {
      return Match
        .findOne({creator: req.user._id, name: name})
        .exec()
        .then(match => {
          if (match) {
            return Promise.reject("Match Name already taken.");
          }
          return Promise.resolve();
        });
    }),
  check('team1').isMongoId(),
  check('team2').isMongoId(),
  check('team1').custom((team1, {req}) => {
      if (team1 === req.body.team2) {
        // trow error if passwords do not match
        throw new Error("Team 1 and Team 2 should be different.");
      }
      return team1;
    }),
  check('overs', 'Overs must be greater than 0').isInt({min: 1}),
];


/* GET matches listing. */
router.get('/', authenticateJwt(), (request, response) => {
  Match
    .find({creator: request.user._id})
    .lean()
    .then(matches => response.json(matches))
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.matches.index.err,
        err: err.error || err.errors || err,
      });
    })
});

router.post('/', authenticateJwt(), matchCreateValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({status: 400, errors: errors.array()});
  const {name, team1, team2, umpire1, umpire2, umpire3, overs} = request.body;

  promise
    .then(() => Match.create({
      name, team1, team2, umpire1, umpire2, umpire3, overs, creator: request.user._id,
    }))
    .then(createdMatch => {
      response.json({
        success: true,
        message: responses.matches.create.ok(name),
        match: {_id: createdMatch._id},
      });
    })
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.matches.create.err,
        err: err.error || err.errors || err,
      });
    })
});

module.exports = router;
