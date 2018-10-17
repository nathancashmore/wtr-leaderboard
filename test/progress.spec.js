
describe('Integration', () => {
  describe('Progress Page', () => {
    let page;

    before(async () => {
      page = await global.browser.newPage();
      await page.goto('http://localhost:3000/progress');
    });

    after(async () => {
      await page.close();
    });

    it('should have the correct page title', async () => {
      expect(await page.title()).to.eql('Christmas IoT Hunt');
    });

    it('should have a heading', async () => {
      const HEADING_SELECTOR = 'h1';

      await page.waitFor(HEADING_SELECTOR);
      const heading = await page.$eval(HEADING_SELECTOR, x => x.innerText);

      expect(heading).to.eql('IoT Hunt');
    });
  });
});
