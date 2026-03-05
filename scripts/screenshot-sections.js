const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('file:///Users/apple/Documents/WORK/AI-Design-Studio/output/aurelius-group/brandbook-v3.html');
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
  await page.waitForTimeout(500);
  const el = await page.$('#business-cards');
  if (el) await el.screenshot({ path: 'output/aurelius-group/v3-business-cards.png' });
  console.log('Done');
  await browser.close();
})();
