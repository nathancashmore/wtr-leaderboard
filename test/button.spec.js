const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const { testHelper } = require('./bootstrap');

chai.use(chaiHttp);

const server = require('../app/app');

chai.use(chaiHttp);

// NOTE : This test requires all of the tests to be run in sequence to test
// the scoring as each button is hit.

const today = moment().format('YYYY-MM-DD');
const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

describe('Button', () => {
  describe('Day 1', () => {
    before(async () => {
      // Make sure the start date is set to today so
      // we know that the day will be 0

      await testHelper.withoutButtonHistoryData();
      await testHelper.withStartDate(today);
    });


    it('it should POST to record press for button 1 on day 0', (done) => {
      const endpoint = '/buttons/1';

      chai.request(server)
        .post(endpoint)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.button).to.equal(1);
          expect(res.body.day).to.equal(0);
          expect(res.body.team).to.equal(1);
          expect(res.body.score).to.equal(3);
          done();
        });
    });

    it('it should POST to record press for button 2 on day 0', (done) => {
      const endpoint = '/buttons/2';

      chai.request(server)
        .post(endpoint)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.button).to.equal(2);
          expect(res.body.day).to.equal(0);
          expect(res.body.team).to.equal(2);
          expect(res.body.score).to.equal(2);
          done();
        });
    });

    it('it should NOT POST to record press for button 2 on day 0 when the button has already been pressed that day', (done) => {
      const endpoint = '/buttons/2';

      chai.request(server)
        .post(endpoint)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.button).to.equal(2);
          expect(res.body.day).to.equal(0);
          expect(res.body.team).to.equal(2);
          expect(res.body.score).to.equal(0);
          done();
        });
    });

    it('it should POST to record press for button 3 on day 0', (done) => {
      const endpoint = '/buttons/3';

      chai.request(server)
        .post(endpoint)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.button).to.equal(3);
          expect(res.body.day).to.equal(0);
          expect(res.body.team).to.equal(3);
          expect(res.body.score).to.equal(1);
          done();
        });
    });
  });
  describe('Day 2', () => {
    before(async () => {
      // Make sure the start date is set to today so
      // we know that the day will be 0
      await testHelper.withStartDate(yesterday);
    });


    it('it should POST to record press for button 3 on day 1', (done) => {
      const endpoint = '/buttons/3';

      chai.request(server)
        .post(endpoint)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.button).to.equal(3);
          expect(res.body.day).to.equal(1);
          expect(res.body.team).to.equal(2);
          expect(res.body.score).to.equal(3);
          done();
        });
    });

    it('it should POST to record press for button 2 on day 1', (done) => {
      const endpoint = '/buttons/2';

      chai.request(server)
        .post(endpoint)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.button).to.equal(2);
          expect(res.body.day).to.equal(1);
          expect(res.body.team).to.equal(1);
          expect(res.body.score).to.equal(2);
          done();
        });
    });
  });

  describe('Day is not yet set', () => {
    before(async () => {
      // Make sure the start date is set to today so
      // we know that the day will be 0
      await testHelper.withStartDate(null);
    });

    it('should return error 405 Method Not Allowed if day not set', (done) => {
      const endpoint = '/buttons/1';

      chai.request(server)
        .post(endpoint)
        .end((err, res) => {
          expect(res.status).to.equal(405);
          done();
        });
    });
  });
});
