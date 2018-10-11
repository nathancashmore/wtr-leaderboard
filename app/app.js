const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const config = require('getconfig');
const i18n = require('i18n');

const DataHelper = require('./helper/data-helper');

const indexRouter = require('./routes/index');
const timeRouter = require('./routes/time');
const buttonRouter = require('./routes/button');
const historyRouter = require('./routes/history');
const introRouter = require('./routes/intro');
const wcsRouter = require('./routes/wcs');
const progressRouter = require('./routes/progress');

const app = module.exports = express();

// Global variables
const redisUrl = process.env.REDIS_URL || config.REDIS_URL;
const noOfTeams = process.env.NO_OF_TEAMS || config.NO_OF_TEAMS;


i18n.configure({
	locales:['en'],
	directory: __dirname + '/locales'
});

app.locals.dataHelper = new DataHelper(noOfTeams, redisUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18n.init);
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/time', timeRouter);
app.use('/buttons', buttonRouter);
app.use('/history', historyRouter);
app.use('/intro', introRouter);
app.use('/shop', wcsRouter);
app.use('/progress', progressRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
