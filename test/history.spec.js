const bootstrap = require('./bootstrap');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

chai.use(chaiHttp);

let server = require('../app/app');

chai.use(chaiHttp);

let today = moment().format('YYYY-MM-DD');

describe('History', function () {
    describe('Withdata', function () {

        before(async () => {
            // Make sure the start date is set to today so
            // we know that the day will be 0

            await bootstrap.withButtonHistoryData();
            await bootstrap.withStartDate(today);
        });

        it('it should clear the button history data', (done) => {
            const endpoint = '/history/clear';

            chai.request(server)
                .patch(endpoint)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.status).to.equal('OK');
                    done();
                });
        });
    });

    describe('Withoutdata', function () {

        before(async () => {
            // Make sure the start date is set to today so
            // we know that the day will be 0

            await bootstrap.withoutButtonHistoryData();
            await bootstrap.withStartDate(today);
        });


        it('it should clear the button history data', (done) => {
            const endpoint = '/history/clear';

            chai.request(server)
                .patch(endpoint)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.status).to.equal('OK');
                    done();
                });
        });
    });


});

