const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const os = require('os');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('dist'));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.get('/api/getUser', (req, res) => res.send({ username: os.userInfo().username }));

module.exports = app;
