const expect = require('chai').expect;
const moment = require('moment');
const config = require('getconfig');
const bootstrap = require('./bootstrap');

const DataHelper = require('../app/helper/data-helper');

const helper = new DataHelper(config.NO_OF_TEAMS, config.REDIS_URL);

const BUTTON_NO = 1;
const TEAM_NO = 1;
const DAY_NO = 1;
const SCORE = 10;

describe('Helper', function () {

    describe('Data Helper', function () {

        describe('With button history data', function () {
            before(async function () {
               await bootstrap.withButtonHistoryData();
            });

            it('should retrieve current standing', async () => {
                let result = await helper.getStanding();

                expect(result[0].name).to.equal(2);
                expect(result[0].score).to.equal(27);
            });

            it('should be able to set a date and work out the day no from it', async () => {
                let yesterday = moment().subtract(2, 'days').format('YYYY-MM-DD');

                await helper.setStartDate(yesterday);
                let day = await helper.getDay();

                expect(day).to.equal(2)
            });

            it('should increase a teams score when button pressed', async () => {
                await helper.pressButton(BUTTON_NO, TEAM_NO, DAY_NO, SCORE);
                let result = await helper.getStanding();
                expect(result[0].name).to.equal(1);
                expect(result[0].score).to.equal(29);
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
                let result = await helper.pressButton(BUTTON_NO, TEAM_NO, DAY_NO, SCORE);
                expect(result).to.equal('OK');
            })
        })
    });
});