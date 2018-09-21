const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const expect = chai.expect;
const should = chai.should();

const bootstrap = require('./bootstrap');
let server = require('../app/app');

chai.use(chaiHttp);

describe('Timekeeper', function () {

    describe('/GET', () => {

        it('it should POST the date', (done) => {

            const endpoint = '/timekeeper';
            const payload = {
                startDate : moment().format('YYYY-MM-DD')
            };

            chai.request(server)
                .post(endpoint)
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    done();
                });
        });


        it('it should GET the current day no', (done) => {
            chai.request(server)
                .get('/timekeeper')
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    done();
                });
        });
    });
});

