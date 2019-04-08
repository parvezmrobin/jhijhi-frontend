/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


const mongoose = require('mongoose');
const session = require('express-session');
/** @type {Function} */
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

module.exports = function (app) {
  return mongoose
    .connect(app.get('db'), { useNewUrlParser: true })
    .then(() => {
      console.log("Connected to database: 'jhijhi'");

      // using db url as the secret key :P :P :P
      app.use(session({
        secret: app.get('db'),
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        resave: false,
        saveUninitialized: false,
      }));
      app.use(passport.session({}));
    });
};
