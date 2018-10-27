const i18n = require('i18n');
const { testHelper } = require('./bootstrap');

describe('Integration', () => {
  describe('Progress Page', () => {
    let page;

    before(async () => {
      await testHelper.withoutButtonHistoryData();
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000/progress');
    });

    after(async () => {
      await page.close();
    });

    it('should have the correct page title', async () => {
      expect(await page.title()).to.eql(i18n.__('title'));
    });

    it('should have a heading', async () => {
      const HEADING_SELECTOR = 'h1';

      await page.waitFor(HEADING_SELECTOR);
      const heading = await page.$eval(HEADING_SELECTOR, x => x.innerText);

      expect(heading).to.eql('IoT Hunt');
    });
  });

  describe('Progress bar', () => {
    let page;
    const buttonHistory = [];

    before(async () => {
      await testHelper.withoutButtonHistoryData();
      page = await global.browser.newPage();
    });

    after(async () => {
      await page.close();
    });

    [
      { percentage: '0%', button: '1', clue: '1' },
      { percentage: '33.333333333333336%', button: '2', clue: '2' },
      { percentage: '66.66666666666667%', button: '3', clue: '3' }

    ].forEach((stage) => {
      it('should display the right information', async () => {
        await page.goto('http://localhost:3000/progress');

        expect(await testHelper.getText(page, 'percentage')).to.eql(stage.percentage);
        expect(await testHelper.getText(page, 'button')).to.eql(i18n.__(`button-name-${stage.button}`));
        expect(await testHelper.getText(page, 'clue')).to.eql(i18n.__(`button-clue-${stage.clue}`));

        buttonHistory.push(
          {
            team: 1, button: stage.button, day: 0
          }
        );

        await testHelper.setButtonHistory(buttonHistory);
      });
    });

    it('should display congratulations at 100%', async () => {
      await page.goto('http://localhost:3000/progress');

      expect(await testHelper.getText(page, 'percentage')).to.eql('100%');
      expect(await testHelper.getText(page, 'finish-text')).to.eql(i18n.__('progress.text-end-1'));
    });
  });
});
