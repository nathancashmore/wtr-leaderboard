const puppeteer = require('puppeteer');
const asyncRedis = require('async-redis');
const config = require('getconfig');
const {expect} = require('chai');
const _ = require('lodash');
const globalVariables = _.pick(global, ['browser', 'expect']);

require('../bin/www'); // This starts the web server, and ensures it is only

// expose variables
before(async function () {
  global.expect = expect;
  global.browser = await puppeteer.launch(
    {
      args: ['--no-sandbox'],
      timeout: 10000
    });
});

// close browser and reset global variables
after(function () {
  browser.close();

  global.browser = globalVariables.browser;
  global.expect = globalVariables.expect;
});


async function withButtonHistoryData() {
  // Following should provide the standing:
  // Team  --  Score
  //   2   --    8
  //   1   --    5
  //   3   --    2

  const testData = [
    {"team": 1, "button": 1, "day": 0, "time": "10:00:00", "score": 3},
    {"team": 2, "button": 2, "day": 0, "time": "10:01:00", "score": 2},
    {"team": 3, "button": 3, "day": 0, "time": "10:02:00", "score": 1},

    {"team": 2, "button": 3, "day": 1, "time": "10:00:00", "score": 3},
    {"team": 1, "button": 2, "day": 1, "time": "10:01:00", "score": 2},
    {"team": 3, "button": 1, "day": 1, "time": "10:02:00", "score": 1},

    {"team": 2, "button": 1, "day": 2, "time": "10:00:00", "score": 3},
    // {"team": 1, "button": 3, "day": 2, "time": "10:01:00", "score": 2},
    // {"team": 3, "button": 2, "day": 2, "time": "10:02:00", "score": 1}
  ];

  const client = await asyncRedis.createClient(config.REDIS_URL, {no_ready_check: true});
  await client.set("buttonHistory", JSON.stringify(testData));

  return [
    {"team": 2, "score": 8},
    {"team": 1, "score": 5},
    {"team": 3, "score": 2}
  ];
}

async function withoutButtonHistoryData() {
  const client = await asyncRedis.createClient(config.REDIS_URL, {no_ready_check: true});
  await client.del("buttonHistory");
}

async function withoutStartDate() {
  const client = await asyncRedis.createClient(config.REDIS_URL, {no_ready_check: true});
  await client.del("startDate");
}

async function withStartDate(dateInFormatYYYY_MM_DD) {
  let startDate = dateInFormatYYYY_MM_DD;
  const client = await asyncRedis.createClient(config.REDIS_URL, {no_ready_check: true});
  await client.set("startDate", JSON.stringify(startDate));
}

module.exports.withButtonHistoryData = withButtonHistoryData;
module.exports.withoutButtonHistoryData = withoutButtonHistoryData;
module.exports.withStartDate = withStartDate;
module.exports.withoutStartDate = withoutStartDate;
