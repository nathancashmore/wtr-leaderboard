const chai = require('chai');
const chaiHttp = require('chai-http');
const i18n = require('i18n');

const { testHelper } = require('./bootstrap');

const server = require('../app/app');

let expectedResult;

chai.use(chaiHttp);

const TEAM_SIZE = 3;

describe('Slack', () => {
  before(async () => {
    // Based on the following response:
    // [
    // { team: 2, score: 8, pressed: true },
    // { team: 1, score: 5, pressed: false },
    // { team: 3, score: 2, pressed: false },
    // ];
    expectedResult = await testHelper.withButtonHistoryData();
  });

  it('should provide score with 200 valid status', (done) => {
    const endpoint = '/slack';
    const payload = { text: 'score' };

    chai.request(server)
      .post(endpoint)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(payload)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(TEAM_SIZE);
        [0, 1, 2].forEach((idx) => {
          expect(res.body[idx].team).to.equal(i18n.__(`team-${expectedResult[idx].team}`));
          expect(res.body[idx].score).to.equal(expectedResult[idx].score);
        });
        done();
      });
  });

  it('should 404 if task not found', (done) => {
    const endpoint = '/slack';
    const payload = { text: 'rubbish' };

    chai.request(server)
      .post(endpoint)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(payload)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});
