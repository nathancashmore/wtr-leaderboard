const bootstrap = require('./bootstrap');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

chai.use(chaiHttp);

let server = require('../app/app');

const START_DATE = moment().format('YYYY-MM-DD');

chai.use(chaiHttp);

describe('Time', function () {

	describe('Happy path', function () {
		it('it should POST the date', (done) => {
			const endpoint = '/time';
			const payload = {
				startDate: START_DATE
			};

			chai.request(server)
				.post(endpoint)
				.send(payload)
				.end((err, res) => {
					expect(res.status).to.equal(200);
					expect(res.body.startDate).to.equal(START_DATE);
					done();
				});
		});

		it('it should GET the current day no', (done) => {
			const endpoint = '/time';

			chai.request(server)
				.get(endpoint)
				.end((err, res) => {
					expect(res.status).to.equal(200);
					expect(res.body.day).to.equal(0);
					done();
				});

		});
	});

	describe('Unhappy path', function () {

		before(async function () {
			await bootstrap.withoutStartDate();
		});

		it('it should GET a default day no when not set', (done) => {
			const endpoint = '/time';

			chai.request(server)
				.get(endpoint)
				.end((err, res) => {
					expect(res.status).to.equal(200);
					expect(res.body.day).to.equal(-1);
					done();
				});
		});
	});


});

