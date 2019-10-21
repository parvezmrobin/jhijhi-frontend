const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const responses = require('../responses');
const { check, validationResult } = require('express-validator/check');
const { sendErrorResponse } = require('../lib/utils');

const authenticateJwt = passport.authenticate.bind(passport, 'jwt', { session: false });

const registrationValidations = [
  check('username')
    .trim()
    .exists({ checkFalsy: true }),
  check('password', 'Password should be at least 4 characters long')
    .isLength({ min: 4 }),
  check('username')
    .custom(username => {
      return User.findOne({ username: username })
        .exec()
        .then(user => {
          if (user) {
            throw new Error('Username already taken');
          }
          return null;
        });
    }),
  check('password')
    .custom((password, { req }) => {
      if (password !== req.body.confirm) {
        // trow error if passwords do not match
        throw new Error('Password and confirm password don\'t match');
      }
      return password;
    }),
];


router.get('/user', authenticateJwt(), function (request, response) {
  response.json({ username: request.user.username });
});

router.post('/register', registrationValidations, function (request, response) {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({
    status: 400,
    errors: errors.array(),
  });
  const { username, password } = request.body;
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
      return response.json({
        success: true,
        message: responses.auth.register.ok,
        user: { _id: user._id },
      });
    })
    .catch(err => sendErrorResponse(response, err, responses.auth.register.err));
});

router.post('/login', function (request, response) {
  const { username, password } = request.body;
  let user;
  User
    .findOne({ username })
    .exec()
    .then(_user => {
      if (!_user) {
        throw new Error('user not found with given username');
      }
      user = _user;
      return bcrypt.compare(password, _user.password);
    })
    .then(matched => {
      if (matched) {
        const token = jwt.sign(user._id.toString(), request.app.get('db'));
        return response.json({
          success: true,
          'token': token,
        });
      }
      throw new Error('password did not match');
    })
    .catch(err => {
      console.error(err);
      response.json({ success: false });
    });
});

module.exports = router;
