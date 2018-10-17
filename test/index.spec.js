const i18n = require('i18n');
const { testHelper } = require('./bootstrap');

let expectedScores;

describe('Integration', () => {
  before(async () => {
    expectedScores = await testHelper.withButtonHistoryData();
  });

  describe('Main Page', () => {
    let page;

    before(async () => {
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000');
    });

    after(async () => {
      await page.close();
    });

    it('should have the correct page title', async () => {
      expect(await page.title()).to.eql('Christmas IoT Hunt');
    });

    it('should have a heading', async () => {
      const HEADING_SELECTOR = 'h1';

      await page.waitFor(HEADING_SELECTOR);
      const heading = await page.$eval(HEADING_SELECTOR, x => x.innerText);

      expect(heading).to.eql('Christmas IoT Hunt');
    });

    it('should show the leader', async () => {
      const LEADER = '[data-test="name-0"]';
      await page.waitFor(LEADER);

      const leader = await page.$eval(LEADER, x => x.innerText);

      expect(leader.replace('\t', '')).to.eql(i18n.__(`team-${expectedScores[0].team}`));
    });
  });

  describe('Score Table', () => {
    let page;

    before(async () => {
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000/score-table');
    });

    after(async () => {
      await page.close();
    });

    it('should show the leader', async () => {
      const FIRST_PLACE_NAME = '[data-test="name-0"]';
      const SECOND_PLACE_NAME = '[data-test="name-1"]';
      const THIRD_PLACE_NAME = '[data-test="name-2"]';

      const FIRST_PLACE_SCORE = '[data-test="score-0"]';
      const SECOND_PLACE_SCORE = '[data-test="score-1"]';
      const THIRD_PLACE_SCORE = '[data-test="score-2"]';

      await page.waitFor(FIRST_PLACE_NAME);

      const firstName = await page.$eval(FIRST_PLACE_NAME, html => html.innerText);
      const firstScore = await page.$eval(FIRST_PLACE_SCORE, html => html.innerText);

      const secondName = await page.$eval(SECOND_PLACE_NAME, html => html.innerText);
      const secondScore = await page.$eval(SECOND_PLACE_SCORE, html => html.innerText);

      const thirdName = await page.$eval(THIRD_PLACE_NAME, html => html.innerText);
      const thirdScore = await page.$eval(THIRD_PLACE_SCORE, html => html.innerText);

      expect(firstName.replace('\t', '')).to.eql(i18n.__(`team-${expectedScores[0].team}`));
      expect(firstScore.replace('\t', '')).to.eql(expectedScores[0].score.toString());

      expect(secondName.replace('\t', '')).to.eql(i18n.__(`team-${expectedScores[1].team}`));
      expect(secondScore.replace('\t', '')).to.eql(expectedScores[1].score.toString());

      expect(thirdName.replace('\t', '')).to.eql(i18n.__(`team-${expectedScores[2].team}`));
      expect(thirdScore.replace('\t', '')).to.eql(expectedScores[2].score.toString());
    });
  });
});
