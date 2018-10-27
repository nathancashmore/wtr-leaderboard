const i18n = require('i18n');
require('./bootstrap');

describe('Integration', () => {
  describe('Introduction Page', () => {
    let page;

    before(async () => {
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000/intro');
    });

    after(async () => {
      await page.close();
    });

    it('should have the correct page title', async () => {
      expect(await page.title()).to.eql(i18n.__('title'));
    });
  });
});
