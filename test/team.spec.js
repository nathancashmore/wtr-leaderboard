const i18n = require('i18n');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const server = require('../app/app');

const { testHelper } = require('./bootstrap');

let expectedScores;

describe('Team Integration', () => {
  describe('Team Page', () => {
    describe('Before event', () => {
      before(async () => {
        expectedScores = await testHelper.withStartDateBeforeEvent();
      });

      let page;

      before(async () => {
        page = await global.browser.newPage();
        await page.goto('http://localhost:3000/teams/1');
      });

      after(async () => {
        await page.close();
      });

      it('should return 404 for teams before event takes place', async () => {
        expect(await testHelper.getText(page, 'error')).to.contain('404');
      });
    });

    describe('After event', () => {
      before(async () => {
        expectedScores = await testHelper.withStartDateAfterEvent();
      });

      let page;

      before(async () => {
        page = await global.browser.newPage();
        await page.goto('http://localhost:3000/teams/1');
      });

      after(async () => {
        await page.close();
      });

      it('should return 404 for teams after event takes place', async () => {
        expect(await testHelper.getText(page, 'error')).to.contain('404');
      });
    });

    describe('Last day', () => {
      before(async () => {
        expectedScores = await testHelper.withButtonHistoryData();
      });

      let page;

      before(async () => {
        page = await global.browser.newPage();
        await page.goto('http://localhost:3000/teams/1');
      });

      after(async () => {
        await page.close();
      });

      it('should return 404 for teams during the event', async () => {
        expect(await testHelper.getText(page, 'error')).to.contain('404');
      });

      xit('should have the correct page title', async () => {
        expect(await page.title()).to.eql(i18n.__('title'));
      });

      xit('should have the correct team name', async () => {
        const TAG = '[data-test="team-name"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('team-1'));
      });

      xit('should have the correct team score', async () => {
        const TAG = '[data-test="team-score"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(`${expectedScores[1].score}`);
      });

      xit('should have the correct button name', async () => {
        const TAG = '[data-test="button-name"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('button-name-3'));
      });

      xit('should have the correct clue', async () => {
        const TAG = '[data-test="button-clue"]';
        await page.waitFor(TAG);

        const text = await page.$eval(TAG, element => element.innerText);

        expect(text.replace('\t', '')).to.eql(i18n.__('button-clue-3'));
      });

      xit('should have a link back to the leaderboard', async () => {
        await page.click('[data-test="leaderboard-button"]');
        expect(page.url()).to.contain('/leaderboard');
      });

      xit('should only return valid teams', async () => {
        await page.goto('http://localhost:3000/teams/0');
        expect(await testHelper.getText(page, 'error')).to.contain('404');

        await page.goto('http://localhost:3000/teams/1');
        expect(await testHelper.getText(page, 'team-name')).to.eql(i18n.__('team-1'));

        await page.goto('http://localhost:3000/teams/2');
        expect(await testHelper.getText(page, 'team-name')).to.eql(i18n.__('team-2'));

        await page.goto('http://localhost:3000/teams/3');
        expect(await testHelper.getText(page, 'team-name')).to.eql(i18n.__('team-3'));

        await page.goto('http://localhost:3000/teams/4');
        expect(await testHelper.getText(page, 'error')).to.contain('404');
      });
    });
  });

  describe('Team Endpoint', () => {
    // Based on:
    // Day = 2
    // [
    //     { team: 2, score: 8, pressed: true },
    //     { team: 1, score: 5, pressed: false },
    //     { team: 3, score: 2, pressed: false },
    // ]
    // Day 2 / team 1 = button 3
    before(async () => {
      expectedScores = await testHelper.withButtonHistoryData();
    });

    it('it should GET the team information', (done) => {
      const endpoint = '/teams/1';

      chai.request(server)
        .get(endpoint)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.team).to.equal(i18n.__('team-1'));
          expect(res.body.clue).to.equal(i18n.__('button-clue-3'));
          expect(res.body.button).to.equal(i18n.__('button-name-3'));
          expect(res.body.score).to.equal(5);
          done();
        });
    });
  });
});
