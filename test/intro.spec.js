const bootstrap = require('./bootstrap');
const i18n = require('i18n');

let expectedScores;

describe('Integration', function () {

    before(async function () {
        expectedScores = await bootstrap.withButtonHistoryData();
    });

    describe('Introduction Page', function () {

        let page;

        before(async function () {
            page = await browser.newPage();
            await page.goto('http://localhost:3000/intro');
        });

        after(async function () {
            await page.close();
        });

        it('should have the correct page title', async function () {
            expect(await page.title()).to.eql('Christmas IoT Hunt');
        });

    });

});

