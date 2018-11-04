const i18n = require('i18n');
const moment = require('moment');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { testHelper } = require('./bootstrap');

chai.use(chaiHttp);

const DATE_TIME_NOW = moment().format('YYYY-MM-DD HH:mm');

const server = require('../app/app');

describe('Status Page', () => {
  describe('with Status Information', () => {
    let page;
    let expectedStatus;

    before(async () => {
      expectedStatus = await testHelper.withButtonStatus();
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000/status');
    });

    after(async () => {
      await page.close();
    });

    it('should have the correct page title', async () => {
      expect(await page.title()).to.eql(i18n.__('title'));
    });

    it('should display the correct status information', async () => {
      expect(await testHelper.getText(page, 'number-0')).to.equal(`${expectedStatus[0].button}`);
      expect(await testHelper.getText(page, 'name-0')).to.equal(i18n.__(`button-name-${expectedStatus[0].button}`));
      expect(await testHelper.getText(page, 'ip-0')).to.equal(expectedStatus[0].ip);
      expect(await testHelper.getStyle(page, 'indicator-0')).to.contain('green');

      expect(await testHelper.getText(page, 'number-1')).to.equal(`${expectedStatus[1].button}`);
      expect(await testHelper.getText(page, 'name-1')).to.equal(i18n.__(`button-name-${expectedStatus[1].button}`));
      expect(await testHelper.getText(page, 'ip-1')).to.equal(expectedStatus[1].ip);
      expect(await testHelper.getStyle(page, 'indicator-1')).to.contain(`${expectedStatus[1].indicator}`);

      expect(await testHelper.getText(page, 'number-2')).to.equal(`${expectedStatus[2].button}`);
      expect(await testHelper.getText(page, 'name-2')).to.equal(i18n.__(`button-name-${expectedStatus[2].button}`));
      expect(await testHelper.getText(page, 'ip-2')).to.equal(expectedStatus[2].ip);
      expect(await testHelper.getStyle(page, 'indicator-2')).to.contain(`${expectedStatus[2].indicator}`);
    });

    it('it should clear the button history data', (done) => {
      const endpoint = '/status/clear';

      chai.request(server)
        .patch(endpoint)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('OK');
          done();
        });
    });
  });

  describe('without status information', () => {
    let page;

    before(async () => {
      await testHelper.withoutButtonStatus();
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000/status');
    });

    after(async () => {
      await page.close();
    });

    it('should say if there is no reported status', async () => {
      expect(await testHelper.getText(page, 'no-status')).to.equal(i18n.__('status.no-status'));
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

describe('Status Endpoint', () => {
  it('should create or update a status entry', (done) => {
    const endpoint = '/status';
    const payload = { button: 1, ip: '10.10.0.99' };

    chai.request(server)
      .put(endpoint)
      .send(payload)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.button).to.equal(1);
        expect(res.body.ip).to.equal('10.10.0.99');
        expect(res.body.time).to.equal(DATE_TIME_NOW);
        done();
      });
  });


});
