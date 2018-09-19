const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('getconfig');
const bodyParser = require("body-parser");

const indexRouter = require('./routes/index');
const timekeeperRouter = require('./routes/timekeeper');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/timekeeper', timekeeperRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // set program locals
  res.locals.dataDirectory = process.env.DATA_DIR || config.DATA_DIR;
  res.locals.noOfTeams = process.env.NO_OF_TEAMS || config.NO_OF_TEAMS;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
