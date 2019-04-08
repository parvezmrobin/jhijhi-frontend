const express = require('express');

/**
 * Index router
 * @var router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', {session: false});
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const responses = require("../responses");
const {check, validationResult} = require('express-validator/check');

const registrationValidations = [
  check('username').exists({checkFalsy: true})
    .custom(username => {
      return new Promise(function (resolve, reject) {
        User.findOne({username: username}).exec().then(user => {
          if (user) {
            reject("Username already taken.");
          } else {
            resolve();
          }
        }).catch(reject);
      });
    }),
  check('password').isLength({min: 4})
    .custom((password, {req}) => {
      if (password !== req.body.confirm) {
        // trow error if passwords do not match
        throw new Error("Password and confirm password don't match");
      }
      return password;
    }),
];


router.get('/user', authenticateJwt(), function (request, response) {
  response.json({username: request.user.username});
});

router.post('/register', registrationValidations, function (request, response) {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({status: 400, errors: errors.array()});
  const {username, password} = request.body;
  const saltRounds = 10;

  promise
    .then(() => bcrypt.hash(password, saltRounds))
    .then(hashedPassword => {
      return User.create({
        username: username,
        password: hashedPassword,
      });
    })
    .then(user => {
      response.json({
        success: true,
        message: responses.auth.register.ok,
        user: {_id: user._id},
      });
    })
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.auth.register.err,
        err: err.error || err.errors || err,
      });
    });
});

router.post('/login', function (request, response) {
  const {username, password} = request.body;

  User
    .findOne({username})
    .exec()
    .then(user => {
      bcrypt
        .compare(password, user.password)
        .then(matched => {
          if (matched) {
            const token = jwt.sign(user._id.toString(), request.app.get('db'));
            return response.json({success: true, 'token': token});
          }
          return response.json({success: false});
        });
    });
});

module.exports = router;
