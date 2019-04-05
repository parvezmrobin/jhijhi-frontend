const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { join } = require('path');

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const config = require('./config');

const app = express();

for (let configKey of Object.keys(config)) {
  app.set(configKey, config[configKey]);
}

require('./db')(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '..', '..', 'public')));

require('./authentication')(app);

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// noinspection JSUnusedLocalSymbols
app.use(function (err, req, res, next) {
  // generate the error
  res.status(err.status || 500);
  const error = {};

  Object.getOwnPropertyNames(err).forEach(function (key) {
    error[key] = err[key];
  });

  error.stack = error.stack.split("\n").map(str => str.trim());

  // only providing error in development
  res.json({
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {}
  });
});

module.exports = app;
