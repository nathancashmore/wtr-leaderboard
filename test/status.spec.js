const i18n = require('i18n');
const { testHelper } = require('./bootstrap');

describe('Status Page', () => {
  describe('with Status Information', () => {
    let page;
    let expectedStatus;

    before(async () => {
      expectedStatus = await testHelper.withButtonStatus();
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000/status');
    });

    after(async () => {
      await page.close();
    });

    it('should have the correct page title', async () => {
      expect(await page.title()).to.eql('Christmas IoT Hunt');
    });

    it('should display the correct status information', async () => {
      expect(await testHelper.getText(page, 'number-0')).to.equal(`${expectedStatus[0].button}`);
      expect(await testHelper.getText(page, 'name-0')).to.equal(i18n.__(`button-name-${expectedStatus[0].button}`));
      expect(await testHelper.getText(page, 'ip-0')).to.equal(expectedStatus[0].ip);
      expect(await testHelper.getStyle(page, 'indicator-0')).to.contain(`${expectedStatus[0].indicator}`);

      expect(await testHelper.getText(page, 'number-1')).to.equal(`${expectedStatus[1].button}`);
      expect(await testHelper.getText(page, 'name-1')).to.equal(i18n.__(`button-name-${expectedStatus[1].button}`));
      expect(await testHelper.getText(page, 'ip-1')).to.equal(expectedStatus[1].ip);
      expect(await testHelper.getStyle(page, 'indicator-1')).to.contain(`${expectedStatus[1].indicator}`);

      expect(await testHelper.getText(page, 'number-2')).to.equal(`${expectedStatus[2].button}`);
      expect(await testHelper.getText(page, 'name-2')).to.equal(i18n.__(`button-name-${expectedStatus[2].button}`));
      expect(await testHelper.getText(page, 'ip-2')).to.equal(expectedStatus[2].ip);
      expect(await testHelper.getStyle(page, 'indicator-2')).to.contain(`${expectedStatus[2].indicator}`);
    });
  });

  describe('without status information', () => {
    let page;

    before(async () => {
      await testHelper.withoutButtonStatus();
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000/status');
    });

    after(async () => {
      await page.close();
    });

    it('should say if there is no reported status', async () => {
      expect(await testHelper.getText(page, 'no-status')).to.equal(i18n.__('status.no-status'));
    });
  });
});
