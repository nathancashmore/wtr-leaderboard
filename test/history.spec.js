const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const { testHelper } = require('./bootstrap');

chai.use(chaiHttp);

const server = require('../app/app');

chai.use(chaiHttp);

const today = moment().format('YYYY-MM-DD');

describe('History', () => {
  describe('Withdata', () => {
    before(async () => {
      // Make sure the start date is set to today so
      // we know that the day will be 0

      await testHelper.withButtonHistoryData();
      await testHelper.withStartDate(today);
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

  describe('Withoutdata', () => {
    before(async () => {
      // Make sure the start date is set to today so
      // we know that the day will be 0

      await testHelper.withoutButtonHistoryData();
      await testHelper.withStartDate(today);
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
