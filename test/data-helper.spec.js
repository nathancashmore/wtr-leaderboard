const expect = require('chai').expect;
const moment = require('moment');
const config = require('getconfig');
const bootstrap = require('./bootstrap');

const DataHelper = require('../app/helper/data-helper');

const helper = new DataHelper(config.NO_OF_TEAMS, config.REDIS_URL);

describe('Helper', function () {

    describe('Data Helper', function () {

        describe('With button history data', function () {
            before(async function () {
               await bootstrap.withButtonHistoryData();
            });

            it('should retrieve current standing', async () => {
                let result = await helper.getStanding();

                expect(result[0].name).to.equal(2);
                expect(result[0].score).to.equal(29);
            });

            it('should be able to set a date and work out the day no from it', async () => {
                let yesterday = moment().subtract(2, 'days').format('YYYY-MM-DD');

                await helper.setStartDate(yesterday);
                let day = await helper.getDay();

                expect(day).to.equal(2)
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
        })
    });
});