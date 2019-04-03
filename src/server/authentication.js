/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 03, 2019
 */


/**
 * @var {Object} ExtractJwt
 * @property {Function} fromAuthHeaderAsBearerToken
 */
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('./models/user');
const passport = require('passport');


module.exports = function (app) {
  app.use(passport.initialize({}));

  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: app.get('db'),
  };

  passport.use('jwt', new JwtStrategy(options, function (jwtPayload, done) {
    User
      .findById(jwtPayload)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(done);
  }));
};
