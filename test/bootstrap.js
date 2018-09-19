const puppeteer = require('puppeteer');
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
