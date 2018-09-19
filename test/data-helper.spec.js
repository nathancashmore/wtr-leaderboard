const expect = require('chai').expect;
const DataHelper = require('../app/helper/data-helper');
const bootstrap = require('./bootstrap');
const moment = require('moment');
const config = require('getconfig');

const helper = new DataHelper(config.DATA_DIR, config.NO_OF_TEAMS, config.REDISCLOUD_URL);

describe('Helper', function () {

    describe('Data Helper', function () {

        it('should retrieve current standing', async () => {
            let result = await helper.getStanding();

            expect(result[0].name).to.equal(2);
            expect(result[0].score).to.equal(29);
        });

        it('should be able to set a date and work out the day no from it', async ()  => {
            let yesterday = moment().subtract(2, 'days').format('YYYY-MM-DD');

            await helper.setStartDate(yesterday);
            let day = await helper.getDay();

            expect(day).to.equal(2)
        })

    });
});