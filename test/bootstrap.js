const puppeteer = require('puppeteer');
const asyncRedis = require('async-redis');
const config = require('getconfig');
const moment = require('moment');
const { expect } = require('chai');
const _ = require('lodash');

const globalVariables = _.pick(global, ['browser', 'expect']);

require('../bin/www'); // This starts the web server, and ensures it is only

// expose variables
before(async () => {
  global.expect = expect;
  global.browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
    timeout: 10000
  });
});

// close browser and reset global variables
after(() => {
  global.browser.close();

  global.browser = globalVariables.browser;
  global.expect = globalVariables.expect;
});

async function setButtonHistory(buttonHistoryJson) {
  const client = await asyncRedis.createClient(config.REDIS_URL, { no_ready_check: true });
  await client.set('buttonHistory', JSON.stringify(buttonHistoryJson));
}

async function setButtonStatus(buttonStatusJson) {
  const client = await asyncRedis.createClient(config.REDIS_URL, { no_ready_check: true });
  await client.set('buttonStatus', JSON.stringify(buttonStatusJson));
}

async function withoutStartDate() {
  const client = await asyncRedis.createClient(config.REDIS_URL, { no_ready_check: true });
  await client.del('startDate');
}

async function withStartDate(dateInFormatYYYYMMDD) {
  const startDate = dateInFormatYYYYMMDD;
  const client = await asyncRedis.createClient(config.REDIS_URL, { no_ready_check: true });
  await client.set('startDate', JSON.stringify(startDate));
}

async function withStartDateToday() {
  const TODAY = moment().format('YYYY-MM-DD');
  await withStartDate(TODAY);
}

async function withStartDateBeforeEvent() {
  const FUTURE = moment().add(10, 'days').format('YYYY-MM-DD');
  await withStartDate(FUTURE);
}

async function withStartDateAfterEvent() {
  const PAST = moment().subtract(10, 'days').format('YYYY-MM-DD');
  await withStartDate(PAST);
}

async function withoutButtonHistoryData() {
  const client = await asyncRedis.createClient(config.REDIS_URL, { no_ready_check: true });
  await client.del('buttonHistory');
}

async function setWindow(window) {
  const client = await asyncRedis.createClient(config.REDIS_URL, { no_ready_check: true });
  await client.set('buttonWindow', JSON.stringify((window)));
}

async function outsideWindow() {
  const BEFORE_NOW = moment().subtract(10, 'minutes').format('HH:mm:ss');
  await setWindow({ start: BEFORE_NOW, end: BEFORE_NOW });
}

async function insideWindow() {
  const BEFORE_NOW = moment().subtract(10, 'minutes').format('HH:mm:ss');
  const AFTER_NOW = moment().add(10, 'minutes').format('HH:mm:ss');
  await setWindow({ start: BEFORE_NOW, end: AFTER_NOW });
}

async function noWindow() {
  const client = await asyncRedis.createClient(config.REDIS_URL, { no_ready_check: true });
  await client.del('buttonWindow');
}

async function withButtonHistoryData() {
  // Following should provide the standing:
  // Team  --  Score
  //   2   --    8
  //   1   --    5
  //   3   --    2

  const testData = [
    {
      team: 1, button: 1, day: 0, time: '10:00:00', score: 3,
    },
    {
      team: 2, button: 2, day: 0, time: '10:01:00', score: 2,
    },
    {
      team: 3, button: 3, day: 0, time: '10:02:00', score: 1,
    },

    {
      team: 2, button: 3, day: 1, time: '10:00:00', score: 3,
    },
    {
      team: 1, button: 2, day: 1, time: '10:01:00', score: 2,
    },
    {
      team: 3, button: 1, day: 1, time: '10:02:00', score: 1,
    },

    {
      team: 2, button: 1, day: 2, time: '10:00:00', score: 3,
    },
    // {"team": 1, "button": 3, "day": 2, "time": "10:01:00", "score": 2},
    // {"team": 3, "button": 2, "day": 2, "time": "10:02:00", "score": 1}
  ];

  noWindow();
  withoutButtonHistoryData();
  setButtonHistory(testData);
  withStartDate(moment().subtract(2, 'days').format('YYYY-MM-DD'));

  return [
    { team: 2, score: 8, pressed: true },
    { team: 1, score: 5, pressed: false },
    { team: 3, score: 2, pressed: false },
  ];
}

async function withButtonStatus() {
  const testData = [
    {
      button: 1, ip: '10.10.0.101', time: moment().subtract(5, 'minutes').format('YYYY-MM-DD HH:mm')
    },
    {
      button: 2, ip: '10.10.0.102', time: moment().subtract(15, 'minutes').format('YYYY-MM-DD HH:mm')
    },
    {
      button: 3, ip: '10.10.0.103', time: moment().subtract(45, 'minutes').format('YYYY-MM-DD HH:mm')
    }
  ];

  setButtonStatus(testData);

  const expectedData = testData;

  expectedData[0].indicator = 'green';
  expectedData[1].indicator = 'yellow';
  expectedData[2].indicator = 'red';

  return expectedData;
}

async function withoutButtonStatus() {
  const client = await asyncRedis.createClient(config.REDIS_URL, { no_ready_check: true });
  await client.del('buttonStatus');
}

async function getText(page, tagName) {
  const TAG = `[data-test="${tagName}"]`;
  await page.waitFor(TAG);

  const text = await page.$eval(TAG, element => element.innerText);
  return text.replace('\t', '');
}

async function getStyle(page, tagName) {
  const TAG = `[data-test="${tagName}"]`;
  const element = await page.waitFor(TAG);
  const classList = await element.getProperty('className');
  return classList._remoteObject.value;
}

module.exports.testHelper = {
  withButtonHistoryData,
  withoutButtonHistoryData,
  withStartDate,
  withoutStartDate,
  withStartDateBeforeEvent,
  withStartDateAfterEvent,
  withoutButtonStatus,
  withStartDateToday,
  getText,
  getStyle,
  setButtonHistory,
  withButtonStatus,
  outsideWindow,
  insideWindow,
  noWindow
};
