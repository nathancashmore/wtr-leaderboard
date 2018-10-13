const bootstrap = require('./bootstrap');
const i18n = require('i18n');

let expectedScores;

describe('Integration', function () {

  before(async function () {
    expectedScores = await bootstrap.withButtonHistoryData();
  });

  describe('Progress Page', function () {

    let page;

    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:3000/progress');
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

      expect(heading).to.eql('IoT Hunt');
    });
  });
});

