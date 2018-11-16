const moment = require('moment');
const i18n = require('i18n');
const { testHelper } = require('./bootstrap');

let expectedScores;

const DAY_2 = moment().subtract(2, 'days').format('YYYY-MM-DD');
const DAY_3 = moment().subtract(3, 'days').format('YYYY-MM-DD');

describe('Team Integration', () => {
  describe('Team Page', () => {
    describe('Last day', () => {
      before(async () => {
        expectedScores = await testHelper.withButtonHistoryData();
        await testHelper.withStartDate(DAY_2);
      });

      let page;

      before(async () => {
        page = await global.browser.newPage();
        await page.goto('http://localhost:3000/teams/1');
      });

      after(async () => {
        await page.close();
      });

      it('should have the correct page title', async () => {
        expect(await page.title()).to.eql(i18n.__('title'));
      });

      it('should have the correct team name', async () => {
        const TAG = '[data-test="team-name"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('team-1'));
      });

      it('should have the correct team score', async () => {
        const TAG = '[data-test="team-score"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(`${expectedScores[1].score}`);
      });

      it('should have the correct button name', async () => {
        const TAG = '[data-test="button-name"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('button-name-3'));
      });

      it('should have the correct clue', async () => {
        const TAG = '[data-test="button-clue"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('button-clue-3'));
      });
    });

    describe('Day after the last day', () => {
      before(async () => {
        expectedScores = await testHelper.withButtonHistoryData();
        await testHelper.withStartDate(DAY_3);
      });

      let page;

      before(async () => {
        page = await global.browser.newPage();
        await page.goto('http://localhost:3000/teams/1');
      });

      after(async () => {
        await page.close();
      });

      it('should have the correct team name', async () => {
        const TAG = '[data-test="team-name"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('team-1'));
      });

      it('should have the correct team score', async () => {
        const TAG = '[data-test="team-score"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(`${expectedScores[1].score}`);
      });

      it('should have a link back to the leaderboard', async () => {
        await page.click('[data-test="leaderboard-button"]');
        expect(page.url()).to.contain('/leaderboard');
      });
    });
  });
});
