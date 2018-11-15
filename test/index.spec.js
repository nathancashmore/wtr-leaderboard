const i18n = require('i18n');
const { testHelper } = require('./bootstrap');

let expectedScores;

describe('Integration', () => {
  before(async () => {
    expectedScores = await testHelper.withButtonHistoryData();
    await testHelper.withStartDateToday();
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
      expect(await page.title()).to.eql(i18n.__('title'));
    });

    it('should have a heading', async () => {
      const HEADING_SELECTOR = 'h1';

      await page.waitFor(HEADING_SELECTOR);
      const heading = await page.$eval(HEADING_SELECTOR, x => x.innerText);

      expect(heading).to.eql('Christmas IoT Hunt');
    });

    it('should display the day information', async () => {
      const dayInfo = await testHelper.getText(page, 'day-title');
      expect(dayInfo).to.eql(i18n.__('day-0'));
    });

    it('should show the leader', async () => {
      const LEADER = '[data-test="name-0"]';
      await page.waitFor(LEADER);

      const leader = await page.$eval(LEADER, x => x.innerText);

      expect(leader.replace('\t', '')).to.eql(i18n.__(`team-${expectedScores[0].team}`));
    });
  });

  describe('Before event', () => {
    let page;

    before(async () => {
      await testHelper.withStartDateBeforeEvent();
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000');
    });

    after(async () => {
      await page.close();
    });

    it('should show information before event', async () => {
      const pageText = await testHelper.getText(page, 'before-event-text');
      expect(pageText).to.eql(i18n.__('before-event-text'));
    });
  });

  describe('After event', () => {
    let page;

    before(async () => {
      await testHelper.withStartDateAfterEvent();
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000');
    });

    after(async () => {
      await page.close();
    });

    it('should show winner information after event and winning team', async () => {
      const pageText = await testHelper.getText(page, 'after-event-text');
      expect(pageText).to.eql(i18n.__('after-event-text-1'));

      const winningTeam = await testHelper.getText(page, 'winning-team');
      expect(winningTeam.replace('\t', '')).to.eql(i18n.__(`team-${expectedScores[0].team}`));
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

    it('should link to the different teams pages', async () => {
      const FIRST_PLACE_NAME = '[data-test="name-0"]';
      const SECOND_PLACE_NAME = '[data-test="name-1"]';
      const THIRD_PLACE_NAME = '[data-test="name-2"]';

      await page.waitFor(FIRST_PLACE_NAME);
      await page.click(FIRST_PLACE_NAME);
      expect(page.url()).to.contain('teams/2');

      await page.goto('http://localhost:3000/score-table');
      await page.waitFor(SECOND_PLACE_NAME);
      await page.click(SECOND_PLACE_NAME);
      expect(page.url()).to.contain('teams/1');

      await page.goto('http://localhost:3000/score-table');
      await page.waitFor(THIRD_PLACE_NAME);
      await page.click(THIRD_PLACE_NAME);
      expect(page.url()).to.contain('teams/3');
    });
  });
});
