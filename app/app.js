const boom = require('boom');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('heroku-logger');
const bodyParser = require('body-parser');
const config = require('getconfig');
const i18n = require('i18n');
const favicon = require('express-favicon');

const DataHelper = require('./helper/data-helper');

const indexRouter = require('./routes/index');
const timeRouter = require('./routes/time');
const buttonRouter = require('./routes/button');
const historyRouter = require('./routes/history');
const teamRouter = require('./routes/team');
const introRouter = require('./routes/intro');
const ifttRouter = require('./routes/iftt');
const progressRouter = require('./routes/progress');
const statusRouter = require('./routes/status');
const slackRouter = require('./routes/slack');

const app = module.exports = express();

// Global variables
const redisUrl = process.env.REDIS_URL || config.REDIS_URL;
const noOfTeams = Number(process.env.NO_OF_TEAMS) || Number(config.NO_OF_TEAMS);
const iftttAuthCode = process.env.IFTTT_AUTH || config.IFTTT_AUTH;

i18n.configure({
  locales: ['en'],
  directory: `${__dirname}/locales`,
});

app.locals.dataHelper = new DataHelper(noOfTeams, redisUrl);
app.locals.iftttAuthCode = iftttAuthCode;
logger.info(`IFTTT Auth code set to ${iftttAuthCode}`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18n.init);
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(`${__dirname}/../public/images/iot-hunt.ico.png`)));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/leaderboard', indexRouter);
app.use('/time', timeRouter);
app.use('/buttons', buttonRouter);
app.use('/history', historyRouter);
app.use('/ifttt', ifttRouter);
app.use('/slack', slackRouter);
app.use('/intro', introRouter);
app.use('/teams', teamRouter);
app.use('/progress', progressRouter);
app.use('/status', statusRouter);
app.use('/pear-shaped', () => { throw boom.internal(); });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  logger.error(`Unable to find route for [${req.method}] - ${req.url}`);
  next(boom.notFound());
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  boom.boomify(err);
  logger.error(`Problem occurred at [${req.method}] - ${req.url} - ${err}`);

  res.status(err.output.statusCode);
  res.render('error', { error: err });
});

module.exports = app;
