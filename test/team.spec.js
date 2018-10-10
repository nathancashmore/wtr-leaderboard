const bootstrap = require('./bootstrap');
const moment = require('moment');
const i18n = require('i18n');

let expectedScores;

const DAY_2 = moment().subtract(2, "days").format('YYYY-MM-DD');
const DAY_3 = moment().subtract(3, "days").format('YYYY-MM-DD');

describe('Team Integration', function () {

  describe('Team Page', function () {

    describe('Last day', function () {

      before(async function () {
        expectedScores = await bootstrap.withButtonHistoryData();
        await bootstrap.withStartDate(DAY_2)
      });

      let page;

      before(async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:3000/team/1');
      });

      after(async function () {
        await page.close();
      });

      it('should have the correct page title', async function () {
        expect(await page.title()).to.eql('Christmas IoT Hunt');
      });

      it('should have the correct team name', async function () {
        const TAG = '[data-test="team-name"]';
        await page.waitFor(TAG);

        text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('team-1'));
      });

      it('should have the correct team score', async function () {
        const TAG = '[data-test="team-score"]';
        await page.waitFor(TAG);

        text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(`${expectedScores[1].score}`);
      });

      it('should have the correct button name', async function () {
        const TAG = '[data-test="button-name"]';
        await page.waitFor(TAG);

        text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('button-name-3'));
      });

      it('should have the correct clue', async function () {
        const TAG = '[data-test="button-clue"]';
        await page.waitFor(TAG);

        text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('button-clue-3'));
      })
    })

    describe('Day after the last day', function () {

      before(async function () {
        expectedScores = await bootstrap.withButtonHistoryData();
        await bootstrap.withStartDate(DAY_3)
      });

      let page;

      before(async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:3000/team/1');
      });

      after(async function () {
        await page.close();
      });

      it('should have the correct team name', async function () {
        const TAG = '[data-test="team-name"]';
        await page.waitFor(TAG);

        text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('team-1'));
      });

      it('should have the correct team score', async function () {
        const TAG = '[data-test="team-score"]';
        await page.waitFor(TAG);

        text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(`${expectedScores[1].score}`);
      });

      it('should tell the player its GAME OVER', async function () {
        const TAG = '[data-test="team-game-over"]';
        await page.waitFor(TAG);

        text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('team-game-over'));
      });
    })

  });

});

