const expect = require('chai').expect;
const DataHelper = require('../app/helper/data-helper');
const bootstrap = require('./bootstrap');

const helper = new DataHelper();

describe('Helper', function () {

    describe('Data Helper', function () {

        it('should retrieve current standing', () => {
            return helper.getStanding()
                .then(result => {
                    expect(result[0].name).to.equal(2);
                    expect(result[0].score).to.equal(29);
                })
        });

    });
});