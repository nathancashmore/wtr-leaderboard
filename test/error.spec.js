const i18n = require('i18n');
const { testHelper } = require('./bootstrap');

describe('Error Integration', () => {
  describe('Error Page', () => {
    let page;

    before(async () => {
      page = await global.browser.newPage();
    });

    after(async () => {
      await page.close();
    });

    it('should display the not found for 404', async () => {
      await page.goto('http://localhost:3000/page-not-found');
      expect(await testHelper.getText(page, 'error')).to.eql('404 - Not Found');
    });

    it('should display the internal error for 500', async () => {
      await page.goto('http://localhost:3000/pear-shaped');
      expect(await testHelper.getText(page, 'error')).to.eql(i18n.__('error.500'));
    });
  });
});
