const bootstrap = require('./bootstrap');

let expectedScores;

describe('Integration', function () {

    before(async function () {
        expectedScores = await bootstrap.withButtonHistoryData();
    });

    describe('Main Page', function () {

        let page;

        before(async function () {
            page = await browser.newPage();
            await page.goto('http://localhost:3000');
        });

        after(async function () {
            await page.close();
        });

        it('should have the correct page title', async function () {
            expect(await page.title()).to.eql('Christmas IoT Hunt');
        });

        it('should have a heading', async function () {
            const HEADING_SELECTOR = 'h1';
            let heading;

            await page.waitFor(HEADING_SELECTOR);
            heading = await page.$eval(HEADING_SELECTOR, heading => heading.innerText);

            expect(heading).to.eql('Christmas IoT Hunt');
        });

        it('should show the leader', async function () {
            const LEADER = '[data-test="name-0"]';
            await page.waitFor(LEADER);

            leader = await page.$eval(LEADER, leader => leader.innerText);

            expect(leader.replace('\t', '')).to.eql(expectedScores[0].team.toString());
        })
    });

    describe('Score Table', function() {

        let page;

        before(async function () {
            page = await browser.newPage();
            await page.goto('http://localhost:3000/score-table');
        });

        after(async function () {
            await page.close();
        });

        it('should show the leader', async function () {
            const FIRST_PLACE_NAME = '[data-test="name-0"]';
            const SECOND_PLACE_NAME = '[data-test="name-1"]';
            const THIRD_PLACE_NAME = '[data-test="name-2"]';

            const FIRST_PLACE_SCORE = '[data-test="score-0"]';
            const SECOND_PLACE_SCORE = '[data-test="score-1"]';
            const THIRD_PLACE_SCORE = '[data-test="score-2"]';

            await page.waitFor(FIRST_PLACE_NAME);

            first_name = await page.$eval(FIRST_PLACE_NAME, html => html.innerText);
            first_score = await page.$eval(FIRST_PLACE_SCORE, html => html.innerText);

            second_name = await page.$eval(SECOND_PLACE_NAME, html => html.innerText);
            second_score = await page.$eval(SECOND_PLACE_SCORE, html => html.innerText);

            third_name = await page.$eval(THIRD_PLACE_NAME, html => html.innerText);
            third_score = await page.$eval(THIRD_PLACE_SCORE, html => html.innerText);

            expect(first_name.replace('\t', '')).to.eql(expectedScores[0].team.toString());
            expect(first_score.replace('\t', '')).to.eql(expectedScores[0].score.toString());

            expect(second_name.replace('\t', '')).to.eql(expectedScores[1].team.toString());
            expect(second_score.replace('\t', '')).to.eql(expectedScores[1].score.toString());

            expect(third_name.replace('\t', '')).to.eql(expectedScores[2].team.toString());
            expect(third_score.replace('\t', '')).to.eql(expectedScores[2].score.toString());
        })
    })
});

