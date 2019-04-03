const express = require('express');
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
app.use('/auth', authRouter);
app.use('/api/users', usersRouter);

module.exports = app;
