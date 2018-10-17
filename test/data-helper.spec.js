const moment = require('moment');
const config = require('getconfig');
const { testHelper } = require('./bootstrap');

const DataHelper = require('../app/helper/data-helper');

const NO_OF_TEAMS = 3;

const helper = new DataHelper(NO_OF_TEAMS, config.REDIS_URL);
let expectedScores;

describe('Helper', () => {
  describe('Data Helper', () => {
    describe('With button history data', () => {
      before(async () => {
        expectedScores = await testHelper.withButtonHistoryData();
      });

      [
        { button: 1, day: 0, expectedTeam: 1 },
        { button: 2, day: 0, expectedTeam: 2 },
        { button: 3, day: 0, expectedTeam: 3 },
        { button: 1, day: 1, expectedTeam: 3 },
        { button: 2, day: 1, expectedTeam: 1 },
        { button: 3, day: 1, expectedTeam: 2 },
        { button: 1, day: 2, expectedTeam: 2 },
        { button: 2, day: 2, expectedTeam: 3 },
        { button: 3, day: 2, expectedTeam: 1 },
        { button: 1, day: 3, expectedTeam: 1 },
        { button: 2, day: 3, expectedTeam: 2 },
        { button: 3, day: 3, expectedTeam: 3 },
      ]
        .forEach((x) => {
          it(`should return the team associated with the day when button=${x.button} and day=${x.day}`, async () => {
            const result = helper.getTeam(x.button, x.day);
            expect(result).to.equal(x.expectedTeam);
          });
        });

      [
        { team: 1, day: 0, expectedButton: 1 },
        { team: 2, day: 0, expectedButton: 2 },
        { team: 3, day: 0, expectedButton: 3 },
        { team: 1, day: 1, expectedButton: 2 },
        { team: 2, day: 1, expectedButton: 3 },
        { team: 3, day: 1, expectedButton: 1 },
        { team: 1, day: 2, expectedButton: 3 },
        { team: 2, day: 2, expectedButton: 1 },
        { team: 3, day: 2, expectedButton: 2 },
        { team: 1, day: 3, expectedButton: 1 },
        { team: 2, day: 3, expectedButton: 2 },
        { team: 3, day: 3, expectedButton: 3 },
      ]
        .forEach((x) => {
          it(`should return the button associated with the day when team=${x.team} and day=${x.day}`, async () => {
            const result = helper.getButton(x.team, x.day);
            expect(result).to.equal(x.expectedButton);
          });
        });

      it('should give a score based on other buttons pressed that day', async () => {
        // Based on the following...
        // {"team": 2, "button": 1, "day": 2, "time": "10:00:00", "score": 3}
        // The next button press on day 2 should give a score of 2
        const day = 2;
        expect(await helper.getScore(day)).to.equal(2);
      });

      it('should give a teams score', async () => {
        // Based on the previous test team 2 should have a score of 2
        expect(await helper.getTeamScore(expectedScores[0].team)).to.equal(expectedScores[0].score);
        expect(await helper.getTeamScore(expectedScores[1].team)).to.equal(expectedScores[1].score);
        expect(await helper.getTeamScore(expectedScores[2].team)).to.equal(expectedScores[2].score);
      });

      it('should retrieve current standing', async () => {
        const result = await helper.getStanding();

        expect(result[0].name).to.equal(expectedScores[0].team);
        expect(result[0].score).to.equal(expectedScores[0].score);
      });

      it('should be able to set a date and work out the day no from it', async () => {
        const yesterday = moment().subtract(2, 'days').format('YYYY-MM-DD');

        await helper.setStartDate(yesterday);
        const day = await helper.getDay();

        expect(day).to.equal(2);
      });

      it('should return -1 for the day if startDate not set', async () => {
        await helper.setStartDate(null);
        const day = await helper.getDay();
        expect(day).to.equal(-1);
      });

      it('should return -1 for the day if there are more days than teams', async () => {
        await helper.setStartDate(moment().subtract(NO_OF_TEAMS, 'days').format('YYYY-MM-DD'));
        const day = await helper.getDay();
        expect(day).to.equal(-1);
      });

      it('should increase a teams score when button pressed', async () => {
        // Where starting score for team 1 is 5
        const button = 3; const team = 1; const day = 2; const
          score = 10;

        await helper.pressButton(button, team, day, score);

        const result = await helper.getStanding();

        expect(result[0].name).to.equal(1);
        expect(result[0].score).to.equal(15);
      });

      it('should not allow button to be pressed twice in one day', async () => {
        // Where starting score for team 1 is 15
        const button = 3; const team = 1; const day = 2; const
          score = 5;

        const buttonReseponse = await helper.pressButton(button, team, day, score);

        expect(buttonReseponse.score).to.equal(0);

        const standingResponse = await helper.getStanding();

        expect(standingResponse[0].name).to.equal(1);
        expect(standingResponse[0].score).to.equal(15);
      });

      it('should clear the button history', async () => {
        const result = await helper.clearHistory();
        expect(result).to.equal('OK');
      });

      it('should return the number of teams', () => {
        expect(helper.noOfTeams).to.equal(NO_OF_TEAMS);
      });
    });

    describe('With NO button history data', () => {
      before(async () => {
        await testHelper.withoutButtonHistoryData();
      });

      it('should retrieve current standing', async () => {
        const result = await helper.getStanding();
        expect(result.length).to.equal(0);
      });

      it('should give a teams score of zero', async () => {
        expect(await helper.getTeamScore(1)).to.equal(0);
        expect(await helper.getTeamScore(2)).to.equal(0);
        expect(await helper.getTeamScore(3)).to.equal(0);
      });

      it('should add history when button pressed', async () => {
        const button = 1; const team = 1; const day = 1; const
          score = 10;

        const result = await helper.pressButton(button, team, day, score);
        expect(result.button).to.equal(button);
        expect(result.team).to.equal(team);
        expect(result.day).to.equal(day);
        expect(result.score).to.equal(score);
      });

      it('should provide progress', async () => {
        const result = await helper.progress();
        expect(result.percentage).to.equal(33.333333333333336);
        expect(result.nextButton).to.equal(2);
        expect(result.finished).to.equal(false);
      });
    });
  });
});
