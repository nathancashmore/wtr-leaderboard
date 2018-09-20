const expect = require('chai').expect;
const moment = require('moment');
const config = require('getconfig');
const asyncRedis = require("async-redis");
const bootstrap = require('./bootstrap');

const DataHelper = require('../app/helper/data-helper');

const helper = new DataHelper(config.NO_OF_TEAMS, config.REDIS_URL);

describe('Helper', function () {

    describe('Data Helper', function () {

        before( async function() {
            const testData = [
                { "team": 1, "button" : 1, "day": 1, "time":"10:00:00", "score": 10 },
                { "team": 2, "button" : 2, "day": 1, "time":"10:01:00", "score": 9 },
                { "team": 3, "button" : 3, "day": 1, "time":"10:02:00", "score": 8 },
                { "team": 2, "button" : 2, "day": 2, "time":"10:00:00", "score": 10 },
                { "team": 1, "button" : 2, "day": 2, "time":"10:01:00", "score": 9 },
                { "team": 2, "button" : 3, "day": 3, "time":"10:01:00", "score": 10 }
            ];

            const client = await asyncRedis.createClient(config.REDIS_URL, {no_ready_check: true});
            await client.set("buttonHistory", JSON.stringify(testData));
        });

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