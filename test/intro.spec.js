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
      expect(await page.title()).to.eql('Christmas IoT Hunt');
    });
  });
});
