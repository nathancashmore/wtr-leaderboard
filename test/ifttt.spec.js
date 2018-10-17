const chai = require('chai');
const chaiHttp = require('chai-http');

require('./bootstrap');

const server = require('../app/app');

chai.use(chaiHttp);

describe('IFTTT', () => {
  it('should provide IFTTT with 200 valid status', (done) => {
    const endpoint = '/ifttt/v1/status';

    chai.request(server)
      .get(endpoint)
      .set('Accept', 'application/json')
      .set('IFTTT-Service-Key', 'XXXX')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('should provide IFTTT with 401 invalid status', (done) => {
    const endpoint = '/ifttt/v1/status';

    chai.request(server)
      .get(endpoint)
      .set('Accept', 'application/json')
      .set('IFTTT-Service-Key', 'INVALID')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });
});
