const puppeteer = require('puppeteer');
const asyncRedis = require("async-redis");
const config = require('getconfig');
const { expect } = require('chai');
const _ = require('lodash');
const globalVariables = _.pick(global, ['browser', 'expect']);

require('../bin/www'); // This starts the web server, and ensures it is only

// expose variables
before (async function () {
    global.expect = expect;
    global.browser = await puppeteer.launch(
        {
            args: ['--no-sandbox'],
            timeout: 10000
        });
});

// close browser and reset global variables
after (function () {
    browser.close();

    global.browser = globalVariables.browser;
    global.expect = globalVariables.expect;
});


async function withButtonHistoryData() {
    const testData = [
        {"team": 1, "button": 1, "day": 1, "time": "10:00:00", "score": 10},
        {"team": 2, "button": 2, "day": 1, "time": "10:01:00", "score": 9},
        {"team": 3, "button": 3, "day": 1, "time": "10:02:00", "score": 8},
        {"team": 2, "button": 2, "day": 2, "time": "10:00:00", "score": 10},
        {"team": 1, "button": 2, "day": 2, "time": "10:01:00", "score": 9},
        {"team": 2, "button": 3, "day": 3, "time": "10:01:00", "score": 10}
    ];

    const client = await asyncRedis.createClient(config.REDIS_URL, {no_ready_check: true});
    await client.set("buttonHistory", JSON.stringify(testData));
}

async function withoutButtonHistoryData() {
    const client = await asyncRedis.createClient(config.REDIS_URL, {no_ready_check: true});
    await client.del("buttonHistory");
}

module.exports.withButtonHistoryData = withButtonHistoryData;
module.exports.withoutButtonHistoryData = withoutButtonHistoryData;