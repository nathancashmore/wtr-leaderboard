const bootstrap = require('./bootstrap');
const moment = require('moment');
const config = require('getconfig');

const DataHelper = require('../app/helper/data-helper');

const helper = new DataHelper(3, config.REDIS_URL);
let expectedScores;

describe('Helper', function () {

	describe('Data Helper', function () {

		describe('With button history data', function () {
			before(async function () {
				expectedScores = await bootstrap.withButtonHistoryData();
			});

			[
				{button: 1, day: 0, expectedTeam: 1},
				{button: 2, day: 0, expectedTeam: 2},
				{button: 3, day: 0, expectedTeam: 3},
				{button: 1, day: 1, expectedTeam: 2},
				{button: 2, day: 1, expectedTeam: 3},
				{button: 3, day: 1, expectedTeam: 1},
				{button: 1, day: 2, expectedTeam: 3},
				{button: 2, day: 2, expectedTeam: 1},
				{button: 3, day: 2, expectedTeam: 2},
				{button: 1, day: 3, expectedTeam: 1},
				{button: 2, day: 3, expectedTeam: 2},
				{button: 3, day: 3, expectedTeam: 3}
			]
				.forEach(x => {
				it(`should return the team associated with the day when button=${x.button} and day=${x.day}`, async () => {
					let result = helper.getTeam(x.button, x.day);
					expect(result).to.equal(x.expectedTeam)
				});
			});

			it('should give a score based on other buttons pressed that day', async () => {
				// Based on the following...
				// {"team": 2, "button": 1, "day": 2, "time": "10:00:00", "score": 3}
				// The next button press on day 2 should give a score of 2
				const day = 2;
				expect(await helper.getScore(day)).to.equal(2);
			});

			it('should retrieve current standing', async () => {
				let result = await helper.getStanding();

				expect(result[0].name).to.equal(expectedScores[0].team);
				expect(result[0].score).to.equal(expectedScores[0].score);
			});

			it('should be able to set a date and work out the day no from it', async () => {
				let yesterday = moment().subtract(2, 'days').format('YYYY-MM-DD');

				await helper.setStartDate(yesterday);
				let day = await helper.getDay();

				expect(day).to.equal(2)
			});

			it('should increase a teams score when button pressed', async () => {
				// Where starting score for team 1 is 5
				const button=3, team=1, day=2, score=10;

				await helper.pressButton(button, team, day, score);

				let result = await helper.getStanding();

				expect(result[0].name).to.equal(1);
				expect(result[0].score).to.equal(15);
			})

		});

		describe('With NO button history data', function () {

			before(async function () {
				await bootstrap.withoutButtonHistoryData();
			});

			it('should retrieve current standing', async () => {
				let result = await helper.getStanding();
				expect(result.length).to.equal(0);
			});

			it('should add history when button pressed', async () => {
				const button=1, team=1, day=1, score=10;

				let result = await helper.pressButton(button, team, day, score);
				expect(result).to.equal('OK');
			})
		})
	});
});